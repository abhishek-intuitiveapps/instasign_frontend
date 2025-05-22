import React, { use, useEffect, useRef, useState } from "react";
import digitalSignature from "../assets/digital_signature.svg";
import {useNavigate} from "react-router";

const Hero1 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // SVG icons as components
  const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const FileSignatureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5"/>
      <path d="M8 18h1"/>
      <path d="M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z"/>
    </svg>
  );

  return (
    <section className="min-h-screen pt-20 sm:pt-24 md:pt-16 flex items-center" style={{
      background: 'linear-gradient(to bottom, #ffffff 80%, rgba(193, 204, 219, 0.01))'
    }}>
      <div className="container mx-auto px-4 py-8 md:py-12" ref={ref}>
        <div 
          className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} 
          style={{
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002864] leading-tight">
              Digitally Sign Documents with Ease and Security
            </h1>
            <p className="text-lg text-[#29354a] md:pr-12">
              Empower your business with a streamlined digital signing platform that ensures secure, verifiable, and effortless document management.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-opacity-90 text-base"
              onClick={() => window.open("https://calendly.com/cs-instasign", "_blank")}
              >
                Request a Demo
              </button>
              <button onClick={() => navigate('/sign-pdf')} className="px-6 py-2 border-2 border-[#002864] text-[#002864] rounded-lg hover:bg-[#002864] hover:text-white text-base">
              Sign Instantly - Free
 
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-[#00a96e]"><CheckCircleIcon /></span>
                <span className="text-[#000]">Secure Signing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00a96e]"><ShieldIcon /></span>
                <span className="text-[#000]">KYC Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00a96e]"><FileSignatureIcon /></span>
                <span className="text-[#000]">Easy Management</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto h-[500px]" style={{
              animation: 'float 3s ease-in-out infinite'
            }}>
              <div className="relative bg-[#c1ccdb]/20 rounded-lg mb-4 h-[300px]">
                <img 
                  src={digitalSignature} 
                  alt="Digital Signing" 
                  className="rounded-lg object-cover h-full w-full scale-110"
                />
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-[#c1ccdb] rounded-full w-3/4"></div>
                <div className="h-3 bg-[#c1ccdb] rounded-full w-5/6"></div>
                <div className="h-3 bg-[#c1ccdb] rounded-full w-2/3"></div>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="h-8 bg-[#2563EB] rounded-md w-1/3"></div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#002864] text-[#cacccf] p-3 rounded-full shadow-lg hidden md:block">
              <FileSignatureIcon />
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </section>
  );
};

export default Hero1;