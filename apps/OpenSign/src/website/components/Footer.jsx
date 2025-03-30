import React, { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="op-bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <a href="/" className="text-2xl font-bold">
                <span className="text-white">Insta</span>
                <span className="text-white">sign</span>
              </a>
            </div>
            <p className="text-white/80 mb-6">
              Digitally sign documents with ease and security. The complete solution for all your e-signature needs.
            </p>
            <div className="flex space-x-4">
              {/* Simple SVG icons replacing Lucide icons */}
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
                </svg>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:contact@instasign.com" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Rest of the columns remain the same */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/policy" style={{textDecoration: "none"}} className="text-white/80 cursor-pointer hover:text-white no-underline transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/refund" style={{textDecoration: "none"}} className="text-white/80 cursor-pointer hover:text-white no-underline transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link to="/service" style={{textDecoration: "none"}} className="text-white/80 cursor-pointer hover:text-white no-underline transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Service Delivery
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{textDecoration: "none"}} className="text-white/80 cursor-pointer hover:text-white no-underline transition-colors" onClick={() => window.scrollTo(0, 0)}>
                  Terms & conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" style={{textDecoration: "none"}} className="text-white/80 hover:text-white no-underline cursor-pointer transition-colors">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="/contact" style={{textDecoration: "none"}} className="text-white/80 hover:text-white no-underline cursor-pointer transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="https://www.intuitiveapps.com/" 
                  style={{textDecoration: "none"}}
                  className="text-white/80 hover:text-white no-underline cursor-pointer transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Intuitive Apps
                </a>
              </li>
              <li>
                <a 
                  href="https://www.intuitiveapps.com/careers" 
                  style={{textDecoration: "none"}}
                  className="text-white/80 hover:text-white no-underline cursor-pointer transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white">Subscribe</h3>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter to get updates on new features and releases.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-l-lg px-4 py-2 w-full focus:outline-none text-gray-800"
              />
              <button className="bg-[#2563EB] text-white hover:op-bg-[#2563EB]/90 rounded-r-lg rounded-l-none px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-6 text-center">
          <p className="text-white/80">
            © 2025 Instasign. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

