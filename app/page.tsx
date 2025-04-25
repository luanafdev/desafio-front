"use client";

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, DatePicker, Input } from '@heroui/react';
import AnimatedImage from '@/components/AnimatedImage';
import CardEvento from '@/components/CardEvento';
import { useEffect, useState } from 'react';
import CardCategoria from '@/components/CardCategoria';

export default function Home() {
  const [eventosDestaque, setEventosDestaque] = useState([]);
  const [eventosRecentes, setEventosRecentes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        const [eventosRes, lotesRes] = await Promise.all([
          fetch("http://localhost:5000/eventos"),
          fetch("http://localhost:5000/lote")
        ]);

        const eventos = await eventosRes.json();
        const lotes = await lotesRes.json();

        const eventosComVendas = eventos.map(evento => {
          const lotesDoEvento = lotes.filter(lote => lote.evento_id === evento.id);
          const totalVendido = lotesDoEvento.reduce((acc, lote) => acc + (lote.quantidade_vendida || 0), 0);
          return { ...evento, totalVendido };
        });

        const top3 = eventosComVendas
          .sort((a, b) => b.totalVendido - a.totalVendido)
          .slice(0, 3);

        setEventosDestaque(top3);
      } catch (error) {
        console.error("Erro ao buscar eventos de destaque:", error);
      }
    };

    const fetchRecentes = async () => {
      try {
        const res = await fetch("http://localhost:5000/eventos");
        const eventos = await res.json();

        const eventosComData = eventos.map(e => ({
          ...e,
          dataOrdenavel: new Date(e.data.split("/").reverse().join("-"))
        }));

        const maisRecentes = eventosComData
          .sort((a, b) => b.dataOrdenavel - a.dataOrdenavel)
          .slice(0, 3);

        setEventosRecentes(maisRecentes);
      } catch (error) {
        console.error("Erro ao buscar eventos recentes:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:5000/categorias");
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchDestaques();
    fetchRecentes();
    fetchCategorias();
  }, []);

  return (
    <div className="w-full flex flex-col">

      {/* Header */}
      <div className="relative w-full h-[700px] bg-[url('/assets/bg.png')] bg-no-repeat bg-cover overflow-hidden">
        <div className="flex ml-[150px] mt-8">
          <ConfirmationNumberIcon />
          <img src="/assets/ToDentro.png" alt="label" className="w-[100px] ml-2" />

          <div className="absolute right-16">
            <Button className="text-white border-white rounded-3xl" variant="bordered">
              Login
            </Button>
          </div>

          <AnimatedImage
            src="/assets/billie 1.png"
            alt="Imagem sobre o fundo"
            width="w-[455px]"
            height="h-[603px]"
            delay={0.3}
            direction="down"
            className="absolute top-[97px] bottom-0"
          />
        </div>

        <div className="relative flex flex-row items-center ml-[650px] top-[50px]">
          <AnimatedImage
            src="/assets/text.png"
            alt="label"
            direction="down"
            delay={0.3}
            className="w-[700px] mr-2"
          />
          <ArrowForwardIosIcon color="primary" sx={{ fontSize: 80 }} className="-mt-16 -ml-16 opacity-45" />
        </div>

        <div className="flex justify-center items-center mt-20 ml-4">
          <Button size="lg" className="text-white border-white rounded-3xl bg-[#F5167E] shadow-md">
            Comprar ticket
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid justify-center items-center mt-[50px] mb-8">
        <div className="bg-[#529371] p-4 rounded-md w-[1000px] shadow-md shadow-blue-500/50">
          <div className="flex gap-4">
            <Input
              classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }}
              variant="underlined"
              label="Procurar evento"
            />
            <Input
              classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }}
              variant="underlined"
              label="Localidade"
            />
            <DatePicker
              classNames={{
                label: "text-white",
                input: "text-white placeholder-white",
                innerWrapper: "text-white",
                inputWrapper: "border-white before:border-white after:border-white hover:border-white"
              }}
              variant="underlined"
              className="max-w-[284px]"
              label="Data"
            />
          </div>
        </div>
      </div>

      {/* Em destaque */}
      <div className="mt-36 mb-16 w-full px-4">
        <img src="/assets/Em destaque.png" alt="label" className="w-[250px] ml-20" />

        <div className="mt-16 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {eventosDestaque.map((evento, i) => (
            <CardEvento key={i} evento={evento} />
          ))}
        </div>
          <div className=' mt-32 flex justify-center items-center'>
            <Button className='px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[150px] h-[80px] '>Saiba mais</Button>
          </div>
        </div>

      {/* Categorias */}
      <div className="mt-36 px-4 w-full">
        <img src="/assets/Categorias.png" alt="label" className="w-[250px] ml-20" />

        <div className="mt-8 mx-auto max-w-4xl grid grid-cols-2 gap-6">
          {categorias.map((categoria, i) => (
            <CardCategoria key={i} categoria={categoria} />
          ))}
        </div>

        <div className=' mt-32 flex justify-center items-center'>
            <Button className='px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[150px] h-[80px] '>Saiba mais</Button>
          </div>
      </div>

      {/* Recentes */}
      <div className="mt-36 px-4 w-full">
        <img src="/assets/Recentes.png" alt="label" className="w-[250px] ml-20" />

        <div className="mt-16 mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {eventosRecentes.map((evento, i) => (
            <CardEvento key={i} evento={evento} />
          ))}
        </div>
        <div className=' mt-32 flex justify-center items-center'>
            <Button className='px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[150px] h-[80px] '>Saiba mais</Button>
          </div>
      </div>

      <footer className="bg-[#00005E] text-white py-12 px-6 sm:px-20 flex flex-col sm:flex-row justify-between items-start gap-12 mt-96">
      
      {/* Lado esquerdo */}
      <div className="max-w-md">
        <img src="/assets/ToDentro.png" alt="Logo Todentro" className="mb-4 w-[100px]" />
        <p className="text-sm leading-relaxed text-gray-200">
          A Todentro é a sua nova plataforma web para venda de tickets de forma simples e segura. 
          Conectamos produtores e público com eficiência, tecnologia e experiência personalizada. 
          Se é evento, é Todentro — onde o ingresso certo encontra o seu momento.
        </p>
      </div>
      {/* Lado direito */}
      <div className="max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Mantenha-Se Atualizado</h2>
        <p className="text-sm text-gray-300 mb-4">
          Participe de nossa lista de transmissão para receber avisos de show antecipadamente e promoções.
        </p>

        {/* Campo de email e botão */}
        <div className="flex rounded-full overflow-hidden shadow-md">
          <Input
            placeholder="Digite seu email"
            className="rounded-none rounded-l-full text-black px-4 focus:outline-none"
          />
          <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-none rounded-r-full px-6 -ml-6">
            Inscreva-se
          </Button>
        </div>
      </div>
    </footer>
    </div>
  );
}
