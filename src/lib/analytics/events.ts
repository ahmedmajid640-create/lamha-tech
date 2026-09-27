/**
 * Canonical analytics event names. Components only ever reference these,
 * so the provider (GA4, Plausible, custom) can change without touching UI code.
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  SERVICE_VIEW: "service_view",
  CTA_CLICK: "cta_click",
  START_PROJECT_CLICK: "start_project_click",
  PROJECT_FORM_START: "project_form_start",
  PROJECT_FORM_SUBMIT: "project_form_submit",
  PROJECT_FORM_ERROR: "project_form_error",
  CAREER_VIEW: "career_view",
  JOB_VIEW: "job_view",
  APPLICATION_START: "application_start",
  APPLICATION_SUBMIT: "application_submit",
  APPLICATION_ERROR: "application_error",
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  CONTACT_FORM_ERROR: "contact_form_error",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;
