"use client";

import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function RedirectToHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting to home...</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xl">W</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              WorkBert
            </span>
          </div>

          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to WorkBert! Your HR AI assistant.
          </p>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Employees
            </h3>
            <p className="text-3xl font-bold text-[#00C853]">0</p>
            <p className="text-sm text-gray-500 mt-2">No employees yet</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upcoming Shifts
            </h3>
            <p className="text-3xl font-bold text-[#313578]">0</p>
            <p className="text-sm text-gray-500 mt-2">No shifts scheduled</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pending Tasks
            </h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500 mt-2">All caught up!</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-semibold text-gray-900">Add Employee</h4>
              <p className="text-sm text-gray-500 mt-1">
                Onboard new team member
              </p>
            </button>

            <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">📅</div>
              <h4 className="font-semibold text-gray-900">Create Roster</h4>
              <p className="text-sm text-gray-500 mt-1">
                Schedule shifts with AI
              </p>
            </button>

            <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-semibold text-gray-900">Run Payroll</h4>
              <p className="text-sm text-gray-500 mt-1">
                Process payments
              </p>
            </button>

            <button className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900">View Reports</h4>
              <p className="text-sm text-gray-500 mt-1">
                Analytics and insights
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

