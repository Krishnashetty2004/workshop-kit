'use client'

import React, { useState } from 'react';
import { ArrowLeft, Eye, Rocket, Users, Calendar, Clock, DollarSign, Star } from 'lucide-react';
import { Workshop } from '../types';
import WorkshopLandingPage from './WorkshopLandingPage';

interface Props {
  workshop: Workshop;
  onBack: () => void;
  onPublish: () => void;
}

export default function WorkshopPreview({ workshop, onBack, onPublish }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false);
      onPublish();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Editor
            </button>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Preview Workshop</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{workshop.title}</p>
              <p className="text-xs text-gray-500">Ready to publish</p>
            </div>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
            >
              {isPublishing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Rocket className="w-4 h-4 mr-2" />
              )}
              {isPublishing ? 'Publishing...' : 'Publish Workshop'}
            </button>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Workshop Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workshop Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{workshop.time} ({workshop.duration})</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  <span>${workshop.price}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span>Max {workshop.maxAttendees} attendees</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Skills Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {workshop.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Expected Outcome</h4>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">High-value workshop</span>
                </div>
              </div>
            </div>
          </div>

          {/* Landing Page Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 font-mono">
                    workshopkit.com/workshop/{workshop.id}
                  </div>
                </div>
              </div>
              
              <div className="max-h-screen overflow-y-auto">
                <WorkshopLandingPage workshop={workshop} isPreview={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
