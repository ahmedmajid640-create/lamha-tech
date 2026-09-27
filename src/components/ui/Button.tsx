import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-light" | "ghost" | "ghost-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blue text-white shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-10px_rgba(23,105,224,0.7)] hover:bg-blue-700 active:translate-y-px",
  secondary: "bg-navy text-white hover:bg-navy-800 active:translate-y-px",
  outline: "border border-slate-300 bg-white text-ink hover:border-slate-400 hover:bg-slate-50 active:translate-y-px",
  "outline-light": "border border-white/25 bg-white/0 text-white hover:border-white/50 hover:bg-white/10 active:translate-y-px",
  ghost: "text-blue hover:text-blue-700 px-0",
  "ghost-light": "text-white hover:text-blue-200 px-0",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: "arrow" | "external" | "none";
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function IconFor({ icon }: { icon: CommonProps["icon"] }) {
  if (icon === "external") return <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />;
  if (icon === "arrow") return <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />;
  return null;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon = "none", className, children } = props;
  const cls = cn(base, variants[variant], (variant === "ghost" || variant === "ghost-light") ? "h-auto" : sizes[size], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _i; void _c; void _ch;
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...(rest as ComponentPropsWithoutRef<"a">)}>
          {children}
          <IconFor icon={icon} />
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
        <IconFor icon={icon} />
      </Link>
    );
  }

  const { variant: _v, size: _s, icon: _i, className: _c, children: _ch, type, ...rest } = props as ButtonAsButton;
  void _v; void _s; void _i; void _c; void _ch;
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {children}
      <IconFor icon={icon} />
    </button>
  );
}
