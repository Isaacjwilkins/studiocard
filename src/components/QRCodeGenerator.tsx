"use client";

import { useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  url: string;
  colorTheme?: string;
  size?: number;
}

export default function QRCodeGenerator({
  url,
  colorTheme = "#6366f1",
  size = 128
}: QRCodeGeneratorProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = useCallback(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current.querySelector("svg");
    if (!svg) return;

    // Create a canvas to draw the SVG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (2x for better resolution)
    const scale = 2;
    canvas.width = size * scale;
    canvas.height = size * scale;

    // Create an image from the SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Draw white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "recital-qr-code.png";
        link.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");

      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  }, [size]);

  return (
    <div className="flex flex-col items-start gap-3">
      <div
        ref={svgRef}
        className="p-3 bg-white rounded-xl border border-zinc-200 dark:border-zinc-700"
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          fgColor={colorTheme}
          bgColor="#ffffff"
          includeMargin={false}
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Download size={14} />
        Download QR Code
      </button>
    </div>
  );
}
