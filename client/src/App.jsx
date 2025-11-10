import { Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./pages/Home"
import SeekerDashboard from "./pages/dashboard/SeekerDashboard"
import Footer from "./components/Footer"
import ResumeBuilder from "./pages/resume/ResumeBuilder"
import About from "./components/About"
import Contact from "./components/Contact"
import InterviewCoach from "./pages/interviewCoach/InterviewCoach"
import InterviewReport from "./pages/interviewCoach/InterviewReport"
import ATScheck from "./pages/resume/ATSCheck"
import JobSearch from "./pages/jobs/JobSearch"
import JobDetail from "./pages/jobs/JobDetails"

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="mx-auto">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="/job-search" element={<JobSearch/>}/>
          <Route path="/job/:id" element={<JobDetail/>}/>
          <Route path='/dashboard/seeker' element={<SeekerDashboard/>}/>
          <Route path='/resume-builder' element={<ResumeBuilder/>}/>
          <Route path='/ats-check' element={<ATScheck/>}/>
          <Route path='/interview' element={<InterviewCoach/>}/>
          <Route path='/interview/report/:sessionId' element={<InterviewReport/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>

  )
}

export default App
