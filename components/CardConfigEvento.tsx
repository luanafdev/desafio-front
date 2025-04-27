import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Modal, ModalContent, ModalHeader, ModalBody, Input,
  ModalFooter,
  DatePicker,
  DateValue
} from "@heroui/react";
import { useEffect, useState } from "react";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useAlert } from "@/contexts/AlertContext";
import FileInput, { Banner } from "./InputImage"; // Importe a interface Banner
import { CalendarDate, parseDate } from "@internationalized/date";
import AddIcon from '@mui/icons-material/Add';


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
    const eventoSelecionado = eventos.find(e => e.id === selectedId);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [local, setLocal] = useState<string | null>(null);
    const [data, setData] = useState<CalendarDate | null>(null);
    const [descricao, setDescricao] = useState<string | null>(null);
    const [novoBanner, setNovoBanner] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [novoTitulo, setNovoTitulo] = useState<string>("");
    const [novoLocal, setNovoLocal] = useState<string>("");
    const [novoDescricao, setNovoDescricao] = useState<string>("");
    const [novoData, setNovoData] = useState<DateValue | null>(null);
    const [novoBannerBase64, setNovoBannerBase64] = useState<string | null>(null);

  const [titulo, setTitulo] = useState<string | null>(null); // Inicializa vazio

  // Você pode usar um useEffect para atualizar o título quando o evento selecionado mudar
  useEffect(() => {
    
      setTitulo(eventoSelecionado?.titulo!);
      setLocal(eventoSelecionado?.local!)
      setLocal(eventoSelecionado?.descricao!)
    
  }, []);

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

  const openEditModal = (id: string) => {
      setSelectedId(id);
      setIsEditModalOpen(true);
      setNovoBanner(null); // Resetar o novo banner ao abrir o modal
  };

  const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedId(null);
      setNovoBanner(null);
  };

  const handleAddEvento = async () => {
    const eventoNovo = {
      id: Math.random().toString(36).substring(2, 10), // cria um id aleatório
      titulo: novoTitulo,
      local: novoLocal,
      descricao: novoDescricao,
      data: novoData ? formatDateValueToBR(novoData) : "",
      banner: novoBannerBase64 ?? "",
    };
  
    try {
      const res = await fetch(`http://localhost:5000/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoNovo),
      });
  
      if (!res.ok) throw new Error("Erro ao adicionar evento");
  
      setEventos(prev => [...prev, eventoNovo]);
      showAlert("Evento adicionado com sucesso!", "success");
  
      // Limpa estados
      setNovoTitulo("");
      setNovoLocal("");
      setNovoDescricao("");
      setNovoData(null);
      setNovoBannerBase64(null);
      setIsAddModalOpen(false);
  
    } catch (err) {
      console.error("Erro ao adicionar evento:", err);
      showAlert("Erro ao adicionar evento", "danger");
    }
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
              method: "PATCH", //  ou PUT, dependendo do que seu JSON Server aceita
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
            closeEditModal();
          setNovoBanner(null); // Limpa o base64 após salvar
      }
  };

  const handleSaveEvento = async () => {
    if (!selectedId) return;
  
    const eventoAtualizado = {
      titulo,
      descricao,
      local,
      data,
      banner: novoBanner ?? eventoSelecionado?.banner ?? "",
      id_usuario: "3"
      // adicione outros campos se houver
    };
  
    try {
      const res = await fetch(`http://localhost:5000/eventos/${selectedId}`, {
        method: "PATCH", // ou "PUT" se for substituir tudo
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventoAtualizado),
      });
  
      if (!res.ok) throw new Error("Erro ao salvar evento");
  
      const eventoSalvo = await res.json();
  
      setEventos(prev =>
        prev.map(ev =>
          ev.id === selectedId ? { ...ev, ...eventoSalvo } : ev
        )   
      );
  
    } catch (err) {
        console.error("Erro ao salvar evento:", err);
        showAlert("Erro ao salvar evento", "danger");
    } finally {
        setNovoBanner(null); // limpa banner base64 temporário
        closeBannerModal();  // se quiser fechar modal após salvar
        showAlert("Evento salvo com sucesso", "success");
    }
  };
  
  function formatDateValueToBR(dateValue: DateValue): string {
    const day = String(dateValue.day).padStart(2, "0");
    const month = String(dateValue.month).padStart(2, "0");
    const year = dateValue.year;
    return `${day}/${month}/${year}`;
  }

  
function stringToDateValue(dateStr?: string | null) {
  if (!dateStr || typeof dateStr !== "string") return null;

  const trimmed = dateStr.trim();

  // ISO: yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return parseDate(trimmed);
  }

  // BR: dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [dia, mes, ano] = trimmed.split("/");
    return parseDate(`${ano}-${mes}-${dia}`);
  }

  // Se ainda assim não reconhecer, retorna null sem quebrar
  console.warn("Formato de data inválido:", dateStr);
  return null;
}


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
                                              <Button isIconOnly onPress={() => openEditModal(evento.id)}>
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

            <div className="relative mb-6">
                <Button onPress={() => setIsAddModalOpen(true)} className="absolute right-6 bottom-6 px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[150px] h-[50px]">
                    <AddIcon className="-mr-2" ></AddIcon>
                    Adicionar evento
                </Button>
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

        {/* Modal Editar evento */}
        <Modal isOpen={isEditModalOpen} placement="top-center" onOpenChange={setIsEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar Evento</ModalHeader>
              <ModalBody>

              <Input
                label="Título"
                defaultValue={eventoSelecionado?.titulo}
                onChange={(e) => 
                  setTitulo(e.target.value)
                }
                classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                ],
                }}
            />

            <Input
                label="Local"
                defaultValue={eventoSelecionado?.local}
                onChange={(e) => setLocal(e.target.value)}
                classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                ],
                }}
            />

            <Input
                label="Descrição"
                defaultValue={eventoSelecionado?.descricao}
                onChange={(e) => setDescricao(e.target.value)}
                classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                ],
                }}
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
                  defaultValue={stringToDateValue(eventoSelecionado?.data!)}
                  onChange={(novaData) =>
                    setData(novaData ? formatDateValueToBR(novaData) : "")
                  }
                  ></DatePicker>
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={handleSaveEvento}>
                  Salvar Alterações
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>



      <Modal isOpen={isAddModalOpen} placement="top-center" onOpenChange={setIsAddModalOpen}>
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Novo Evento</ModalHeader>
                <ModalBody>

                <Input
                    label="Título"
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                />
                <Input
                    label="Local"
                    value={novoLocal}
                    onChange={(e) => setNovoLocal(e.target.value)}
                />
                <Input
                    label="Descrição"
                    value={novoDescricao}
                    onChange={(e) => setNovoDescricao(e.target.value)}
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
                    value={novoData}
                    onChange={(date) => setNovoData(date)}
                />

                <FileInput
                    existingBannerUrl={null}
                    onNewBase64={(base64) => setNovoBannerBase64(base64)}
                    onRemoveExistingBanner={() => setNovoBannerBase64(null)}
                />

                </ModalBody>
                <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                </Button>
                <Button color="primary" onPress={handleAddEvento}>
                    Salvar Evento
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