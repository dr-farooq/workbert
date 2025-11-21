import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisuals } from "@/components/hero-visuals";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { Footer } from "@/components/footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#313578] text-white overflow-x-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-[#252860] text-center py-2 px-4 text-sm font-medium">
        <Link
          href="#"
          className="hover:text-green-400 transition-colors flex items-center justify-center gap-2"
        >
          Our 2026 Workforce Trends Report is out — Read More{" "}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-xl">W</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">WorkBert</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
          <Link href="#" className="hover:text-white transition-colors">
            Product
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Use Cases
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Resources
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium hover:text-green-400 transition-colors"
          >
            Login
          </Link>
          <Link href="/sign-up">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#313578] rounded-full px-6 bg-transparent"
            >
              Get Started Free
            </Button>
          </Link>
          <Button className="bg-[#00C853] hover:bg-[#00b54b] text-white rounded-full px-6 font-semibold border-none">
            Contact Us
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium hover:text-green-400 transition-colors"
          >
            Login
          </Link>
          <button className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visuals */}
          <div className="order-2 lg:order-1 w-full max-w-[600px] mx-auto lg:mx-0">
            <HeroVisuals />
          </div>

          {/* Right Column: Text */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Workforce Chaos into{" "}
              <span className="text-[#00C853]">Predictable</span>{" "}
              <span className="text-[#00C853]">Coordination</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AI-driven rostering, staffing and workforce intelligence for
              healthcare and high-pressure teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button className="w-full sm:w-auto bg-[#00C853] hover:bg-[#00b54b] text-white rounded-full px-8 py-6 text-lg font-semibold border-none h-auto">
                Contact Us
              </Button>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-[#313578] rounded-full px-8 py-6 text-lg font-semibold h-auto bg-transparent"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
