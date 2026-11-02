/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le lien privé d'un aventurier contient son jeton : ne jamais le transmettre en Referer.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] }];
  },
};

export default nextConfig;
