import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import{FaFileAlt, FaEdit, FaTrash} from 'react-icons/fa'

export default function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApps();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl rounded-xl">

      
      <div className="border border-blue-300 rounded-xl p-6 mb-10 bg-blue-200/40 shadow-md">
        <h2 className="text-4xl font-bold text-blue-800 text-center mb-4">
          Build Resume with AI ✨
        </h2>
        <div className="text-center">
          <Link
            to="/resume-builder"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow transition"
          >
            Build Resume
          </Link>
        </div>
      </div>

      
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        My Job Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {app.job?.title}
                  </h3>
                  <p className="text-gray-700">{app.job?.company}</p>
                  <p className="text-sm text-gray-500">
                    {app.job?.type} | {app.job?.location}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              
              <p>{app.name}</p>
              <p>{app.email}</p>
              <p className="text-gray-800 text-sm">
                <span className="font-medium text-gray-900">Cover Letter:</span>{" "}
                {app.coverLetter}
              </p>

              
              <div className="mt-4 flex items-center flex-wrap gap-4">
                <a
                  href={app.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                  <FaFileAlt /> View Resume
                </a>

                <button
                  onClick={() => navigate(`applications/update/${app._id}`)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md transition"
                >
                  <FaEdit /> Update
                </button>

                <button
                  onClick={() => handleDelete(app._id)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-sm rounded-md transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}
