import { MetadataRoute } from 'next';
import { destinations } from '@/data/destinations';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vistara-culture.azurewebsites.net';
  
  // Halaman utama
  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  // Halaman destinasi dinamis
  const destinationRoutes = destinations.map((dest) => ({
    url: `${siteUrl}/destinasi/${dest.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...routes, ...destinationRoutes];
}
