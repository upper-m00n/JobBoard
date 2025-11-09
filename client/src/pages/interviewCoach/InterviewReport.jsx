import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "../../api/axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const formatChartData = (answers) => {
  return answers
    .filter((a) => a.answerText)
    .map((a, index) => ({
      name: `Q${index + 1}`,
      tone: a.toneScore,
      fillerWords: a.fillerWordCount,
      fullData: a,
    }))
}

const chartConfig = {
  tone: {
    label: "Tone (sentiment)",
    color: "#5B4EA8",
  },
  fillerWords: {
    label: "Filler Words",
    color: "#10B981",
  },
}

function InterviewReport() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        const sessionRes = await axios.get(`/interview/session/${sessionId}`)
        setSession(sessionRes.data)

        const reportRes = await axios.post(`/interview/report/${sessionId}`)
        setReport(reportRes.data)

        setError(null)
      } catch (err) {
        console.error(err)
        setError("Failed to load report. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchReport()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">Loading Your Report...</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-10 text-red-500"
      >
        {error}
      </motion.div>
    )
  }
  if (!session || !report) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-10">
        No data found.
      </motion.div>
    )
  }

  const chartData = formatChartData(session.answers)

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

  const tipVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Interview Report
          </h1>
          <p className="text-slate-600 text-lg">Detailed analysis of your interview performance</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8 hover:shadow-xl transition-shadow"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8">
            <motion.h2
              className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"
                animate={{ scaleY: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              ></motion.span>
              Overall Summary
            </motion.h2>
            <motion.p
              className="text-slate-700 leading-relaxed text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {report.summary}
            </motion.p>
          </div>

          <motion.div
            className="border-t border-slate-200 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2
              className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"
                animate={{ scaleY: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              ></motion.span>
              Actionable Tips
            </motion.h2>
            <motion.ul className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
              {report.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  className="flex gap-3 text-slate-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                  variants={tipVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.span
                    className="text-indigo-600 font-semibold flex-shrink-0 mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    •
                  </motion.span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="mb-6">
              <motion.h3
                className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Tone Analysis
              </motion.h3>
              <p className="text-sm text-slate-600">(Sentiment Score - Higher is more positive)</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{ backgroundColor: "#fff", border: "2px solid #5B4EA8", borderRadius: "8px" }}
                    />
                    <Bar dataKey="tone" fill="#5B4EA8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="mb-6">
              <motion.h3
                className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Confidence Analysis
              </motion.h3>
              <p className="text-sm text-slate-600">(Filler Words - Lower is more confident)</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{ backgroundColor: "#fff", border: "2px solid #10B981", borderRadius: "8px" }}
                    />
                    <Bar dataKey="fillerWords" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.h2
            className="text-2xl font-semibold text-slate-900 mb-8 flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.span
              className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
            ></motion.span>
            Full Q&A Breakdown
          </motion.h2>
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {session.answers
              .filter((a) => a.answerText)
              .map((a, index) => (
                <motion.div
                  key={index}
                  className={index !== session.answers.length - 1 ? "border-b border-slate-200 pb-8" : ""}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <motion.h4
                    className="text-lg font-semibold text-slate-900 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Q{index + 1}:
                    </span>{" "}
                    {a.questionText}
                  </motion.h4>
                  <motion.div
                    className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <p className="text-slate-700">
                      <span className="font-semibold text-slate-900">Your Answer:</span> "{a.answerText}"
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <p className="font-semibold text-indigo-900 mb-2">Content Analysis</p>
                    <p className="text-slate-700">{a.contentAnalysis}</p>
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Link
            to="/interview"
            className="block w-full text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-indigo-700"
          >
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
              Start a New Interview
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default InterviewReport
