import {useState,useRef} from 'react';
import axios from '../../api/axios';

const InterviewCoach = () =>{
    const [isLoading,setIsLoading]=useState(false);
    const [messages,setMessages]=useState([]);
    const [sessionId,setSessionId]=useState(null);

    const [isInterviewStarted,setIsInterviewStarted]=useState(false);
    const [isRecording,setIsRecording]=useState(false);
    const [jobDescription,setJobDescription]=useState("SDE-I");

    const mediaRecorder= useRef(null);
    const audioChunks= useRef([]);
    const startInterview = async()=>{
        setIsLoading(true);
        setMessages([]);

        try {
            const response = await axios.post('/interview/start', {jobDescription:jobDescription});
            const data= response.data;

            setSessionId(data.sessionId);
            addMessage('ai',data.firstQuestion);
            setIsInterviewStarted(true);
            speakText(data.firstQuestion);

            
        } catch (error) {
            console.error("Error starting interview:", error);
            addMessage('ai', 'Error: Could not start the interview. Please try again.');
        }
        setIsLoading(false);
    }

    const toggleRecording=()=>{
        if(isRecording){
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
        else{
            startRecording();
        }
    }

    const startRecording= async()=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio:true});
            mediaRecorder.current= new MediaRecorder(stream);
            audioChunks.current=[];

            mediaRecorder.current.ondataavailable = (event)=>{
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = sendAudioToServer;

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            addMessage('ai', 'Error: Could not access microphone.');
        }
    };

    const sendAudioToServer = async () => {
    setIsLoading(true);
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('sessionId', sessionId);

    try {
      const response = await axios.post('/interview/answer', 
        formData,
        {
          headers:{'Content-Type':'multipart/form-data'}
        }
      );

      const data = response.data;
      
    
      addMessage('user', data.userTranscript);
      const aiFullResponse = `${data.feedback} ... ${data.nextQuestion}`;
      addMessage('ai', aiFullResponse);
      
      speakText(aiFullResponse); 

    } catch (error) {
      console.error("Error sending audio:", error);
      addMessage('ai', 'Error: Could not process your answer. Please try again.');
    }
    setIsLoading(false);
  };

    const addMessage = (type,text)=>{
        setMessages(prev => [...prev,{type,text}])
    }

    const speakText=(text)=>{
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    const baseButtonClass = "w-full font-semibold py-3 px-5 rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const recordButtonClass = isRecording
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700";

    return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200 my-10">
      
      <h1 className='font-bold text-3xl text-center text-slate-800 pb-6'>
        AI Interview Coach
      </h1>

      <div className='mb-6'>
        <label htmlFor="jd" className='block text-lg font-semibold text-gray-700 mb-2'>
          Enter Job Description
        </label>
        <textarea 
          id="jd"
          name="jd" 
          className='w-full p-3 rounded-lg bg-slate-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]' 
          placeholder='E.g., "Senior React Developer with 5 years experience..."'
          onChange={(e) => setJobDescription(e.target.value)} 
          value={jobDescription}
          disabled={isInterviewStarted} 
        />
      </div>

      <div className='border border-gray-300 rounded-lg p-4 h-[500px] overflow-y-auto mb-6 bg-gray-50 flex flex-col space-y-4'>
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Click "Start Interview" to begin.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
    
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span 
              className={`
                px-4 py-2 rounded-lg inline-block max-w-lg shadow-sm
                ${msg.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }
              `}
            >
              <strong>{msg.type === 'user' ? 'You:' : 'AI Coach:'}</strong> {msg.text}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-center p-2">
            <i className="text-gray-500">AI is thinking...</i>
          </div>
        )}
      </div>

      <div className="mt-4">
        {!isInterviewStarted ? (
          <button 
            onClick={startInterview} 
            disabled={isLoading} 
            className={`${baseButtonClass} bg-blue-600 hover:bg-blue-700`}
          >
            {isLoading ? 'Starting...' : 'Start Interview'}
          </button>
        ) : (
          <button 
            onClick={toggleRecording} 
            disabled={isLoading}
            className={`${baseButtonClass} ${recordButtonClass}`}
          >
            {isLoading ? 'Processing...' : (isRecording ? 'Stop Recording' : 'Record Answer')}
          </button>
        )}
      </div>
    </div>
    )
}

export default InterviewCoach;
