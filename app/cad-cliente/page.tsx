"use client"

import Stepper from "@/components/stepper";
import {BuildingIconHero, LockIconHero, PersonIconHero} from "@/components/icons"
import { Input } from "@heroui/input";
import InputCPF from "@/components/InputCPF";
import InputTelefone from "@/components/InputTelefone";
import { useState } from "react";

export default function CadastroCliente() {

    const [user, setUser] = useState({
      id: null,
      nome: "",
      email: "",
      senha: "",
      cpf: "",
      cnpj: "",
      razao_social: "",
      nome_fantasia: "",
      telefone: ""
    })

   
    function DadosPessoais(){
        return(
            <>
                <h2 className="text-lg font-extrabold  drop-shadow-lg mt-2">
                    Dados Pessoais
                </h2>

                <div className="grid gap-3 mt-8">

                    <Input type="text" label="Nome" isRequired  onChange={(e) => user.nome = e.target.value}></Input>

                    <InputCPF/>

                    <InputTelefone/>
                </div>

            </>
        )
    }
    
    function Instituicao(){
        return(
            <>
            <h2 className="text-2xl font-extrabold  drop-shadow-lg">
                Instituição
            </h2>
        </>
        )
    }
    
    function Login(){
        return(
            <>
            <h2 className="text-2xl font-extrabold  drop-shadow-lg">
                Informações de login
            </h2>
        </>
        )
    }

     
    const steps = [
        { component: <DadosPessoais />, icon: <PersonIconHero size={25} />, validate: () => user.nome !== "" && user.telefone !== "" && user.cpf !== "", },
        { component: <Instituicao />, icon: <BuildingIconHero size={25} />, validate: () => user.cnpj !== "" && user.razao_social !== "" },
        { component: <Login />, icon: <LockIconHero size={25} />, validate: () => user.email !== "" && user.senha !== "" }
    ];


    return (
        <>  
            <div className="flex flex-col bg-[#2B2A2A] flex justify-center items-center !rounded-3xl shadow-2xl shadow-black w-[900px]">

                <div className="justify-center p-8 mb-8">
                    <h1 className="text-5xl font-bold text-white">
                        Cadastro de usuário
                    </h1>
                </div>

                <Stepper steps={steps} />

            </div>
        </>
    );
}