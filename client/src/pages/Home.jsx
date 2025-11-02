"use client"

import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Link } from "react-router-dom"
import JobCard from "../components/JobCard"
import HeroSection from "../components/HeroSection"
import ResumeBuilderCTA from "../components/ResumeBuilderCTA"
import { MessageSquare, Sparkles } from "lucide-react"

export default function Home() {
  const [jobs, setJobs] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/jobs")
        setJobs(res.data)
      } catch (err) {
        console.error("Failed to fetch jobs", err)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="p-0">
      <HeroSection />

      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20 mt-16 rounded-2xl px-6 m-4">
        <div className="text-center space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">AI Powered</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">Practice Interviews with AI</h2>

          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Get real-time feedback on your interview skills. Practice common questions, refine your answers, and
            interview with confidence.
          </p>

          {user !== null ? (
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all mt-4 group"
            >
              <MessageSquare className="w-5 h-5" />
              Start Interview Practice
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all mt-4"
            >
              <MessageSquare className="w-5 h-5" />
              Sign in to Practice
            </Link>
          )}
        </div>
      </div>

      <ResumeBuilderCTA />

      <div className="px-6 py-16 pt-0">
        <div className="mb-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900">Featured Opportunities</h2>
          <p className="text-slate-600 mt-2">Discover roles that match your skills</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No jobs available at the moment</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
