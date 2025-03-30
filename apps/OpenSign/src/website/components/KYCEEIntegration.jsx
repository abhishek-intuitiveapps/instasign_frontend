import React, { useEffect, useRef, useState } from "react";

// Custom SVG Icons as components
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KYCEEIntegration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const ref = useRef(null);
  const quoteRef = useRef(null);

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

  useEffect(() => {
    const quoteObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setQuoteVisible(true);
          quoteObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (quoteRef.current) {
      quoteObserver.observe(quoteRef.current);
    }

    return () => {
      if (quoteRef.current) {
        quoteObserver.unobserve(quoteRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#002864] text-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isVisible ? 'fade-in' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our KYC Integration Works</h2>
          <p className="max-w-2xl mx-auto opacity-90">
            Enhance document security with our built-in KYC verification system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors ${isVisible ? 'fade-in' : ''}`}>
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
              <ShieldIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">KYC Verification Check</h3>
            <p className="opacity-90">
              When a recipient opens the document, Instasign automatically checks their KYC verification status.
            </p>
          </div>

          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors ${isVisible ? 'fade-in' : ''}`}>
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Verified Users</h3>
            <p className="opacity-90">
              If the user is verified, the document will display a KYC watermark, confirming their verified status.
            </p>
          </div>

          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors ${isVisible ? 'fade-in' : ''}`}>
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unverified Users</h3>
            <p className="opacity-90">
              If the user is not KYC verified, no watermark will be applied, making it clear that the signer is not verified.
            </p>
          </div>

          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors ${isVisible ? 'fade-in' : ''}`}>
            <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
              <LockIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Transparent</h3>
            <p className="opacity-90">
              This system ensures document authenticity with visible verification marks, providing peace of mind for all parties.
            </p>
          </div>
        </div>

        <div className={`mt-16 text-center ${quoteVisible ? 'fade-in' : ''}`} ref={quoteRef}>
          <p className="font-semibold">
            <em>"Enhanced security with every signature — only with Instasign's KYC integration"</em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default KYCEEIntegration;
