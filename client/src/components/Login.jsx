import { useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from '../api/axios'
import {useAuth} from '../context/AuthContext'

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login} = useAuth()
    const navigate= useNavigate();

    const handlesubmit = async(e)=>{
        e.preventDefault();
        try {
            const res= await axios.post('/auth/login', {email, password})
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (error) {
            alert(error.response?.data?.error || 'Login Failed')
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={handlesubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font bold mb-6 text-center text-gray-800">Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-6 p-3 border border-gray-300 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Login
                </button>

                <p className="mt-4 text-center text-sm">Dont have an account ?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </form>
        </div>
    )

}