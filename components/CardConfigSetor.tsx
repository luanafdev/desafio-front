import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Modal, ModalContent, ModalHeader, ModalBody, Input,
    ModalFooter, useDisclosure
  } from "@heroui/react";
  import { useEffect, useState } from "react";
  import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
  import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
  import AddIcon from '@mui/icons-material/Add';
  import { useAlert } from "@/contexts/AlertContext";
  
  type Setor = {
    id: string;
    eventoId: string;
    nome: string;
    capacidade: number;
    descricao: string;
  };
  
  type Evento = {
    id: string;
    titulo: string;
    local: string;
    descricao: string;
    data: string; // Formato esperado: "DD/MM/YYYY"
    banner: string;
  };
  
  
  const CardConfigSetores = () => {
    const [setores, setSetores] = useState<Setor[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEventoModalOpen, onOpenChange: onEventoModalChange } = useDisclosure({ defaultOpen: true });
    const setorSelecionado = setores.find(s => s.id === selectedId);
  
    const [nome, setNome] = useState<string>("");
    const [capacidade, setCapacidade] = useState<number>(0);
    const [descricao, setDescricao] = useState<string>("");

    const [eventos, setEventos] = useState<Evento[]>([]);

    const fetchEventos = async () => {
    try {
        const res = await fetch("http://localhost:5000/eventos");
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data = await res.json();
        setEventos(data);
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
    }
    };

    useEffect(() => {
    fetchEventos();
    }, []);

  
    const { showAlert } = useAlert();
  
    useEffect(() => {
      if (setorSelecionado) {
        setNome(setorSelecionado.nome);
        setCapacidade(setorSelecionado.capacidade);
        setDescricao(setorSelecionado.descricao);
      }
    }, [setorSelecionado]);
  
    const fetchSetores = async () => {
      try {
        const res = await fetch("http://localhost:5000/setores");
        if (!res.ok) throw new Error("Erro ao buscar setores");
        const data = await res.json();
        setSetores(data);
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchSetores();
    }, []);
  
    const openDeleteModal = (id: string) => {
      setSelectedId(id);
      setIsDeleteModalOpen(true);
    };
  
    const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    };
  
    const openEditModal = (id: string) => {
      setSelectedId(id);
      setIsEditModalOpen(true);
    };
  
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedId(null);
    };
  
    const handleDelete = async () => {
      if (!selectedId) return;
      try {
        const res = await fetch(`http://localhost:5000/setores/${selectedId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao deletar setor");
        setSetores(prev => prev.filter(s => s.id !== selectedId));
        showAlert("Setor deletado com sucesso!", "success");
      } catch (err) {
        console.error("Erro ao deletar setor:", err);
        showAlert("Erro ao deletar setor", "danger");
      } finally {
        closeDeleteModal();
      }
    };
  
    const handleSaveSetor = async () => {
      if (!selectedId) return;
  
      const setorAtualizado = { nome, capacidade, descricao };
  
      try {
        const res = await fetch(`http://localhost:5000/setores/${selectedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(setorAtualizado),
        });
  
        if (!res.ok) throw new Error("Erro ao salvar setor");
  
        const setorSalvo = await res.json();
        setSetores(prev =>
          prev.map(s => (s.id === selectedId ? { ...s, ...setorSalvo } : s))
        );
        showAlert("Setor atualizado com sucesso", "success");
      } catch (err) {
        console.error("Erro ao salvar setor:", err);
        showAlert("Erro ao salvar setor", "danger");
      } finally {
        closeEditModal();
      }
    };
  
    const handleCreateSetor = async () => {
      if (!nome || capacidade == null || !descricao || !eventoSelecionado) return;
  
      const novoSetor: Setor = {
        id: crypto.randomUUID(),
        eventoId: eventoSelecionado,
        nome,
        capacidade,
        descricao,
      };
  
      try {
        const res = await fetch("http://localhost:5000/setores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoSetor),
        });
  
        if (!res.ok) throw new Error("Erro ao criar setor");
  
        setSetores(prev => [...prev, novoSetor]);
        onOpenChange(); // fecha modal
        resetForm();
      } catch (err) {
        console.error("Erro ao criar setor:", err);
      }
    };
  
    const resetForm = () => {
      setNome("");
      setCapacidade(0);
      setDescricao("");
    };
  
    const setoresFiltrados = setores.filter(s => s.eventoId === eventoSelecionado); 
    console.log(eventos)
  
    const columns = [
      { key: "nome", label: "NOME" },
      { key: "capacidade", label: "CAPACIDADE" },
      { key: "descricao", label: "DESCRIÇÃO" },
      { key: "acoes", label: "AÇÕES" },
    ];
  
    return (
      <>
        {/* Modal Escolher Evento */}
        <Modal isOpen={isEventoModalOpen} onOpenChange={onEventoModalChange} placement="top-center">
        <ModalContent>
            <ModalHeader>Escolha o Evento</ModalHeader>
            <ModalBody>
            {eventos.map(evento => (
                <Button
                key={evento.id}
                onPress={() => {
                    setEventoSelecionado(evento.id);
                    onEventoModalChange();
                }}
                >
                {evento.titulo}
                </Button>
            ))}
            </ModalBody>
        </ModalContent>
        </Modal>
        
        {/* Área Principal */}
        <div className="flex justify-center items-center mt-1 p-4 w-[900px]">
          <div className="w-full h-[600px] bg-[#636262] rounded-2xl">
            <div className="rounded-md bg-cover h-[75px] w-full bg-[url('/assets/images.jpg')] bg-no-repeat" />
            {erro ? (
              <p className="text-red-500 p-4">Erro: {erro}</p>
            ) : loading ? (
              <p className="p-4 text-white">Carregando setores...</p>
            ) : (
              <Table className="p-4" aria-label="Tabela de Setores">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={setoresFiltrados}>
                  {(setor) => (
                    <TableRow className="!bg-[#353536]" key={setor.id}>
                      <TableCell>{setor.nome}</TableCell>
                      <TableCell>{setor.capacidade}</TableCell>
                      <TableCell>{setor.descricao}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly onPress={() => openEditModal(setor.id)}>
                            <ModeEditOutlineOutlinedIcon />
                          </Button>
                          <Button isIconOnly onPress={() => openDeleteModal(setor.id)}>
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
  
        {/* Botão Adicionar */}
        <div className="relative mb-6">
          <Button onPress={onOpen} className="absolute right-6 bottom-6 px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[150px] h-[50px]">
            <AddIcon className="-mr-2" />
            Adicionar setor
          </Button>
        </div>
  
        {/* Modal Excluir */}
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Confirmar Exclusão</ModalHeader>
                <ModalBody>
                  Tem certeza que deseja excluir esse setor?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" variant="flat" onPress={() => {
                    handleDelete();
                    onClose();
                  }}>
                    Excluir
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
  
        {/* Modal Editar Setor */}
        <Modal isOpen={isEditModalOpen} placement="top-center" onOpenChange={setIsEditModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Editar Setor</ModalHeader>
                <ModalBody>
                  <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                  <Input label="Capacidade" type="number" value={capacidade.toString()} onChange={(e) => setCapacidade(Number(e.target.value))} />
                  <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Fechar
                  </Button>
                  <Button color="primary" onPress={handleSaveSetor}>
                    Salvar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
  
        {/* Modal Novo Setor */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="bg-[#353536] text-white">
            <ModalHeader>Criar Novo Setor</ModalHeader>
            <ModalBody>
              <Input label="Nome" placeholder="Nome do setor" onChange={(e) => setNome(e.target.value)} />
              <Input label="Capacidade" type="number" placeholder="Capacidade" onChange={(e) => setCapacidade(parseInt(e.target.value))} />
              <Input label="Descrição" placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onOpenChange}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleCreateSetor}>
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  export default CardConfigSetores;
  