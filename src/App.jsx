import { FloatingWhatsApp } from './components/FloatingWhatsApp/FloatingWhatsApp'
import { Header } from './components/Header/Header'
import { NetworkLayer } from './components/Network3D/NetworkLayer'
import { Benefits } from './sections/Benefits/Benefits'
import { CTA } from './sections/CTA/CTA'
import { Diagnostic } from './sections/Diagnostic/Diagnostic'
import { Experience } from './sections/Experience/Experience'
import { Footer } from './sections/Footer/Footer'
import { Hero } from './sections/Hero/Hero'
import { Segments } from './sections/Segments/Segments'
import { Services } from './sections/Services/Services'

export default function App() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Benefits />
        <Services />
        <Segments />
        <Experience />
        <Diagnostic />
        <CTA />
      </main>
      {/* Rendered after <main> so it paints above section backgrounds but below their content. */}
      <NetworkLayer />
      <FloatingWhatsApp />
      <Footer />
    </>
  )
}
