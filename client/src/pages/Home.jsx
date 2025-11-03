"use client"

import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Link } from "react-router-dom"
import JobCard from "../components/JobCard"
import HeroSection from "../components/HeroSection"
import { MessageSquare, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { FileText } from "lucide-react"

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
    <div className="w-full">
      <HeroSection />

      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Interview Practice</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Master Your Interview Skills</h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get real-time feedback on your interview performance. Practice common questions, refine your answers, and
            interview with confidence using our AI-powered system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user !== null ? (
              <Link
                to="/interview"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all group"
              >
                <MessageSquare className="w-5 h-5" />
                Start Interview Practice
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Sign in to Practice
              </Link>
            )}
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-muted border border-border text-foreground px-8 py-4 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all group"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { title: "Real-time Feedback", desc: "Instant analysis on delivery and content" },
              { title: "Common Questions", desc: "Practice frequently asked interview questions" },
              { title: "Confidence Building", desc: "Track progress and improve over time" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full w-fit">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">AI Resume Builder</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Build Your Perfect Resume in Minutes
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Create a professionally designed resume with our AI-powered builder. Get optimized formatting,
                  tailored content, and instant download capabilities.
                </p>

                <ul className="space-y-3 pt-4">
                  {["ATS-Optimized Templates", "AI Content Suggestions", "Instant PDF Export"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link
                    to="/resume-builder"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-md hover:shadow-lg transition-all group"
                  >
                    Start Building
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Visual Element */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-xs">
                  <div className="w-full h-64 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl border border-accent/30 flex items-center justify-center group hover:border-accent/50 transition-all">
                    <FileText className="w-20 h-20 text-accent/40 group-hover:text-accent/60 transition-colors" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-xl border border-primary/20 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground">Featured Opportunities</h2>
            <p className="text-lg text-muted-foreground mt-2">Discover roles that match your skills and career goals</p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-border">
              <p className="text-muted-foreground text-lg">No jobs available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <div className="text-center pt-12">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md hover:shadow-lg transition-all group"
            >
              View All Opportunities
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
