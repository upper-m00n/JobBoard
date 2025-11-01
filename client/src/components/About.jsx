import { BriefcaseIcon, UserGroupIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-10">
          
          {/* --- CHANGED --- */}
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
            About <span className="text-blue-500">HireReady AI</span>
          </h1>
          
          {/* --- CHANGED --- */}
          <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Your intelligent career platform. We use AI to build your resume, coach your interviews, and match you with the perfect job—making you hire-ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <RocketLaunchIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">Our Mission</h3>
              <p className="text-gray-600 mt-2">
                To revolutionize job preparation and hiring by making it faster, smarter, and more personalized.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">For Job Seekers</h3>
              <p className="text-gray-600 mt-2">
                Build an AI-powered resume, practice interviews with an AI coach, and discover your next opportunity.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <BriefcaseIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">For Employers</h3>
              <p className="text-gray-600 mt-2">
                Post listings, screen talent, and find qualified candidates who are truly ready for the job.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">By <span className="font-medium text-blue-600">Ashutosh Sharma</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}