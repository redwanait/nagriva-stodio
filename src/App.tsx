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
import Start from "./pages/Start";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Brand from "./pages/Brand";

type Route = "home" | "services" | "portfolio" | "about" | "process" | "start" | "privacy-policy" | "terms-of-service" | "brand";

const LEGACY_HASH_MAP: Record<string, string> = {
  "#services": "/services",
  "#portfolio": "/portfolio",
  "#about": "/about",
  "#process": "/process",
  "#start": "/start",
};

function getRoute(): Route {
  const path = window.location.pathname;
  if (path === "/services") return "services";
  if (path === "/portfolio") return "portfolio";
  if (path === "/about") return "about";
  if (path === "/process") return "process";
  if (path === "/start") return "start";
  if (path === "/privacy-policy") return "privacy-policy";
  if (path === "/terms-of-service") return "terms-of-service";
  if (path === "/brand") return "brand";
  return "home";
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && LEGACY_HASH_MAP[hash]) {
      window.location.replace(LEGACY_HASH_MAP[hash]);
      return;
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const page =
    route === "about" ? <About /> :
    route === "services" ? <Services /> :
    route === "portfolio" ? <Portfolio /> :
    route === "process" ? <Process /> :
    route === "start" ? <Start /> :
    route === "privacy-policy" ? <PrivacyPolicy /> :
    route === "terms-of-service" ? <TermsOfService /> :
    route === "brand" ? <Brand /> :
    <Home />;

  return (
    <>
      <Navbar />
      {page}
      {route === "home" && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;