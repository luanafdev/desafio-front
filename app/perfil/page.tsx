"use client";

import PersonIcon from '@mui/icons-material/Person';
import SideBar from "@/components/SideBar";
import CardMeuPerfil from '@/components/CardMeuPerfil';
import { useEffect, useState } from 'react';

type UserData = {
  id: number | null;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  url_foto: string;
};

export default function LoginPage() {

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserData);
    } 
    else{
      window.location.href = '/login';
    }
    
  }, []); 


 const items = [
  {
    tituloItem: `Bem vinda, ${user?.nome.split(" ")[0]}`,
    icon: PersonIcon,
    content: <CardMeuPerfil usuario={user}/>,
  },
 ];

 return (
  <SideBar
    className="w-1/2"
    titulo={`Bem vinda, ${user?.nome.split(" ")[0]}`}
    items={items} conteudo={<CardMeuPerfil usuario={user}/>}
  />
  );
}
