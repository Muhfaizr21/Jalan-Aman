"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent browser from restoring old scroll position on reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If the URL contains an anchor hash from a previous click (e.g. #rute, #mobile),
    // clean it from the URL bar so the browser does not jump down to that element on reload
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    // Immediately snap to the top (Hero section)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
