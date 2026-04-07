import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Remote domains allowed for next/image optimisation.
    // Plain <img> tags (used in LocationImage) bypass this list entirely —
    // they work with any URL already.
    remotePatterns: [
      // Wikimedia Commons (Wikipedia photos)
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      // Unsplash
      { protocol: "https", hostname: "images.unsplash.com" },
      // Imgur
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      // Google user content / Blogger CDN
      { protocol: "https", hostname: "**.googleusercontent.com" },
      // Google Photos shared links
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudinary (any subdomain — your future upload CDN)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // AWS S3 / any region
      { protocol: "https", hostname: "**.amazonaws.com" },
      // General: any HTTPS source
      // (keeps next/image optimisation available for anything you add later)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
