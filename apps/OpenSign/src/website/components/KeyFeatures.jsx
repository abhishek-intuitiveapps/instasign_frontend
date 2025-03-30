import React, { useEffect, useRef, useState } from "react";

// Custom SVG icons to match Lucide icons exactly
const Icons = {
  Lock: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Search: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  FileText: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Database: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  CheckCircle: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Clock: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Users: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  ShieldCheck: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
  ),
  Save: ({ stroke = "currentColor" }) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  ),
  MousePointer: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
      <path d="M13 13l6 6"></path>
    </svg>
  ),
  FolderLock: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2.5"></path>
      <rect x="14" y="14" width="8" height="6" rx="1"></rect>
      <path d="M18 14v-1a2 2 0 1 0-4 0v1"></path>
    </svg>
  ),
  Filter: ({ stroke = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  )
};

const KeyFeatures = () => {
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
    <section id="features" className="py-16 md:py-24 bg-base-100">
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`text-center mb-12 ${isVisible ? 'fade-in' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">Key Features</h2>
          <p className="text-black max-w-2xl mx-auto">
            Powerful tools to streamline your document signing process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Seamless Digital Signing */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-neutral/20 transition-transform duration-300 ease-in-out ${isVisible ? 'hover:scale-105 hover:shadow-lg fade-in' : ''}`}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Icons.Lock className="h-6 w-6 text-[#002864]" stroke="#002864" />
            </div>
            <h3 className="text-xl font-semibold op-text-primary mb-3">Seamless Digital Signing</h3>
            <ul className="space-y-3 text-black">
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">No signup required for recipients</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.Clock className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Real-time status tracking and notifications</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.Users className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Send to multiple signers simultaneously</span>
                </div>
              </li>
            </ul>
          </div>

          {/* KYC Verification */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-neutral/20 transition-transform duration-300 ease-in-out ${isVisible ? 'hover:scale-105 hover:shadow-lg fade-in' : ''}`}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Icons.Search className="h-6 w-6 text-[#002864]" stroke="#002864" />
            </div>
            <h3 className="text-xl font-semibold op-text-primary mb-3">KYC Verified</h3>
            <ul className="space-y-3 text-black">
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Automatic verification of signers</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.ShieldCheck className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Authenticity stamp for verified signers</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.Lock className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Enhanced security to prevent fraud</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Custom Templates */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-neutral/20 transition-transform duration-300 ease-in-out ${isVisible ? 'hover:scale-105 hover:shadow-lg fade-in' : ''}`}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Icons.FileText className="h-6 w-6 text-[#002864]" stroke="#002864" />
            </div>
            <h3 className="text-xl font-semibold op-text-primary mb-3">Custom Templates</h3>
            <ul className="space-y-3 text-black">
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.Save className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Create reusable templates with pre-defined fields</span>
                </div>
              </li>
                <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.MousePointer className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Drag-and-drop signature, date, and text fields</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Centralized Repository */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-neutral/20 transition-transform duration-300 ease-in-out ${isVisible ? 'hover:scale-105 hover:shadow-lg fade-in' : ''}`}>
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Icons.Database className="h-6 w-6 text-[#002864]" stroke="#002864"/>
            </div>
            <h3 className="text-xl font-semibold op-text-primary mb-3">Document Repository</h3>
            <ul className="space-y-3 text-black">
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                  <Icons.FolderLock className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="ml-3">Secure storage for all signed documents</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                <Icons.Lock className="h-5 w-5 text-success flex-shrink-0" />
                <span className="ml-3">Restricted access for authorized users only</span>
                </div>
                
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center">
                <Icons.Filter className="h-5 w-5 text-success flex-shrink-0" />
                <span className="ml-3">Search & filter to find documents quickly</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
