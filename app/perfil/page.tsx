"use client";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
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
};

export default function LoginPage() {

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserData);
    } 
  }, []); 


 const items = [
  {
    tituloItem: `Bem vinda, ${user?.nome}`,
    icon: PersonAddIcon,
    content: <CardMeuPerfil usuario={user}/>,
  },
 ];

 return (
  <SideBar
    className="w-1/2"
    titulo="Bem vinda, Luana!"
    items={items} conteudo={<CardMeuPerfil usuario={user}/>}
  />
  );
}
