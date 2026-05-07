import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/m12.jpeg";
import { useContent, useImage } from "@/lib/content-store";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { content } = useContent();
  const { titleTamil, titleEn, nav } = content.header;
  const logoSrc = useImage("logo", logoImg);

  return (
    <header className="relative-z sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-[#A52A2A] to-[#cc7722] border-b border-parchment/20">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo (admin entrance) and title (home) are now SEPARATE links */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Logo image → admin login */}
          <Link
            to="/admin/login"
            aria-label="Admin login"
            title="நிர்வாக நுழைவு / Admin login"
            className="group block"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-3xl border border-parchment/30 bg-parchment/10 shadow-sm ring-0 group-hover:ring-2 group-hover:ring-parchment/40 transition">
              <img
                src={logoSrc}
                alt="Temple logo"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          {/* Temple title → home */}
          <Link to="/" className="leading-tight group">
            <div className="font-tamil text-base sm:text-lg font-bold text-parchment group-hover:text-parchment/90">
              {titleTamil}
            </div>
            <div className="font-display italic text-[0.65rem] sm:text-xs text-parchment/75 tracking-widest">
              {titleEn}
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "!bg-parchment/20 !border-parchment/40" }}
              className="group flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border border-transparent hover:bg-parchment/10 hover:border-parchment/30 transition-all"
            >
              <span className="font-tamil text-[0.8rem] xl:text-sm font-semibold text-parchment/90 leading-none">
                {item.label}
              </span>
              <span className="font-display italic text-[0.55rem] xl:text-[0.6rem] text-parchment/70 tracking-wider leading-none">
                {item.sub}
              </span>
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 rounded-md border border-parchment/40 text-parchment"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-parchment/20 bg-gradient-to-r from-[#b8491b] to-[#8b3a15] backdrop-blur">
          <nav className="px-4 py-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "!bg-parchment/20 !border-parchment/40" }}
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl border border-parchment/30 bg-parchment/10 hover:bg-parchment/20 transition-all text-center"
              >
                <span className="font-tamil text-xs font-semibold text-parchment leading-tight">
                  {item.label}
                </span>
                <span className="font-display italic text-[0.6rem] text-parchment/70 tracking-wider leading-none">
                  {item.sub}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
