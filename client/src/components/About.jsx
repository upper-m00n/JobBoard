import { BriefcaseIcon, UserGroupIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-10">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">About <span className="text-blue-500">JobBoard</span></h1>
          <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Your one-stop platform for connecting top talent with top opportunities. We empower individuals and businesses with the tools they need to grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <RocketLaunchIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">Our Mission</h3>
              <p className="text-gray-600 mt-2">
                To revolutionize job discovery and hiring by making it faster, smarter, and more human.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">For Job Seekers</h3>
              <p className="text-gray-600 mt-2">
                Discover opportunities, manage applications, and get hired — all in one streamlined experience.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <BriefcaseIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-blue-600">For Employers</h3>
              <p className="text-gray-600 mt-2">
                Post listings, screen talent, and build your team with confidence and ease.
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
