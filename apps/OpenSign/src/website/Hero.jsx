import React, { useEffect, useRef, useState } from "react";
import digitalSignature from "./assets/digital_signature.svg";

const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .floating-animation {
    animation: float 5s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-white via-white to-neutral/5">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${isVisible ? 'fade-in' : ''}`}>
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002864] leading-tight">
              Digitally Sign Documents with Ease and Security
            </h1>
            <p className="text-lg text-secondary md:pr-12">
              Empower your business with a streamlined digital signing platform that ensures secure, verifiable, and effortless document management.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="h-12 bg-[#2563EB] text-white hover:bg-[#2563EB]/90 rounded-md text-base px-6">
                Get Started
              </button>
              <button className="h-12 border-[1px] border-solid border-[#002864] text-[#002864] hover:bg-[#002864] hover:text-white rounded-md text-base px-6">
                E-Sign
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 text-success">✔️</span>
                <span className="text-base-300">Secure Signing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 text-success">🛡️</span>
                <span className="text-base-300">KYC Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 text-success">✍️</span>
                <span className="text-base-300">Easy Management</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-base-100 p-6 rounded-xl shadow-lg max-w-md mx-auto floating-animation">
              <div className="aspect-w-16 aspect-h-9 bg-neutral/20 rounded-lg mb-4">
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={digitalSignature} 
                    alt="Digital Signing" 
                    className="rounded-lg object-cover h-full w-full scale-110"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-neutral rounded-full w-3/4"></div>
                <div className="h-3 bg-neutral rounded-full w-5/6"></div>
                <div className="h-3 bg-neutral rounded-full w-2/3"></div>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="h-8 bg-[#2563EB] rounded-md w-1/3"></div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-primary text-primary-content p-3 rounded-full shadow-lg hidden md:block">
              <span className="h-8 w-8">✍️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
