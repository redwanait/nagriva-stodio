import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Home from "./pages/Home";
import Services from "./pages/Services";

const HOME_ANCHORS = new Set(["", "#home", "#portfolio", "#about", "#process"]);

function getRoute(): "home" | "services" {
  return window.location.hash === "#services" ? "services" : "home";
}

function App() {
  const [route, setRoute] = useState<"home" | "services">(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#services") {
        setRoute("services");
        window.scrollTo(0, 0);
        return;
      }
      if (HOME_ANCHORS.has(hash)) {
        setRoute("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (route !== "home") return;
    const hash = window.location.hash;
    if (hash !== "" && hash !== "#home") {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }, [route]);

  return (
    <>
      <Navbar />
      {route === "services" ? <Services /> : <Home />}
      <FinalCta />
      <Footer />
    </>
  );
}

export default App;