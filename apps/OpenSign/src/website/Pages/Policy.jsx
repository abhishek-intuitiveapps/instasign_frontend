import React,{ useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import AccordionItem from "../components/AccordionItem";

const Policy = () => {
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
      title: "What information do we collect?",
      content: (
        <ul className="list-disc list-inside">
          <strong>Personal Information:</strong>
          <li>Full Name: To verify your identity, the application collects your full legal name as it appears on official documents.</li>
          <strong>Contact Details:</strong>
          <li>Address: Instasign may collect your business address to cross-verify it with official records.</li>
          <li>Email Address: Used for communication purposes and sometimes for sending verification codes, links, or updates.</li>
          <li>Phone Number: A contact number is often collected to send SMS verification codes or for contact purposes.</li>
          <li>Location: Instasign may collect your location as part of the verification process to cross-verify that the user is physically present in a specific location.</li>
          <strong>Official Identification:</strong>
          <li>Government-issued ID: Users are typically required to provide any official identification such as a passport number, driver's license number, Aadhar card number or national ID card number for Validation.</li>
          <li>CIN and GSTIN Number: Users are typically required to provide a CIN and GSTIN number for Business account verification.</li>
          <strong>Biometric Data:</strong>
          <li>Facial Recognition: Some Instasign applications may use facial recognition technology to match the provided images with the identification documents.</li>
          <strong>Consent and Authorization:</strong>
          <li>Agreement to Terms: Users are often required to consent to the terms and conditions of the Instasign process.</li>
          <li>Authorization: Permission to access official records and databases for verification purposes.</li>
          <strong>Non-Personal Information:</strong>
          <li>We may collect non-personal information such as device information, browser type, and IP address for analytical purposes.</li>
        </ul>
      ),
    },
    {
      id: 'item-2',
      title: "How do we use your information?",
      content: (
        <ul className="list-disc list-inside">
          <li>Account creation and management.</li>
          <li>Manage your account.</li>
          <li>Providing and improving our services.</li>
          <li>Communicating with you about updates, promotions, and important information.</li>
          <li>Comply with legal requirements.</li>
        </ul>
      ),
    },
    {
      id: 'item-3',
      title: "How do we keep your information safe?",
      content: (
        <ul className="list-disc list-inside">
          Data security is governed by the data protection laws and we at Instasign strictly comply with the data protection laws of all the countries that we operate in and have implemented several security features to keep the data collected confidential and mitigate the risk of data breach. Data security measures adopted include:
          <li>Instasign implements security controls to protect the confidentiality and integrity of user data.</li>
          <li>Access to sensitive data is limited to personnel with a legitimate business reason, and unlawful disclosure is prohibited.</li>
          We implement security measures to protect your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
        </ul>
      ),
    },
    {
      id: 'item-4',
      title: "How long do we retain your information?",
      content: (
        <ul className="list-disc list-inside">
          We retain your data based on the purpose for collection, legal obligations, and user agreements. Active app connections, legal requirements, ongoing service provision, fraud prevention, and user-approved extended retention are exceptions. Users can request data deletion through our online form or contact Instasign.
        </ul>
      ),
    },
    {
      id: 'item-5',
      title: "How do we respond to information disclosure requests?",
      content: (
        <ul className="list-disc list-inside">
          At Instasign, we prioritize the protection of your information and adhere to legal standards when it comes to information disclosure. We want to provide you with a comprehensive understanding of our approach. Instasign diligently follows legal processes and standards when responding to information disclosure requests. Our commitment to user privacy is unwavering, and we only disclose information in a manner consistent with legal obligations and user consent. If you have any questions or concerns regarding our information disclosure practices, please feel free to reach out to us at privacy@Instasign.in.
        </ul>
      ),
    },
    {
      id: 'item-6',
      title: "How we share your data",
      content: (
        <ul className="list-disc list-inside">
          We do not sell, trade, or otherwise transfer your personal information to outside parties. However, we may share your information with trusted third parties or developers who assist us in operating our website or conducting our business.
        </ul>
      ),
    },
    {
      id: 'item-7',
      title: "Your Data Protection Rights",
      content: (
        <ul className="list-disc list-inside">
          You have the right to:
          <li>Review and update your personal information.</li>
          <li>Opt-out of promotional communications.</li>
          <li>Change or reset your password.</li>
          <li>Request the deletion of your account and data.</li>
          <li>Request, under certain circumstances, that we rectify or update your data that is inaccurate or incomplete.</li>
        </ul>
      ),
    },
    {
      id: 'item-8',
      title: "Cookies and Tracking Technologies",
      content: (
        <ul className="list-disc list-inside">
          We use cookies and similar technologies to enhance your experience and collect data about how you interact with our website.
        </ul>
      ),
    },
    {
      id: 'item-9',
      title: "Changes to this privacy policy",
      content: (
        <ul className="list-disc list-inside">
          We may update this Privacy Policy periodically. We will notify you of any changes by posting the updated policy on our website.
        </ul>
      ),
    },
    {
      id: 'item-10',
      title: "How to contact us in case of questions?",
      content: (
        <ul className="list-inside">
          <li>For privacy-related questions or concerns, we are committed to addressing your inquiries and maintaining a secure and transparent privacy experience at Instasign. You can contact us in the following modes:</li>
          <li><strong>Through Email:</strong> <a href="mailto:support@Instasign.in">support@Instasign.in</a></li>
          <li><strong>Through Phone:</strong> +91.9311648358</li>
        </ul>
      ),
    },
  ];

  return (
    <section id="refund" className="py-16 md:py-24 bg-white" ref={ref}>
      <Title title="Policy" drive={false} />
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">Privacy Policy</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Thank you for choosing Instasign, a product crafted by Intuitive Apps Inc. Protecting your privacy is of utmost importance to us. This End User Privacy Policy is designed to clarify how Instasign, powered by Intuitive Apps Inc., gathers, utilizes, and shares your data when you use our website.
            <br /><br />
            Applicable to Intuitive Apps Inc., its affiliates, and subsidiaries, this policy outlines key information about your privacy rights and choices. Please review it carefully as it serves as a comprehensive guide to how we collect, use, disclose, and safeguard your information throughout your interaction with our website.
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

export default Policy;
