import { Award } from "lucide-react"

export function StatsSection() {
  return (
    <section className="bg-[#1a1b2e] py-20 relative overflow-hidden">
      {/* Background Network Graphic (Abstract Lines) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="10%" cy="20%" r="100" fill="blue" filter="blur(80px)" opacity="0.4" />
        <circle cx="90%" cy="80%" r="100" fill="purple" filter="blur(80px)" opacity="0.4" />
      </svg>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Automated HR Matters</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-6">
            Securing the Future of Workforce Management
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            Manual processes cost businesses billions each year. WorkBert makes managing your workforce as seamless and
            real-time as monitoring campaign data. Trusted by brands worldwide, we prevent payroll errors, safeguard
            compliance, and empower businesses to grow confidently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Stat 1 */}
          <div className="border-l-4 border-[#00C853] pl-6">
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">1M+</div>
            <p className="text-slate-300 text-sm lg:text-base">
              shifts rostered and optimized across 500+ companies worldwide.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="border-l-4 border-[#00C853] pl-6">
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">$500M+</div>
            <p className="text-slate-300 text-sm lg:text-base">
              payroll processed accurately without a single compliance breach.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="border-l-4 border-[#00C853] pl-6">
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">40%</div>
            <p className="text-slate-300 text-sm lg:text-base">
              reduction in administrative time for HR managers and team leaders.
            </p>
          </div>

          {/* Stat 4 - Badge */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Certified Partner</span>
            </div>
            <p className="text-slate-300 text-sm lg:text-base">
              Certified Xero & MYOB Partner with a global presence on the App Store.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
