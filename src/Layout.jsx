import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        :root {
          --pink: #FF6B9D;
          --purple: #9B5DE5;
          --cyan: #00F5D4;
          --lime: #B8F83A;
          --yellow: #FEE440;
          --coral: #FF9F68;
          --lavender: #E8D5FF;
          --soft-pink: #FFD6E8;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        /* PWA safe areas */
        @supports (padding-top: env(safe-area-inset-top)) {
          .safe-area-top {
            padding-top: env(safe-area-inset-top);
          }
          .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #E8D5FF;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF6B9D, #9B5DE5);
          border-radius: 4px;
        }
        
        /* Selection colors */
        ::selection {
          background: #9B5DE5;
          color: white;
        }
        
        /* Input focus states */
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #9B5DE5 !important;
        }
      `}</style>
      
      <main className="safe-area-top safe-area-bottom">
        {children}
      </main>
    </div>
  );
}