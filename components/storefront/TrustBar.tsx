export function TrustBar() {
  const BADGES = [
    "Natural Gemstones",
    "Since 2005",
    "150+ Gem Types",
    "Worldwide Shipping",
    "30-Day Returns",
  ];

  return (
    <section className="bg-[#F3F4F6] border-y border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {BADGES.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-[#006B3F] font-extrabold flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
