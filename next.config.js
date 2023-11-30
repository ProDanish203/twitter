/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"]
    },
}

module.exports = nextConfig
