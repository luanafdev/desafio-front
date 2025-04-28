"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";

type Evento = {
  id: string;
  titulo: string;
  local: string;
  descricao: string;
  data: string;
  banner: string;
};

type Setor = {
  id: string;
  eventoId: string;
  nome: string;
  capacidade: number;
  descricao: string;
};

type Lote = {
  id: string;
  evento_id: string;
  nome: string;
  preco: number;
  quantidade_total: number;
  quantidade_vendida: number;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
};

const CheckoutPage = () => {

  const params = useParams();
  const id = params?.id as string;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const [setorSelecionado, setSetorSelecionado] = useState<string>("");
  const [loteSelecionado, setLoteSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [pixCode, setPixCode] = useState("00020126420014BR.GOV.BCB.PIX0114+5581999999995204000053039865405100.005802BR5913Nome Exemplo6009SAO PAULO62070503***6304B14F");

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventoRes = await fetch(`http://localhost:5000/eventos/${id}`).then(res => res.json());
        const setoresRes = await fetch(`http://localhost:5000/setores?eventoId=${id}`).then(res => res.json());
        const lotesRes = await fetch(`http://localhost:5000/lotes?evento_id=${id}`).then(res => res.json());

        setEvento(eventoRes);
        setSetores(setoresRes);
        setLotes(lotesRes.filter((l: Lote) => l.ativo));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const lote = lotes.find(l => l.id === loteSelecionado);
  const total = lote ? lote.preco * quantidade : 0;

  const handleComprar = () => {
    alert("Compra realizada!");
    // Aqui poderia chamar POST para criar compra
  };

  if (!evento) {
    return <div className="p-8 text-center text-lg">Carregando evento...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 p-8 gap-8 w-full">
      
      {/* Coluna da esquerda */}
      <div className="w-2/3 bg-default  p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{evento.titulo}</h2>
        <img src={evento.banner} alt={evento.titulo} className="w-full h-64 object-cover rounded-lg mb-4" />
        
        <p className="mb-2"><strong>Local:</strong> {evento.local}</p>
        <p className="mb-2"><strong>Data:</strong> {evento.data}</p>
        <p className="mb-6">{evento.descricao}</p>

        {/* Seções de setores e lotes */}
        <div className="mb-4">
          <Select label="Setor" value={setorSelecionado} onChange={(e) => setSetorSelecionado(e.target.value)}>
            {setores.map(se => (
              <SelectItem key={se.id} >
                {se.nome}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Select label="Lote" value={loteSelecionado} onChange={(e) => setLoteSelecionado(e.target.value)}>
            {lotes.map(lo => (
              <SelectItem key={lo.id} >
                {lo.nome} - R$ {lo.preco.toFixed(2)}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Input
            label="Quantidade"
            type="number"
            min={1}
            value={quantidade.toString()}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Coluna da direita */}
      <div className="w-1/3 bg-default p-6 rounded-lg shadow flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Resumo</h2>

          <p className="mb-2"><strong>Evento:</strong> {evento.titulo}</p>
          {setorSelecionado && (
            <p className="mb-2"><strong>Setor:</strong> {setores.find(s => s.id === setorSelecionado)?.nome}</p>
          )}
          {loteSelecionado && (
            <p className="mb-2"><strong>Lote:</strong> {lotes.find(l => l.id === loteSelecionado)?.nome}</p>
          )}

          <p className="text-lg mt-4"><strong>Total:</strong> R$ {total.toFixed(2)}</p>
        </div>

        <Button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white"
          onPress={onOpen}
          disabled={!setorSelecionado || !loteSelecionado}
        >
          Comprar
        </Button>
      </div>

      {/* Modal de Pagamento */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent className="p-4">
          <ModalHeader className="text-center text-2xl font-bold">Pagamento via Pix</ModalHeader>
          <ModalBody className="flex flex-col items-center gap-4">
            <img src={qrCodeUrl} alt="QR Code do Pix" className="rounded-lg" />
            <p className="text-sm text-center break-words">
              Copie o código abaixo e pague no seu banco:
            </p>
            <textarea
              readOnly
              className="w-full p-2 text-sm bg-gray-100 text-black rounded"
              value={pixCode}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onOpenChange}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default CheckoutPage;
