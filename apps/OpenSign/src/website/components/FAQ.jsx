import React,{ useEffect, useRef, useState } from "react";
import Title from "../../components/Title";
import AccordionItem from "./AccordionItem";


const Faq = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItem, setOpenItem] = useState(null);
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

  const faqData = [
    {
      id: 'item-1',
      title: 'How does KYC verification work?',
      content: 'Instasign automatically checks the KYC status of recipients when they sign. Verified signers get a watermark on the document, providing an additional layer of security and authenticity to your important documents.'
    },
    {
      id: 'item-2',
      title: 'Can I create templates?',
      content: 'Yes! You can create custom templates with pre-defined fields for faster document preparation. These templates can be reused for recurring documents, saving you time and ensuring consistency.'
    },
    {
      id: 'item-3',
      title: 'Do recipients need to register?',
      content: 'No, recipients can sign without signing up. They\'ll receive the document link via email and can immediately view and sign the document without creating an account or installing any software.'
    },
    {
      id: 'item-4',
      title: 'Where are signed documents stored?',
      content: 'All signed documents are stored in a secure repository accessible only by the admin or document creator. This ensures that your sensitive documents remain confidential and are only accessible to authorized personnel.'
    },
    {
      id: 'item-5',
      title: 'How secure is Instasign?',
      content: 'Instasign employs enterprise-grade security measures, including encryption, secure access controls, and KYC verification. All data is encrypted both in transit and at rest, ensuring your documents and signatures remain secure at all times.'
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-blue-50" ref={ref}>
      <Title title="FAQs" drive={false} />
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-in-out transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold op-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-black max-w-2xl mx-auto">
            Get answers to common questions about Instasign
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {faqData.map((item) => (
              <AccordionItem
                key={item.id}
                title={item.title}
                content={item.content}
                isOpen={openItem === item.id}
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
              />
            ))}
          </div>
          
          <div className={`mt-8 text-center ${isVisible ? 'fade-in' : ''}`}>
            <p className="text-black mb-4">
              Don't see your question here? Reach out to our support team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#002864] text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer no-underline"
              style={{textDecoration: 'none'}}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
