'use client'

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Workshop, WorkshopPrompt } from '../types';
import { generateWorkshopWithAI } from '../lib/api';
import { Navigation } from './layout/Navigation';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input, Textarea } from './ui/Input';
import { EXAMPLE_PROMPTS, TONE_OPTIONS, PRICE_RANGE_OPTIONS } from '../lib/constants';

interface Props {
  onWorkshopGenerated: (workshop: Workshop) => void;
  onBack: () => void;
}

export default function WorkshopGenerator({ onWorkshopGenerated, onBack }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'inspiring' | 'technical'>('professional');
  const [priceRange, setPriceRange] = useState<'free' | 'budget' | 'premium' | 'enterprise'>('premium');
  const [targetAudience, setTargetAudience] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const workshopPrompt: WorkshopPrompt = {
        prompt: prompt.trim(),
        tone: selectedTone,
        priceRange: priceRange,
        targetAudience: targetAudience.trim() || undefined
      };

      const workshop = await generateWorkshopWithAI(workshopPrompt);
      onWorkshopGenerated(workshop);
    } catch (error) {
      console.error('Failed to generate workshop:', error);
      setError('Failed to generate workshop. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="max-w-4xl mx-auto">
          <Navigation 
            onBack={onBack}
            title="Create Your Workshop"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Describe Your Workshop
            </CardTitle>
            <p className="text-gray-600">
              Tell us about your workshop and we'll create everything you need
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Textarea
              label="Workshop Description"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your workshop - what will you teach, who is it for, what will attendees learn?"
              className="h-32"
            />

            {/* Example Prompts */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Need inspiration? Try these examples:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Target Audience (Optional)"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Beginners, Professionals, Students, Entrepreneurs"
            />

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Workshop Tone
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TONE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedTone(value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTone === value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRICE_RANGE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPriceRange(value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      priceRange === value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              loading={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI is creating your workshop...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Workshop with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
