import { useRouter } from 'next/router';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function CancelPage() {
  const router = useRouter();
  const { workshop_id } = router.query;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your workshop registration was cancelled. No payment has been processed.
          </p>

          {/* Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Reasons for Cancellation</h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Changed your mind about the workshop</li>
              <li>• Found a scheduling conflict</li>
              <li>• Technical issues during checkout</li>
              <li>• Decided to register for a different workshop</li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
            <p className="text-blue-800 mb-4">
              If you experienced technical issues or have questions about the workshop, 
              we're here to help!
            </p>
            <div className="space-y-2 text-blue-800">
              <p>• Check your internet connection and try again</p>
              <p>• Contact us if you need assistance</p>
              <p>• Browse other available workshops</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {workshop_id && (
              <button
                onClick={() => router.push(`/workshop/${workshop_id}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              No charges were made to your payment method. If you see a pending charge, 
              it will be automatically released within 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
