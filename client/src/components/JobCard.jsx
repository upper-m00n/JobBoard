import { Link } from "react-router-dom"
import { MapPin, Briefcase, DollarSign } from "lucide-react"

export default function JobCard({ job }) {
  return (
    <Link to={`/job/${job._id}`}>
      <div className="bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
            <p className="text-slate-600">{job.company}</p>
          </div>
          {job.type && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">{job.type}</span>
          )}
        </div>

        <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </div>
          )}
          {job.experience && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.experience}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {job.skills &&
            job.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                {skill}
              </span>
            ))}
          {job.skills && job.skills.length > 3 && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
