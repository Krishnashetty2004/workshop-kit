'use client'

import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAIWorkshopGeneration } from '../lib/ai-integration';

/**
 * AI Workshop Generator Component
 * Complete integration example with the AI prompt system
 */
export default function AIWorkshopGenerator() {
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('professional');
  const { generateWorkshop, generateWithTemplate, isLoading, error, result, reset } = useAIWorkshopGeneration();

  const handleGenerate = async () => {
    if (!description.trim()) return;

    await generateWorkshop({
      description,
      enhancements: {
        tone: template,
        audience: template === 'technical' ? 'developers' : 'professionals'
      }
    });
  };

  const handleGenerateWithTemplate = async () => {
    if (!description.trim()) return;

    await generateWithTemplate({
      description,
      template,
      enhancements: {
        tone: template,
        audience: template === 'technical' ? 'developers' : 'professionals'
      }
    });
  };

  const examplePrompts = [
    "AI Workshop for Beginners, 2-day online bootcamp, for students and professionals",
    "React Masterclass for Developers, 3-day intensive course, advanced techniques",
    "Digital Marketing Workshop for Entrepreneurs, 1-day crash course, practical strategies",
    "Creative Writing Workshop for Authors, 4-week program, storytelling techniques"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Workshop Generator
        </h1>
        <p className="text-gray-600">
          Describe your workshop in one sentence and get a complete landing page
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workshop Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., AI Workshop for Beginners, 2-day online bootcamp, for students and professionals"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workshop Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'professional', label: 'Professional', desc: 'Corporate style' },
              { value: 'casual', label: 'Casual', desc: 'Friendly approach' },
              { value: 'technical', label: 'Technical', desc: 'Developer focused' },
              { value: 'creative', label: 'Creative', desc: 'Inspiring tone' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTemplate(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  template === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Need inspiration? Try these examples:
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setDescription(example)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Workshop
              </>
            )}
          </button>

          <button
            onClick={handleGenerateWithTemplate}
            disabled={isLoading || !description.trim()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            With Template
          </button>

          {result && (
            <button
              onClick={reset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700 font-medium">Generation Failed</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {result?.success && result.workshop && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Workshop Generated Successfully!</span>
          </div>
          {result.warning && (
            <p className="text-green-600 mt-1">{result.warning}</p>
          )}
        </div>
      )}

      {/* Generated Workshop Preview */}
      {result?.success && result.workshop && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Workshop</h2>
          
          {/* Hero Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Hero Section</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900">{result.workshop.content.hero.title}</h4>
              <p className="text-gray-600 mt-1">{result.workshop.content.hero.subtitle}</p>
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg">
                {result.workshop.content.hero.cta_text}
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">About Section</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">{result.workshop.content.about.heading}</h4>
              <p className="text-gray-600 mt-1">{result.workshop.content.about.description}</p>
            </div>
          </div>

          {/* Agenda */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Agenda</h3>
            <div className="space-y-2">
              {result.workshop.content.agenda.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-gray-900">{item.topic}</span>
                      <p className="text-sm text-gray-600">{item.speaker}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Speakers */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Speakers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {result.workshop.content.speakers.map((speaker, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{speaker.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">FAQ</h3>
            <div className="space-y-3">
              {result.workshop.content.faq.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Call to Action</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-gray-900 mb-2">{result.workshop.content.cta.heading}</h4>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
                {result.workshop.content.cta.button_text}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Generation Details</h3>
            <div className="text-sm text-gray-600">
              <p>Generated: {new Date(result.workshop.metadata.generatedAt).toLocaleString()}</p>
              <p>Model: {result.workshop.metadata.model}</p>
              <p>Method: {result.workshop.metadata.generatedBy}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
