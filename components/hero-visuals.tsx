import { Users, DollarSign, CheckCircle, TrendingUp, Clock } from "lucide-react"

export function HeroVisuals() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
      {/* Background Chart Layer */}
      <div className="absolute inset-0 z-0 opacity-20 transform scale-90 translate-y-10">
        <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm p-6">
          <div className="flex justify-between items-end h-full pb-8 px-4">
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
              <div key={i} className="w-8 bg-blue-400/50 rounded-t-md" style={{ height: `${h}%` }} />
            ))}
          </div>
          {/* Chart Line */}
          <svg className="absolute inset-0 w-full h-full p-6 pointer-events-none" preserveAspectRatio="none">
            <path
              d="M 40 300 L 100 200 L 160 250 L 220 100 L 280 180 L 340 50 L 400 120"
              fill="none"
              stroke="#00C853"
              strokeWidth="4"
              className="drop-shadow-lg"
            />
          </svg>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="relative z-10 w-[280px] h-[560px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-500">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white text-gray-800 overflow-hidden flex flex-col">
          {/* App Header */}
          <div className="bg-[#313578] text-white p-6 pt-10">
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-semibold">WorkBert</span>
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-[#313578]"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold">$14,250</h3>
            <p className="text-xs text-blue-200">Total Payroll (This Week)</p>
          </div>

          {/* App Body */}
          <div className="p-4 flex-1 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm text-gray-700">Active Shifts</h4>
              <span className="text-xs text-blue-600 font-medium">View All</span>
            </div>

            {/* Shift Items */}
            <div className="space-y-3">
              {[
                { name: "Sarah J.", role: "Manager", time: "09:00 - 17:00", status: "Active" },
                { name: "Mike T.", role: "Support", time: "10:00 - 18:00", status: "Break" },
                { name: "Emma W.", role: "Sales", time: "08:30 - 16:30", status: "Active" },
                { name: "David L.", role: "Tech", time: "12:00 - 20:00", status: "Scheduled" },
              ].map((shift, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i % 2 === 0 ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
                    >
                      {shift.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{shift.name}</p>
                      <p className="text-[10px] text-gray-500">{shift.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-gray-600">{shift.time}</p>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${shift.status === "Active" ? "bg-green-100 text-green-600" : shift.status === "Break" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {shift.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Chart */}
            <div className="mt-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700">Efficiency</span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
              <div className="h-16 flex items-end gap-1">
                {[30, 50, 45, 70, 60, 85, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t-sm"
                    style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards */}

      {/* Card 1: Top Left - Active Staff */}
      <div className="absolute top-20 left-0 md:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow z-20 max-w-[160px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Staff</p>
            <p className="text-lg font-bold text-gray-800">1,248</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full w-[85%]"></div>
        </div>
      </div>

      {/* Card 2: Top Right - Payroll Status */}
      <div className="absolute top-32 right-0 md:-right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Payroll Run</p>
            <p className="text-sm font-bold text-gray-800">Completed</p>
          </div>
        </div>
      </div>

      {/* Card 3: Bottom Left - Shift Coverage */}
      <div className="absolute bottom-32 left-4 md:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float-delayed z-20">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-gray-700">Shift Coverage</span>
            </div>
            <span className="text-xs font-bold text-green-500">98%</span>
          </div>
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
              <img src="/diverse-group-avatars.png" alt="User" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden -ml-3">
              <img src="/diverse-group-avatars.png" alt="User" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden -ml-3 flex items-center justify-center text-[10px] font-bold text-gray-500">
              +12
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Bottom Right - Cost Savings */}
      <div className="absolute bottom-20 right-8 md:right-0 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow z-20">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Monthly Savings</p>
          <div className="flex items-center justify-center gap-1 text-green-600">
            <DollarSign className="w-5 h-5 fill-current" />
            <span className="text-2xl font-bold">12.5k</span>
          </div>
          <div className="mt-2 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full inline-block">
            +15% vs last month
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
    </div>
  )
}
