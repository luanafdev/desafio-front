import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { useEffect, useState } from "react";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useAlert } from "@/contexts/AlertContext";


type Evento = {
  id: string;
  titulo: string;
  local: string;
  descricao: string;
  data: string; // "DD/MM/YYYY"
  banner: string;
};

const CardConfigEvento = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();

  const fetchEventos = async () => {
    try {
      const res = await fetch("http://localhost:5000/eventos");
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      const data = await res.json();
      setEventos(data);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const openModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`http://localhost:5000/eventos/${selectedId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar evento");
      setEventos(prev => prev.filter(evento => evento.id !== selectedId));
      showAlert("Evento deletado com sucesso", "success");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      showAlert("Erro ao deletar evento", "error");
    } finally {
      closeModal();
    }
  };

  const columns = [
    { key: "titulo", label: "TÍTULO" },
    { key: "local", label: "LOCAL" },
    { key: "data", label: "DATA" },
    { key: "acoes", label: "AÇÕES" },
  ];

  return (
    <>
  <div className="flex justify-center items-center mt-1 p-4 w-[900px]">
    <div className="w-full h-[600px] bg-[#636262] rounded-2xl">
      <div className="rounded-md bg-cover h-[75px] w-full bg-[url('/assets/images.jpg')] bg-no-repeat" />
      {erro ? (
        <p className="text-red-500 p-4">Erro: {erro}</p>
      ) : loading ? (
        <p className="p-4 text-white">Carregando eventos...</p>
      ) : (
        <Table className="p-4" aria-label="Tabela de Eventos">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={eventos}>
            {(evento) => (
              <TableRow className="!bg-[#353536]" key={evento.id}>
                <TableCell>{evento.titulo}</TableCell>
                <TableCell>{evento.local}</TableCell>
                <TableCell>{evento.data}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly>
                      <ModeEditOutlineOutlinedIcon />
                    </Button>
                    <Button isIconOnly>
                      <ImageOutlinedIcon />
                    </Button>
                    <Button isIconOnly onPress={() => openModal(evento.id)}>
                      <DeleteForeverOutlinedIcon className="text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  </div>

  <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} placement="top-center">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Confirmação</ModalHeader>
          <ModalBody>
            <h2>Deseja mesmo excluir esse evento permanentemente?</h2>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                handleDelete();
                onClose(); // Fecha o modal após deletar
              }}
            >
              Excluir
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  </>
);
}



export default CardConfigEvento;
