import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          /* Y2K Glowing effects */
          @keyframes glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(255, 105, 180, 0.5),
                          0 0 40px rgba(138, 43, 226, 0.3),
                          0 0 60px rgba(0, 191, 255, 0.2);
            }
            50% { 
              box-shadow: 0 0 30px rgba(255, 105, 180, 0.7),
                          0 0 60px rgba(138, 43, 226, 0.5),
                          0 0 90px rgba(0, 191, 255, 0.3);
            }
          }
          
          .glow-effect {
            animation: glow 3s ease-in-out infinite;
          }
          
          /* Lisa Frank rainbow gradient background */
          .lisa-frank-bg {
            background: linear-gradient(
              135deg,
              #ff9ff3 0%,
              #feca57 10%,
              #ff6b6b 20%,
              #ff9ff3 30%,
              #a29bfe 40%,
              #74b9ff 50%,
              #81ecec 60%,
              #55efc4 70%,
              #ffeaa7 80%,
              #ff9ff3 90%,
              #ff6b6b 100%
            );
            background-size: 400% 400%;
            animation: gradient-flow 15s ease infinite;
          }
          
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Neobrutalist shadows */
          .neo-shadow {
            box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
          }
          
          .neo-shadow-lg {
            box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 12px;
          }
          
          ::-webkit-scrollbar-track {
            background: #fce7f3;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #f472b6, #a78bfa, #67e8f9);
            border-radius: 10px;
            border: 2px solid black;
          }
          
          /* Selection color */
          ::selection {
            background: #a78bfa;
            color: white;
          }
          
          /* PWA specific styles */
          @media (display-mode: standalone) {
            body {
              padding-top: env(safe-area-inset-top);
              padding-bottom: env(safe-area-inset-bottom);
            }
          }
        `}
      </style>
      {children}
    </div>
  );
}