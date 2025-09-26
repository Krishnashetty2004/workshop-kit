'use client'

import React, { useState } from 'react';
import { Rocket, Sparkles, Users, CreditCard, Calendar, Mail } from 'lucide-react';
import WorkshopGenerator from '../components/WorkshopGenerator';
import WorkshopPreview from '../components/WorkshopPreview';
import Dashboard from '../components/Dashboard';
import { Header } from '../components/layout/Header';
import { Workshop } from '../types';
import { ViewState } from '../types';
import { FEATURES, PROCESS_STEPS } from '../lib/constants';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [generatedWorkshop, setGeneratedWorkshop] = useState<Workshop | null>(null);

  const handleWorkshopGenerated = (workshop: Workshop) => {
    setGeneratedWorkshop(workshop);
    setCurrentView('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {currentView === 'home' && (
        <div className="relative">
          <Header 
            onDashboardClick={() => setCurrentView('dashboard')}
            showDashboard={true}
          />

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Workshop Creation
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Launch Your Workshop in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Minutes, Not Days
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Create professional workshop landing pages, handle payments, and manage attendees 
                with a single AI prompt. No coding, no complicated setup.
              </p>

              <button
                onClick={() => setCurrentView('generator')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Create Workshop Now
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {FEATURES.map((feature, index) => {
                const IconComponent = feature.icon === 'Sparkles' ? Sparkles : 
                                    feature.icon === 'CreditCard' ? CreditCard : Users;
                return (
                  <FeatureCard
                    key={index}
                    icon={<IconComponent className="w-6 h-6 text-purple-600" />}
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>

            {/* Example Journey */}
            <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                See How It Works
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                {PROCESS_STEPS.map((step, index) => {
                  const IconComponent = step.icon === 'Mail' ? Mail :
                                      step.icon === 'Sparkles' ? Sparkles :
                                      step.icon === 'Calendar' ? Calendar : Users;
                  return (
                    <StepCard
                      key={index}
                      number={step.number}
                      title={step.title}
                      description={step.description}
                      icon={<IconComponent className="w-5 h-5" />}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'generator' && (
        <WorkshopGenerator 
          onWorkshopGenerated={handleWorkshopGenerated}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentView === 'preview' && generatedWorkshop && (
        <WorkshopPreview 
          workshop={generatedWorkshop}
          onBack={() => setCurrentView('generator')}
          onPublish={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
        {number}
      </div>
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-3 mx-auto">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
