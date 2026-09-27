"use client";

import type { MouseEvent, ReactNode } from "react";
import { track, type AnalyticsEventName, type AnalyticsProps } from "@/lib/analytics";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

type TrackedCTAProps = {
  href: string;
  event: AnalyticsEventName;
  eventProps?: AnalyticsProps;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: "arrow" | "external" | "none";
  className?: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/** A Button link that reports an analytics event on click. */
export function TrackedCTA({ href, event, eventProps, onClick, children, ...rest }: TrackedCTAProps) {
  return (
    <Button
      href={href}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        track(event, { href, ...eventProps });
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
}
