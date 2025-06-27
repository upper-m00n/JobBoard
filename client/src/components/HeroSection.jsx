import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function HeroSection() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () =>{
    if(searchTerm.trim()){
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    }
    else{
      navigate('/jobs');
    }
  }

  return (
    <section
      className="relative w-full min-h-[600px] bg-cover bg-center rounded-3xl overflow-hidden"
      style={{
        backgroundImage: "url('/image.png')",
      }}
    >
  
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg"
        >
          Find Your <span className="text-blue-400">Dream Job</span> Today
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Discover thousands of opportunities across tech, design, business, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 max-w-md mx-auto"
        >
          <div className='flex'>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e)=> setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-full shadow-md text-black focus:ring-2 focus:ring-blue-500 outline-none rounded-r-[0px]"
            />
            <button onClick={handleSearch} className='border rounded-r-2xl border-t-2 border-b-2 bg-green-600 p-2 text-[20px] hover:bg-transparent hover:transition'>Search</button>

          </div>
          

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
              onClick={() => navigate('/jobs')}
            >
              Posted Jobs
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
              onClick={() => navigate('/resume-builder')}
            >
              AI Resume
            </button>

            {user?.role !== 'employer' ? (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
                  onClick={() => navigate('/dashboard/seeker')}
                >
                  Dashboard
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
                  onClick={() => navigate('/dashboard/seeker')}
                >
                  Applications
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
                  onClick={() => navigate('/dashboard/employer')}
                >
                  Dashboard
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
                  onClick={() => navigate('/dashboard/employer')}
                >
                  Jobs Posted by You
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
