import type { Metadata } from "next";
import { BlueScreen } from "@/components/BlueScreen";
import { getBlueScreenState } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tela",
  robots: { index: false, follow: false },
};

export default async function TelaPage() {
  const state = await getBlueScreenState();
  return <BlueScreen initial={state} serverNow={Date.now()} />;
}
