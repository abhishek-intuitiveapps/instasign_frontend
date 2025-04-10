import React, { useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import AccordionItem from "../components/AccordionItem";

const Refund = () => {
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
      title: "Credit Purchase",
      content: (
        <ul className="list-disc list-inside">
          <li>Users have the option to buy credits on our platform following account registration and approval.</li>
          <li>The credits purchased are non-transferable and are solely intended for the specified designated services functionalities.</li>
        </ul>
      ),
    },
    {
      id: 'item-2',
      title: "Cancellation of Credit Purchase",
      content: (
        <ul className="list-disc list-inside">
          <li>Users can cancel a credit purchase within a specified period of 90 days after the transaction is approved.</li>
          <li>To initiate a cancellation, users must follow the instructions on our platform or contact our customer support.</li>
        </ul>
      ),
    },
    {
      id: 'item-3',
      title: "Refund Eligibility",
      content: (
        <ul className="list-disc list-inside">
          <li>Refunds for credit purchases are applicable only within the stipulated refund period of 90 days.</li>
          <li>Refund eligibility is subject to compliance with our criteria outlined below.</li>
        </ul>
      ),
    },
    {
      id: 'item-4',
      title: "Refund Criteria",
      content: (
        <ul className="list-disc list-inside">
          <li>Unused Credits: Refunds are applicable only for unused credits. Once credits are utilized for a verification service, they become non-refundable.</li>
          <li>Cancellation Period: Users must request a refund within the designated period of 90 days from the date of credit purchase.</li>
          <li>Technical Issues: Refunds may be considered in the case of verifiable technical issues that prevent the use of purchased credits.</li>
        </ul>
      ),
    },
    {
      id: 'item-5',
      title: "Refund Process",
      content: (
        <ul className="list-disc list-inside">
          <li>Refund Request Submission: Users can submit refund requests through our platform or contact customer support, providing relevant details.</li>
          <li>Review and Approval: Instasign will review refund requests to ensure they meet the specified criteria.</li>
          <li>Processing Time: Approved refunds will be processed promptly, within the processing time depending on the payment method and other factors, and transferred within 48 business hours.</li>
        </ul>
      ),
    },
    {
      id: 'item-6',
      title: "Contacting Support",
      content: (
        <ul className="list-disc list-inside">
          <li>For any queries or assistance regarding credit purchase cancellations and refunds, please contact our customer support at support@Instasign.in.</li>
        </ul>
      ),
    },
    {
      id: 'item-7',
      title: "Policy Updates",
      content: (
        <ul className="list-disc list-inside">
          <li>Instasign reserves the right to update the Credit Purchase Refund and Cancellation Policy. Users will be informed of any changes, and the latest version will be available on our website.</li>
        </ul>
      ),
    },
  ];

  return (
    <section id="refund" className="py-16 md:py-24 bg-white" ref={ref}>
      <Title title="Refund And Cancellation" drive={false} />
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">Refund And Cancellation</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            At Instasign, our dedication to ensuring a seamless and satisfactory user experience extends to our Refund and Cancellation Policy. We understand that circumstances may arise where you need to cancel or seek a refund for a purchase.
            <br /><br />
            To uphold transparency and address such situations, we have carefully outlined our policies, ensuring clarity and fairness for our users. Please take a moment to review our Refund and Cancellation Policy, which serves as a guide to the processes and conditions associated with refunds. We aim to make this aspect of your experience with Instasign as straightforward and user-friendly as possible.
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

export default Refund;
