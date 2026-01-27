"use client";
import React, { useEffect, useRef } from "react";

// YOUR REFINED MANUAL COORDINATES
const PIANO_MAP = [
    { x: 0.25, y: 0.80 },
    { x: 0.75, y: 0.80 },
    { x: 0.75, y: 0.60 },
    { x: 0.74, y: 0.53 },
    { x: 0.72, y: 0.48 },
    { x: 0.70, y: 0.46 },
    { x: 0.67, y: 0.44 },
    { x: 0.64, y: 0.43 },
    { x: 0.61, y: 0.42 },
    { x: 0.59, y: 0.42 },
    { x: 0.57, y: 0.42 },
    { x: 0.54, y: 0.41 },
    { x: 0.51, y: 0.36 },
    { x: 0.49, y: 0.29 },
    { x: 0.47, y: 0.23 },
    { x: 0.45, y: 0.20 },
    { x: 0.41, y: 0.19 },
    { x: 0.32, y: 0.19 },
    { x: 0.27, y: 0.20 },
    { x: 0.25, y: 0.23 },
    { x: 0.25, y: 0.28 },
    { x: 0.25, y: 0.80 }
];

export default function Background() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pianoModeRef = useRef(false); 
    const scrollRef = useRef(0);
    // Track previous scroll to avoid unnecessary DOM updates
    const prevScrollProgress = useRef(-1);

    useEffect(() => {
        // Start on swirls
        pianoModeRef.current = false;
      
        // Switch to piano after 2 seconds
        const initialTimeout = setTimeout(() => {
          pianoModeRef.current = true;
      
          // Then start the 8 second interval
          const interval = setInterval(() => {
            pianoModeRef.current = !pianoModeRef.current;
          }, 8000);
      
          return () => clearInterval(interval);
        }, 2000);
      
        return () => clearTimeout(initialTimeout);
      
      
        // 2. Optimized Scroll Listener
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            clearInterval(interval);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let time = 0;
        let animationFrameId: number;
        
        // Track width to prevent reset on mobile URL bar scroll
        let prevWidth = window.innerWidth;

        const getSegments = (w: number, h: number, scrollY: number) => {
            // DETECT MOBILE: If width is small (< 768px), use a smaller scale factor
            const isMobile = w < 768;
            const scaleFactor = isMobile ? 0.55 : 0.75;

            const s = Math.min(w, h) * scaleFactor;
            const cx = w / 2;

            // Determine when the drop should start (82% down the page)
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const triggerPoint = maxScroll * 0.82; 

            const scrollPastTrigger = Math.max(0, scrollY - triggerPoint);
            const cy = (h / 2) + (scrollPastTrigger * 0.5);

            const project = (pt: { x: number; y: number }) => ({
                x: cx + (pt.x - 0.5) * s,
                y: cy + (pt.y - 0.5) * s,
            });

            return PIANO_MAP.slice(0, -1).map((pt, i) => ({
                a: project(pt),
                b: project(PIANO_MAP[i + 1]),
            }));
        };

        const getClosestPoint = (px: number, py: number, a: { x: number; y: number }, b: { x: number; y: number }) => {
            const dx = b.x - a.x, dy = b.y - a.y;
            const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy)));
            return { x: a.x + t * dx, y: a.y + t * dy };
        };

        class Particle {
            x!: number; y!: number; size!: number; vx!: number; vy!: number;
            opacity!: number; hue!: number; life!: number; maxLife!: number;

            constructor() { this.init(); }

            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.maxLife = Math.random() * 400 + 400;
                this.life = this.maxLife;
                this.opacity = 0;
                this.hue = Math.random() * 360;
            }

            update(t: number, segments: any[]) {
                const mode = pianoModeRef.current;
                const zoom = mode ? 0.0015 : 0.0035;
                const angle = (Math.sin(this.x * zoom + t * 0.0005) + Math.cos(this.y * zoom + t * 0.0005)) * Math.PI * 2;
                const accel = mode ? 0.06 : 0.2;

                this.vx += Math.cos(angle) * accel;
                this.vy += Math.sin(angle) * accel;

                if (mode) {
                    let bestPoint = { x: 0, y: 0 }, minDSq = Infinity;
                    for (const seg of segments) {
                        const cp = getClosestPoint(this.x, this.y, seg.a, seg.b);
                        const dSq = (this.x - cp.x) ** 2 + (this.y - cp.y) ** 2;
                        if (dSq < minDSq) { minDSq = dSq; bestPoint = cp; }
                    }
                    const dist = Math.sqrt(minDSq);
                    if (dist < 150) {
                        const pull = (150 - dist) / 150;
                        this.vx += (bestPoint.x - this.x) * 0.005 * pull;
                        this.vy += (bestPoint.y - this.y) * 0.005 * pull;
                    }
                }

                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.93; this.vy *= 0.93;
                this.hue = (this.hue + 0.1) % 360;

                this.life--;
                if (this.life > this.maxLife * 0.8) this.opacity += 0.01;
                if (this.life < 50) this.opacity -= 0.02;
                if (this.life <= 0 || this.x < -100 || this.x > width + 100) this.init();
            }

            draw() {
                if (!ctx) return;
                ctx.globalAlpha = Math.max(0, Math.min(this.opacity, 0.4));
                ctx.fillStyle = `hsl(${this.hue}, 5%, 50%)`;
                ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
            }
        }

        const init = () => {
            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 1200 : 3000;
            particles = Array.from({ length: particleCount }, () => new Particle());
        };

        const updateScrollColors = () => {
            const scrollY = scrollRef.current;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const rawProgress = Math.min(scrollY / (maxScroll || 1), 1);
            const progress = rawProgress * 0.5;

            if (Math.abs(progress - prevScrollProgress.current) > 0.001) {
                document.documentElement.style.setProperty('--scroll-progress', progress.toString());
                prevScrollProgress.current = progress;
            }
        }

        const animate = () => {
            time++;
            updateScrollColors();

            const segments = getSegments(width, height, scrollRef.current);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';

            particles.forEach(p => {
                p.update(time, segments);
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            const newWidth = window.innerWidth;
            
            // KEY FIX: Only reset animation if WIDTH changes.
            // This ignores the URL bar collapse/expand on mobile scroll.
            if (newWidth === prevWidth) return;

            prevWidth = newWidth;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-background -z-30" />
            <div className="sunset-layer" aria-hidden="true" />
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
        </>
    );
}