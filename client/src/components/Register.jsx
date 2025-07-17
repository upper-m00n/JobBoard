import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Link } from "react-router-dom"; 

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/auth/register', form);
      alert('Registered successfully');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-1">JobBoard</h1>
        <p className="text-sm text-center text-gray-500 mb-6">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        {/* replaced <a> tag with <Link> for register to login routing*/}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
           <Link to='/login' className="text-blue-600 font-medium hover:underline">Login here</Link>
          </p>
      </div>
    </div>
  );
}
