import { useEffect, useState } from "react";
import axios from '../../api/axios'
import {useAuth} from '../../context/AuthContext'
import {Link,Navigate, useNavigate} from 'react-router-dom'

export default function EmployerDashboard(){
    const {user}= useAuth();
    const [jobs, setJobs]= useState([])
    const navigate = useNavigate();

    if(!user || user.role !== 'employer') return <Navigate to='/'/>

    const fetchJobs= async()=>{
        try{
            const token = localStorage.getItem('token')
            const res= await axios.get('/jobs/myJobs', {headers:{Authorization: `Bearer ${token}`},})
            setJobs(res.data)
        }
        catch(err){
            console.error(err);
        }
    }

    const handleDelete = async()=>{
        const confirm = window.confirm('Are you sure you want to delete this job?')
        if(!confirm) return

        try {
            const token= localStorage.getItem('token')
            await axios.delete(`/jobs/${id}`,{headers:{Authorization: `Bearer ${token}`},})
            setJobs(jobs.filter((job)=> job._id !== id))
        } catch (error) {
            alert('Delete failed')
        }
    }

        useEffect(()=>{
            fetchJobs()
        },[])

    return (
        <div className="max-w-5xl mx-auto p-4 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font bold text-gray-800">DashBoard</h1>
                <Link to='/jobs/new' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"> + Post Job</Link>
            </div>

            <div className="mb-4">
                <p className="text-gray-600" >You have posted <strong>{jobs.length}</strong>jobs(s).</p>
            </div>

            {jobs.length === 0 ? (<p className="text-gray-500">No jobs posted yet.</p>):
            (<table className="w-full table-auto border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 text-left">Title</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Posted</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job)=>(
                        <tr key={job._id} className="border-t hover:bg-gray-50">
                            <td className="p-2">{job.title}</td>
                            <td className="p-2">{job.location}</td>
                            <td className="p-2">{job.type}</td>
                            <td className="p-2">{new Date(job.createdAt).toLocaleDateString()}</td>
                            <td className="p-2 bg-green-300 rounded hover:bg-green-600 transition cursor-pointer" onClick={()=>{navigate(`/dashboard/employer/jobApplications/${job._id}`)}}>See Applications</td>
                        </tr>
                    ))}
                </tbody>
            </table>)
            }

        </div>
    )
}

