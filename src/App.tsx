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

const HOME_ANCHORS = new Set(["", "#home"]);

type Route = "home" | "services" | "portfolio" | "about" | "process" | "start" | "privacy-policy" | "terms-of-service" | "brand";

const ROUTE_HASHES = new Set(["#services", "#portfolio", "#about", "#process", "#start"]);

function getRoute(): Route {
  const path = window.location.pathname;
  if (path === "/privacy-policy") return "privacy-policy";
  if (path === "/terms-of-service") return "terms-of-service";
  if (path === "/brand") return "brand";
  const hash = window.location.hash;
  if (hash === "#services") return "services";
  if (hash === "#portfolio") return "portfolio";
  if (hash === "#about") return "about";
  if (hash === "#process") return "process";
  if (hash === "#start") return "start";
  return "home";
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === "/privacy-policy") {
        setRoute("privacy-policy");
        window.scrollTo(0, 0);
        return;
      }
      if (path === "/terms-of-service") {
        setRoute("terms-of-service");
        window.scrollTo(0, 0);
        return;
      }
      if (path === "/brand") {
        setRoute("brand");
        window.scrollTo(0, 0);
        return;
      }
      const hash = window.location.hash;
      if (ROUTE_HASHES.has(hash)) {
        setRoute(getRoute());
        window.scrollTo(0, 0);
        return;
      }
      if (HOME_ANCHORS.has(hash)) {
        setRoute("home");
      }
    };
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
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
      {route !== "portfolio" && route !== "about" && route !== "process" && route !== "start" && route !== "privacy-policy" && route !== "terms-of-service" && route !== "brand" && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;