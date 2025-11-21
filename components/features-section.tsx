import type React from "react"
import {
  Calendar,
  Users,
  DollarSign,
  Smartphone,
  BarChart3,
  CheckCircle2,
  FileText,
  ShieldCheck,
  RefreshCw,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturesSection() {
  return (
    <div className="flex flex-col">
      {/* Feature 1: AI Rostering & Shift Swaps */}
      <FeatureBlock
        category="AI Rostering"
        title="Automate Rostering & Seamless Shift Swaps"
        description="Say goodbye to manual scheduling. WorkBert's AI generates optimized rosters in seconds, considering availability, skills, and costs. Empower your team with automated shift swaps that handle approvals instantly."
        buttonText="Explore Smart Rostering"
        align="left"
        visual={<RosteringVisual />}
      />

      {/* Feature 2: Onboarding & Compliance */}
      <FeatureBlock
        category="Onboarding & Compliance"
        title="Effortless Onboarding & Total Compliance"
        description="Streamline the new hire journey from contract to day one. Automate document collection, training modules, and background checks to ensure every employee is compliant and ready to work."
        buttonText="View Onboarding Tools"
        align="right"
        visual={<OnboardingVisual />}
      />

      {/* Feature 3: Payroll & Payslips */}
      <FeatureBlock
        category="Payroll Automation"
        title="Error-Free Payroll & Instant Payslips"
        description="Turn timesheets into transactions with a single click. WorkBert automates award interpretation, tax calculations, and superannuation, delivering accurate payslips to your team instantly."
        buttonText="See Payroll Features"
        align="left"
        visual={<PayrollVisual />}
      />

      {/* Feature 4: Mobile App */}
      <FeatureBlock
        category="Employee Experience"
        title="A Companion App Your Team Will Love"
        description="Give your employees control with the WorkBert mobile app. They can view rosters, swap shifts, submit leave requests, and access payslips—all from their pocket."
        buttonText="Check Out the App"
        align="right"
        visual={<MobileAppVisual />}
      />

      {/* Feature 5: Insights */}
      <FeatureBlock
        category="Real-time Insights"
        title="Data-Driven Decisions with Live Analytics"
        description="Gain visibility into labor costs, attendance trends, and productivity. Our insights dashboard helps you optimize staffing levels and reduce unnecessary overtime."
        buttonText="Explore Analytics"
        align="left"
        visual={<InsightsVisual />}
      />
    </div>
  )
}

function FeatureBlock({
  category,
  title,
  description,
  buttonText,
  align,
  visual,
}: {
  category: string
  title: string
  description: string
  buttonText: string
  align: "left" | "right"
  visual: React.ReactNode
}) {
  return (
    <section className={`py-20 lg:py-32 overflow-hidden ${align === "right" ? "bg-slate-50" : "bg-white"}`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div
          className={`flex flex-col gap-12 lg:gap-20 items-center ${align === "right" ? "lg:flex-row-reverse" : "lg:flex-row"}`}
        >
          {/* Text Content */}
          <div className="flex-1 max-w-xl">
            <div className="text-[#313578] font-semibold mb-4 flex items-center gap-2">
              {align === "right" && <div className="w-8 h-1 bg-[#00C853]" />}
              {category}
              {align === "left" && <div className="w-8 h-1 bg-[#00C853]" />}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1b2e] mb-6 leading-tight">{title}</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">{description}</p>
            <Button
              variant="outline"
              className="border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 bg-transparent"
            >
              {buttonText}
            </Button>

            {/* Optional "See also" links similar to reference */}
            <div className="mt-10 space-y-3">
              <p className="font-semibold text-[#1a1b2e]">See also</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="text-[#00C853] font-bold">Integration</span> with Xero & MYOB.
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="text-[#00C853] font-bold">Award Interpretation</span> for complex rates.
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Content */}
          <div className="flex-1 w-full flex justify-center relative">{visual}</div>
        </div>
      </div>
    </section>
  )
}

/* --- Visual Components --- */

function RosteringVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square">
      {/* Connection Lines Background */}
      <svg className="absolute inset-0 w-full h-full text-blue-100" style={{ zIndex: 0 }}>
        <path d="M100,100 L250,250 L400,100" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-50" />
        <path d="M250,250 L250,400" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-50" />
      </svg>

      {/* Central Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-50 flex flex-col items-center gap-3 animate-float">
          <div className="w-16 h-16 bg-[#313578] rounded-full flex items-center justify-center text-white">
            <RefreshCw className="w-8 h-8" />
          </div>
          <span className="font-bold text-[#313578]">AI Scheduler</span>
        </div>
      </div>

      {/* Satellite Nodes */}
      <div className="absolute top-[20%] left-[10%] animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00C853]" />
          <span className="font-medium text-slate-700">Shift A</span>
        </div>
      </div>

      <div className="absolute top-[20%] right-[10%] animate-bounce-slow" style={{ animationDelay: "1s" }}>
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#00C853]" />
          <span className="font-medium text-slate-700">Shift B</span>
        </div>
      </div>

      <div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 animate-bounce-slow"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="bg-[#00C853] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Swap Approved</span>
        </div>
      </div>
    </div>
  )
}

function OnboardingVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square">
      {/* Path Line */}
      <svg className="absolute inset-0 w-full h-full text-blue-100" style={{ zIndex: 0 }}>
        <path
          d="M50,250 C150,250 150,100 250,100 C350,100 350,250 450,250"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 8"
        />
      </svg>

      {/* Steps */}
      <div className="absolute left-[5%] top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#313578]">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-700">New Hire</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float">
        <div className="bg-white p-5 rounded-xl shadow-xl border-l-4 border-[#00C853] flex items-center gap-3 w-48">
          <FileText className="w-8 h-8 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Contract</span>
            <span className="font-bold text-[#00C853]">Signed</span>
          </div>
        </div>
      </div>

      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 z-10">
        <div className="bg-[#313578] p-4 rounded-xl shadow-lg flex flex-col items-center gap-2 text-white">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold">Compliant</span>
        </div>
      </div>
    </div>
  )
}

function PayrollVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
      {/* Central Hub */}
      <div className="relative z-10 bg-white p-8 rounded-full shadow-2xl border-4 border-blue-50 w-48 h-48 flex flex-col items-center justify-center text-center animate-pulse-slow">
        <DollarSign className="w-12 h-12 text-[#00C853] mb-2" />
        <span className="font-bold text-xl text-[#313578]">Payroll Engine</span>
      </div>

      {/* Orbiting Elements */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md border border-slate-100">
          <Clock className="w-6 h-6 text-blue-500" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white p-3 rounded-lg shadow-md border border-slate-100">
          <FileText className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      {/* Floating Cards */}
      <div
        className="absolute right-0 top-1/4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-[#00C853] animate-float"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="text-xs text-slate-500">Payslip Generated</div>
        <div className="font-bold text-slate-800">John Doe</div>
        <div className="text-[#00C853] font-mono">$1,250.00</div>
      </div>
    </div>
  )
}

function MobileAppVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
      {/* Phone Frame */}
      <div className="relative w-[200px] h-[400px] bg-[#1a1b2e] rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden z-10">
        {/* Screen Content */}
        <div className="absolute inset-0 bg-white flex flex-col">
          <div className="h-14 bg-[#313578] flex items-center justify-center text-white font-bold">WorkBert</div>
          <div className="p-4 space-y-3">
            <div className="h-24 bg-blue-50 rounded-xl p-3">
              <div className="w-1/2 h-3 bg-blue-200 rounded mb-2"></div>
              <div className="w-3/4 h-3 bg-blue-100 rounded"></div>
            </div>
            <div className="h-24 bg-green-50 rounded-xl p-3">
              <div className="w-1/2 h-3 bg-green-200 rounded mb-2"></div>
              <div className="w-3/4 h-3 bg-green-100 rounded"></div>
            </div>
          </div>
          {/* Bottom Nav */}
          <div className="mt-auto h-16 border-t flex justify-around items-center text-slate-400">
            <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-6 h-6 bg-[#313578] rounded-full"></div>
            <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Floating App Icons */}
      <div className="absolute left-[10%] top-[30%] bg-white p-3 rounded-xl shadow-lg animate-bounce-slow">
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
      <div
        className="absolute right-[10%] top-[40%] bg-white p-3 rounded-xl shadow-lg animate-bounce-slow"
        style={{ animationDelay: "0.7s" }}
      >
        <RefreshCw className="w-8 h-8 text-[#00C853]" />
      </div>
      <div
        className="absolute left-[15%] bottom-[20%] bg-white p-3 rounded-xl shadow-lg animate-bounce-slow"
        style={{ animationDelay: "1.2s" }}
      >
        <Smartphone className="w-8 h-8 text-purple-500" />
      </div>
    </div>
  )
}

function InsightsVisual() {
  return (
    <div className="relative w-full max-w-[500px] aspect-square">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner transform rotate-3 hover:rotate-0 transition-transform duration-500">
        <div className="bg-white p-4 rounded-xl shadow-sm col-span-2">
          <div className="flex justify-between items-end mb-2">
            <div className="text-sm text-slate-500">Labor Cost</div>
            <div className="text-green-500 text-xs font-bold">-12%</div>
          </div>
          <div className="h-20 flex items-end gap-1">
            {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-100 rounded-t-sm hover:bg-blue-500 transition-colors"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Overtime</div>
          <div className="text-2xl font-bold text-slate-800">4.2h</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Efficiency</div>
          <div className="text-2xl font-bold text-[#00C853]">98%</div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute -top-4 -right-4 bg-[#313578] text-white px-4 py-2 rounded-lg shadow-lg transform rotate-6">
        <BarChart3 className="inline-block w-4 h-4 mr-2" />
        Live Data
      </div>
    </div>
  )
}
