import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";

const HOME_ANCHORS = new Set(["", "#home", "#process"]);

function getRoute(): "home" | "services" | "portfolio" | "about" {
  const hash = window.location.hash;
  if (hash === "#services") return "services";
  if (hash === "#portfolio") return "portfolio";
  if (hash === "#about") return "about";
  return "home";
}

function App() {
  const [route, setRoute] = useState<"home" | "services" | "portfolio" | "about">(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#services" || hash === "#portfolio" || hash === "#about") {
        setRoute(getRoute());
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

  const page =
    route === "about" ? <About /> : route === "services" ? <Services /> : route === "portfolio" ? <Portfolio /> : <Home />;

  return (
    <>
      <Navbar />
      {page}
      {route !== "portfolio" && route !== "about" && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;