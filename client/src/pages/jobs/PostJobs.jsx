import { useState } from "react";
import {useNavigate, Navigate} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import axios from '../../api/axios'

export default function PostJob(){
    const {user} = useAuth()
    const navigate=useNavigate()

    if(!user || user.role !=='employer') return <Navigate to='/'/>

    const [form, setForm]= useState({
        title:'',
        company:'',
        location:'',
        type:'Full-time',
        description:'',
    })

    const handleChange=(e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            const token = localStorage.getItem('token')
            await axios.post('/jobs', form,{
                headers: {Authorization:`Bearer ${token}`},
            })
            alert('Job posted successfully')
            navigate('/dashboard/employer')
        }
        catch(err){
            //console.error(err);
            alert(err.response?.data?.error || 'Failed to post job')
        }
    }

    return(
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-while shadow rounded">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a new Job</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text"
                    name="title"
                    placeholder="Job Title"
                    className="w-full border px-4 py-2 rounded"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input type="text"
                    name="company"
                    placeholder="Company"
                    className="w-full border px-4 py-2 rounded"
                    value={form.company}
                    onChange={handleChange}
                    required
                />

                <input type="text"
                    name="location"
                    placeholder="Location"
                    className="w-full border px-4 py-2 rounded"
                    value={form.location}
                    onChange={handleChange}
                    required
                />

                <select name="type"
                    className="w-full border px-4 py-2 rounded"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                </select>

                <textarea name="description"
                    placeholder="Job Description" 
                    rows='5'
                    className="w-full border px-4 py-2 rounded"
                    value={form.description}
                    onChange={handleChange}
                    required
                ></textarea>

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-900">Post Job</button>
            </form>
        </div>
    )
}