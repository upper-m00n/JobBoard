import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import{FaTrash} from 'react-icons/fa'

export default function JobApplications(){
    const {jobId} = useParams();

    const [applications,setApplications]= useState([]);
    const [error, setError]= useState("");

    useEffect(()=>{
        console.log("jobId:",jobId)
        const fetchApplications = async()=>{

            try {
                const token = localStorage.getItem('token');

            const res= await axios.get(`/applications/employer/${jobId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setApplications(res.data.applications || []);
            console.log(applications)
            } 
            catch (err) {
                setError('Failed to fetch applications');
                console.error(err)
            }
        }
        fetchApplications();
    },[jobId]);

    const updateStatus = async (appId, status) =>{
        try {
            const token = localStorage.getItem('token')
            await axios.patch(`/applications/${appId}/status`,{status},{headers:{Authorization:`Bearer ${token}`}})

            setApplications((prev)=> prev.map((app)=>
                app._id === appId ?{...app,status} : app
            ))
        } catch (error) {
            alert("Failed to update status")
        }
    }

    const deleteApplication= async(appId)=>{
        try {
            const token= localStorage.getItem('token')
            await axios.delete(`/applications/employer/${appId}`, {
                headers:{Authorization:`Bearer ${token}`}
            })
            setApplications((prev)=>prev.filter((app)=> app._id !==appId));
            alert("Application deleted.")
        } catch (error) {
            alert('Failed to delete application')
            console.error(error);
        }
    }

    return(
        <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Applications for this Job</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {applications.length === 0 ? (<p className="text-gray-600">No applications yet.</p>):
            (
                <div className="space-y-4">
                    {applications.map((app)=>
                        <div key={app._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <p className="font-semibold">Seeker ID: {app.seeker?._id}</p>
                            <p className="mt-2">Cover Letter : {app.coverLetter}</p>
                            <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-2">View Resume</a>

                            <div className="mt-3 flex gap-3">
                                <button onClick={()=> updateStatus(app._id, "accepted")} className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-800 transition">Accept</button>
                                <button onClick={()=> updateStatus(app._id, "rejected")} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-800 transition">Reject</button>
                                <button onClick={()=> updateStatus(app._id, "pending")} className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-red-800 transition">Pending</button>
                                <button onClick={()=> deleteApplication(app._id)} className="text-3xl"><FaTrash/></button>
                                
                                <span className="ml-auto font-medium text-sm">
                                    Status:{" "}
                                    <span className={`capitalize ${
                                        app.status === "accepted"
                                        ? "text-green-500"
                                        : app.status === "rejected"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}>
                                        {app.status}
                                    </span>
                                    </span>
                                </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}