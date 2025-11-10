import {
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-10">
          
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
            About <span className="text-blue-500">HireReady AI</span>
          </h1>
          
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Your all-in-one career co-pilot. We help you find jobs, build a perfect resume, pass the ATS, and ace the interview. Manage your entire job search from "Saved" to "Hired" in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div className="flex flex-col items-center p-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">1. Find Your Next Job</h3>
              <p className="text-gray-600 mt-2">
                Our job aggregator scrapes the web for you. Search for any role and save interesting opportunities directly to your personal dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <SparklesIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">2. Prepare with AI</h3>
              <p className="text-gray-600 mt-2">
                Use our AI toolkit for each saved job: check your resume with our ATS scanner, practice with the AI interview coach, and build a tailored resume.
              </p>
            </div>

            <div className="flex flex-col items-center p-4">
              <ClipboardDocumentListIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">3. Track Your Progress</h3>
              <p className="text-gray-600 mt-2">
                Stop using spreadsheets. Manage all your applications in our simple tracker. Update your status from "Applied" to "Interviewing" to "Offer."
              </p>
            </div>
          </div>

          <div className="text-center border-t pt-10">
            <RocketLaunchIcon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold text-blue-600">Our Mission</h3>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              To revolutionize job preparation by making it faster, smarter, and more personalized, helping you land the job you deserve.
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">By <span className="font-medium text-blue-600">Ashutosh Sharma</span></p>
          </div>

        </div>
      </div>
    </div>
  );
}