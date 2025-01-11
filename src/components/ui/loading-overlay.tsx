import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
        <p className="mt-6 text-lg font-medium text-gray-900">{message}</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we process your request.</p>
      </div>
    </div>
  );
}