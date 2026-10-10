import type { Metadata } from "next";
import { PixGateway } from "@/components/PixGateway";

export const metadata: Metadata = {
  title: "Pagamento Pix",
  description: "Pagamento da assinatura Criptografia Security z1 por Pix.",
};

export default function PixPage() {
  return <PixGateway />;
}
