import axios from "../../api/axios"
import { useState } from "react"
import { CheckCircleIcon, AlertCircleIcon, TrendingUpIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"

export default function ATScheck() {

  const location= useLocation()
  const jd= location.state || "";
  console.log(jd)

  const [feedback, setFeedback] = useState(null)
  const [jobDescription, setJobDescription] = useState(jd.jobDescription)
  const [resumeFile, setResumeFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFeedback(null)

    if (!resumeFile || !jobDescription) {
      setError("Please upload a resume (PDF) and paste a job description")
      setIsLoading(false)
      return
    }

    if (resumeFile.type !== "application/pdf") {
      setError("Please upload PDF file only")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("jobDescription", jobDescription)

    try {
      const response = await axios.post("/resume/check-ats", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setFeedback(response.data)
    } catch (err) {
      console.error("Error checking ATS:", err)

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error)
      } else {
        setError("An unknown error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
  
        <motion.div variants={headerVariants} initial="hidden" animate="visible" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-30 animate-pulse"></div>
              <TrendingUpIcon className="h-10 w-10 text-accent relative" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Optimize Your Resume for ATS
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            See how well your resume matches a job description. Get instant insights on keywords, formatting, and
            actionable recommendations.
          </p>
        </motion.div>

  
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-sm p-8 md:p-10 mb-8 hover:shadow-md transition-all"
        >
     
          <div className="mb-8">
            <label htmlFor="jobDescription" className="block text-sm font-semibold text-foreground mb-3">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full px-4 py-3 rounded-lg bg-input border border-black text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 min-h-[180px] resize-none"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="resumeFile" className="block text-sm font-semibold text-foreground mb-3">
              Upload Your Resume (PDF only)
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input
                id="resumeFile"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="relative w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 hover:file:cursor-pointer cursor-pointer transition-all duration-200"
                required
              />
            </div>
            {resumeFile && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-primary mt-2 flex items-center gap-2"
              >
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">{resumeFile.name}</span>
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-amber-500 hover:bg-black/90 hover:text-white text-accent-foreground py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing Your Resume...
              </>
            ) : (
              <>
                <TrendingUpIcon className="h-5 w-5 mr-2" />
                Check My Match Score
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg flex items-start gap-3"
          >
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block">Error</strong>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {feedback && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Score Card */}
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all"
            >
              <div className="bg-gradient-to-r from-accent/10 via-background to-background p-8 text-center">
                <p className="text-muted-foreground text-sm font-medium mb-2">Your Match Score</p>
                <div className="flex items-center justify-center gap-6 flex-col md:flex-row">
                  <div className="relative w-32 h-32 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <svg className="w-32 h-32 transform -rotate-90 relative" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="8"
                        strokeDasharray={339.29}
                        initial={{ strokeDashoffset: 339.29 }}
                        animate={{ strokeDashoffset: 339.29 - (feedback.match_score / 100) * 339.29 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-4xl font-bold text-accent"
                      >
                        {feedback.match_score}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">%</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-left">
                    <p className="text-2xl font-semibold text-foreground">{feedback.summary}</p>
                    <p className="text-sm text-muted-foreground">based on keyword matching and formatting</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Missing Keywords */}
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircleIcon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Missing Keywords</h3>
              </div>
              {feedback.missing_keywords && feedback.missing_keywords.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2"
                >
                  {feedback.missing_keywords.map((keyword, index) => (
                    <motion.span
                      key={index}
                      variants={itemVariants}
                      className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3"
                >
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-primary font-medium">Great job! No major keywords are missing from your resume.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Formatting Issues */}
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Formatting & Recommendations</h3>
              </div>
              {feedback.formatting_issues && feedback.formatting_issues.length > 0 ? (
                <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                  {feedback.formatting_issues.map((issue, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex gap-3 text-foreground hover:text-primary transition-colors duration-200"
                    >
                      <span className="text-primary font-semibold flex-shrink-0 mt-1">→</span>
                      <span className="text-sm leading-relaxed">{issue}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3"
                >
                  <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-primary font-medium">Your resume formatting looks clean and ATS-friendly.</p>
                </motion.div>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={() => setFeedback(null)}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              Check Another Resume
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
