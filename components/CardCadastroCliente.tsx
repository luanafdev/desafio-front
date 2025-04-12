"use client";

import Stepper from "@/components/stepper";
import { BuildingIconHero, LockIconHero, PersonIconHero } from "@/components/icons";
import { Input } from "@heroui/input";
import { useState } from "react";
import { formatCPF, formatCNPJ, formatTelefone } from "@/expressoes-regulares/regex";
import { useAlert } from "@/contexts/AlertContext"; 

export default function CardCadastroCliente() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("")
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [telefone, setTelefone] = useState("");

    const {showAlert} = useAlert()

  const handleSubmit = async () => {
    const dadosUsuario = {
      id,
      nome,
      email,
      senha,
      cpf,
      cnpj,
      razaoSocial,
      nomeFantasia,
      telefone
    };

    await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosUsuario),
    });

    showAlert("Usuário cadastrado com sucesso!", "success")
    window.location.href = "/"
  }

  function DadosPessoais() {
  
    return (
      <>
        <h2 className="text-lg font-extrabold drop-shadow-lg mt-2 ">Dados Pessoais</h2>
        <div className="grid gap-3 mt-8">
          {/* Nome */}
          <Input
            type="text"
            label="Nome"
            name="nome"
            isRequired
            defaultValue={nome}
            onBlur={(e) => setNome(e.target.value)}
            maxLength={100}
          />

          {/* CPF - Formata dinamicamente enquanto digita */}
          <Input
            label="CPF"
            isRequired
            defaultValue={cpf}
            onBlur={(e) => setCpf(formatCPF(e.target.value))}
            maxLength={14}
          />

          {/* Telefone - Formata dinamicamente enquanto digita */}
          <Input
            label="Telefone"
            name="telefone"
            isRequired
            defaultValue={telefone}
            onBlur={(e) => setTelefone(formatTelefone(e.currentTarget.value))}
            maxLength={14}
          />
        </div>
      </>
    );
  }

  function Instituicao() {
    return (
      <>
        <h2 className="text-2xl font-extrabold drop-shadow-lg">Instituição</h2>
        <div className="grid gap-3 mt-8">
          <Input
            label="CNPJ"
            name="cnpj"
            isRequired 
            defaultValue={cnpj}
            onBlur={(e) => setCnpj(formatCNPJ(e.target.value))}
            maxLength={18}
          />
          <Input
            label="Razão social"
            name="razao_social"
            isRequired
            defaultValue={razaoSocial}
            onBlur={(e) => setRazaoSocial(e.target.value)}
            maxLength={100}
          />
          <Input
            label="Nome Fantasia"
            name="nome_fantasia"
            defaultValue={nomeFantasia}
            onBlur={(e) => setNomeFantasia(e.target.value)}
            maxLength={100}
          />
        </div>
      </>
    );
  }

  function Login() {
    return (
      <>
        <h2 className="text-2xl font-extrabold drop-shadow-lg">Informações de login</h2>
        <div className="grid gap-3 mt-8">
          <Input label="Email" isRequired type="email" maxLength={100} defaultValue={email} onBlur={(e) => setEmail(e.target.value)}/>
          <Input label="Senha" isRequired type="password" maxLength={8} defaultValue={email} onBlur={(e) => setSenha(e.target.value)}/>
        </div>
      </>
    );
  }

  const steps = [
    { component: <DadosPessoais />, icon: <PersonIconHero size={25} />, validate: () => nome !== "" && telefone !== "" && cpf !== "" },
    { component: <Instituicao />, icon: <BuildingIconHero size={25} />, validate: () => cnpj !== "" && razaoSocial !== "" },
    { component: <Login />, icon: <LockIconHero size={25} />, validate: () => email !== "" && senha !== "" }
  ];

  return (
    <>
      <div className="flex flex-col bg-[#2B2A2A] flex justify-center items-center !rounded-3xl shadow-2xl shadow-black w-[1000px] ml-12">
        <div className="justify-center p-8 mb-8">
          <h1 className="text-5xl font-bold text-white">Cadastro de usuário</h1>
        </div>

        <Stepper steps={steps} handle={handleSubmit} />
      </div>
    </>
  );
}
