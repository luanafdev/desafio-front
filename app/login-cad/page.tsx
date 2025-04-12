"use client";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import SideBar from "@/components/SideBar";
import CardLogin from '@/components/CardLogin';
import CardCadastroCliente from '@/components/CardCadastroCliente';

export default function LoginPage() {

  const items = [
    {
      tituloItem: "Cadastra-se aqui!",
      icon: PersonAddIcon,
      content: <CardCadastroCliente></CardCadastroCliente>,
    },
    {
      tituloItem: "Faça login aqui",
      icon: LoginIcon,
      content: <CardLogin></CardLogin>,
    },
  ];

  return (
    <SideBar
      titulo="Cadastre-se aqui!"
      items={items} conteudo={<CardCadastroCliente></CardCadastroCliente>} className={''}    />
    );
}
