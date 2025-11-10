import axios from "../../api/axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  BuildingOfficeIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"

function JobSearch() {
  const loc = useLocation()

  const queryParams = new URLSearchParams(loc.search)
  const searchTerm = queryParams.get("search") || ""

  const [query, setQuery] = useState(searchTerm)
  const [location, setLocation] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savedStatus, setSavedStatus] = useState({})

  useEffect(() => {
    if (searchTerm) {
      setQuery(searchTerm)
      handleSearch()
    }
  }, [searchTerm])

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const response = await axios.post("/aggregate", { query, location })
      console.log(response.data)
      setResults(response.data)
    } catch (error) {
      setError("Failed to fetch jobs. The scraper might be blocked. Please try again later.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveJob = async (job) => {
    setSavedStatus((prev) => ({ ...prev, [job.jobUrl]: "saving" }))
    try {
      await axios.post("/tracker", {
        jobTitle: job.title,
        companyName: job.company,
        jobDescription: job.summary,
        originalUrl: job.jobUrl,
      })

      setSavedStatus((prev) => ({ ...prev, [job.jobUrl]: "saved" }))
    } catch (err) {
      setSavedStatus((prev) => ({ ...prev, [job.jobUrl]: "error" }))
      console.error("Failed to save job:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">Find Your Next Job</h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Discover opportunities tailored to your skills and experience
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex-grow relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, keyword, or skill"
              className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex-1 relative">
            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or remote"
              className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Searching
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5" />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-red-200" />
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {results.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="mb-4 text-slate-400">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-slate-500 text-lg">Enter a job title and location to get started</p>
          </div>
        )}

        {/* Job Listings */}
        <div className="grid gap-4">
          {results.map((job, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start gap-4">
                {/* Left Content */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{job.company}</span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">{job.summary}</p>

                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 group/link"
                  >
                    View full posting
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </a>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => handleSaveJob(job)}
                  disabled={savedStatus[job.jobUrl] === "saving" || savedStatus[job.jobUrl] === "saved"}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    savedStatus[job.jobUrl] === "saved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200 active:bg-blue-100"
                  } disabled:opacity-60`}
                >
                  {savedStatus[job.jobUrl] === "saved" ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Saved
                    </>
                  ) : savedStatus[job.jobUrl] === "saving" ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-8 w-8 rounded-full border-3 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-slate-600 font-medium">Finding great opportunities...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobSearch
