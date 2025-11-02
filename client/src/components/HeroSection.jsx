"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Briefcase, FileText, MessageSquare } from "lucide-react"

function HeroSection() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate("/jobs")
    }
  }

  const navigationButtons = [
    { label: "Browse Jobs", icon: Briefcase, action: () => navigate("/jobs"), role: "all" },
    { label: "AI Resume Builder", icon: FileText, action: () => navigate("/resume-builder"), role: "all" },
    { label: "Dashboard", icon: Briefcase, action: () => navigate("/dashboard/seeker"), role: "seeker" },
    { label: "Applications", icon: MessageSquare, action: () => navigate("/dashboard/seeker"), role: "seeker" },
    { label: "Interview Practice", icon: MessageSquare, action: () => navigate("/interview"), role: "seeker" },
    { label: "Employer Dashboard", icon: Briefcase, action: () => navigate("/dashboard/employer"), role: "employer" },
    { label: "Your Postings", icon: Briefcase, action: () => navigate("/dashboard/employer"), role: "employer" },
  ]

  const getVisibleButtons = () => {
    if (user?.role === "employer") {
      return navigationButtons.filter((btn) => btn.role === "employer" || btn.role === "all")
    }
    return navigationButtons.filter((btn) => btn.role === "seeker" || btn.role === "all")
  }

  return (
    <section
      className="relative w-full min-h-[600px] bg-cover bg-center  overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/65 to-slate-950/70 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight"
        >
          Find Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dream Job</span>{" "}
          Today
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
        >
          Discover thousands of opportunities across tech, design, business, and more with our AI-powered platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 max-w-xl mx-auto"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-5 py-3 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
            {getVisibleButtons().map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-lg backdrop-blur-sm transition-all border border-white/20 group"
              >
                <btn.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
