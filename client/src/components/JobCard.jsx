import {useNavigate} from 'react-router-dom'

export default function JobCard({job}){

    const navigate=useNavigate();

    const handleApplyClick= () =>{
        navigate(`/jobs/${job._id}/apply`,{
            state:{job},
        })
    }

    return(
        <div className="p-6 border bg-gray-300 rounded shadow hover:shadow-black transition">
            <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
            <p className="text-gray-700">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
            <p className="text-xs text-gray-800 mt-1">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
            </p>
            <button onClick={handleApplyClick} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Apply Now</button>
      </div>
    )
}