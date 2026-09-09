import { COMPANY } from "@/lib/brand";

export function Copyright() {
  return (
    <p className="copyright">
      © {new Date().getFullYear()} {COMPANY}. Todos os direitos reservados.
    </p>
  );
}
