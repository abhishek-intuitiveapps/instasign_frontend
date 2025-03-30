import React from 'react'
import Hero1 from '../components/Hero1'
import HowItWorks from '../components/HowItWorks'
import KeyFeatures from '../components/KeyFeatures'
import Benefits from '../components/Benefits'
import KYCEEIntegration from '../components/KYCEEIntegration'
import About from '../components/About'
import Faq from '../components/FAQ'
import Contact from '../components/Contact'
import Title from '../../components/Title'

const Website = () => {
  return (
      <main>
        <Title title="Home" drive={false} />
        <Hero1 />
        <HowItWorks />
        <KeyFeatures />
        <Benefits />
        <KYCEEIntegration />
        <About />
        {/* <Faq /> */}
        {/* <Contact /> */}
      </main>
    
  )
}

export default Website;