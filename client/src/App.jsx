import { Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'
import Login from "./components/Login"
import Register from "./components/Register"
import JobList from "./pages/jobs/JobList"
import PostJob from "./pages/jobs/PostJobs"
import EmployerDashboard from "./pages/dashboard/EmployerDashBoard"
import Home from "./pages/Home"
import JobApplyPage from "./pages/jobs/JobApplyPage"
import SeekerDashboard from "./pages/dashboard/SeekerDashboard"
import UpdateApplicationPage from "./pages/jobs/UpdateApplicationPage"
import JobApplications from "./pages/jobs/JobApplications"
import Footer from "./components/Footer"
import ResumeBuilder from "./pages/resume/ResumeBuilder"
import About from "./components/About"
import Contact from "./components/Contact"

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="p-4 max-w-4xl mx-auto">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/jobs' element={<JobList/>}/> 
          <Route path='/jobs/new' element={<PostJob/>}/>
          <Route path='/dashboard/employer' element={<EmployerDashboard/>}/>
          <Route path='/jobs/:jobId/apply' element={<JobApplyPage/>}/>
          <Route path='/dashboard/seeker' element={<SeekerDashboard/>}/>
          <Route path='/dashboard/seeker/applications/update/:applicationId' element={<UpdateApplicationPage/>}/>
          <Route path='/dashboard/employer/jobApplications/:jobId' element={<JobApplications/>}/>
          <Route path='/resume-builder' element={<ResumeBuilder/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  
  )
}

export default App
