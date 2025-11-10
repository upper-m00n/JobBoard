import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Link } from "react-router-dom"
import JobCard from "../components/JobCard"
import HeroSection from "../components/HeroSection"
import { MessageSquare, Sparkles, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react"
import { FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [jobs, setJobs] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const res = await axios.get("/jobs")
  //       setJobs(res.data)
  //     } catch (err) {
  //       console.error("Failed to fetch jobs", err)
  //     }
  //   }
  //   fetchJobs()
  // }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
          >
            {[
              { title: "Real-time Feedback", desc: "Instant analysis on delivery and content" },
              { title: "Common Questions", desc: "Practice frequently asked interview questions" },
              { title: "Confidence Building", desc: "Track progress and improve over time" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
<section className="py-20 px-6 bg-gradient-to-br from-indigo-50/20 via-background to-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white via-indigo-50/10 to-slate-50 rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 rounded-full w-fit border border-indigo-200/50"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    AI Resume Builder
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
                >
                  Build Your Perfect Resume in Minutes
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  Create a professionally designed resume with our AI-powered builder. Get optimized formatting,
                  tailored content, and instant download capabilities.
                </motion.p>

                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3 pt-4"
                >
                  {["ATS-Optimized Templates", "AI Content Suggestions", "Instant PDF Export"].map((item, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -15 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.4 },
                        },
                      }}
                      className="flex items-center gap-3 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 group-hover:text-indigo-700" />
                      </motion.div>
                      <span className="text-foreground font-medium">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="pt-4"
                >
                  <Link
                    to="/resume-builder"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all group"
                  >
                    Start Building
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <div className="relative w-full max-w-xs">
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="w-full h-64 bg-gradient-to-br from-indigo-100/60 to-blue-100/40 rounded-2xl border-2 border-indigo-200/60 flex items-center justify-center group hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      className="relative"
                    >
                      <FileText className="w-20 h-20 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-200/20 rounded-xl border border-blue-200/40 -z-10"
                  ></motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-amber-50/30 via-background to-background mt-0">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full w-fit"
                >
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">ATS Resume Checker</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
                >
                  Optimize Your Resume for ATS
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  Check how well your resume matches job descriptions. Get instant insights on missing keywords,
                  formatting issues, and actionable recommendations to improve your match score.
                </motion.p>

                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-3 pt-4"
                >
                  {["Keyword Analysis", "Formatting Check", "Match Score"].map((item, idx) => (
                    <motion.li key={idx} variants={itemVariants} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="pt-4"
                >
                  <Link
                    to="/ats-check"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all group"
                  >
                    Check My Resume
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="relative w-full max-w-xs"
                >
                  <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center group hover:border-amber-300 transition-all">
                    <TrendingUp className="w-20 h-20 text-amber-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200/20 rounded-xl border border-amber-200/30 -z-10"
                  ></motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* <section className="py-20 px-6 bg-slate-50/50">
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {jobs.map((job) => (
                <motion.div key={job._id} variants={itemVariants}>
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
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
      </section> */}
    </div>
  )
}
