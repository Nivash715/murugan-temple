import kolam from "@/assets/kolam-ornament.png";

const socialLinks = [
  {
    label: "Google Maps",
    href: "https://maps.app.goo.gl/Qz5nvCGZK2fLCfGe6",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://m.youtube.com/%40skanthanarul?fbclid=PAb21jcARNRpZleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAacD1TLsVOrPBbkwYNwx2cozITY_8Q3cEfRFWwh0_5GvcRhYCWqftKOFdqH8IA_aem_dE8LW_4Q0r7JaoNqhdn4VA",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M21.8 8.001a2.752 2.752 0 0 0-1.935-1.945C18.2 5.6 12 5.6 12 5.6s-6.2 0-7.865.456A2.752 2.752 0 0 0 2.2 8.001 28.8 28.8 0 0 0 1.75 12a28.8 28.8 0 0 0 .45 3.999 2.752 2.752 0 0 0 1.935 1.945C5.8 18.4 12 18.4 12 18.4s6.2 0 7.865-.456a2.752 2.752 0 0 0 1.935-1.945A28.8 28.8 0 0 0 22.25 12a28.8 28.8 0 0 0-.45-3.999zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skanthan_arul?igsh=azJleTBvbmlrdTkw",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-gradient-sanctum text-parchment overflow-hidden">
      {/* Decorative kolam right */}
      <img
        src={kolam}
        alt=""
        aria-hidden
        className="absolute -right-10 -bottom-10 w-44 opacity-20 animate-spin-slow pointer-events-none select-none"
      />
      {/* Decorative kolam left */}
      <img
        src={kolam}
        alt=""
        aria-hidden
        className="absolute -left-10 -bottom-10 w-44 opacity-20 animate-spin-slow pointer-events-none select-none"
        style={{ animationDirection: "reverse" }}
      />

      {/* Top gold divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-7">
        {/* Top section: Temple name and Social Links */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 mb-6">

          {/* Temple name */}
          <div className="flex flex-col items-center sm:items-start gap-0.5 text-center sm:text-left">
            <span className="font-display italic text-brass/70 tracking-[0.2em] text-[0.58rem] uppercase">
              Sri Subramaniyar Temple
            </span>
            <h2 className="font-tamil text-parchment font-bold text-base sm:text-lg leading-snug">
              ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியர் ஆலயம்
            </h2>
          </div>

          {/* Find Us Online */}
          <div className="flex flex-col items-center gap-2.5 shrink-0">
            <span className="font-display italic text-brass tracking-[0.2em] text-[0.62rem] uppercase">
              Find Us Online
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-parchment/10 border border-brass/30 text-brass hover:bg-brass hover:text-ink transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section: Links and Developer credit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[0.7rem] text-parchment/60">
            <span>© 2026 ஸ்ரீ சுப்ரமணியர் ஆலயம் . All Rights Reserved</span>
            <span className="text-brass/40"></span>
            <a href="#" className="text-brass/70 hover:text-brass transition-colors"></a>
            <span className="text-brass/40"></span>
            <a href="#" className="text-brass/70 hover:text-brass transition-colors"></a>
          </div>
          <span className="text-[0.7rem] text-parchment/60">
            Developed by{" "}
            <a
              href="https://www.dveininnovations.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass font-semibold hover:underline transition-all"
            >
              Dvein Innovation Pvt Ltd
            </a>
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-brass/20 to-transparent" />
    </footer>
  );
}
