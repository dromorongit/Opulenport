export function getSiteUrl(): string {
  const url =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;

  if (url !== undefined) {
    return url;
  }

  return "http://localhost:3000";
}
