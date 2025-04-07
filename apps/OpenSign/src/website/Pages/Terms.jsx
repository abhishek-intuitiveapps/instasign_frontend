import React,{ useEffect, useRef, useState } from "react";
import Title from "../../components/Title"; 
import AccordionItem from "../components/AccordionItem";

const Terms = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItem, setOpenItem] = useState(null); // Track which accordion item is open
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

  const policyData = [
    {
      id: 'item-1',
      title: 'Acceptance of Terms',
      content: (
        <ul className="list-disc list-inside">
          <li>By accessing and using our Instasign platform ('Platform'), you agree to comply with and be bound by these Terms and Conditions.</li>
        </ul>
      ),
    },
    {
      id: 'item-2',
      title: 'User Registration',
      content: (
        <ul className="list-disc list-inside">
          <li>To use certain features of the Platform, you may be required to register an account. You agree to provide accurate and complete information during the registration process as per government laws.</li>
        </ul>
      ),
    },
    {
      id: 'item-3',
      title: 'Identity Validation',
      content: (
        <ul className="list-disc list-inside">
          <li>The Platform collects and processes personal information for account authorization process. Your consent to the use of this information for authentication and compliance with applicable laws and regulations.</li>
        </ul>
      ),
    },
    {
      id: 'item-4',
      title: 'User Responsibilities',
      content: (
        <ul className="list-disc list-inside">
          <li>You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.</li>
        </ul>
      ),
    },
    {
      id: 'item-5',
      title: 'Compliance with Laws',
      content: (
        <ul className="list-disc list-inside">
          <li>Users agree to comply with all applicable laws and regulations related to instasign account authorization and privacy.</li>
        </ul>
      ),
    },
    {
      id: 'item-6',
      title: 'Modifications',
      content: (
        <ul className="list-disc list-inside">
          <li>We reserve the right to modify, suspend, or discontinue the Platform, or any part thereof, at any time without notice. We may also update these Terms and Conditions, and your continued use of the Platform constitutes acceptance of such changes.</li>
        </ul>
      ),
    },
    {
      id: 'item-7',
      title: 'Intellectual Property',
      content: (
        <ul className="list-disc list-inside">
          <li>All content and materials on the Platform are the property of the platform owner and are protected by intellectual property laws.</li>
        </ul>
      ),
    },
    {
      id: 'item-8',
      title: 'Limitation of Liability',
      content: (
        <ul className="list-disc list-inside">
          <li>The Platform is provided 'as is,' and we make no warranties or representations regarding its accuracy, completeness, or reliability. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use the Platform.</li>
        </ul>
      ),
    },
    {
      id: 'item-9',
      title: 'Termination',
      content: (
        <ul className="list-disc list-inside">
          <li>We reserve the right to terminate or suspend your access to the Platform at any time, without notice, for any reason.</li>
        </ul>
      ),
    },
    {
      id: 'item-10',
      title: 'Governing Law',
      content: (
        <ul className="list-disc list-inside">
          <li>These Terms and Conditions are governed by and construed in accordance with the laws of Government of India.</li>
        </ul>
      ),
    },
    // ... add more FAQ items as needed ...
  ];

  return (
    <section id="terms" className="py-16 md:py-24 bg-white" ref={ref}>
      <Title title="Terms And Condition" drive={false} />
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">Terms And Conditions</h2>
          <p className="text-secondary max-w-2xl mx-auto">
          Welcome to Instasign! Before engaging with our services, we encourage you to carefully review our terms and conditions. By accessing or utilizing Instasign's services, you signify your acceptance and agreement to comply with these terms. Users are responsible for maintaining the confidentiality of their account information, and Instasign assumes no liability for unauthorized access.
            <br /><br />
            Our services are intended for lawful use, and users must refrain from engaging in any illegal activities. Additionally, please familiarize yourself with our Privacy Policy governing the collection and use of personal information. Instasign reserves the right to terminate services for users violating terms, and we may update these terms periodically. Your continued use of our services implies acceptance of any modifications. If you do not agree with these terms, kindly refrain from using our services.
            <br /><br />
            Thank you for choosing Instasign.    
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {policyData.map((item) => (
              <AccordionItem
                key={item.id}
                title={item.title}
                content={item.content}
                isOpen={openItem === item.id}
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
