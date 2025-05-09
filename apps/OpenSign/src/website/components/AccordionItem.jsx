import React, { useEffect, useRef, useState } from "react";
import Title from "../../components/Title";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

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

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={itemRef}
      className={`border-b border-neutral/20 transition-all duration-1000 ease-in-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } ${isOpen ? 'fade-in' : ''}`}
    >
      <button
        className="w-full px-6 py-4 hover:bg-blue-50 op-text-primary font-medium text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-md"
        onClick={onClick}
      >
        {title}
        <span className={`transform transition-transform duration-700 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-700 ease-in-out`}
        style={{ maxHeight: isOpen ? contentRef.current?.scrollHeight + 'px' : '0' }}
      >
        <div ref={contentRef} className="px-6 pb-6 pt-2 text-secondary leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
