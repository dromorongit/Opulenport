export function getSiteUrl(): string {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}
