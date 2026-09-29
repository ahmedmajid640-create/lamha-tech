/**
 * CMS model: Leadership (name, role, approved biography, portrait, profile link, display status).
 * Portraits and role descriptions supplied by LAMHA on 2026-09-28. Descriptions state role and
 * discipline only; fuller biographies can replace them when approved.
 */
export type Leader = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  /** Approved biography / role description. null renders a "biography coming soon" placeholder. */
  bio: string | null;
  /** Approved portrait path (public/). null renders an initials placeholder. */
  portrait: string | null;
  /** CSS object-position for the portrait crop (keeps faces in frame on square cards). */
  portraitPosition?: string;
  /** TODO(owner): approved LinkedIn (or other professional) profile URL; feeds Person.sameAs. null = not yet supplied. */
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
    bio: "Founder of LAMHA Technologies. A software engineer, Syeda Laiba Haider sets the company's vision and direction: building practical technology for businesses while developing LAMHA Technologies's own systems, automation and future products.",
    portrait: "/leadership/syeda-laiba-haider.jpg",
    portraitPosition: "50% 22%",
    profileUrl: null,
    featured: true,
    status: "published",
  },
  {
    slug: "ahmed-majid",
    name: "Ahmed Majid",
    role: "Co-Founder",
    initials: "AM",
    bio: "Co-Founder of LAMHA Technologies. An electrical engineer, Ahmed Majid brings the engineering discipline behind LAMHA Technologies's technical work and its planned expansion into engineering services.",
    portrait: "/leadership/ahmed-majid.jpg",
    portraitPosition: "50% 20%",
    profileUrl: null,
    featured: false,
    status: "published",
  },
  {
    slug: "maira-almas",
    name: "Maira Almas",
    role: "Chief Executive Officer",
    initials: "MA",
    bio: "Chief Executive Officer of LAMHA Technologies. Maira Almas leads the company's operations, delivery and growth.",
    portrait: "/leadership/maira-almas.jpg",
    portraitPosition: "50% 22%",
    profileUrl: null,
    featured: false,
    status: "published",
  },
  {
    slug: "syed-hamad-haider",
    name: "Syed Hamad Haider",
    role: "Board of Directors",
    initials: "SH",
    bio: "Member of the Board of Directors of LAMHA Technologies, providing governance and strategic oversight.",
    portrait: "/leadership/syed-hamad-haider.jpg",
    portraitPosition: "50% 18%",
    profileUrl: null,
    featured: false,
    status: "published",
  },
];

export const founder = leadership.find((l) => l.featured)!;
export const publishedLeadership = leadership.filter((l) => l.status === "published");
