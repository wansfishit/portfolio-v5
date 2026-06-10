export const SITE_CONTENT_STORAGE_KEY = "portfolioSiteContent";
export const SITE_CONTENT_UPDATED_EVENT = "portfolioSiteContentUpdated";

export const DEFAULT_SITE_CONTENT = {
  home: {
    statusBadge: "Ready to Innovate",
    titleLine1: "Frontend",
    titleLine2: "Developer",
    typingWords: ["Network & Telecom Student", "Tech Enthusiast"],
    description: "Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital.",
    techStack: ["React", "Javascript", "Node.js", "Tailwind"],
    projectsButtonLabel: "Projects",
    contactButtonLabel: "Contact",
    githubUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    metaTitle: "Portfolio Website",
    metaDescription: "Website portfolio.",
    canonicalUrl: "",
  },
  about: {
    heading: "About Me",
    intro: "Transforming ideas into digital experiences",
    greeting: "Hello, I'm",
    name: "Nama Kamu",
    description: "Tulis deskripsi profil kamu di sini.",
    quote: "Keep learning and keep building.",
    photo: "/Photo.jpg",
    cvUrl: "",
    cvButtonLabel: "Download CV",
    projectButtonLabel: "View Projects",
    experienceStartDate: "2021-11-06",
  },
};

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const mergeSiteContent = (base, overrides) => {
  if (Array.isArray(base)) return Array.isArray(overrides) ? overrides : base;
  if (!isPlainObject(base)) return overrides ?? base;
  const result = { ...base };
  Object.keys(overrides || {}).forEach((key) => {
    result[key] = mergeSiteContent(base[key], overrides[key]);
  });
  return result;
};

export const readSiteContent = () => {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    return mergeSiteContent(DEFAULT_SITE_CONTENT, JSON.parse(raw));
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
};

export const writeSiteContent = (content) => {
  const nextContent = mergeSiteContent(DEFAULT_SITE_CONTENT, content);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(nextContent));
    window.dispatchEvent(new CustomEvent(SITE_CONTENT_UPDATED_EVENT, { detail: nextContent }));
  }
  return nextContent;
};
