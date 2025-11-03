"use client"

import { Link } from "react-router-dom"
import { MapPin, DollarSign, Briefcase, Calendar, Star } from "lucide-react"

export default function JobCard({ job }) {
  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    const isSaved = savedJobs.find((j) => j._id === job._id)

    if (isSaved) {
      const filtered = savedJobs.filter((j) => j._id !== job._id)
      localStorage.setItem("savedJobs", JSON.stringify(filtered))
    } else {
      savedJobs.push(job)
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
    }
  }

  const isSaved = JSON.parse(localStorage.getItem("savedJobs") || "[]").find((j) => j._id === job._id)

  return (
    <Link to={`/jobs/${job._id}`}>
      <div className="h-full bg-white rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all p-6 group cursor-pointer">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSaveJob()
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Star className={`w-5 h-5 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {job.skills &&
              job.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
