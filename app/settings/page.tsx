"use client";

import PersonIcon from '@mui/icons-material/Person';
import SideBar from "@/components/SideBar";
import CardMeuPerfil from '@/components/CardMeuPerfil';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import  Settings  from '@mui/icons-material/Settings';
import AnimatedImage from '@/components/AnimatedImage';

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
  {
    tituloItem: `Bem vinda, ${user?.nome.split(" ")[0]}`,
    icon: SettingsIcon,
    content: <CardMeuPerfil usuario={user}/>,
  },
  {
    tituloItem: `Bem vinda, ${user?.nome.split(" ")[0]}`,
    icon: EventIcon,
    content: <CardMeuPerfil usuario={user}/>,
  },
 ];

 return (
  <SideBar
    className="-mt-8"
    titulo="Configurações da Conta e Preferências"
    items={items} conteudo={<AnimatedImage
      src="/assets/img-settings.png"
      alt="settings"
      width="w-[900px]"
      delay={0.3}
    />}
  />
  );
}
