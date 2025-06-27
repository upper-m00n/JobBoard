import { useState } from 'react'
import { useEffect, usestate } from "react";
import axios from '../../api/axios'
import JobCard from '../../components/JobCard'
import { Query } from 'mongoose';
import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function JobList(){
    const query = useQuery();
    const [jobs,setJobs]= useState([])
    const [filteredJobs, setFilteredJobs] = useState([]);
    const searchTerm = query.get('search')?.toLowerCase() || '';

    useEffect(()=>{
        const fetchJobs = async ()=>{
            try{
                const res = await axios.get('/jobs')
                setJobs(res.data)
            }
            catch(err){
                console.error('Error fetching Jobs', err);
            }
        }

        fetchJobs()
    },[])

    useEffect(() => {
        if(!searchTerm){
            setFilteredJobs(jobs);
        }
        else{
            const result = jobs.filter((job)=>
                job.title.toLowerCase().includes(searchTerm) || 
                job.company.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm)
            );
            setFilteredJobs(result);
        }
    },[searchTerm, jobs]);

    return (
        <div className='max-w-4xl mx-auto mt-10 px-4'>
            <h2 className='text-3xl font-bold mb-6 text-gray-800'>{searchTerm ? `Results for "${searchTerm}"` : 'Latest Job Listings'}</h2>
            <div className='grid gap-6'>
                {filteredJobs.length === 0? (<p>No Jobs found.</p>):
                (filteredJobs.map((job)=> <JobCard key={job._id} job={job}/>))
                }
            </div>
        </div>
    )
}