export  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{2})(\d)/, "$1.$2") // Coloca um ponto depois do segundo dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto depois do quinto dígito
      .replace(/(\d{3})(\d)/, "$1/$2") // Coloca uma barra depois do oitavo dígito
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2") // Coloca um traço antes dos últimos dois dígitos
      .slice(0, 18); // Limita a 18 caracteres (99.999.999/0001-99)
};

export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto depois do terceiro dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto depois do sexto dígito
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca um traço antes dos últimos dois dígitos
    .slice(0, 14); // Limita a 14 caracteres (999.999.999-99)
};

export const formatTelefone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2")
    .slice(0, 15);
};
