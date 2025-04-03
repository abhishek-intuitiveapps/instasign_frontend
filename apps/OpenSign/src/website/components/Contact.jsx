import { useState, useEffect, useRef } from "react";
import React from "react";
import styled, { keyframes } from "styled-components";
import Title from "../../components/Title";
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContactSection = styled.section`
  padding: 4rem 1rem;
  background-color: #ffffff;
  &.fade-in {
    animation: ${fadeIn} 0.6s ease-in;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h2 {
    font-size: 2.25rem;
    font-weight: bold;
    color: #002864;
    margin-bottom: 1rem;
  }

  p {
    max-width: 42rem;
    margin: 0 auto;
    color: #29354a;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const InfoContent = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #002864;
    margin-bottom: 0.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Icon = styled.span`
  background: rgba(0, 40, 100, 0.1);
  padding: 0.25rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const ContactForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #002864;
    margin-bottom: 1.5rem;
    
    &.fade-in {
      animation: ${fadeIn} 0.6s ease-in;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #29354a;
    margin-bottom: 0.5rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.375rem;
    font-size: 1rem;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #002864;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 40, 100, 0.9);
  }
`;

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
    <ContactSection id="contact" className={isVisible ? 'fade-in' : ''} ref={ref}>
      <Title title="Contact Us" drive={false} />
      <Container>
        <Header>
          <h2>Contact Us</h2>
          <p>Have questions or ready to get started? Reach out to our team for support.</p>
        </Header>

        <ContactGrid>
          <ContactInfo>
            <InfoCard>
              <InfoContent>
                <h3>India</h3>
                <InfoItem>
                  <Icon><MapPinIcon /></Icon>
                  <p>B-85 Dashrath Puri, Palam Road,<br /> New Delhi 110045</p>
                </InfoItem>
                <InfoItem>
                  <Icon><PhoneIcon /></Icon>
                  <p>+91 9311648357</p>
                </InfoItem>
                <InfoItem>
                  <Icon><MailIcon /></Icon>
                  <p>cs@instasign.com</p>
                </InfoItem>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoContent>
                <h3>USA</h3>
                <InfoItem>
                  <Icon><MapPinIcon /></Icon>
                  <p>2802 E. Lincoln St, Suite # 1D, Bloomington, IL 61704</p>
                </InfoItem>
                <InfoItem>
                  <Icon><PhoneIcon /></Icon>
                  <p>+1 408.341.9417</p>
                </InfoItem>
                <InfoItem>
                  <Icon><MailIcon /></Icon>
                  <p>cs@instasign.com</p>
                </InfoItem>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoContent>
                <h3>Canada</h3>
                <InfoItem>
                  <Icon><MapPinIcon /></Icon>
                  <p>206 Coventry Crt NE,<br /> Calgary, Alberta T3K5E8</p>
                </InfoItem>
                <InfoItem>
                  <Icon><PhoneIcon /></Icon>
                  <p>+1 408.341.9417</p>
                </InfoItem>
                <InfoItem>
                  <Icon><MailIcon /></Icon>
                  <p>cs@instasign.com</p>
                </InfoItem>
              </InfoContent>
            </InfoCard>
          </ContactInfo>

          <ContactForm ref={messageRef}>
            <h3 className={messageVisible ? 'fade-in' : ''}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit">Send Message</SubmitButton>
            </form>
          </ContactForm>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;
