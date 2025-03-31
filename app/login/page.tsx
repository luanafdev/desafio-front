"use client"

import { useState } from "react";
import { Accordion, AccordionItem, Input} from "@heroui/react";
import { Alert } from "@heroui/alert";
import { EmailIcon, PersonIcon, KeyIcon } from "@/components/icons";
import {Image} from "@heroui/image";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores
    
    try {
      // Fazendo a requisição corretamente
      const response = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      const data = await response.json();

      // Verifica se encontrou o usuário
      if (data.length > 0) {

        alert(`Bem-vindo, ${data[0].name}!`);

      } else {
        setError("Email ou senha incorretos.");
      }
    } catch (err) {

      // Caso ocorra algum erro na requisição
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
      <div className=" bg-[#2B2A2A] flex justify-center items-center !rounded-3xl shadow-2xl w-[900px]">
    
        {/* Div Esquerda */}    
        <div className="w-1/2 rounded-3xl ">
            <Image alt="logo" src={"/assets/logo.png"} className="h-[600px] w-[500px] object-cover "></Image>
        </div>

        {/* Div Direita (formulário de login) */}
        <div className="w-1/2 flex flex-col !items-center !justify-center p-5 ">
          <PersonIcon></PersonIcon>

          <form onSubmit={handleLogin} className="mt-16">
            <div className="flex items-center mb-4">
              <Input
              label="Email"
              labelPlacement="outside"
              placeholder="Digite seu email"
              startContent={
                <EmailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div className="flex items-center mb-4">
                <Input
                label="Senha"
                labelPlacement="outside"
                placeholder="Digite sua senha"
                startContent={
                  <KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="justify-center mt-16 -ml-16">
              <button
                type="submit"
                className="w-[248px] h-[55px] rounded-[25px] mt-26 bg-[#14AE5C] text-white cursor-pointer hover:bg-[#108B4A] ml-16"
              >
                L O G I N
              </button>
            </div>
           
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
  );
}
