import { useEffect } from "react";
import { initGA, sendPageView } from "../lib/analytics";

export function usePageView(route: string): void {
  useEffect(() => {
    initGA();
    sendPageView(window.location.pathname, document.title);
  }, [route]);
}
