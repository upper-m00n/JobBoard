import { useEffect, useState } from "react";
import axios from '../api/axios'
import {Link} from 'react-router-dom'
import JobCard from "../components/JobCard";
import HeroSection from "../components/HeroSection";
import ResumeBuilderCTA from "../components/ResumeBuilderCTA";

export default function Home(){
    const[jobs, setJobs]= useState([]);

    useEffect(()=>{
        const fetchJobs= async()=>{
            try {
                const res= await axios.get('/jobs')
                setJobs(res.data)
            } catch (error) {
                console.error('Failed to fetch jobs',err);
            }
        }
        fetchJobs()
    },[])

    return(
        <>
          <HeroSection/>  
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