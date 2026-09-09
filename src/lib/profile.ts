export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  const calc = (base: string, factor: number) => {
    let total = 0;
    for (const digit of base) {
      total += Number(digit) * factor;
      factor -= 1;
    }
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const first = calc(cpf.slice(0, 9), 10);
  const second = calc(cpf.slice(0, 10), 11);
  return first === Number(cpf[9]) && second === Number(cpf[10]);
}

export function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function parseProfile(body: Record<string, unknown>) {
  const fullName = String(body.fullName || "").trim();
  const cpf = onlyDigits(String(body.cpf || ""));
  const phone = onlyDigits(String(body.phone || ""));
  const city = String(body.city || "").trim();

  if (fullName.split(" ").filter(Boolean).length < 2) {
    return { error: "Informe o nome completo." };
  }
  if (!isValidCpf(cpf)) {
    return { error: "Informe um CPF válido." };
  }
  if (phone.length < 10 || phone.length > 11) {
    return { error: "Informe um WhatsApp válido com DDD." };
  }
  if (city.length < 2) {
    return { error: "Informe a cidade." };
  }

  return { fullName, cpf, phone, city };
}

export function isProfileComplete(row: { full_name?: unknown; cpf?: unknown; phone?: unknown }) {
  return Boolean(row.full_name && row.cpf && row.phone);
}
