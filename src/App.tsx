import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <FinalCta />
      <Footer />
    </>
  );
}

export default App;
