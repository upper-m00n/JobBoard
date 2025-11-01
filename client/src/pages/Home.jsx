import { useEffect, useState } from "react";
import axios from '../api/axios'
import {Link} from 'react-router-dom'
import JobCard from "../components/JobCard";
import HeroSection from "../components/HeroSection";
import ResumeBuilderCTA from "../components/ResumeBuilderCTA";
import { useAuth } from "../context/AuthContext";

export default function Home(){
    const[jobs, setJobs]= useState([]);
    const user=JSON.parse(localStorage.getItem('user'))

    useEffect(()=>{
        const fetchJobs= async()=>{
            try {
                const res= await axios.get('/jobs')
                console.log(res.data)
                setJobs(res.data)
            } catch (err) {
                console.error('Failed to fetch jobs',err);
            }
        }
        fetchJobs()
    },[])

    return(
        <>
          <HeroSection/>  
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16 mt-10 rounded-lg">
                <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-4">Interview with AI</h2>
                <p className="text-lg mb-8 text-indigo-100">
                    Practice real-world interview questions powered by AI.  
                    Get instant feedback, improve your responses, and prepare with confidence.
                </p>

                {user !== null ? <Link
                    to="/interview"
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-100 transition duration-300"
                >
                    Start AI Interview
                </Link> : <Link
                    to="/login"
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-100 transition duration-300"
                >
                    Start AI Interview
                </Link> }
                

                </div>
            </div>
          <ResumeBuilderCTA/>
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-6 text-gray-800"> Featured Jobs</h1>
                {jobs.length === 0 ? (<p className="text-gray-500">No Jobs found</p>) : 
                (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map((job)=>(
                            <JobCard key={job._id} job={job}/>
                        ))}
                    </div>
                )}
            </div>
        </>
        
    )
}