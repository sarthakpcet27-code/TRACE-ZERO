import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import IncidentAlert from '../components/IncidentAlert'
import ProtocolSection from '../components/ProtocolSection'
import CaseFile from '../components/CaseFile'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#080A0A]"
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <IncidentAlert />
      <ProtocolSection />
      <CaseFile />
      <FinalCTA />
      <Footer />
    </motion.div>
  )
}
