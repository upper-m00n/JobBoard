import {FaGithub,FaLinkedin,FaEnvelope} from 'react-icons/fa'

import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-200 py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                <div>
                    <h2 className="text-xl font-bold text-white mb-2">JobBoard</h2>
                    <p className="text-sm text-gray-400">Empowering job seekers and employers with a seamless hiring platform.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                    <ul className="text-sm space-y-2">
                        <li>Email : ashu.toast@gmail.com</li>
                        <li>Phone: +91 8800942618</li>
                        <li>Location: Noida, Uttar Pradesh, India</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
                    <div className="flex space-x-4 text-lg">
                        <a href="https://github.com/upper-m00n" target="_blank" rel="noreferrer" className="hover:text-white"><FaGithub/></a>
                        <a href="https://www.linkedin.com/in/ashutosh-sharma-063727144/" target="_blank" rel="noreferrer" className="hover:text-white"><FaLinkedin/></a>
                        <a href="mailto:ashu.toast@gmail.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaEnvelope/></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} JobBoard. All rights reserved.
            </div>

        </footer>
    )
}

export default Footer
