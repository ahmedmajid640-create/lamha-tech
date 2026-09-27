/**
 * CMS model: Leadership (name, role, approved biography, portrait, profile link, display status).
 * Biographies and portraits are intentionally null until approved content is supplied.
 * Never fabricate biographies.
 */
export type Leader = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  /** Approved biography. null renders a "biography coming soon" placeholder. */
  bio: string | null;
  /** Approved portrait path (public/). null renders an initials placeholder. */
  portrait: string | null;
  profileUrl: string | null;
  featured: boolean;
  status: "published" | "draft";
};

export const leadership: Leader[] = [
  {
    slug: "syeda-laiba-haider",
    name: "Syeda Laiba Haider",
    role: "Founder",
    initials: "SL",
    bio: null,
    portrait: null,
    profileUrl: null,
    featured: true,
    status: "published",
  },
  {
    slug: "ahmed-majid",
    name: "Ahmed Majid",
    role: "Co-Founder",
    initials: "AM",
    bio: null,
    portrait: null,
    profileUrl: null,
    featured: false,
    status: "published",
  },
  {
    slug: "maira-almas",
    name: "Maira Almas",
    role: "CEO",
    initials: "MA",
    bio: null,
    portrait: null,
    profileUrl: null,
    featured: false,
    status: "published",
  },
  {
    slug: "syed-hamad-haider",
    name: "Syed Hamad Haider",
    role: "Board of Directors",
    initials: "SH",
    bio: null,
    portrait: null,
    profileUrl: null,
    featured: false,
    status: "published",
  },
];

export const founder = leadership.find((l) => l.featured)!;
export const publishedLeadership = leadership.filter((l) => l.status === "published");
