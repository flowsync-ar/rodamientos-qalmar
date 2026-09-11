import type { NextConfig } from "next";

function supabaseImageHosts(): string[] {
  const hosts = new Set([
    'jkipogzerpepuiylpuwl.supabase.co',
    'efcnzmhhjtqbdptpyubf.supabase.co',
  ])
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url) {
    try {
      hosts.add(new URL(url).hostname)
    } catch {
      // ignore invalid env URL
    }
  }
  return [...hosts]
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImageHosts().map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/storage/v1/object/public/**',
    })),
  },
};

export default nextConfig;
