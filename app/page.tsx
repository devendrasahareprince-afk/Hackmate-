import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { CallToAction, Features, HowItWorks, Stats, Testimonials } from '@/components/landing/sections'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
