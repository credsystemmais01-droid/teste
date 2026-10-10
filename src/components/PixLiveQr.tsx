"use client";

import { useEffect, useState } from "react";
import { buildPixPayload } from "@/lib/pixDemo";

export function usePixPayload(chargeId: string) {
  const [payload, setPayload] = useState("");

  useEffect(() => {
    if (!chargeId) return;
    setPayload(buildPixPayload(window.location.origin, chargeId));
  }, [chargeId]);

  return payload;
}
