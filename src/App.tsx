import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Process from "./pages/Process";

const HOME_ANCHORS = new Set(["", "#home"]);

function getRoute(): "home" | "services" | "portfolio" | "about" | "process" {
  const hash = window.location.hash;
  if (hash === "#services") return "services";
  if (hash === "#portfolio") return "portfolio";
  if (hash === "#about") return "about";
  if (hash === "#process") return "process";
  return "home";
}

function App() {
  const [route, setRoute] = useState<"home" | "services" | "portfolio" | "about" | "process">(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#services" || hash === "#portfolio" || hash === "#about" || hash === "#process") {
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
    route === "about" ? <About /> : route === "services" ? <Services /> : route === "portfolio" ? <Portfolio /> : route === "process" ? <Process /> : <Home />;

  return (
    <>
      <Navbar />
      {page}
      {route !== "portfolio" && route !== "about" && route !== "process" && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;