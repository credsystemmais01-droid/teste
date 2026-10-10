"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  size?: number;
  alt?: string;
};

export function PixQr({ value, size = 220, alt = "QR Code Pix" }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: size,
      color: { dark: "#0a2540", light: "#ffffff" },
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {
        if (alive) setSrc("");
      });
    return () => {
      alive = false;
    };
  }, [value, size]);

  if (!src) {
    return <div className="pix-qr-pending" style={{ width: size, height: size }} aria-hidden />;
  }

  return <img className="pix-qr-img" src={src} width={size} height={size} alt={alt} />;
}
