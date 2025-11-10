import { useEffect, useState } from "react"
import axios from "../../api/axios"
import { Link } from "react-router-dom"
import { ClockIcon, BriefcaseIcon, DocumentTextIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function SeekerDashboard() {
  const [reports, setReports] = useState([])
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        const [reportsRes, jobsRes] = await Promise.all([axios.get("/dashboard/reports"), axios.get("/tracker")])

        setReports(reportsRes.data)
        setJobs(jobsRes.data)
      } catch (err) {
        console.error("Failed to fetch dashboard:", err)
        setError("Could not load your dashboard. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const handleDelete = async (e, jobId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!window.confirm("Are you sure you want to delete this job?")) {
      return
    }

    try {
      await axios.delete(`/tracker/${jobId}`)
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId))
    } catch (error) {
      console.log("error while deleting job", error)
      setError("Failed to delete job. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md animate-fadeIn">
          <p className="text-red-700 font-semibold text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-16">
        <section className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">Interview Reports</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
          </div>

          {reports.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm border border-slate-100 p-12 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 text-center animate-scaleIn">
              <DocumentTextIcon className="h-20 w-20 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">No Reports Yet</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Complete your first interview to see your personalized report and insights.
              </p>
              <Link
                to="/interview"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report, idx) => (
                <Link
                  to={`/interview/report/${report._id}`}
                  key={report._id}
                  className="group block bg-white/60 backdrop-blur-sm border p-7 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn"
                  style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 text-slate-500 text-sm mb-4 group-hover:text-blue-600 transition-colors">
                    <BriefcaseIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{report.jobDescription}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Interview Report
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {report.finalReportSummary
                      ? report.finalReportSummary.substring(0, 100) + "..."
                      : "Report is still being generated."}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      View &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-3">My Job Tracker</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-cyan-500 rounded-full"></div>
            </div>
            <Link
              to="/job-search"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-full hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Find New Jobs
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm border border-slate-100 p-12 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 text-center animate-scaleIn">
              <DocumentTextIcon className="h-20 w-20 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">Your Tracker is Empty</h2>
              <p className="text-slate-600">Discover and save jobs that match your skills and interests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, idx) => (
                <Link
                  to={`/job/${job._id}`}
                  key={job._id}
                  className="group relative bg-white/60 backdrop-blur-sm border p-6 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn overflow-hidden"
                  style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50 group-hover:to-cyan-50 transition-all duration-300 pointer-events-none"></div>

                  <button
                    onClick={(e) => handleDelete(e, job._id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    aria-label="Delete job"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>

                  <div className="relative z-10">
                    <div className="mb-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-300
                        ${
                          job.status === "Applied"
                            ? "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100"
                            : job.status === "Interviewing"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
                      {job.jobTitle}
                    </h3>
                    <p className="text-slate-600 flex items-center gap-2 mb-6 group-hover:text-slate-900 transition-colors">
                      <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{job.companyName}</span>
                    </p>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-700 transition-colors">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default SeekerDashboard
