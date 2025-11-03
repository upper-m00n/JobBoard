import React,{useEffect,useState} from "react";
import { useParams,Link } from "react-router-dom";
import axios from '../../api/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import { Spinner } from "@/components/ui/spinner"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const formatChartData = (answers)=>{
    return answers
        .filter(a=>a.answerText)
        .map((a,index)=>({
            name:`Q${index + 1}`,
            tone:a.toneScore,
            fillerWords:a.fillerWordCount,
            fullData:a
        }))
}

const chartConfig = {
    tone:{
        label:"Tone (sentiment)",
        color:"hsl(var(--primary))",
    },
    fillerWords:{
        label:"Filler Words",
        color:"hsl(var(--chart-2))"
    }
}

function InterviewReport(){
    const {sessionId}= useParams();
    const [session,setSession]= useState(null);
    const [report, setReport]=useState(null);
    const [isLoading, setIsLoading]=useState(true);
    const [error,setError]= useState(null);

    useEffect(()=>{
        const fetchReport = async()=>{
            try {
                setIsLoading(true);
                const sessionRes = await axios.get(`/interview/session/${sessionId}`);
                setSession(sessionRes.data);

                const reportRes= await axios.post(`/interview/report/${sessionId}`);
                setReport(reportRes.data);

                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load report. Please try again.');
            }finally{
                setIsLoading(false);
            }
        }
        fetchReport();
    },[sessionId]);

    if(isLoading){
        return (<div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
            <Item variant="muted">
                <ItemMedia>
                <Spinner />
                </ItemMedia>
                <ItemContent>
                <ItemTitle className="line-clamp-1">Loading Your Report...</ItemTitle>
                </ItemContent>
            </Item>
        </div>
    )
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }
    if (!session || !report) {
        return <div className="text-center p-10">No data found.</div>;
    }

    const chartData = formatChartData(session.answers);

    console.log(chartData)

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 my-10 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">Your Interview Report</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Overall Summary</h2>
        <p className="text-gray-700 mb-4">{report.summary}</p>
        
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Actionable Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {report.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Tone Analysis (Sentiment)</h3>
          <p className="text-center text-sm text-gray-500 mb-4">(Higher is more positive)</p>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="tone" 
                  fill="var(--color-tone)"
                  radius={4} 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Confidence Analysis (Filler Words)</h3>
          <p className="text-center text-sm text-gray-500 mb-4">(Lower is more confident)</p>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="fillerWords" 
                  fill="var(--color-fillerWords)" 
                  radius={4} 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Full Q&A Breakdown</h2>
        <div className="space-y-6">
          {session.answers.filter(a => a.answerText).map((a, index) => (
            <div key={index} className="border-b pb-4">
              <h4 className="text-lg font-semibold text-gray-800">Q{index + 1}: {a.questionText}</h4>
              <p className="text-gray-600 my-2 italic"><strong>Your Answer:</strong> "{a.answerText}"</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <strong className="text-blue-700">Content Analysis:</strong>
                <p className="text-gray-700">{a.contentAnalysis}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Link to="/interview" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg mt-8 font-semibold hover:bg-blue-700">
        Start a New Interview
      </Link>
    </div>
    )
}

export default InterviewReport;