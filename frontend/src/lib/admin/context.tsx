import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { http, setToken, getToken } from "@/lib/api";
import {
  impactStats as seedImpact,
  testimonials as seedTestimonials,
  programs as seedProgramsData,
  team as seedTeam,
  milestones as seedMilestones,
  newsPosts as seedNews,
  resources as seedResources,
  galleryAlbums as seedAlbums,
  partners as seedPartners,
  socialLinks,
} from "@/lib/constants";
import {
  imgs,
  programImages,
  programGallery,
  teamPhotos,
  newsImages,
  galleryImages,
  partnerImages,
} from "@/lib/images";
import nirmalaLogo from "@/assets/nirmala-logo.png";

/* ------------------------------------------------------------------ *
 * NOTE: This is a FRONTEND-ONLY mock. Auth and content are persisted
 * to localStorage so the admin panel is fully functional without a
 * backend. Swap these providers for real API calls later — every
 * consumer reads through the hooks below, so it's a single-point change.
 * ------------------------------------------------------------------ */

// Demo credentials (frontend-only)
export const DEMO_EMAIL = "admin@nirmala.org";
export const DEMO_PASSWORD = "admin123";

const SESSION_KEY = "nf_admin_session_v1";
const CONTENT_KEY = "nf_admin_home_v1";

