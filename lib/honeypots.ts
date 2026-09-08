type HoneypotFamily = 'wordpress' | 'environment';

/** Finite probe families seen in the September 2026 access-log export. */
export function matchHoneypot(
  pathname: string,
): { path: string; family: HoneypotFamily } | null {
  let path: string;
  try {
    path = decodeURIComponent(pathname)
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '')
      .toLowerCase();
  } catch {
    return null;
  }

  // Keep logs bounded; only the path is passed here, never queries or bodies.
  // eslint-disable-next-line no-control-regex -- Reject control characters in decoded paths before logging.
  if (path.length > 256 || /[\u0000-\u001f\u007f]/.test(path)) return null;

  if (
    /(?:^|\/)wp-admin(?:\/|$)/.test(path) ||
    /(?:^|\/)(?:wp-login|xmlrpc|index)\.php$/.test(path) ||
    /(?:^|\/)wp-includes\/wlwmanifest\.xml$/.test(path) ||
    /(?:^|\/)wp-json(?:\/|$)/.test(path)
  ) {
    return { path, family: 'wordpress' };
  }

  if (/(?:^|\/)\.env(?:\.[a-z0-9_-]+)*$/.test(path)) {
    return { path, family: 'environment' };
  }

  return null;
}
