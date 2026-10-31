import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { usePageView } from "./hooks/usePageView";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";

// Each page is its own chunk, so a visitor downloads only the code for the page
// they open. Before this, every route shared one bundle that included the whole site.
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Process = lazy(() => import("./pages/Process"));
const HandInHand = lazy(() => import("./pages/HandInHand"));
const Start = lazy(() => import("./pages/Start"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostDetails = lazy(() => import("./pages/BlogPostDetails"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagPage = lazy(() => import("./pages/TagPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

type Route =
  | "home"
  | "services"
  | "portfolio"
  | "about"
  | "process"
  | "hand-in-hand"
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

/** Treats "/portfolio/" like "/portfolio". The root "/" is left as it is. */
function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/** Decode a URL segment without throwing on malformed percent-encoding. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getRoute(): Route {
  const path = normalizePath(window.location.pathname);
  if (path === "/services") return "services";
  if (path === "/portfolio") return "portfolio";
  if (path === "/about") return "about";
  if (path === "/process") return "process";
  if (path === "/hand-in-hand") return "hand-in-hand";
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
  return match ? safeDecode(match[1]) : "";
}

function getBlogCategorySlug(): string {
  const path = window.location.pathname;
  const match = /^\/blog\/category\/([^/]+)\/?$/.exec(path);
  return match ? safeDecode(match[1]) : "";
}

function getBlogTagSlug(): string {
  const path = window.location.pathname;
  const match = /^\/blog\/tag\/([^/]+)\/?$/.exec(path);
  return match ? safeDecode(match[1]) : "";
}

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
    route === "hand-in-hand" ? <HandInHand /> :
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
      {route !== "not-found" && <Navbar />}
      <Suspense fallback={null}>{page}</Suspense>
      {route === "home" && <FinalCta />}
      {route !== "not-found" && route !== "start" && <Footer />}
    </>
  );
}

export default App;
