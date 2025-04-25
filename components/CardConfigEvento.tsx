import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { useEffect, useState } from "react";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useAlert } from "@/contexts/AlertContext";
import FileInput, { Banner } from "./InputImage"; // Importe a interface Banner

type Evento = {
  id: string;
  titulo: string;
  local: string;
  descricao: string;
  data: string; // "DD/MM/YYYY"
  banner: string | null; // Permita que banner seja null inicialmente
};

const CardConfigEvento = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [novoBanner, setNovoBanner] = useState<string | null>(null);
  const eventoSelecionado = eventos.find(e => e.id === selectedId);

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

  const openDeleteModal = (id: string) => {
      setSelectedId(id);
      setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedId(null);
  };

  const openBannerModal = (id: string) => {
      setSelectedId(id);
      setIsBannerModalOpen(true);
      setNovoBanner(null); // Resetar o novo banner ao abrir o modal
  };

  const closeBannerModal = () => {
      setIsBannerModalOpen(false);
      setSelectedId(null);
      setNovoBanner(null);
  };

  const handleDelete = async () => {
      if (!selectedId) return;

      try {
          const res = await fetch(`http://localhost:5000/eventos/${selectedId}`, {
              method: "DELETE",
          });
          if (!res.ok) throw new Error("Erro ao deletar evento");
          setEventos(prev => prev.filter(evento => evento.id !== selectedId));
          showAlert("Evento deletado com sucesso!", "success");
      } catch (err) {
          console.error("Erro ao deletar:", err);
          showAlert("Erro ao deletar evento", "danger");
      } finally {
          closeDeleteModal();
      }
  };

  const handleSaveBanner = async () => {
      if (!selectedId || !novoBanner) return;

      try {
          const res = await fetch(`http://localhost:5000/eventos/${selectedId}`, {
              method: "PATCH", // ou PUT, dependendo do que seu JSON Server aceita
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ banner: novoBanner }), // atualiza só o campo banner
          });

          if (!res.ok) throw new Error("Erro ao salvar banner");

          const eventoAtualizado = await res.json();
          setEventos(prev =>
              prev.map(ev => ev.id === selectedId ? { ...ev, banner: eventoAtualizado.banner } : ev)
          );
          showAlert("Banner salvo com sucesso", "success");
      } catch (err) {
          console.error("Erro ao salvar banner:", err);
          showAlert("Erro ao salvar banner", "danger");
      } finally {
          closeBannerModal();
          setNovoBanner(null); // Limpa o base64 após salvar
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
                                              <Button isIconOnly onPress={() => openBannerModal(evento.id)}>
                                                  <ImageOutlinedIcon />
                                              </Button>
                                              <Button isIconOnly onPress={() => openDeleteModal(evento.id)}>
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

          {/* Modal confirmação */}
          <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} placement="top-center">
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

          {/* Modal InputImage */}
          <Modal isOpen={isBannerModalOpen} onOpenChange={setIsBannerModalOpen} placement="top-center">
              <ModalContent>
                  {(onClose) => (
                      <>
                          <ModalHeader className="flex flex-col gap-1">Selecione o banner</ModalHeader>
                          <ModalBody>
                              <FileInput
                                  existingBannerUrl={eventoSelecionado?.banner || null}
                                  onNewBase64={(base64) => setNovoBanner(base64)}
                                  onRemoveExistingBanner={() => setNovoBanner(null)} // Simplifiquei aqui
                              />
                          </ModalBody>
                          <ModalFooter>
                              <Button color="danger" variant="flat" onPress={onClose}>
                                  Cancelar
                              </Button>
                              <Button
                                  color="primary"
                                  variant="flat"
                                  onPress={async () => {
                                      await handleSaveBanner(); // <-- Salva o novo banner
                                      onClose(); // <-- Fecha o modal só depois de salvar
                                  }}
                                  isDisabled={!novoBanner}
                              >
                                  Salvar
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