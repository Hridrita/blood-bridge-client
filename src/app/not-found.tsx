'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6 text-black">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        
        
        
        
        <h1 className="text-6xl font-black text-red-600 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">Page Not Found</h2>
        
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          The link you followed might be broken, or the page may have been removed. 
          Let's get you back on track to save lives!
        </p>

       
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="w-full bg-red-600 text-white font-semibold p-3 rounded-xl text-sm transition hover:bg-red-700 shadow-sm"
        >
           Go to Login Page
        </button>

      </div>
    </div>
  );
}