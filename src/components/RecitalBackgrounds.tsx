"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface RecitalBackgroundsProps {
  type: string;
  color: string;
}

export default function RecitalBackgrounds({ type, color }: RecitalBackgroundsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 99, g: 102, b: 241 };
  };

  const rgb = hexToRgb(color);

  // Animated background (particles)
  useEffect(() => {
    if (type !== "animated") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.maxLife = Math.random() * 300 + 200;
        this.life = this.maxLife;
        this.opacity = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life > this.maxLife * 0.8) {
          this.opacity += 0.02;
        } else if (this.life < 50) {
          this.opacity -= 0.02;
        }

        this.opacity = Math.max(0, Math.min(this.opacity, 0.3));

        if (
          this.life <= 0 ||
          this.x < -50 ||
          this.x > width + 50 ||
          this.y < -50 ||
          this.y > height + 50
        ) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.life = this.maxLife;
          this.opacity = 0;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from(
      { length: Math.min(100, Math.floor((width * height) / 10000)) },
      () => new Particle()
    );

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, rgb.r, rgb.g, rgb.b]);

  if (type === "animated") {
    return (
      <>
        <div className="fixed inset-0 bg-white dark:bg-black -z-30" />
        <canvas ref={canvasRef} className="fixed inset-0 -z-20 pointer-events-none" />
      </>
    );
  }

  if (type === "gradient") {
    return (
      <div className="fixed inset-0 -z-30">
        {/* Base background */}
        <div className="absolute inset-0 bg-white dark:bg-black" />
        {/* Gradient overlay - adjusted for dark mode */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `radial-gradient(ellipse at 30% 20%, ${color}15 0%, transparent 50%),
                 radial-gradient(ellipse at 70% 80%, ${color}10 0%, transparent 50%)`
              : `radial-gradient(ellipse at 30% 20%, ${color}20 0%, transparent 50%),
                 radial-gradient(ellipse at 70% 80%, ${color}15 0%, transparent 50%)`
          }}
        />
        {/* Subtle noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  }

  if (type === "pattern") {
    return (
      <div className="fixed inset-0 -z-30">
        {/* Base background */}
        <div className="absolute inset-0 bg-white dark:bg-black" />
        {/* Musical note pattern - adjusted opacity for dark mode */}
        <div
          className="absolute inset-0"
          style={{
            opacity: isDark ? 0.06 : 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(color)}' fill-rule='evenodd'%3E%3Ccircle cx='15' cy='45' r='3'/%3E%3Cpath d='M18 45V25h2v20h-2zm2-20h8v2h-8v-2z'/%3E%3Ccircle cx='45' cy='35' r='3'/%3E%3Cpath d='M48 35V15h2v20h-2zm2-20h6v2h-6v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
        {/* Subtle horizontal lines like staff lines */}
        <div className="absolute inset-0" style={{ opacity: isDark ? 0.04 : 0.02 }}>
          {[15, 30, 45, 60, 75].map((top) => (
            <div
              key={top}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${top}%`,
                backgroundColor: color
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Original/Plain background (default)
  return (
    <div className="fixed inset-0 -z-30">
      <div className="absolute inset-0 bg-white dark:bg-black" />
      {/* Very subtle top gradient with theme color */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(180deg, ${color}08 0%, transparent 30%)`
            : `linear-gradient(180deg, ${color}06 0%, transparent 30%)`
        }}
      />
    </div>
  );
}
