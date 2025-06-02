import React from 'react';

interface QRCodePreviewProps {
  url: string;
  size?: number;
}

export default function QRCodePreview({ url, size = 120 }: QRCodePreviewProps) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-muted/40 w-fit">
      <img
        src={qrSrc}
        alt="QR Kod"
        width={size}
        height={size}
        className="rounded-lg border border-border bg-white dark:bg-black"
      />
      <a
        href={qrSrc}
        download={`cihaz-qr.png`}
        className="mt-1 text-xs text-blue-600 dark:text-blue-400 underline hover:opacity-80"
      >
        QR Kodunu İndir
      </a>
    </div>
  );
} 