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
import IframeTest from "./pages/IframeTest";
import ProjectPreview from "./pages/ProjectPreview";

const HOME_ANCHORS = new Set(["", "#home"]);

type Route = "home" | "services" | "portfolio" | "about" | "process" | "start";

const ROUTE_HASHES = new Set(["#services", "#portfolio", "#about", "#process", "#start"]);

function getRoute(): Route {
  const hash = window.location.hash;
  if (hash === "#services") return "services";
  if (hash === "#portfolio") return "portfolio";
  if (hash === "#about") return "about";
  if (hash === "#process") return "process";
  if (hash === "#start") return "start";
  return "home";
}

function getPreviewId(hash: string): string | null {
  const match = hash.match(/^#\/preview\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);
  const [previewId, setPreviewId] = useState<string | null>(() =>
    getPreviewId(window.location.hash)
  );
  const isIframeTest = window.location.hash === "#iframe-test";

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#iframe-test") return;
      const nextPreviewId = getPreviewId(hash);
      if (nextPreviewId !== null) {
        setPreviewId(nextPreviewId);
        setRoute("home");
        window.scrollTo(0, 0);
        return;
      }
      setPreviewId(null);
      if (ROUTE_HASHES.has(hash)) {
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
    route === "about" ? <About /> :
    route === "services" ? <Services /> :
    route === "portfolio" ? <Portfolio /> :
    route === "process" ? <Process /> :
    route === "start" ? <Start /> :
    <Home />;

  if (isIframeTest) {
    return <IframeTest />;
  }

  if (previewId !== null) {
    return <ProjectPreview projectId={previewId} />;
  }

  return (
    <>
      <Navbar />
      {page}
      {route !== "portfolio" && route !== "about" && route !== "process" && route !== "start" && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;