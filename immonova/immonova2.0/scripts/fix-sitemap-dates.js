import fs from 'fs/promises';
import path from 'path';

// Obtenir la date actuelle au format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

async function fixDates() {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap-0.xml');
    let content = await fs.readFile(sitemapPath, 'utf8');

    // Remplacer les dates incorrectes (format YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)
    // par la date d'aujourd'hui (YYYY-MM-DD)
    content = content.replace(/<lastmod>\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

    await fs.writeFile(sitemapPath, content, 'utf8');
    console.log(`Dates dans ${sitemapPath} mises à jour avec ${today}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des dates:', error);
    process.exit(1);
  }
}

fixDates(); 