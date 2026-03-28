import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <HeroSection />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
