import React,{useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import axios from '../../api/axios'

export default function UpdateApplicationPage(){
    const {applicationId}= useParams()
    const navigate = useNavigate()

    const [coverLetter, setCoverLetter]= useState("");
    const [resume,setResume]= useState(null);
    const [message,setMessage]= useState("");

    useEffect(()=>{
        const fetchApplication = async() =>{
            try{
                const token= localStorage.getItem('token')
                const res = await axios.get(`/applications/${applicationId}`,{
                    headers:{Authorization: `Bearer ${token}`}
                })

                setCoverLetter(res.data.coverLetter);
            }
            catch(err){
                console.error("Failed to fetch application",err)
            }
        }
        fetchApplication();
    },[applicationId]);

    const handleSubmit= async (e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append("coverLetter",coverLetter);

        if(resume) formData.append("resume",resume);

        try {
            const token = localStorage.getItem('token')
            const res= await axios.put(`/applications/${applicationId}`,formData,{
                headers: {Authorization:`Bearer ${token}`,
                "Content-Type":"multipart/form-data",
            },
            })

            setMessage(res.data.message);
            setTimeout(() => navigate("/dashboard/seeker",{state:{updated:true}}),2000)
            
        } catch (err) {
            console.error("Failed to update application",err);
            setMessage("Update Failed.")
        }
    }

    return (<div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Upload New Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="block w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cover Letter</label>
          <textarea
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>)



}