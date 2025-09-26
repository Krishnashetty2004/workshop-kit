'use client'

import React from 'react';
import { Calendar, Clock, Users, Star, CheckCircle, User, Mail, CreditCard } from 'lucide-react';
import { Workshop } from '../types';

interface Props {
  workshop: Workshop;
  isPreview?: boolean;
}

export default function WorkshopLandingPage({ workshop, isPreview = false }: Props) {
  const themeColors = {
    primary: workshop.theme.primaryColor,
    secondary: workshop.theme.secondaryColor,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative py-20 px-6"
        style={{
          background: `linear-gradient(135deg, ${themeColors.primary}15 0%, ${themeColors.secondary}15 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" style={{ color: themeColors.primary }} />
            {workshop.date} • {workshop.time}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {workshop.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {workshop.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{workshop.duration}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              <span>Max {workshop.maxAttendees} attendees</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                ${workshop.price}
              </span>
            </div>
          </div>

          {!isPreview && (
            <button 
              className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)` 
              }}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Register Now
            </button>
          )}
        </div>
      </div>

      {/* Instructor Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Meet Your Instructor
              </h2>
              <h3 className="text-xl font-semibold mb-4" style={{ color: themeColors.primary }}>
                {workshop.instructor.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {workshop.instructor.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Agenda */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What You'll Learn
          </h2>
          
          <div className="space-y-6">
            {workshop.agenda.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  {item.time}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Skills You'll Master
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshop.skills.map((skill, index) => (
              <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 mr-3" style={{ color: themeColors.primary }} />
                <span className="font-medium text-gray-900">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {workshop.testimonials && workshop.testimonials.length > 0 && (
        <div className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What Students Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {workshop.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {workshop.faq && workshop.faq.length > 0 && (
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {workshop.faq.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!isPreview && (
        <div 
          className="py-20 px-6"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Join This Workshop?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Limited spots available. Secure your seat today!
            </p>
            
            <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Mail className="w-5 h-5 mr-2" />
              Register Now - ${workshop.price}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
