"use client";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      easing: "ease",
      speed: 500,
      minimum: 0.1,
    });

    NProgress.done();

    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}
