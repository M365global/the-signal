import "server-only";

export interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  full_picture?: string;
}

interface FacebookApiPost {
  id: string;
  message?: string;
  created_time?: string;
  full_picture?: string;
}

interface FacebookGraphError {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

const FACEBOOK_API_VERSION = "v25.0";
const FACEBOOK_REVALIDATE_SECONDS = 3600;
const FACEBOOK_REQUEST_TIMEOUT_MS = 10_000;
const FACEBOOK_POSTS_TAG = "facebook-posts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeMessage(message: string): string {
  return message
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildFacebookPostsUrl(pageId: string, token: string): string {
  const url = new URL(
    `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/posts`
  );
  url.searchParams.set("fields", "message,created_time,full_picture");
  url.searchParams.set("limit", "3");
  url.searchParams.set("access_token", token);
  return url.toString();
}

function parseJsonSafely(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractFacebookError(payload: unknown): FacebookGraphError | null {
  if (!isRecord(payload) || !isRecord(payload.error)) {
    return null;
  }

  const error = payload.error;

  return {
    message: typeof error.message === "string" ? error.message : undefined,
    type: typeof error.type === "string" ? error.type : undefined,
    code: typeof error.code === "number" ? error.code : undefined,
    error_subcode:
      typeof error.error_subcode === "number" ? error.error_subcode : undefined,
    fbtrace_id:
      typeof error.fbtrace_id === "string" ? error.fbtrace_id : undefined,
  };
}

function formatFacebookError(error: FacebookGraphError | null): string {
  if (!error) return "Unknown Facebook API error";

  const parts = [
    error.message,
    error.type ? `type=${error.type}` : null,
    typeof error.code === "number" ? `code=${error.code}` : null,
    typeof error.error_subcode === "number" ? `subcode=${error.error_subcode}` : null,
    error.fbtrace_id ? `fbtrace_id=${error.fbtrace_id}` : null,
  ].filter(Boolean);

  return parts.join(" | ") || "Unknown Facebook API error";
}

function isValidFacebookPost(
  value: unknown
): value is Required<Pick<FacebookApiPost, "id" | "message" | "created_time">> &
  Pick<FacebookApiPost, "full_picture"> {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.message === "string" &&
    typeof value.created_time === "string" &&
    (typeof value.full_picture === "undefined" ||
      typeof value.full_picture === "string")
  );
}

export async function getFacebookPosts(): Promise<FacebookPost[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const token = process.env.FACEBOOK_ACCESS_TOKEN?.trim();

  if (!pageId || !token) {
    console.warn("Facebook credentials missing in environment variables.");
    return [];
  }

  const url = buildFacebookPostsUrl(pageId, token);

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    FACEBOOK_REQUEST_TIMEOUT_MS
  );

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: FACEBOOK_REVALIDATE_SECONDS,
        tags: [FACEBOOK_POSTS_TAG],
      },
    });

    const rawBody = await res.text();
    const payload = parseJsonSafely(rawBody);

    if (!res.ok) {
      const apiError = extractFacebookError(payload);

      console.error(
        `Facebook API request failed: ${res.status} ${res.statusText} | ${formatFacebookError(apiError)}`
      );
      return [];
    }

    const apiError = extractFacebookError(payload);
    if (apiError) {
      console.error(
        `Facebook API returned an error payload: ${formatFacebookError(apiError)}`
      );
      return [];
    }

    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      console.warn("Facebook API response did not include a valid data array.");
      return [];
    }

    return payload.data
      .filter(isValidFacebookPost)
      .map((post): FacebookPost => ({
        id: post.id,
        message: sanitizeMessage(post.message),
        created_time: post.created_time,
        ...(post.full_picture ? { full_picture: post.full_picture } : {}),
      }))
      .filter((post) => post.message.length > 0);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `Facebook API request timed out after ${FACEBOOK_REQUEST_TIMEOUT_MS}ms.`
      );
      return [];
    }

    console.error("Failed to fetch Facebook posts:", error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
