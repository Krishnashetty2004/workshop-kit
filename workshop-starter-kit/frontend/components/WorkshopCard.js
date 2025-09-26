import { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, Star, ArrowRight } from 'lucide-react';

export default function WorkshopCard({ workshop, onRegister, onViewDetails }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (onRegister) {
      setIsLoading(true);
      try {
        await onRegister(workshop);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Workshop Image/Header */}
      <div 
        className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${workshop.theme?.primaryColor || '#8B5CF6'} 0%, ${workshop.theme?.secondaryColor || '#3B82F6'} 100%)`
        }}
      >
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">{workshop.title}</h3>
          <p className="text-purple-100">{workshop.category}</p>
        </div>
      </div>

      {/* Workshop Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {workshop.description}
        </p>

        {/* Workshop Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(workshop.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{workshop.time} ({workshop.duration})</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{workshop.attendees?.length || 0} / {workshop.maxAttendees} attendees</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-semibold text-green-600">
              {workshop.price === 0 ? 'Free' : formatPrice(workshop.price, workshop.currency)}
            </span>
          </div>
        </div>

        {/* Skills Tags */}
        {workshop.skills && workshop.skills.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {workshop.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {workshop.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{workshop.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Instructor */}
        {workshop.instructor && (
          <div className="mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-semibold">
                  {workshop.instructor.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{workshop.instructor.name}</p>
                <p className="text-sm text-gray-600">Instructor</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            workshop.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : workshop.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {workshop.status === 'published' ? 'Available' : 
             workshop.status === 'draft' ? 'Draft' : 'Unavailable'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {workshop.status === 'published' && (
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <DollarSign className="w-4 h-4 mr-2" />
              )}
              {workshop.price === 0 ? 'Register Free' : 'Register Now'}
            </button>
          )}
          
          <button
            onClick={() => onViewDetails && onViewDetails(workshop)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Details
          </button>
        </div>

        {/* Workshop Stats */}
        {workshop.testimonials && workshop.testimonials.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({workshop.testimonials.length} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
