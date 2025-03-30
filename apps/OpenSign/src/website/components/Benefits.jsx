import React, { useEffect, useRef, useState } from "react";

const Benefits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("admins");
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

  // Icons as SVG components
  const icons = {
    CheckCircle: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    Clock: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    Shield: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    Database: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    Mail: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    CheckSquare: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    MousePointer: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>
      </svg>
    )
  };

  const BenefitCard = ({ icon: Icon, title, description }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-[rgba(0,0,0,0.2)] ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 hover:opacity-90 hover:shadow-xl`}>
      <div className="flex items-start">
        <div className="bg-[rgba(0,40,100,0.1)] p-2 rounded-full mr-4">
          <Icon className="h-6 w-6 text-[#002864]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#002864] mb-2">{title}</h3>
          <p className="text-[#29354a]">{description}</p>
        </div>
      </div>
    </div>
  );

  const adminBenefits = [
    {
      icon: icons.CheckCircle,
      title: "Efficient Document Management",
      description: "Organize, send, and track documents from a single platform, streamlining your entire workflow."
    },
    {
      icon: icons.Clock,
      title: "Faster Approvals",
      description: "Reduce the turnaround time by up to 60% with instant digital signatures and automated workflows."
    },
    {
      icon: icons.Shield,
      title: "KYC Validation",
      description: "Enhance trust and security with verified signers, reducing the risk of fraudulent signatures."
    },
    {
      icon: icons.Database,
      title: "Secure Storage",
      description: "Keep all signed documents safe and accessible only by authorized users in a protected repository."
    }
  ];

  const recipientBenefits = [
    {
      icon: icons.Mail,
      title: "Simple Signing",
      description: "Sign with ease from any device without needing to create an account or download software."
    },
    {
      icon: icons.CheckSquare,
      title: "KYC Verification",
      description: "Showcase authenticity with a verification watermark, enhancing the credibility of your signature."
    },
    {
      icon: icons.MousePointer,
      title: "Hassle-Free Process",
      description: "No signup or login required—simply click the link in your email and complete the signing process."
    }
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-gradient-to-b from-[#EBF5FF] to-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#002864] mb-4">What You Gain</h2>
          <p className="text-[#29354a] max-w-2xl mx-auto">
            Discover the advantages Instasign brings to everyone in your organization
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-2 mb-8 border rounded-lg overflow-hidden">
            {["admins", "recipients"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-base py-3 ${
                  activeTab === tab
                    ? "bg-[#002864] text-white"
                    : "bg-white text-[#002864] hover:bg-[rgba(0,40,100,0.1)]"
                } transition-colors duration-300`}
              >
                For {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeTab === "admins" && 
              adminBenefits.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} />
              ))
            }
            
            {activeTab === "recipients" && 
              recipientBenefits.map((benefit, index) => (
                <BenefitCard key={index} {...benefit} />
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
