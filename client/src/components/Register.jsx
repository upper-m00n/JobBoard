import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from '../api/axios'

export default function Register(){
    const [form, setForm] = useState({name:'', email:'', password:'', role:'seeker'})
    const navigate =useNavigate()

    const handleChange=(e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try {
            await axios.post('/auth/register', form)
            alert('Registered succesfully')
            navigate('/login')
        } catch (error) {
            alert(error.response?.data?.error || 'registration failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

                <input type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                 />

                 <input type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                 />

                 <input type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                 />

                 <select name="role"
                    onChange={handleChange}
                    className="w-full mb-6 p-3 border border-gray-300 rounded"
                 >
                    <option value="seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                 </select>

                 <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition">Register</button>

                 <p>Already have an account? {' '}
                    <a href="/login" className="text-blue-500 hover:underline">Login</a>
                 </p>
            </form>
        </div>
    )

}