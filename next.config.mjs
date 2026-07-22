/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The paper bodies are read from /content at request time via fs; make sure
  // those files are traced into the serverless bundle.
  outputFileTracingIncludes: {
    '/papers/[slug]': ['./content/**/*'],
    '/api/download': ['./content/pdfs/**/*'],
  },
};

export default nextConfig;
