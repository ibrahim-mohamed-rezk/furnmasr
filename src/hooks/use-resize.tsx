import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getIsTablet() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < TABLET_BREAKPOINT;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setIsMobile(getIsMobile());
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    const onChange = () => {
      setIsMobile(getIsMobile());
    };
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, [isClient]);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setIsTablet(getIsTablet());
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    const onChange = () => {
      setIsTablet(getIsTablet());
    };
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  }, [isClient]);

  return isTablet;
}
