"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Briefcase, FileText, MessageSquare, Sparkles,Check } from "lucide-react"

function HeroSection() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/job-search?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate("/job-search")
    }
  }

  const navigationButtons = [
    { label: "Browse Jobs", icon: Briefcase, action: () => navigate("/job-search"), role: "all" },
    { label: "AI Resume Builder", icon: FileText, action: () => navigate("/resume-builder"), role: "all" },
    { label: "Dashboard", icon: Briefcase, action: () => navigate("/dashboard/seeker"), role: "seeker" },
    { label: "Interview Practice", icon: MessageSquare, action: () => navigate("/interview"), role: "seeker" },
    { label: "ATS check", icon: Check, action: () => navigate("/ats-check"), role: "seeker" },
    { label: "Your Postings", icon: Briefcase, action: () => navigate("/dashboard/employer"), role: "employer" },
  ]

  const getVisibleButtons = () => {
    if (user?.role === "employer") {
      return navigationButtons.filter((btn) => btn.role === "employer" || btn.role === "all")
    }
    return navigationButtons.filter((btn) => btn.role === "seeker" || btn.role === "all")
  }

  return (
    <section className="relative w-full min-h-[700px] overflow-hidden pt-20 pb-32">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 z-0"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">AI-Powered Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground max-w-4xl mx-auto text-balance">
            Find Your <span className="text-primary">Dream Job</span> Today
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Discover thousands of opportunities across tech, design, business, and more. Build your perfect resume and
            practice interviews with AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4"
          >
            <div className="w-full sm:w-auto flex gap-2 flex-1 sm:flex-none">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search jobs by title, skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-full text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none shadow-sm hover:border-muted transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">Quick access to key features</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center max-w-4xl mx-auto">
              {getVisibleButtons().map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-muted border border-border hover:border-primary text-foreground font-medium px-4 py-2.5 rounded-lg transition-all group hover:shadow-sm"
                >
                  <btn.icon className="w-4 h-4 group-hover:scale-110 transition-transform text-primary" />
                  <span className="hidden sm:inline text-sm">{btn.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