const uid = () => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* ignore */
  }
  return `id_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
};

/* ----------------------------- Types ----------------------------- */

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
};

export type ImpactStat = {
  id: string;
  label: string;
  value: number;
  suffix: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export type ProgramHighlight = { value: string; label: string };

export type AdminProgram = {
  id: string;
  title: string;
  slug: string;
  icon: string; // emoji
  color: string; // hex
  tagline: string;
  desc: string; // short summary
  image: string; // main image (URL or data URL)
  body: string; // rich text HTML
  goals: string[];
  highlights: ProgramHighlight[];
  gallery: string[];
  donateSlug: string;
  published: boolean;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export type TeamMember = { id: string; name: string; role: string; bio: string; photo: string };

export type Milestone = { id: string; year: string; title: string; desc: string };

export type Story = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  excerpt: string;
  readTime: string;
  image: string;
  body: string; // rich text HTML
  published: boolean;
};

export type InvolveWay = { id: string; icon: string; title: string; text: string; cta: string };

export type AboutContent = {
  heroTitle: string;
  heroSubtitle: string;
  founderName: string;
  founderRole: string;
  founderImage: string;
  founderStory: string; // rich text HTML
  founderHonours: string[];
  mission: string;
  vision: string;
  values: string;
};

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  mapEmbed: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  logo: string;
  primaryColor: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export type FooterLink = { id: string; label: string; url: string };

export type FooterContent = {
  aboutText: string;
  newsletterHeading: string;
  newsletterText: string;
  copyright: string;
  legalLinks: FooterLink[];
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  url: string;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  color: string;
  cover: string;
  images: string[];
};

export type PartnerItem = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  region: string;
  type: string;
  since: string;
  areas: string[];
  url: string;
  color: string;
  logo: string;
  featured: boolean;
};

export type HomeContent = {
  heroSlides: HeroSlide[];
  impactStats: ImpactStat[];
  testimonials: Testimonial[];
  programs: AdminProgram[];
  about: AboutContent;
  team: TeamMember[];
  milestones: Milestone[];
  stories: Story[];
  getInvolved: InvolveWay[];
  contactInfo: ContactInfo;
  settings: SiteSettings;
  footer: FooterContent;
  resources: Resource[];
  galleryAlbums: GalleryAlbum[];
  partners: PartnerItem[];
};

/** Keys of HomeContent whose value is an orderable array of `{ id }` items. */
export type ArrayContentKey =
  | "heroSlides"
  | "impactStats"
  | "testimonials"
  | "programs"
  | "team"
  | "milestones"
  | "stories"
  | "getInvolved"
  | "resources"
  | "galleryAlbums"
  | "partners";

/* --------------------------- Seed data --------------------------- */

function defaultContent(): HomeContent {
  return {
    heroSlides: [
      {
        id: uid(),
        eyebrow: "Nirmala Foundation · Nepal",
        title: "More than support — we build belonging.",
        text: "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal — through sport, the arts, education and mobility.",
        image: imgs.founderCommunity,
      },
      {
        id: uid(),
        eyebrow: "Adaptive Sports",
        title: "Every person deserves a place to play.",
        text: "From wheelchair basketball to para-badminton, sport is how many Nepalis with disabilities step into public life for the first time.",
        image: imgs.heroAthlete,
      },
      {
        id: uid(),
        eyebrow: "Inclusion is a right",
        title: "Breaking barriers, inspiring futures.",
        text: "Globally, 1 in 6 people live with a disability. We build the pathways — mobility, education and health — that turn ability into opportunity.",
        image: imgs.heroJoy,
      },
    ],
    impactStats: seedImpact.map((s) => ({ id: uid(), ...s })),
    testimonials: seedTestimonials.map((t) => ({ id: uid(), ...t })),
    programs: seedProgramsData.map((p) => ({
      id: uid(),
      title: p.title,
      slug: p.slug,
      icon: p.icon,
      color: p.color,
      tagline: p.tagline,
      desc: p.desc,
      image: programImages[p.slug] ?? "",
      body: p.philosophy.map((para) => `<p>${para}</p>`).join(""),
      goals: [...p.goals],
      highlights: p.highlights.map((h) => ({ value: String(h.value), label: h.label })),
      gallery: programGallery[p.slug] ?? [],
      donateSlug: p.donateSlug,
      published: true,
      seoTitle: `${p.title} — Nirmala Foundation Nepal`,
      seoDescription: p.desc,
      seoKeywords: `${p.title}, disability inclusion Nepal, ${p.slug.replace(/-/g, " ")}`,
    })),
    about: {
      heroTitle: "Building belonging across Nepal.",
      heroSubtitle:
        "A Kathmandu-based foundation working on disability inclusion through sports, arts, education and mobility — founded and led by people with lived experience.",
      founderName: "Nirmala Bhandari",
      founderRole: "Founder & Executive Director",
      founderImage: imgs.founderAbout,
      founderStory:
        "<p>The Nirmala Foundation Nepal was founded in January 2024 by <strong>Nirmala Bhandari</strong> — a woman with a disability whose own life is the reason this organisation exists. From her early years as a resident of the Hope Centre, she refused to let circumstance decide what she could become.</p><p>Today she is a national wheelchair basketball player and para-powerlifter, a <strong>Miss Disability Queen</strong>, a UN Women Nepal honoree, and was named to the <strong>D-30 Disability Impact List 2025</strong>.</p>",
      founderHonours: [
        "National wheelchair basketball player",
        "Para-powerlifter",
        "Miss Disability Queen",
        "UN Women Nepal honoree",
        "D-30 Disability Impact List 2025",
      ],
      mission:
        "To empower people with disabilities in Nepal through inclusive sports, arts, education, and mobility.",
      vision: "A Nepal where every person — regardless of ability — belongs, contributes, and thrives.",
      values: "Dignity, accessibility, joy, community, and unwavering advocacy.",
    },
    team: seedTeam.map((t, i) => ({ id: uid(), ...t, photo: teamPhotos[i % teamPhotos.length] })),
    milestones: seedMilestones.map((m) => ({ id: uid(), ...m })),
    stories: seedNews.map((n) => ({
      id: uid(),
      title: n.title,
      slug: n.slug,
      category: n.category,
      date: n.date,
      excerpt: n.excerpt,
      readTime: n.readTime,
      image: newsImages[n.slug] ?? "",
      body: `<p>${n.excerpt}</p>`,
      published: true,
    })),
    getInvolved: [
      { id: uid(), icon: "🙌", title: "Volunteer", text: "Give your time at camps, tournaments, and tutoring circles across the Kathmandu Valley.", cta: "Become a volunteer" },
      { id: uid(), icon: "🤝", title: "Partner with us", text: "Organisations and schools can co-design inclusive programmes and share resources.", cta: "Start a partnership" },
      { id: uid(), icon: "💛", title: "Donate", text: "Fund wheelchairs, equipment, school supplies, and rural health camps.", cta: "Make a donation" },
      { id: uid(), icon: "📣", title: "Fundraise", text: "Run a campaign among friends, family, or colleagues to support our work.", cta: "Start fundraising" },
    ],
    contactInfo: {
      address: "Kathmandu, Nepal",
      phone: "+977 9800000000",
      email: "info@nirmalafoundation.org.np",
      whatsapp: "9779800000000",
      hours: "Sun–Fri, 10:00 AM – 5:00 PM",
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.69%2C85.34%2C27.72&layer=mapnik",
      facebook: socialLinks.facebook,
      instagram: socialLinks.instagram,
      youtube: socialLinks.youtube,
      linkedin: socialLinks.linkedin,
    },
    settings: {
      siteName: "Nirmala Foundation Nepal",
      tagline: "Breaking Barriers, Building Belonging",
      description:
        "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
      logo: nirmalaLogo,
      primaryColor: "#5B2C86",
      seoTitle: "Nirmala Foundation Nepal — Breaking Barriers, Building Belonging",
      seoDescription:
        "Empowering people with disabilities through sports, arts, education & mobility in Nepal.",
      seoKeywords: "disability inclusion Nepal, adaptive sports, Nirmala Foundation, Kathmandu NGO",
    },
    footer: {
      aboutText:
        "Empowering communities, breaking barriers, and inspiring futures for people with disabilities across Nepal.",
      newsletterHeading: "Add hope to your inbox",
      newsletterText:
        "Monthly stories from the field, program updates, and simple ways to get involved — straight to you.",
      copyright: "© 2025 Nirmala Foundation Nepal. Registered NGO, Nepal.",
      legalLinks: [
        { id: uid(), label: "Privacy Policy", url: "#" },
        { id: uid(), label: "Terms", url: "#" },
      ],
    },
    resources: seedResources.map((r) => ({ id: uid(), ...r, url: "#" })),
    galleryAlbums: seedAlbums.map((a) => ({
      id: uid(),
      title: a.title,
      slug: a.slug,
      color: a.color,
      cover: galleryImages[a.slug] ?? "",
      images: [],
    })),
    partners: seedPartners.map((p) => ({
      id: uid(),
      name: p.name,
      tagline: p.tagline,
      desc: p.desc,
      region: p.region,
      type: p.type,
      since: p.since,
      areas: [...p.areas],
      url: p.url,
      color: p.color,
      logo: partnerImages[p.name] ?? "",
      featured: !!p.featured,
    })),
  };
}

/* --------------------------- Auth ctx ---------------------------- */

type AuthUser = { email: string; name: string };

type AuthCtx = {
  user: AuthUser | null;
  isAuthed: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

/** Frontend content-collection key → backend REST resource path. */
const ENDPOINTS: Record<ArrayContentKey, string> = {
  heroSlides: "hero-slides",
  impactStats: "impact-stats",
  testimonials: "testimonials",
  programs: "programs",
  team: "team",
  milestones: "milestones",
  stories: "stories",
  getInvolved: "involve-ways",
  resources: "resources",
  galleryAlbums: "gallery-albums",
  partners: "partners",
};

const AuthContext = createContext<AuthCtx | null>(null);

/* -------------------------- Content ctx -------------------------- */

type ContentCtx = {
  content: HomeContent;
  // Hero slides
  addHeroSlide: (s: Omit<HeroSlide, "id">) => void;
  updateHeroSlide: (id: string, s: Omit<HeroSlide, "id">) => void;
  removeHeroSlide: (id: string) => void;
  // Impact stats
  addImpactStat: (s: Omit<ImpactStat, "id">) => void;
  updateImpactStat: (id: string, s: Omit<ImpactStat, "id">) => void;
  removeImpactStat: (id: string) => void;
  // Testimonials
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, t: Omit<Testimonial, "id">) => void;
  removeTestimonial: (id: string) => void;
  // Programs
  addProgram: (p: Omit<AdminProgram, "id">) => void;
  updateProgram: (id: string, p: Omit<AdminProgram, "id">) => void;
  removeProgram: (id: string) => void;
  // About (scalar fields)
  setAbout: (patch: Partial<AboutContent>) => void;
  // Team
  addTeam: (t: Omit<TeamMember, "id">) => void;
  updateTeam: (id: string, t: Omit<TeamMember, "id">) => void;
  removeTeam: (id: string) => void;
  // Milestones
  addMilestone: (m: Omit<Milestone, "id">) => void;
  updateMilestone: (id: string, m: Omit<Milestone, "id">) => void;
  removeMilestone: (id: string) => void;
  // Stories
  addStory: (s: Omit<Story, "id">) => void;
  updateStory: (id: string, s: Omit<Story, "id">) => void;
  removeStory: (id: string) => void;
  // Get involved
  addInvolve: (w: Omit<InvolveWay, "id">) => void;
  updateInvolve: (id: string, w: Omit<InvolveWay, "id">) => void;
  removeInvolve: (id: string) => void;
  // Contact info (scalar fields)
  setContactInfo: (patch: Partial<ContactInfo>) => void;
  // Settings & footer (scalar objects)
  setSettings: (patch: Partial<SiteSettings>) => void;
  setFooter: (patch: Partial<FooterContent>) => void;
  // Resources
  addResource: (r: Omit<Resource, "id">) => void;
  updateResource: (id: string, r: Omit<Resource, "id">) => void;
  removeResource: (id: string) => void;
  // Gallery albums
  addAlbum: (a: Omit<GalleryAlbum, "id">) => void;
  updateAlbum: (id: string, a: Omit<GalleryAlbum, "id">) => void;
  removeAlbum: (id: string) => void;
  // Partners
  addPartner: (p: Omit<PartnerItem, "id">) => void;
  updatePartner: (id: string, p: Omit<PartnerItem, "id">) => void;
  removePartner: (id: string) => void;
  // Ordering (works on any array collection key)
  move: (collection: ArrayContentKey, id: string, dir: -1 | 1) => void;
  resetAll: () => void;
};

const ContentContext = createContext<ContentCtx | null>(null);

/* ------------------------- Provider ------------------------------ */

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  // Seeded with local defaults so the public UI renders instantly, then the
  // real content from the backend replaces it once fetched.
  const [content, setContent] = useState<HomeContent>(() => defaultContent());

  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const settingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /** Fetch every collection + singleton from the backend (public reads). */
  const fetchAll = useCallback(async () => {
    const q = "?limit=500&sort=order";
    const opt = { auth: false } as const;
    const [settings, hero, impact, testi, progs, team, miles, stories, involve, resc, albums, prtnrs] =
      await Promise.all([
        http.get<Record<string, any>>("/settings", opt).catch(() => null),
        http.get<any[]>(`/hero-slides${q}`, opt).catch(() => null),
        http.get<any[]>(`/impact-stats${q}`, opt).catch(() => null),
        http.get<any[]>(`/testimonials${q}`, opt).catch(() => null),
        http.get<any[]>(`/programs${q}`, opt).catch(() => null),
        http.get<any[]>(`/team${q}`, opt).catch(() => null),
        http.get<any[]>(`/milestones${q}`, opt).catch(() => null),
        http.get<any[]>(`/stories${q}`, opt).catch(() => null),
        http.get<any[]>(`/involve-ways${q}`, opt).catch(() => null),
        http.get<any[]>(`/resources${q}`, opt).catch(() => null),
        http.get<any[]>(`/gallery-albums${q}`, opt).catch(() => null),
        http.get<any[]>(`/partners${q}`, opt).catch(() => null),
      ]);
    setContent((c) => ({
      ...c,
      heroSlides: hero ?? c.heroSlides,
      impactStats: impact ?? c.impactStats,
      testimonials: testi ?? c.testimonials,
      programs: progs ?? c.programs,
      team: team ?? c.team,
      milestones: miles ?? c.milestones,
      stories: stories ?? c.stories,
      getInvolved: involve ?? c.getInvolved,
      resources: resc ?? c.resources,
      galleryAlbums: albums ?? c.galleryAlbums,
      partners: prtnrs ?? c.partners,
      settings: settings?.site ? { ...c.settings, ...settings.site } : c.settings,
      about: settings?.about ? { ...c.about, ...settings.about } : c.about,
      contactInfo: settings?.contact ? { ...c.contactInfo, ...settings.contact } : c.contactInfo,
      footer: settings?.footer ? { ...c.footer, ...settings.footer } : c.footer,
    }));
  }, []);

  // On mount: restore session (if a token exists) then load content.
  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          const u = await http.get<AuthUser>("/auth/me");
          setUser(u);
        } catch {
          setToken(null);
        }
      }
      await fetchAll().catch(() => {});
      setReady(true);
    })();
  }, [fetchAll]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await http.post<{ token: string; user: AuthUser }>(
        "/auth/login",
        { email, password },
        { auth: false },
      );
      setToken(res.token);
      setUser(res.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Sign in failed" };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    http.post("/auth/logout").catch(() => {});
  }, []);

  const authValue = useMemo<AuthCtx>(
    () => ({ user, isAuthed: !!user, ready, login, logout }),
    [user, ready, login, logout],
  );

  // API-backed collection mutators. Each hits the backend, then reconciles
  // local state with the server's response (source of truth).
  const contentValue = useMemo<ContentCtx>(() => {
    const addTo = async (key: ArrayContentKey, item: unknown) => {
      try {
        const doc = await http.post<any>(`/${ENDPOINTS[key]}`, item);
        setContent((c) => ({ ...c, [key]: [...(c[key] as any[]), doc] }));
      } catch (e) {
        console.error(`add ${key}`, e);
      }
    };
    const updateIn = async (key: ArrayContentKey, id: string, patch: unknown) => {
      try {
        const doc = await http.patch<any>(`/${ENDPOINTS[key]}/${id}`, patch);
        setContent((c) => ({ ...c, [key]: (c[key] as any[]).map((it) => (it.id === id ? doc : it)) }));
      } catch (e) {
        console.error(`update ${key}`, e);
      }
    };
    const removeFrom = async (key: ArrayContentKey, id: string) => {
      try {
        await http.delete(`/${ENDPOINTS[key]}/${id}`);
        setContent((c) => ({ ...c, [key]: (c[key] as any[]).filter((it) => it.id !== id) }));
      } catch (e) {
        console.error(`remove ${key}`, e);
      }
    };
    // Debounced save for singleton sections (about/contact/site/footer).
    const saveSetting = (backendKey: string, field: keyof HomeContent) => {
      clearTimeout(settingTimers.current[backendKey]);
      settingTimers.current[backendKey] = setTimeout(() => {
        http.put(`/settings/${backendKey}`, contentRef.current[field]).catch((e) => console.error("save setting", e));
      }, 500);
    };

    return {
      content,
      addHeroSlide: (s) => addTo("heroSlides", s),
      updateHeroSlide: (id, s) => updateIn("heroSlides", id, s),
      removeHeroSlide: (id) => removeFrom("heroSlides", id),
      addImpactStat: (s) => addTo("impactStats", s),
      updateImpactStat: (id, s) => updateIn("impactStats", id, s),
      removeImpactStat: (id) => removeFrom("impactStats", id),
      addTestimonial: (t) => addTo("testimonials", t),
      updateTestimonial: (id, t) => updateIn("testimonials", id, t),
      removeTestimonial: (id) => removeFrom("testimonials", id),
      addProgram: (p) => {
        addTo("programs", p);
      },
      updateProgram: (id, p) => updateIn("programs", id, p),
      removeProgram: (id) => removeFrom("programs", id),
      setAbout: (patch) => {
        setContent((c) => ({ ...c, about: { ...c.about, ...patch } }));
        saveSetting("about", "about");
      },
      addTeam: (t) => addTo("team", t),
      updateTeam: (id, t) => updateIn("team", id, t),
      removeTeam: (id) => removeFrom("team", id),
      addMilestone: (m) => addTo("milestones", m),
      updateMilestone: (id, m) => updateIn("milestones", id, m),
      removeMilestone: (id) => removeFrom("milestones", id),
      addStory: (s) => addTo("stories", s),
      updateStory: (id, s) => updateIn("stories", id, s),
      removeStory: (id) => removeFrom("stories", id),
      addInvolve: (w) => addTo("getInvolved", w),
      updateInvolve: (id, w) => updateIn("getInvolved", id, w),
      removeInvolve: (id) => removeFrom("getInvolved", id),
      setContactInfo: (patch) => {
        setContent((c) => ({ ...c, contactInfo: { ...c.contactInfo, ...patch } }));
        saveSetting("contact", "contactInfo");
      },
      setSettings: (patch) => {
        setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }));
        saveSetting("site", "settings");
      },
      setFooter: (patch) => {
        setContent((c) => ({ ...c, footer: { ...c.footer, ...patch } }));
        saveSetting("footer", "footer");
      },
      addResource: (r) => addTo("resources", r),
      updateResource: (id, r) => updateIn("resources", id, r),
      removeResource: (id) => removeFrom("resources", id),
      addAlbum: (a) => addTo("galleryAlbums", a),
      updateAlbum: (id, a) => updateIn("galleryAlbums", id, a),
      removeAlbum: (id) => removeFrom("galleryAlbums", id),
      addPartner: (p) => addTo("partners", p),
      updatePartner: (id, p) => updateIn("partners", id, p),
      removePartner: (id) => removeFrom("partners", id),
      move: (collection, id, dir) => {
        const arr = [...(contentRef.current[collection] as any[])];
        const i = arr.findIndex((it) => it.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setContent((c) => ({ ...c, [collection]: arr }));
        http
          .patch(`/${ENDPOINTS[collection]}/reorder`, { items: arr.map((it, idx) => ({ id: it.id, order: idx })) })
          .catch((e) => console.error("reorder", e));
      },
      resetAll: () => {
        fetchAll().catch(() => {});
      },
    };
  }, [content, fetchAll]);

  return (
    <AuthContext.Provider value={authValue}>
      <ContentContext.Provider value={contentValue}>{children}</ContentContext.Provider>
    </AuthContext.Provider>
  );
}

/** Convenience read-only hook for public pages. */
export function useContent() {
  return useHomeContent().content;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AdminProvider");
  return ctx;
}

export function useHomeContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useHomeContent must be used within AdminProvider");
  return ctx;
}
