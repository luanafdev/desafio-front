"use client"

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, DatePicker, Input } from '@heroui/react';
import AnimatedImage from '@/components/AnimatedImage';

export default function Home() {


  return (
    <section className="flex flex-col top-0 h-screen w-full right-0">

      {/* Header */}
      <div className="bg-[url('/assets/bg.png')] bg-no-repeat bg-cover h-[700px]">
          <div className=" flex ml-[150px] mt-8">

            <ConfirmationNumberIcon></ConfirmationNumberIcon>
            <img
              src="/assets/ToDentro.png"
              alt="label"
              className="w-[100px] ml-2"
            />

            <div className='absolute right-16'>
              <Button className='text-white border-white rounded-3xl' variant="bordered">
                Login
              </Button>
            </div>

            <AnimatedImage
              src="/assets/billie 1.png"
              alt="Imagem sobre o fundo"
              width="w-[400px]"
              height='h-[505px]'
              delay={0.3}
              direction='down'
              className="absolute top-[97px] bottom-0"
            />

          </div>

          {/* Conteúdo do centro (opcional) */}
          <div className="relative flex flex-row items-center ml-[650px] top-[50px]">
            <AnimatedImage
              src="/assets/text.png"
              alt="label"
              direction='down'
              delay={0.3}
              className="w-[600px] mr-2"
            />
            <ArrowForwardIosIcon color="primary" sx={{ fontSize: 80 }} className='-mt-16 -ml-16 opacity-45'/>
          </div>

          <div className='flex justify-center items-center mt-20 ml-20'>
            <Button size='lg' className='text-white border-white rounded-3xl bg-[#F5167E] shadow-md' >
              Comprar ticket
            </Button>
          </div>

        </div>
      
        {/* Filtros */}
        <div className="grid justify-center items-center mt-[50px] mb-8">
          <div className="bg-[#529371] p-4 rounded-md w-[1000px] shadow-md shadow-blue-500/50">
            <div className="flex gap-4 ">

              <Input  classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }} variant="underlined" label="Procurar evento" />

              <Input classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }} variant="underlined" label="Localidade" />

              <DatePicker classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }} variant="underlined" className="max-w-[284px]" label="Data" />

            </div>
          </div>
        </div>

      

    </section>
  );
}


