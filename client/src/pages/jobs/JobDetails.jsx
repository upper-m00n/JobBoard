"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "../../api/axios"
import { BriefcaseIcon, DocumentTextIcon, SparklesIcon, MicrophoneIcon } from "@heroicons/react/24/outline"

function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState("")

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value
    try {
      await axios.put(`/tracker/${id}`, { status: newStatus })
      setStatus(newStatus)
    } catch (error) {
      console.log("error while changing job status", error)
    }
  }

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/tracker/${id}`)
        setJob(response.data)
        setStatus(response.data.status)
      } catch (err) {
        console.error("Failed to fetch job details:", err)
        setError("Could not load job details.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (isLoading) {
    return <div className="text-center p-10 text-gray-500">Loading Job Details...</div>
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>
  }
  if (!job) {
    return <div className="text-center p-10 text-gray-500">Job not found.</div>
  }

  const getStatusBadge = () => {
    const statusStyles = {
      Applied: "bg-blue-50 text-blue-700 border border-blue-200",
      Interviewing: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      Preparing: "bg-amber-50 text-amber-700 border border-amber-200",
      Offer: "bg-green-50 text-green-700 border border-green-200",
      Rejected: "bg-gray-100 text-gray-600 border border-gray-200",
      Saved: "bg-slate-50 text-slate-700 border border-slate-200",
    }
    return statusStyles[job.status] || statusStyles["Saved"]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
    
        <div className="mb-8">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${getStatusBadge()}`}
          >
            {job.status}
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 text-pretty">{job.jobTitle}</h1>
          <div className="flex items-center gap-2 text-lg text-gray-600">
            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            <span>{job.companyName}</span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-serif text-gray-900 mb-6">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8 text-base">
                {job.jobDescription || "No description was saved."}
              </p>
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                Apply at Original Site
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-serif text-gray-900 mb-2">AI Toolkit</h3>
              <p className="text-sm text-gray-500 mb-6">Enhance your application</p>

              <div className="space-y-3">
                <Link
                  to="/ats-check"
                  state={{ jobDescription: job.jobDescription }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 text-blue-700 font-medium transition-all border border-blue-100 hover:border-blue-200"
                >
                  <DocumentTextIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Check Resume (ATS)</span>
                </Link>

                <Link
                  to="/interview"
                  state={{ jobDescription: job.jobDescription }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-50 hover:from-emerald-100 hover:to-emerald-100 text-emerald-700 font-medium transition-all border border-emerald-100 hover:border-emerald-200"
                >
                  <MicrophoneIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Practice Interview</span>
                </Link>

                <Link
                  to="/resume-builder"
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-50 hover:from-amber-100 hover:to-amber-100 text-amber-700 font-medium transition-all border border-amber-100 hover:border-amber-200"
                >
                  <SparklesIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">Tweak My Resume</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-serif text-gray-900 mb-4">Application Status</h3>
              <select
                value={status}
                onChange={handleStatusUpdate}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
              >
                <option value="Saved">Saved</option>
                <option value="Preparing">Preparing</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <p className="text-xs text-gray-400 mt-3">Status updates in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
