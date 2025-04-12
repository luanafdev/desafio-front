"use client"

import { useState } from "react";
import { Alert, Input} from "@heroui/react";
import { EmailIcon, PersonIcon, KeyIcon } from "@/components/icons";
import {Image} from "@heroui/image";
import { useAlert } from "@/contexts/AlertContext";
import SideBar from "./SideBar";


export default function LoginComponent() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mensagem, tipoAlerta } = useAlert();

  const { showAlert} = useAlert(); 

  const handleLogin = async (e: { preventDefault: () => void; }) => {

    e.preventDefault();
    
    if(email != "" && password != ""){
      try {
        // Fazendo a requisição corretamente
        const response = await fetch(
          `http://localhost:5000/users?email=${email}&password=${password}`
        );
        
        const data = await response.json();
  
        // Verifica se encontrou o usuário
        if (data.length > 0) {
          showAlert(`Bem-vindo, ${data[0].name}!`, "success")
          window.location.href = "/"

        } else {
          showAlert("Email ou senha incorretos.", "danger")
        }
      } catch (err) {
  
        // Caso ocorra algum erro na requisição
        showAlert("Erro ao conectar com o servidor.", "danger");
      }
    }
   
  };

  return (
    <>
      <div className=" bg-[#2B2A2A] flex justify-center items-center !rounded-3xl shadow-2xl w-[1000px] h-[580px] ml-8">
        
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
            <div className="flex mt-12">
            {mensagem && tipoAlerta && (
              <div className="w-full flex items-center ">
                <Alert color={tipoAlerta} title={mensagem}></Alert>
              </div>
            )}
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
