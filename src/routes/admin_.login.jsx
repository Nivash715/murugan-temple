import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, User, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import logoImg from "@/assets/m12.jpeg";
import kolam from "@/assets/kolam-ornament.png";
import { useAuth } from "@/lib/admin-auth";
import { useContent as useSiteContent, useImage } from "@/lib/content-store";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "நிர்வாக நுழைவு — Admin Login" },
      {
        name: "description",
        content: "ஆலய இணைய நிர்வாக நுழைவு பக்கம். Admin login for the temple website content panel.",
      },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthed, login } = useAuth();
  const { content } = useSiteContent();
  const logoSrc = useImage("logo", logoImg);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in → go straight to the editor
  useEffect(() => {
    if (isAuthed) navigate({ to: "/admin" });
  }, [isAuthed, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = login(userId.trim(), password);
    setBusy(false);
    if (result.ok) {
      navigate({ to: "/admin" });
    } else {
      setError(result.error || "உள்நுழைவு தோல்வி (Login failed)");
    }
  };

  return (
    <div className="min-h-screen relative-z flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background ornaments — match site theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-parchment" />
      <img
        src={kolam}
        alt=""
        aria-hidden
        className="absolute -left-24 -top-24 w-[28rem] opacity-20 animate-spin-slow pointer-events-none"
      />
      <img
        src={kolam}
        alt=""
        aria-hidden
        className="absolute -right-24 -bottom-24 w-[28rem] opacity-15 animate-spin-slow pointer-events-none"
        style={{ animationDirection: "reverse" }}
      />

      {/* Back to public site */}
      <Link
        to="/"
        className="absolute top-5 left-5 inline-flex items-center gap-2 text-xs sm:text-sm text-brass-deep hover:text-vermillion font-tamil-sans transition-colors"
      >
        <ArrowLeft size={16} />
        முகப்புக்குத் திரும்பு · Back to home
      </Link>

      {/* Login card */}
      <div className="w-full max-w-md">
        <div className="ornament-divider mb-4">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em] text-brass-deep">
            ADMIN · நிர்வாகம்
          </span>
        </div>

        <div className="relative rounded-3xl border border-brass/30 bg-card/95 backdrop-blur-sm shadow-temple p-7 sm:p-9">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-brass/40 shadow-brass">
              <img src={logoSrc} alt="Temple logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-4 font-tamil text-2xl sm:text-3xl font-bold text-ink leading-tight">
              நிர்வாக நுழைவு
            </h1>
            <p className="mt-1 font-display italic text-base sm:text-lg text-brass-deep">
              Admin Sign-in
            </p>
            <p className="mt-3 font-tamil-sans text-xs sm:text-sm text-ink/60 max-w-xs">
              {content.header.titleTamil} · உள்ளடக்க மேலாண்மைக்கு உள்நுழையவும்.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="flex items-center gap-2 font-tamil-sans text-sm font-semibold text-ink/80">
                <User size={14} className="text-brass-deep" />
                பயனர் பெயர் <span className="text-ink/40 font-display italic">/ User ID</span>
              </span>
              <input
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-brass/40 bg-parchment/80 px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion transition"
                placeholder="உங்கள் பயனர் பெயர்"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 font-tamil-sans text-sm font-semibold text-ink/80">
                <Lock size={14} className="text-brass-deep" />
                கடவுச்சொல் <span className="text-ink/40 font-display italic">/ Password</span>
              </span>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-brass/40 bg-parchment/80 px-4 py-2.5 pr-11 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 my-auto inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink/60 hover:text-vermillion hover:bg-brass/10 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-xs sm:text-sm text-destructive font-tamil-sans">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold text-sm sm:text-base py-3 shadow-brass hover:shadow-temple disabled:opacity-60 transition-all"
            >
              <ShieldCheck size={16} className="text-parchment" />
              உள்நுழை · Sign in
            </button>
          </form>

          <p className="mt-6 text-[0.7rem] text-center text-ink/50 font-tamil-sans leading-relaxed">
            இது உள்ளடக்க நிர்வாகிகளுக்கான பாதுகாக்கப்பட்ட பகுதி.
            <br />
            Authorized personnel only — content management area.
          </p>
        </div>
      </div>
    </div>
  );
}
