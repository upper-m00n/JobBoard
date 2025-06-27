import React from 'react'
import { Link } from 'react-router-dom'
function ResumeBuilderCTA() {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 rounded-xl shadow-xl my-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
           
            <div className="md:w-2/3">
            <h2 className="text-4xl font-bold mb-4">
                ✨ Build a Stunning Resume in Seconds
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
                Stand out from the crowd with our AI-powered Resume Builder. Just enter your details and get a professionally designed resume ready to download — perfect for every job application.
            </p>
            <Link 
                to="/resume-builder" 
                className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
            >
                🛠️ Start Building Now
            </Link>
            </div>

            
            <div className="md:w-1/3 hidden md:block">
            <img 
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" 
                alt="Resume Builder Illustration" 
                className="w-full"
            />
            </div>
        </div>
</section>
    )
}

export default ResumeBuilderCTA
