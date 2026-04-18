/**
 * CHECKLIST DEPLOY KE AZURE:
 * [ ] 1. Buka portal.azure.com → Create → Static Web App
 * [ ] 2. Connect GitHub repo: Maverick-list/vistara_culture
 * [ ] 3. Build preset: Next.js
 * [ ] 4. Salin Deployment Token dari Azure
 * [ ] 5. Tambah GitHub Secret: AZURE_STATIC_WEB_APPS_API_TOKEN
 * [ ] 6. Di Azure portal → Configuration → tambah env vars:
 *         GEMINI_API_KEY, AZURE_LANGUAGE_ENDPOINT, AZURE_LANGUAGE_KEY
 * [ ] 7. Push ke master → GitHub Actions otomatis deploy
 * [ ] 8. Update README: ganti link Vercel dengan link Azure
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
