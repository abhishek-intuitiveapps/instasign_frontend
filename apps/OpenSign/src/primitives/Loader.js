// import React from "react";

// const Loader = () => {
//   return (
//     <div className="op-loading op-loading-infinity w-[4rem] text-neutral"></div>
//   );
// };

// export default Loader;

// import React from 'react';

// const Loader = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div 
//         className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-2 animate-spin"
//         style={{ borderTopColor: '#002684' }}
//       ></div>
//     </div>
//   );
// };

// export default Loader;


import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % 4);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-36">
      <div className="relative w-36 h-24">
        {/* Document */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-white rounded-sm shadow-md"
             style={{ border: '1px solid #e5e7eb' }}>
          {/* Document lines */}
          <div className="mt-8 px-4 space-y-3">
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Signature line */}
          <div className="absolute bottom-8 left-4 right-4 h-px bg-gray-400"></div>
          
          {/* Animated signature */}
          {phase >= 2 && (
            <svg className="absolute bottom-8 left-4 h-2.5 w-14" viewBox="0 0 80 16">
              <path
                d="M5,8 C10,2 15,14 20,8 C25,2 30,14 35,8 C40,2 45,14 50,8 C55,2 60,14 65,8 C70,2 75,14 80,8"
                fill="none"
                stroke="#002684"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        
        {/* Pen */}
        <div 
          className={`absolute transition-all duration-500 ease-in-out ${phase >= 2 ? 'opacity-0' : 'opacity-0.5'}`}
          style={{
            width: '8px',
            height: '40px',
            backgroundColor: '#002684',
            borderRadius: '1px',
            transform: `translate(${phase >= 1 ? '60px, 50px' : '10px, 5px'}) rotate(${phase >= 1 ? '45deg' : '30deg'})`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-800 rounded-b-sm"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-500" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
        </div>
      </div>
      
      <div className="mt-4 text-sm font-medium" style={{ color: '#002684' }}>
        {['Loading'][phase]}
      </div>
    </div>
  );
};

export default Loader;