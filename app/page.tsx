"use client";

import { Unauthenticated, Authenticated } from "convex/react";
import { LandingPage } from "@/components/landing-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Authenticated>
        <RedirectToDashboard />
      </Authenticated>
    </>
  );
}

function RedirectToDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting to dashboard...</p>
    </div>
  );
}
