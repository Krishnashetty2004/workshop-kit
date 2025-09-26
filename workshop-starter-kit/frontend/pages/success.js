import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Calendar, Clock, Users, Mail } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session_id) {
      fetchSessionDetails();
    }
  }, [session_id]);

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`/api/checkout/session/${session_id}`);
      const data = await response.json();
      
      if (data.success) {
        setSession(data.session);
      } else {
        setError('Failed to load session details');
      }
    } catch (err) {
      setError('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registration details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for registering for the workshop. You'll receive a confirmation email shortly.
          </p>

          {/* Workshop Details */}
          {session && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Workshop Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Workshop:</span>
                  <span className="font-medium">{session.workshopTitle || 'Your Workshop'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">
                    ${(session.amountTotal / 100).toFixed(2)} {session.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{session.customerEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="text-left space-y-2 text-blue-800">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Check your email for confirmation details
              </li>
              <li className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Add the workshop to your calendar
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                We'll send you a reminder 24 hours before
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Another Workshop
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
