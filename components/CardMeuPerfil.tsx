import { useState } from 'react';

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

interface CardMeuPerfilProps {
    usuario: UserData | null;
}

const CardMeuPerfil: React.FC<CardMeuPerfilProps> = ({ usuario }) => {
    return(
        <div className='flex justify-center items-center mt-8 p-4 w-[900px]'>
            <div className='w-full  h-[550px] bg-[#636262] rounded-2xl '>
                <div className=" rounded-md bg-cover h-[75px] w-full bg-[url('/assets/images.jpg')] bg-no-repeat"></div>

            </div>
        </div>
        
    );
  
}

export default CardMeuPerfil;