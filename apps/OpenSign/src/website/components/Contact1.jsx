import React, { useState, useEffect, useRef } from "react";

// SVG Icons components
const MailIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const ref = useRef(null);
  const messageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      company: "",
      message: "",
    });
  };

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
    const messageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMessageVisible(true);
          messageObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (messageRef.current) {
      messageObserver.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        messageObserver.unobserve(messageRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="contact" 
      className={`py-16 md:py-24 bg-white ${isVisible ? 'animate-fadeIn' : ''}`} 
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002864] mb-4">Contact Us</h2>
          <p className="text-[#29354a] max-w-2xl mx-auto">
            Have questions or ready to get started? Reach out to our team for support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            {/* India Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c1ccdb]/20">
              <div className="info-content">
                <h3 className="text-lg font-semibold text-[#002864] mb-4">India</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MapPinIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">B-85 Dashrath Puri,</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <PhoneIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">+91 9311648357</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MailIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">hr.india@intuitiveapps.com</p>
                </div>
              </div>
            </div>

            {/* USA Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c1ccdb]/20">
              <div className="info-content">
                <h3 className="text-lg font-semibold text-[#002864] mb-4">USA</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MapPinIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">2802 E. Lincoln St, Suite # 1D</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <PhoneIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">+1 408-341-9417</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MailIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">hr@intuitiveapps.com</p>
                </div>
              </div>
            </div>

            {/* Canada Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c1ccdb]/20">
              <div className="info-content">
                <h3 className="text-lg font-semibold text-[#002864] mb-4">Canada</h3>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MapPinIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">206 Coventry Crt NE</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <PhoneIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">+1 408-341-9417</p>
                </div>
                <div className="flex items-center mt-3">
                  <span className="bg-[#002864]/10 p-2 rounded-full mr-3">
                    <MailIcon className="text-[#002864]" />
                  </span>
                  <p className="text-[#29354a]">hr@intuitiveapps.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-[#c1ccdb]/20" ref={messageRef}>
            <h3 className={`text-2xl font-semibold text-[#002864] mb-6 ${messageVisible ? 'animate-fadeIn' : ''}`}>
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#29354a]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#c1ccdb]/30 focus:border-[#002864] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#29354a]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#c1ccdb]/30 focus:border-[#002864] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-[#29354a]">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#c1ccdb]/30 focus:border-[#002864] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[#29354a]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#c1ccdb]/30 focus:border-[#002864] focus:outline-none transition-colors min-h-[120px] resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-[#002864] text-[#cacccf] rounded-[1.9rem] font-medium hover:bg-[#002864]/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
