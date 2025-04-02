"use client";

import { Input } from "@heroui/input";
import { useState } from "react";

export default function InputTelefone() {
  const [telefone, setTelefone] = useState("");

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{2})(\d)/, "($1) $2") // Coloca os parênteses no DDD
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o traço no número
      .slice(0, 15); // Limita a 15 caracteres (99) 99999-9999
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatTelefone(event.target.value));
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        value={telefone}
        onChange={handleChange}
        label="Telefone" isRequired maxLength={15}
      />
    </div>
  );
}
