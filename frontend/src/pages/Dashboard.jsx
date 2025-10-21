// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext"; // This is correct
import { useState } from "react";
import Layout from "../components/Layout";
import MultimodalCheckIn from "../components/MultimodalCheckIn"; // We will create this
import PHQ9Survey from "../components/PHQ9Survey"; // We will create this

export default function Dashboard() {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  
  // 1. Get the 'auth' object instead of 'user'
  const { auth } = useAuth(); 

  // Dummy data for now
  const moodData = {
    currentMood: "🙂 Happy",
    trend: "Improving", // This will come from your backend
  };

  return (
    <Layout>
      {/* Page Header */}
      
      {/* 2. Check for auth.user instead of just user */}
      {auth && auth.user && ( 
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          {/* 3. Use auth.user.name */}
          Welcome back, {auth.user.name} 
        </h2>
      )}      

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Main Action Column --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Start a New Session</h3>
            <p className="text-slate-600 mb-6">
              Check in with your audio, video, and text to get a complete
              understanding of your emotional state.
            </p>
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-sky-600 transition-colors"
            >
              Start Multimodal Check-In
            </button>
          </div>
        </div>

        {/* --- Sidebar Column --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Mood Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Mood Overview</h3>
            <div className="mb-3">
              <h4 className="font-medium text-slate-500 mb-1">Current Mood</h4>
              <p className="text-2xl font-semibold text-slate-800">
                {moodData.currentMood}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-500 mb-1">Mood Trend</h4>
              <p className="text-gray-500">[Chart goes here]</p>
            </div>
          </div>

          {/* PHQ-9 Survey Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Wellness Survey</h3>
            <p className="text-slate-600 mb-4">
              Take your weekly PHQ-9 depression screening survey.
            </p>
            <button
              onClick={() => setIsSurveyOpen(true)}
              className="w-full bg-slate-200 text-slate-700 px-5 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Take Survey
            </button>
          </div>

        </div>
      </div>

      {/* --- Modals --- */}
      {isCheckInOpen && (
        <MultimodalCheckIn onClose={() => setIsCheckInOpen(false)} />
      )}

      {isSurveyOpen && (
        <PHQ9Survey onClose={() => setIsSurveyOpen(false)} />
      )}
    </Layout>
  );
}