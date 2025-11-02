"use client"

import { useState, useRef } from "react"
import axios from "../../api/axios"

const InterviewCoach = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [jobDescription, setJobDescription] = useState("SDE-I")

  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])

  const startInterview = async () => {
    setIsLoading(true)
    setMessages([])

    try {
      const response = await axios.post("/interview/start", { jobDescription: jobDescription })
      const data = response.data

      setSessionId(data.sessionId)
      addMessage("ai", data.firstQuestion)
      setIsInterviewStarted(true)
      speakText(data.firstQuestion)
    } catch (error) {
      console.error("Error starting interview:", error)
      addMessage("ai", "Error: Could not start the interview. Please try again.")
    }
    setIsLoading(false)
  }

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
    } else {
      startRecording()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = sendAudioToServer

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      addMessage("ai", "Error: Could not access microphone.")
    }
  }

  const sendAudioToServer = async () => {
    setIsLoading(true)
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
    const formData = new FormData()
    formData.append("audio", audioBlob)
    formData.append("sessionId", sessionId)

    try {
      const response = await axios.post("/interview/answer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const data = response.data
      addMessage("user", data.userTranscript)
      const aiFullResponse = `${data.feedback} ... ${data.nextQuestion}`
      addMessage("ai", aiFullResponse)
      speakText(aiFullResponse)
    } catch (error) {
      console.error("Error sending audio:", error)
      addMessage("ai", "Error: Could not process your answer. Please try again.")
    }
    setIsLoading(false)
  }

  const addMessage = (type, text) => {
    setMessages((prev) => [...prev, { type, text }])
  }

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI Interview Coach</h1>
            <p className="text-slate-300 text-sm">Practice interviews with AI-powered feedback</p>
          </div>

          {/* Job Description Input */}
          <div className="mb-6">
            <label htmlFor="jd" className="block text-sm font-semibold text-slate-200 mb-3">
              Job Description
            </label>
            <textarea
              id="jd"
              name="jd"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 min-h-[90px] resize-none"
              placeholder='E.g., "Senior React Developer with 5 years experience..."'
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
              disabled={isInterviewStarted}
            />
          </div>

          {/* Messages Container */}
          <div className="border border-slate-600/30 rounded-xl p-5 h-[450px] overflow-y-auto mb-6 bg-slate-800/30 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-center">Click "Start Interview" to begin your practice session.</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-blue-500/20"
                      : "bg-slate-700 text-slate-100 rounded-bl-none shadow-slate-900/50"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 opacity-75">{msg.type === "user" ? "You" : "AI Coach"}</p>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <p className="text-slate-400 text-sm ml-3">AI is thinking...</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex gap-3">
            {!isInterviewStarted ? (
              <button
                onClick={startInterview}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                {isLoading ? "Starting..." : "Start Interview"}
              </button>
            ) : (
              <button
                onClick={toggleRecording}
                disabled={isLoading}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/30 hover:shadow-red-500/50"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-500/30 hover:shadow-green-500/50"
                }`}
              >
                {isLoading ? "Processing..." : isRecording ? "⏹ Stop Recording" : "🎤 Record Answer"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewCoach
