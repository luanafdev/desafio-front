"use client";

import PersonIcon from '@mui/icons-material/Person';
import SideBar from "@/components/SideBar";
import CardMeuPerfil from '@/components/CardMeuPerfil';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import AnimatedImage from '@/components/AnimatedImage';
import CardConfigLoja from '@/components/CardConfigLoja';
import CardConfigEvento from '@/components/CardConfigEvento';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CardConfigCupons from '@/components/CardCupons';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CardConfigSetores from '@/components/CardConfigSetor';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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
  desconto: number;
  qtdMin: number;
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

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const response = await fetch(`http://localhost:5000/users/${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));

          } else {
            console.error("Erro ao buscar dados do usuário:", response.status);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      } else {
        console.log("Nenhum usuário encontrado no localStorage.");
        window.location.href = "/login-cad"
      }
    };
  
    fetchUserData();
  }, [user]);

 const items = [
  {
    tituloItem: `Bem vinda, ${user?.nome.split(" ")[0]}`,
    icon: PersonIcon,
    content: <CardMeuPerfil usuario={user}/>,
  },
  {
    tituloItem: `Bem vinda, ${user?.nome.split(" ")[0]}`,
    icon: SettingsIcon,
    content: <CardConfigLoja usuario={user}/>,
  },
  {
    tituloItem: `Esses são seus eventos!`,
    icon: EventIcon,
    content: <CardConfigEvento/>,
  },
  {
    tituloItem: `Esses são seus cupons!`,
    icon: ConfirmationNumberIcon,
    content: <CardConfigCupons/>,
  },
  {
    tituloItem: `Setores`,
    icon: EventSeatIcon,
    content: <CardConfigSetores/>,
  },
 ];

 return (
  <SideBar
    className="-mt-8"
    titulo="Configurações e Preferências"
    items={items} conteudo={<AnimatedImage
      src="/assets/image.png"
      alt="settings"
      width="w-[700px]"
      height='h-4/5'
      delay={0.3}
    />}
  />
  );
}
