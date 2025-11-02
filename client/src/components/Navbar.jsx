"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu, X, LogOut, Home } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 bg-opacity-95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent hover:from-blue-300 hover:to-indigo-500 transition-all duration-300"
        >
          <Home className="w-6 h-6 text-blue-500" />
          HireReady AI
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-slate-300">Welcome, {user.name}</span>
              <Link
                to={user.role === "employer" ? "/dashboard/employer" : "/dashboard/seeker"}
                className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/contact"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/about"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-semibold text-center hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === "employer" ? "/dashboard/employer" : "/dashboard/seeker"}
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                About
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
