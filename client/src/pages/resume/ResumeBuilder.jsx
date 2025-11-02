"use client"

import { useState } from "react"
import axios from "../../api/axios"
import { FaUserGraduate, FaBriefcase, FaCode, FaLaptopCode, FaLayerGroup, FaPen, FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function ResumeBuilder() {
  const navigate = useNavigate()
  const user = localStorage.getItem("user")

  const [formData, setFormData] = useState({
    fullName: "",
    education: "",
    projects: "",
    experience: "",
    skills: "",
    jobTitle: "",
    info: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post("/resume/generate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
        responseType: "blob",
      })

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "resume.pdf"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Resume generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: "Full Name", name: "fullName", icon: <FaUserGraduate className="text-indigo-500" /> },
    { label: "Education", name: "education", icon: <FaUserGraduate className="text-indigo-500" /> },
    { label: "Projects", name: "projects", icon: <FaLaptopCode className="text-indigo-500" /> },
    { label: "Experience", name: "experience", icon: <FaBriefcase className="text-indigo-500" /> },
    { label: "Skills", name: "skills", icon: <FaCode className="text-indigo-500" /> },
    { label: "Job Title", name: "jobTitle", icon: <FaLayerGroup className="text-indigo-500" /> },
    { label: "Additional Info", name: "info", icon: <FaPen className="text-indigo-500" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
  
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            AI Resume Builder
          </h1>
          <p className="text-slate-400 text-lg font-light">
            Craft a professional resume in minutes with our intelligent builder
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(({ label, name, icon }) => (
                <div key={name} className={name === "info" ? "md:col-span-2" : ""}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
                    <span className="text-lg">{icon}</span>
                    {label}
                  </label>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    rows={name === "info" ? 4 : 3}
                    required
                    placeholder={`Enter your ${label.toLowerCase()}...`}
                    className="w-full bg-slate-700/30 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              {user === null ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50"
                >
                  <span>Login to Generate Resume</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  className={`w-full group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      <span>Generating your resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Resume</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8 font-light">
          Your resume will be generated and downloaded automatically
        </p>
      </div>
    </div>
  )
}
