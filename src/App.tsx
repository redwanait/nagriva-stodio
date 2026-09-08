import { useEffect, useState } from "react";
import "./App.css";
import { usePageView } from "./hooks/usePageView";
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
import Blog from "./pages/Blog";
import BlogPostDetails from "./pages/BlogPostDetails";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import NotFound from "./pages/NotFound";

type Route =
  | "home"
  | "services"
  | "portfolio"
  | "about"
  | "process"
  | "start"
  | "blog"
  | "blog-post"
  | "blog-category"
  | "blog-tag"
  | "privacy-policy"
  | "terms-of-service"
  | "not-found";

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
  if (/^\/blog\/category\/[^/]+$/.test(path)) return "blog-category";
  if (/^\/blog\/tag\/[^/]+$/.test(path)) return "blog-tag";
  if (/^\/blog\/[^/]+$/.test(path)) return "blog-post";
  if (path === "/blog" || path.startsWith("/blog/")) return "blog";
  if (path === "/privacy-policy") return "privacy-policy";
  if (path === "/terms-of-service") return "terms-of-service";
  if (path === "/") return "home";
  return "not-found";
}

function getBlogSlug(): string {
  const path = window.location.pathname;
  const match = /^\/blog\/([^/]+)\/?$/.exec(path);
  return match ? decodeURIComponent(match[1]) : "";
}

function getBlogCategorySlug(): string {
  const path = window.location.pathname;
  const match = /^\/blog\/category\/([^/]+)\/?$/.exec(path);
  return match ? decodeURIComponent(match[1]) : "";
}

function getBlogTagSlug(): string {
  const path = window.location.pathname;
  const match = /^\/blog\/tag\/([^/]+)\/?$/.exec(path);
  return match ? decodeURIComponent(match[1]) : "";
}

const BLOG_ROUTES: ReadonlySet<Route> = new Set([
  "blog",
  "blog-post",
  "blog-category",
  "blog-tag",
]);

function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  usePageView(route);

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
    route === "blog" ? <Blog /> :
    route === "blog-post" ? <BlogPostDetails key={getBlogSlug()} slug={getBlogSlug()} /> :
    route === "blog-category" ? <CategoryPage key={getBlogCategorySlug()} slug={getBlogCategorySlug()} /> :
    route === "blog-tag" ? <TagPage key={getBlogTagSlug()} slug={getBlogTagSlug()} /> :
    route === "privacy-policy" ? <PrivacyPolicy /> :
    route === "terms-of-service" ? <TermsOfService /> :
    route === "not-found" ? <NotFound /> :
    <Home />;

  return (
    <>
      <Navbar />
      {page}
      {(route === "home" || BLOG_ROUTES.has(route)) && <FinalCta />}
      <Footer />
    </>
  );
}

export default App;
