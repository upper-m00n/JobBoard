import { useState } from 'react';
import axios from '../../api/axios';
import { FaUserGraduate, FaBriefcase, FaCode, FaLaptopCode, FaLayerGroup, FaPen } from 'react-icons/fa';

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    fullName: "",
    education: "",
    projects: "",
    experience: "",
    skills: "",
    jobTitle: "",
    info: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post("/resume/generate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "fullName", icon: <FaUserGraduate /> },
    { label: "Education", name: "education", icon: <FaUserGraduate /> },
    { label: "Projects", name: "projects", icon: <FaLaptopCode /> },
    { label: "Experience", name: "experience", icon: <FaBriefcase /> },
    { label: "Skills", name: "skills", icon: <FaCode /> },
    { label: "Job Title", name: "jobTitle", icon: <FaLayerGroup /> },
    { label: "Additional Info", name: "info", icon: <FaPen /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          AI-Powered Resume Builder
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fill in your details and get a professionally designed resume in seconds!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map(({ label, name, icon }) => (
            <div key={name}>
              <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
                {icon} {label}
              </label>
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={name === "info" ? 3 : 2}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            className={`w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Generating Resume...
              </>
            ) : (
              "Generate Resume"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
