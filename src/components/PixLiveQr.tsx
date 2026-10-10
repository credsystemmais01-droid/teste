"use client";

import { useEffect, useState } from "react";
import { PixQr } from "@/components/PixQr";
import { buildPixPayload } from "@/lib/pixDemo";

export function usePixPayload() {
  const [payload, setPayload] = useState(() => buildPixPayload());

  useEffect(() => {
    setPayload(buildPixPayload(window.location.origin));
  }, []);

  return payload;
}

export function PixLiveQr({ size }: { size: number }) {
  const payload = usePixPayload();
  return <PixQr value={payload} size={size} alt="QR Code Pix" />;
}
