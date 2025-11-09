import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-black to-slate-800 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              HireReady AI
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering job seekers and employers with AI-driven hiring solutions for seamless recruitment.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                ashu.toast@gmail.com
              </li>
              <li>
                <span className="text-blue-400">Phone:</span> +91 8800942618
              </li>
              <li>
                <span className="text-blue-400">Location:</span> Noida, India
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/upper-m00n"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:shadow-lg group"
              >
                <Github className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/ashutosh-sharma-063727144/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:shadow-lg group"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="mailto:ashu.toast@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:shadow-lg group"
              >
                <Mail className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-400 text-center md:text-left">© {currentYear} HireReady AI. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Made with <Heart className="w-4 h-4 text-red-500" /> by the HireReady Team
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
