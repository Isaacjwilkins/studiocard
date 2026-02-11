"use client";

import { useEffect, useRef } from "react";

interface RecitalBackgroundsProps {
  type: string;
  color: string;
}

export default function RecitalBackgrounds({ type, color }: RecitalBackgroundsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 99, g: 102, b: 241 }; // Default purple
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
        <div className="fixed inset-0 bg-background -z-30" />
        <canvas ref={canvasRef} className="fixed inset-0 -z-20 pointer-events-none" />
      </>
    );
  }

  if (type === "gradient") {
    return (
      <div
        className="fixed inset-0 -z-30"
        style={{
          background: `linear-gradient(135deg,
            ${color}10 0%,
            transparent 50%,
            ${color}10 100%
          )`
        }}
      >
        <div className="absolute inset-0 bg-background" style={{ opacity: 0.95 }} />
      </div>
    );
  }

  if (type === "pattern") {
    return (
      <div className="fixed inset-0 -z-30 bg-background">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L30 25 L25 15 Z M10 25 L15 35 L10 45 L5 35 Z M50 25 L55 35 L50 45 L45 35 Z M30 35 L35 45 L30 55 L25 45 Z' fill='${encodeURIComponent(color)}' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
        {/* Musical staff lines */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${10 + i * 10}%`,
                backgroundColor: color
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Plain background (default)
  return (
    <div
      className="fixed inset-0 -z-30 bg-background"
      style={{
        background: `linear-gradient(180deg, ${color}05 0%, transparent 100%)`
      }}
    />
  );
}
