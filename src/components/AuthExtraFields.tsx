"use client";

import { useState } from "react";
import { formatCpf, formatPhone } from "@/lib/profile";

type Props = {
  fullName?: string;
  cpf?: string;
  phone?: string;
  city?: string;
};

export function AuthExtraFields({ fullName = "", cpf = "", phone = "", city = "" }: Props) {
  const [cpfValue, setCpfValue] = useState(cpf ? formatCpf(cpf) : "");
  const [phoneValue, setPhoneValue] = useState(phone ? formatPhone(phone) : "");

  return (
    <>
      <div className="field">
        <label htmlFor="fullName">Nome completo</label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          required
          autoComplete="name"
          placeholder="Nome e sobrenome"
          enterKeyHint="next"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            name="cpf"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            enterKeyHint="next"
            required
            value={cpfValue}
            onChange={(event) => setCpfValue(formatCpf(event.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">WhatsApp</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            enterKeyHint="next"
            required
            value={phoneValue}
            onChange={(event) => setPhoneValue(formatPhone(event.target.value))}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="city">Cidade</label>
        <input
          id="city"
          name="city"
          defaultValue={city}
          required
          autoComplete="address-level2"
          placeholder="Cidade"
          enterKeyHint="next"
        />
      </div>
    </>
  );
}
