import React, { useEffect, useState } from 'react';
import axios from '../../api/axios'; 
import { Link } from 'react-router-dom';
import { ClockIcon, BriefcaseIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function SeekerDashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/dashboard/reports');
        console.log("reports",response.data)
        setReports(response.data);

      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError("Could not load your reports. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Loading Your Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-10">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">My Interview Dashboard</h1>

      {reports.length === 0 ? (

        <div className="text-center bg-white p-10 rounded-lg shadow-md border">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Reports Found</h2>
          <p className="text-gray-500 mb-6">
            You haven't completed any interviews yet.
          </p>
          <Link
            to="/interview"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Your First Interview
          </Link>
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Link
              to={`/interview/report/${report._id}`}
              key={report._id}
              className="block bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span>{report.jobDescription}</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                Interview Report
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {report.finalReportSummary 
                  ? `${report.finalReportSummary.substring(0, 100)}...`
                  : "Report is still being generated."}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1.5" />
                  <span>Completed: {formatDate(report.createdAt)}</span>
                </div>
                <span className="text-blue-600 font-semibold">
                  View Report &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeekerDashboard;