'use client'

import React, { useState } from 'react';
import { ArrowLeft, Plus, Users, DollarSign, Calendar, TrendingUp, Eye, CreditCard as Edit, Share2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function Dashboard({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workshops' | 'attendees' | 'analytics'>('overview');

  // Mock data
  const mockWorkshops = [
    {
      id: 1,
      title: "Design Thinking for Beginners",
      date: "2025-01-15",
      status: "published",
      attendees: 12,
      maxAttendees: 20,
      revenue: 480,
      price: 40
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      date: "2025-01-22",
      status: "draft",
      attendees: 0,
      maxAttendees: 15,
      revenue: 0,
      price: 75
    }
  ];

  const totalRevenue = mockWorkshops.reduce((sum, workshop) => sum + workshop.revenue, 0);
  const totalAttendees = mockWorkshops.reduce((sum, workshop) => sum + workshop.attendees, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Workshop Dashboard</h1>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create Workshop
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            change="+12%"
            trend="up"
          />
          <StatCard
            title="Total Attendees"
            value={totalAttendees.toString()}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            change="+8%"
            trend="up"
          />
          <StatCard
            title="Active Workshops"
            value={mockWorkshops.filter(w => w.status === 'published').length.toString()}
            icon={<Calendar className="w-6 h-6 text-purple-600" />}
            change="+2"
            trend="up"
          />
          <StatCard
            title="Conversion Rate"
            value="78%"
            icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
            change="+5%"
            trend="up"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'workshops', label: 'Workshops' },
                { id: 'attendees', label: 'Attendees' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'workshops' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Your Workshops</h2>
                </div>
                
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Workshop</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Attendees</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Revenue</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockWorkshops.map((workshop) => (
                        <tr key={workshop.id} className="border-b border-gray-100">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-900">{workshop.title}</p>
                              <p className="text-sm text-gray-500">${workshop.price} per seat</p>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">{workshop.date}</td>
                          <td className="py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              workshop.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {workshop.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {workshop.attendees}/{workshop.maxAttendees}
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900">
                            ${workshop.revenue}
                          </td>
                          <td className="py-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Welcome back!</h2>
                <p className="text-gray-600">Here's what's happening with your workshops.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
                    <p className="text-purple-100 mb-4">Create your next workshop in minutes</p>
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                      Get Started
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">New registration for Design Thinking</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-600">Workshop reminder sent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendees' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Workshop Attendees</h2>
                <p className="text-gray-600">Manage your attendees and send communications.</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics & Insights</h2>
                <p className="text-gray-600">Track your workshop performance and revenue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}
