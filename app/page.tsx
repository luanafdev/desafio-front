"use client"

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@heroui/react';
import AnimatedImage from '@/components/AnimatedImage';

export default function Home() {


  return (
    <section className="flex flex-col top-0 h-[600px] w-full bg-[url('/assets/bg.png')] bg-no-repeat bg-cover right-0">

      {/* Imagem por cima */}
      <div className=" flex ml-[100px] mt-8">

        <ConfirmationNumberIcon></ConfirmationNumberIcon>
        <img
          src="/assets/ToDentro.png"
          alt="label"
          className="w-[100px] ml-2"
        />
        <AnimatedImage
          src="/assets/billie 1.png"
          alt="Imagem sobre o fundo"
          width="w-[400px]"
          height='h-[503px]'
          delay={0.3}
          direction='down'
          className="absolute top-[97px] bottom-0"
        />
        
      </div>

      {/* Conteúdo do centro (opcional) */}
      <div className="relative flex flex-row items-center ml-[600px] top-[50px]">
        <AnimatedImage
          src="/assets/text.png"
          alt="label"
          direction='down'
          delay={0.3}
          className="w-[700px] mr-2"
        />
        <ArrowForwardIosIcon color="primary" sx={{ fontSize: 80 }} className='-mt-16 -ml-16 opacity-45'/>
      </div>


    </section>
  );
}


