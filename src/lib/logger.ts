export type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_KEYS = new Set([
  "dob",
  "date_of_birth",
  "password",
  "password_hash",
  "token",
  "access_token",
  "refresh_token",
  "secret",
  "service_role_key",
  "razorpay_signature",
  "razorpay_key_secret",
  "credit_card",
  "journal_content",
  "transcript",
  "interview_transcript",
  "raw_transcript",
  "resume_snapshot",
  "resume_content",
  "full_resume",
  "cv_text",
  "direct_message_content",
  "video_url",
  "otp",
  "pin",
  "cookie",
  "authorization",
]);

export function scrubObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj.map(scrubObject);
  if (typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        cleaned[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        cleaned[key] = scrubObject(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  return obj;
}

export interface LogContext {
  request_id?: string;
  user_id?: string;
  route?: string;
  method?: string;
  status_code?: number;
  latency_ms?: number;
  service?: string;
  [key: string]: any;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development";

export function logStructured(
  level: LogLevel,
  message: string,
  metadata: LogContext = {}
): Record<string, any> {
  // Suppress DEBUG logs in production to reduce log noise and cost
  if (level === "debug" && IS_PRODUCTION) return {};

  const scrubbedMeta = scrubObject(metadata);
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    environment: APP_ENV,
    service: scrubbedMeta.service ?? "edworld-web",
    message,
    ...scrubbedMeta,
  };

  const output = JSON.stringify(logEntry);
  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }

  return logEntry;
}

export const logger = {
  debug: (msg: string, meta?: LogContext) => logStructured("debug", msg, meta),
  info: (msg: string, meta?: LogContext) => logStructured("info", msg, meta),
  warn: (msg: string, meta?: LogContext) => logStructured("warn", msg, meta),
  error: (msg: string, meta?: LogContext) => logStructured("error", msg, meta),

  /**
   * Creates a child logger with a bound request_id and optional static context.
   * Use this inside route handlers so every log line shares the same request_id.
   *
   * @example
   * const log = logger.child({ request_id: reqId, route: "/api/interview/turn" });
   * log.info("Processing request");
   * log.error("AI call failed", { error: err.message });
   */
  child(baseContext: LogContext) {
    return {
      debug: (msg: string, extra?: LogContext) =>
        logStructured("debug", msg, { ...baseContext, ...extra }),
      info: (msg: string, extra?: LogContext) =>
        logStructured("info", msg, { ...baseContext, ...extra }),
      warn: (msg: string, extra?: LogContext) =>
        logStructured("warn", msg, { ...baseContext, ...extra }),
      error: (msg: string, extra?: LogContext) =>
        logStructured("error", msg, { ...baseContext, ...extra }),
    };
  },
};

