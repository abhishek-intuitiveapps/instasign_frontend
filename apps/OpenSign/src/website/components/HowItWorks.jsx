import React,{ useEffect, useRef, useState } from "react";

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FileTextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const MousePointerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
    <path d="M13 13l6 6"></path>
  </svg>
);

const CheckSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const HowItWorks = () => {
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

  const Card = ({ icon, title, items }) => (
    <div className="card">
      <div className="card-header">
        <div className="icon-wrapper">
          {icon}
        </div>
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        <ul className="item-list">
          {items.map((item, index) => (
            <li key={index}>
              <span className="bullet">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "admins":
        return (
          <div className={`tab-grid ${isVisible ? 'fade-in' : ''}`}>
            <Card
              icon={<UsersIcon />}
              title="Company Registration & User Management"
              items={[
                "Register your company on Instasign",
                "Add multiple users under your organization",
                "Assign roles and manage permissions"
              ]}
            />
            <Card
              icon={<FileTextIcon />}
              title="Template Creation"
              items={[
                "Create reusable templates for frequently used documents",
                "Define signing fields to standardize the signing process"
              ]}
            />
            <Card
              icon={<DatabaseIcon />}
              title="Centralized Document Storage"
              items={[
                "All signed documents are stored in a secure repository",
                "Only the admin and document creator can view and manage them"
              ]}
            />
          </div>
        );
      case "recipients":
        return (
          <div className={`tab-grid ${isVisible ? 'fade-in' : ''}`}>
            <Card
              icon={<MailIcon />}
              title="No Signup or Login Needed"
              items={[
                "Recipients receive the document link via email",
                "No need to create an account—just open the link and sign"
              ]}
            />
            <Card
              icon={<MousePointerIcon />}
              title="Instant Digital Signing"
              items={[
                "Sign using touch, mouse, or pre-saved signatures",
                "Review the document before signing"
              ]}
            />
            <Card
              icon={<CheckSquareIcon />}
              title="KYC Verification"
              items={[
                "If the signer is KYC verified, the document will display a KYC watermark",
                "If not, no watermark will be added"
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className="how-it-works" ref={ref}>
      <div className="container">
        <div className={`header ${isVisible ? 'fade-in' : ''}`}>
          <h2>How It Works</h2>
          <p>
            Discover how Instasign streamlines document signing for admins, senders, and signers.
          </p>
        </div>

        <div className="tabs">
          <div className="tabs-list">
            <button
              className={`tab-button ${activeTab === "admins" ? "active" : ""}`}
              onClick={() => setActiveTab("admins")}
            >
              For Admins
            </button>
            <button
              className={`tab-button ${activeTab === "recipients" ? "active" : ""}`}
              onClick={() => setActiveTab("recipients")}
            >
              For Recipients
            </button>
          </div>
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .how-it-works {
          padding: 4rem 1rem;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h2 {
          font-size: 2.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #002864;
        }

        .header p {
          color: #29354a;
          max-width: 36rem;
          margin: 0 auto;
        }

        .tabs {
          max-width: 64rem;
          margin: 0 auto;
        }

        .tabs-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: #f5f5f5;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .tab-button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 0.5rem;
          color: #29354a;
          transition: all 0.2s ease;
        }

        .tab-button:focus {
          outline: 2px solid #002864;
          outline-offset: 2px;
        }

        .tab-button.active {
          background: white;
          color: #002864;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .card {
          border: 2px solid rgba(0, 40, 100, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          background: white;
          height: 100%;
        }

        .card:hover {
          transform: scale(1.05);
          border-color: rgba(0, 40, 100, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          margin-bottom: 1rem;
        }

        .icon-wrapper {
          background: rgba(0, 40, 100, 0.1);
          padding: 0.75rem;
          border-radius: 50%;
          width: fit-content;
          margin-bottom: 1rem;
          color: #002864;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #002864;
          margin-bottom: 1rem;
        }

        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
          color: #29354a;
        }

        .item-list li {
          display: flex;
          align-items: start;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .bullet {
          color: #002864;
          font-weight: bold;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @media (max-width: 1024px) {
          .tab-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header h2 {
            font-size: 1.875rem;
          }
          
          .tab-grid {
            grid-template-columns: 1fr;
          }

          .card:hover {
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
