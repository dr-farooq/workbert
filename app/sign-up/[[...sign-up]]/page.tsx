import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#313578] via-[#252860] to-[#1a1b2e] flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-bold text-white text-xl">W</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            WorkBert
          </span>
        </Link>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-300 hover:text-[#00C853] transition-colors"
        >
          Already have an account? <span className="text-[#00C853]">Sign in</span>
        </Link>
      </nav>

      {/* Auth Component */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Get started with WorkBert
            </h1>
            <p className="text-gray-300">
              Transform workforce chaos into predictable coordination
            </p>
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/95 backdrop-blur-sm shadow-2xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-white border-gray-200 hover:bg-gray-50",
                formButtonPrimary: "bg-[#00C853] hover:bg-[#00b54b]",
                footerActionLink: "text-[#00C853] hover:text-[#00b54b]",
              },
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

