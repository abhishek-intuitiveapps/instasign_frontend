import React, { useEffect, useRef, useState } from "react";

// Exact Lucide icon SVGs
const Target = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 op-text-primary"
  >
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const Eye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 op-text-primary"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const About = () => {
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
    <section id="about" className="py-16 md:py-24 bg-base-100" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 ${isVisible ? 'fade-in' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">About Instasign</h2>
            <p className="text-black max-w-2xl mx-auto">
              Leading the way in secure digital document signing solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className={`bg-base-100 p-8 rounded-xl shadow-sm border border-neutral/100 ${isVisible ? 'fade-in' : ''}`}>
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Target />
              </div>
              <h3 className="text-2xl font-semibold op-text-primary mb-4">Our Mission</h3>
              <p className="text-black">
                To simplify and secure the document signing process with digital verification and real-time tracking, making business operations more efficient and reliable for organizations of all sizes.
              </p>
            </div>
            
            <div className={`bg-base-100 p-8 rounded-xl shadow-sm border border-neutral/100 ${isVisible ? 'fade-in' : ''}`}>
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Eye />
              </div>
              <h3 className="text-2xl font-semibold op-text-primary mb-4">Our Vision</h3>
              <p className="text-black">
                To become the go-to platform for businesses seeking fast, reliable, and secure digital signature solutions, revolutionizing how organizations handle document workflows in the digital age.
              </p>
            </div>
          </div>
          
          <div className={`mt-12 bg-gradient-to-r from-primary to-secondary p-8 rounded-xl text-base-100 text-center ${isVisible ? 'fade-in' : ''}`}>
            <h3 className="text-2xl font-semibold mb-4">Why Choose Instasign?</h3>
            <p className="max-w-2xl mx-auto mb-6">
              Instasign combines ease of use with enterprise-grade security, providing a digital signing solution that doesn't compromise on either. With our unique KYC verification, we add an extra layer of trust to your important documents.
            </p>
            <p className="font-semibold">
              <em>"Join thousands of satisfied businesses using Instasign"</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
