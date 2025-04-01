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
              {/* <a href="/" className="text-white/80 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a> */}
              <a href="https://x.com/Instasign17966" className="text-white/80 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* <a href="#" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a> */}
              <a href="https://www.instagram.com/instasign__/" className="text-white/80 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* <a href="mailto:contact@instasign.com" className="text-white/80 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a> */}
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

