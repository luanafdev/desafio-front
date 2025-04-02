"use client";

import { Input } from "@heroui/input";
import { useState } from "react";

export default function InputCPF() {
  const [cpf, setCpf] = useState("");

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto depois do terceiro dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto depois do sexto dígito
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca um traço antes dos últimos dois dígitos
      .slice(0, 14); // Limita a 14 caracteres (999.999.999-99)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(event.target.value));
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        value={cpf}
        onChange={handleChange}
        label="CPF" isRequired maxLength={14}
      />
    </div>
  );
}
