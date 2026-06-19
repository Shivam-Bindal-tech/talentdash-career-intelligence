import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-airbnb-black font-sans">
      {/* Navigation Header */}
      <header className="border-b border-light-border bg-surface-bg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-coral text-white font-bold rounded-lg text-lg">
              T
            </div>
            <span className="font-bold text-xl tracking-tight text-airbnb-black">
              Talent<span className="text-coral">Dash</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/salaries"
              className="text-sm font-semibold text-soft-dark-gray hover:text-coral transition-colors"
            >
              Salaries
            </Link>
            <Link
              href="/compare"
              className="text-sm font-semibold text-soft-dark-gray hover:text-coral transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>

      {/* Main 404 Body */}
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-coral/10 text-coral flex items-center justify-center text-4xl font-extrabold select-none animate-bounce">
            404
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-airbnb-black tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-neutral-gray leading-relaxed">
              We couldn&apos;t find the company or page you were looking for. It might have been moved, renamed, or doesn&apos;t exist in our compensation database.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href="/salaries"
              className="bg-coral text-white text-sm font-bold h-11 px-6 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all shadow-sm"
            >
              Back to Salaries
            </Link>
            <Link
              href="/"
              className="border border-light-border bg-white text-soft-dark-gray text-sm font-bold h-11 px-6 rounded-lg flex items-center justify-center hover:bg-hover-gray transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border bg-surface-bg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-neutral-gray">
            &copy; {new Date().getFullYear()} TalentDash. All rights reserved. Confidential Engineering Trial.
          </p>
        </div>
      </footer>
    </div>
  );
}
