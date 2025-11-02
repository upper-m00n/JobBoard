import { Link } from "react-router-dom"
import { FileText, ArrowRight } from "lucide-react"

function ResumeBuilderCTA() {
  return (
    <section className="relative py-20 px-6 my-16 max-w-6xl mx-auto pt-0 pb-0">
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-100 rounded-full opacity-40 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-10 md:p-16">
          <div className="md:w-2/3 text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">AI Resume Builder</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Build Your Perfect Resume in Minutes
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Create a professionally designed resume with our AI-powered builder. Stand out with optimized formatting,
              tailored content, and instant download capabilities.
            </p>

            <Link
              to="/resume-builder"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all group"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="md:w-1/3 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
                <FileText className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-cyan-400 rounded-lg opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResumeBuilderCTA
