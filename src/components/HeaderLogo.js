"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderLogo() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    // Navigate back to listing page
    router.push("/jobs");

    // Capture exact cursor offsets to trigger burst from clicked location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Generate 8 radial speed particles
    const newParticles = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 360) / 8 + Math.random() * 10;
      const speed = 25 + Math.random() * 20;
      return {
        id: Math.random(),
        x,
        y,
        dx: Math.cos((angle * Math.PI) / 180) * speed,
        dy: Math.sin((angle * Math.PI) / 180) * speed,
        color: ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-amber-500"][Math.floor(Math.random() * 4)],
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Clear particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 600);
  };

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={handleClick}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 450, damping: 15 }}
      >
        <img 
          src="/logo.png" 
          alt="A-Careers Logo" 
          className="h-9 w-9 rounded-lg object-contain border border-zinc-200/80 shadow-2xs"
        />
        <div>
          <h1 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-1.5">
            <span className="blurred-brand">Ahamove</span> Careers
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200">
              Dashboard
            </span>
          </h1>
          <p className="text-[10px] text-zinc-400">Recruiter Console & Candidate Tracker</p>
        </div>
      </motion.div>

      {/* Sparkle Particles Render */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute w-2 h-2 rounded-full pointer-events-none ${p.color}`}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{
            x: p.x + p.dx,
            y: p.y + p.dy,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
