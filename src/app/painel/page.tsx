import { Suspense } from "react";
import { PanelApp } from "@/components/PanelApp";

export default function PainelPage() {
  return (
    <Suspense fallback={<main className="wrap"><p className="muted">Carregando painel...</p></main>}>
      <PanelApp />
    </Suspense>
  );
}
