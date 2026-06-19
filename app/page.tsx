import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-airbnb-black font-sans">
      {/* Navigation Header */}
      <header className="border-b border-light-border bg-surface-bg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-coral text-white font-bold rounded-lg text-lg">
              T
            </div>
            <span className="font-bold text-xl tracking-tight text-airbnb-black">
              Talent<span className="text-coral">Dash</span>
            </span>
          </div>
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
            <Link
              href="/salaries"
              className="bg-coral text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
            >
              Explore Data
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex self-center sm:self-start items-center gap-2 bg-coral/10 text-coral font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping"></span>
                Structured Compensation Intelligence
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-airbnb-black">
                Decision-Ready <br />
                <span className="text-coral">Career Intelligence</span> at Scale.
              </h1>
              <p className="text-lg sm:text-xl text-soft-dark-gray leading-relaxed max-w-2xl">
                TalentDash is not a job board. We provide structured, comparable, and verified compensation analytics. Make your next career leap backed by hard data.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href="/salaries"
                  className="flex items-center justify-center h-12 px-6 rounded-lg bg-coral text-white font-bold text-base hover:bg-opacity-90 transition-all shadow-md hover:translate-y-[-1px] active:translate-y-0"
                >
                  Explore Salaries
                </Link>
                <Link
                  href="/compare"
                  className="flex items-center justify-center h-12 px-6 rounded-lg border border-light-border bg-surface-bg text-soft-dark-gray font-bold text-base hover:bg-hover-gray transition-all"
                >
                  Compare Offers
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-light-border mt-6">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-airbnb-black">65+</p>
                  <p className="text-xs sm:text-sm text-neutral-gray font-medium">Verified Records</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-airbnb-black">12</p>
                  <p className="text-xs sm:text-sm text-neutral-gray font-medium">Top Tier Tech Firms</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-airbnb-black">100%</p>
                  <p className="text-xs sm:text-sm text-neutral-gray font-medium">Structured Schema</p>
                </div>
              </div>
            </div>

            {/* Feature Cards Column */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
              <div className="bg-surface-bg p-6 rounded-xl border border-light-border shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-lg text-airbnb-black mb-1">Standardized Level Badges</h3>
                  <p className="text-sm text-soft-dark-gray leading-relaxed">
                    Compare L3 SDE-I positions up to Principal roles seamlessly across companies using our strict indexing engine.
                  </p>
                </div>
              </div>

              <div className="bg-surface-bg p-6 rounded-xl border border-light-border shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-success-green flex items-center justify-center shrink-0 font-bold">
                  $
                </div>
                <div>
                  <h3 className="font-bold text-lg text-airbnb-black mb-1">Currency Flexibility</h3>
                  <p className="text-sm text-soft-dark-gray leading-relaxed">
                    Toggle instantly between INR (with Lakhs/Crores formatting) and USD for global compensation comparisons.
                  </p>
                </div>
              </div>

              <div className="bg-surface-bg p-6 rounded-xl border border-light-border shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0 font-bold">
                  SEO
                </div>
                <div>
                  <h3 className="font-bold text-lg text-airbnb-black mb-1">SEO & Speed Optimized</h3>
                  <p className="text-sm text-soft-dark-gray leading-relaxed">
                    Built for speed (LCP &lt; 2s) and pre-packed with JSON-LD structured data for direct search engine visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border bg-surface-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-gray">
            &copy; {new Date().getFullYear()} TalentDash. All rights reserved. Confidential Engineering Trial.
          </p>
          <div className="flex gap-4">
            <Link href="/salaries" className="text-xs text-neutral-gray hover:text-coral transition-colors">
              Salaries Table
            </Link>
            <Link href="/compare" className="text-xs text-neutral-gray hover:text-coral transition-colors">
              Comparison Engine
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
