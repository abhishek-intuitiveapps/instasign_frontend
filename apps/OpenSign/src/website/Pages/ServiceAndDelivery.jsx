import { useEffect, useRef, useState } from "react";
import Title from "../../components/Title"; 
import AccordionItem from "../components/AccordionItem";

const ServiceAndDelivery = () => {
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
    { id: 'item-1', title: 'Credit Delivery', content: (
      <ul className="list-disc list-inside">
        <li>Online payments are processed instantly, and UPI purchases are verified through the UTR (Unique Transaction Reference) number.</li>
      </ul>
    )},
    { id: 'item-2', title: 'UPI Purchase', content: (
      <ul className="list-disc list-inside">
        <li>For UPI purchases, users need to provide the UTR number for verification. The system checks the UTR number and payment status for approval.</li>
        <li>If approved, credits are promptly added to the user's account wallet.</li>
      </ul>
    )},
    { id: 'item-3', title: 'Non-Delivery Instance', content: (
      <ul className="list-disc list-inside">
        <li>In case of non-delivery due to technical issues, rejected payments, or other reasons, users have options for resolution.</li>
      </ul>
    )},
    { id: 'item-4', title: 'Resolution Options', content: (
      <ul className="list-disc list-inside">
        <li><strong>Update UTR:</strong> If the UTR number is rejected, users can update the UTR number in the system and users can choose to resend the UPI purchase request for re-verification.</li>
        <li><strong>Contact Support:</strong> For any issues or assistance, users can contact our support team at support@Instasign.in.</li>
      </ul>
    )},
    { id: 'item-5', title: 'Refund For Non-Delivery', content: (
      <ul className="list-disc list-inside">
        <li>If credits are not delivered due to system errors or other verifiable issues, users may be eligible for a refund.</li>
        <li>Refund requests should be submitted through the platform, and they will be reviewed by Instasign.</li>
      </ul>
    )},
    { id: 'item-6', title: 'Approval and Processing', content: (
      <ul className="list-disc list-inside">
        <li>Upon approval of a refund request, the process for crediting the refunded amount to the user's payment method will be initiated.</li>
        <li>Refund processing time may vary based on the payment method and other factors.</li>
      </ul>
    )},
    { id: 'item-7', title: 'Communication', content: (
      <ul className="list-disc list-inside">
        <li>Users will be informed of the status of their credit purchase, delivery, and any refund processes through email notifications or within their account dashboard.</li>
      </ul>
    )},
    { id: 'item-8', title: 'Policy Updates', content: (
      <ul className="list-disc list-inside">
        <li>Instasign reserves the right to update the Shipping and Delivery Document. Users will be notified of any changes, and the latest version will be available on our website.</li>
      </ul>
    )},
    // ... add more FAQ items as needed ...
  ];

  return (
    <section id="service-and-delivery" className="py-16 md:py-24 bg-white" ref={ref}>
      <Title title="Service And Delivery" drive={false} />
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">Service And Delivery</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            At Instasign, our paramount goal is to redefine the user experience, particularly in credit acquisition and delivery. Our streamlined processes ensure a seamless journey for users, whether unlocking premium features or enhancing their accounts.
            <br /><br />
            For an in-depth understanding of credit transactions and user account crediting, explore our comprehensive policy. This guide offers insights into the checks, balances, and protocols governing our operations. At Instasign, transparency empowers users to make informed decisions, elevating their experience where every credit transaction seamlessly blends simplicity and sophistication.
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

export default ServiceAndDelivery;
