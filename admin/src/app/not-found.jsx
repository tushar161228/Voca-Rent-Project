// app/not-found.jsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6">
            {/* Background Glow */}
            <div className="absolute left-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-purple-700/30 blur-3xl" />

            <div className="absolute bottom-[-120px] right-[-100px] h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-3xl" />

            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-2xl text-center">
                {/* Animated 404 */}
                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-[120px] font-extrabold leading-none text-transparent md:text-[180px]"
                >
                    404
                </motion.h1>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-2 text-3xl font-bold text-white md:text-5xl"
                >
                    Oops! Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mx-auto mt-5 max-w-lg text-lg leading-8 text-gray-400"
                >
                    The page you are looking for might have been removed,
                    renamed, or is temporarily unavailable.
                </motion.p>

                {/* Illustration */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="mx-auto mt-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <Search className="h-14 w-14 text-purple-400" />
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-105"
                    >
                        <Home size={20} />
                        Back To Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="cursor-pointer flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </motion.div>

                {/* Footer */}
                <p className="mt-14 text-sm text-gray-500">
                    © 2026 VocaRent. All rights reserved.
                </p>
            </div>
        </div>
    );
}