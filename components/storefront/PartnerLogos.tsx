export function PartnerLogos() {
  const partners = [
    { name: "ICA", bg: "bg-gray-100 text-gray-800 border-gray-300 font-extrabold" },
    { name: "Bizrate", bg: "bg-blue-50 text-blue-800 border-blue-200 font-bold" },
    { name: "GeoTrust", bg: "bg-blue-900 text-white border-blue-950 font-black tracking-wider" },
  ];

  const payments = [
    { name: "WESTERN UNION", bg: "bg-yellow-400 text-black border-yellow-500 font-black" },
    { name: "VISA", bg: "bg-blue-50 text-blue-900 border-blue-200 font-extrabold italic" },
    { name: "Mastercard", bg: "bg-red-50 text-orange-600 border-orange-200 font-bold" },
    { name: "Amex", bg: "bg-sky-50 text-sky-700 border-sky-200 font-bold" },
    { name: "Discover", bg: "bg-orange-50 text-orange-700 border-orange-200 font-bold" },
    { name: "PayPal", bg: "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold italic" },
    { name: "Bank Transfer", bg: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold" },
    { name: "WeChat Pay", bg: "bg-green-500 text-white border-green-600 font-bold" },
    { name: "Alipay", bg: "bg-sky-500 text-white border-sky-600 font-bold" },
  ];

  const socials = [
    { name: "Facebook", color: "bg-blue-600 text-white" },
    { name: "Pinterest", color: "bg-red-600 text-white" },
    { name: "Instagram", color: "bg-pink-500 text-white" },
    { name: "Twitter", color: "bg-sky-400 text-white" },
  ];

  return (
    <section className="py-12 px-6 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto text-center">
        {/* Partners */}
        <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mb-6">
          Partners and Trust
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {partners.map((p) => (
            <div
              key={p.name}
              className={`h-11 px-6 border rounded-md flex items-center justify-center text-sm ${p.bg}`}
            >
              {p.name}
            </div>
          ))}
          <div className="flex gap-2">
            {socials.map((s) => (
              <div
                key={s.name}
                className={`w-11 h-11 rounded-md flex items-center justify-center text-xs font-semibold ${s.color}`}
              >
                {s.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Payments */}
        <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mb-6">
          Accepted Payments
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {payments.map((p) => (
            <div
              key={p.name}
              className={`h-10 px-5 border rounded flex items-center justify-center text-xs tracking-wide ${p.bg}`}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
