/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
            },
            {
                protocol: "https",
                hostname: "example.com",
            },
        ],
    },
};

export default nextConfig;