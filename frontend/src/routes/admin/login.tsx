import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import nirmalaLogo from "@/assets/nirmala-logo.png";
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from "@/lib/admin/context";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Sign in | Nirmala Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthed, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already signed in? Skip the form.
  useEffect(() => {
    if (ready && isAuthed) navigate({ to: "/admin" });
  }, [ready, isAuthed, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate({ to: "/admin" });
    else setError(res.error ?? "Sign in failed.");
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block aurora-deep">
        <div className="grain absolute inset-0" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <img src={nirmalaLogo} alt="" className="h-11 w-11 rounded-xl bg-white/10 object-contain p-1" />
            <span className="font-display text-lg font-bold">Nirmala Foundation</span>
          </div>
          <div className="max-w-md">
            <div className="eyebrow text-accent-light">Content Admin</div>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-white">
              Manage your story, all in one place.
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Update the homepage, programs, and stories that power inclusion for Nepalis with
              disabilities — no code required.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ShieldCheck className="h-4 w-4" /> Secure content management
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <img src={nirmalaLogo} alt="" className="mb-4 h-12 w-12 rounded-xl object-contain" />
          </div>
          <div className="eyebrow text-accent">Welcome back</div>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Sign in to Admin</h2>
          <p className="mt-2 text-sm text-text/65">Enter your credentials to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Email address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text/40" style={{ width: 18, height: 18 }} />
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nirmala.org"
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-colors placeholder:text-text/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" style={{ width: 18, height: 18 }} />
                <input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-text/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-text/50 hover:bg-muted hover:text-ink"
                >
                  {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2.5 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo hint (frontend-only) */}
          <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-sm">
            <div className="mb-1 font-semibold text-ink">Demo credentials</div>
            <p className="text-text/70">
              Email: <span className="font-mono-stat text-ink">{DEMO_EMAIL}</span>
              <br />
              Password: <span className="font-mono-stat text-ink">{DEMO_PASSWORD}</span>
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-accent"
            >
              Fill in demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
