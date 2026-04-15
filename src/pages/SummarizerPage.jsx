import Navbar from '../components/Navbar'
import AIDemo from '../components/AIDemo'
import Footer from '../components/Footer'

export default function SummarizerPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <AIDemo />
      </main>
      <Footer />
    </>
  )
}
