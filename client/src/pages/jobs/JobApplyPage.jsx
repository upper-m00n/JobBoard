import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { Briefcase, MapPin, Clock, Building2 } from "lucide-react";

export default function JobApplyPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const { jobId } = useParams();
  const location = useLocation();
  const job = location.state?.job;

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("coverLetter", coverLetter);
    formData.append("name", name);
    formData.append("email", email);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`/applications/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to apply");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-gray-100 rounded-2xl shadow-lg">
      
      <div className="bg-white p-6 rounded-xl shadow border mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Briefcase className="mr-2 text-blue-500" />
          {job?.title || "Job Title"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-500" /> {job?.company}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-500" /> {job?.location}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-blue-500" /> {job?.type}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {job?.description || "No description provided for this job. Please check back later."}
          </p>
        </div>
      </div>

      {/* Application Form Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Apply for this Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {user === null ? (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Login to Apply
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Submit Application
            </button>
          )}
        </form>

        {message && (
          <p className="mt-4 text-green-600 font-medium text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
