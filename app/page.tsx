import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import ModBotDemo from '@/components/ModBotDemo'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import TechStack from '@/components/TechStack'
import Pricing from '@/components/Pricing'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <ModBotDemo />
      <HowItWorks />
      <Testimonials />
      <TechStack />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  )
}
