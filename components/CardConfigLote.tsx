import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Modal, ModalContent, ModalHeader, ModalBody, Input, Switch,
    ModalFooter, useDisclosure
  } from "@heroui/react";
  import { useEffect, useState } from "react";
  import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
  import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
  import AddIcon from '@mui/icons-material/Add';
  import { useAlert } from "@/contexts/AlertContext";
  
  type Lote = {
    id: string;
    evento_id: string;
    nome: string;
    preco: number;
    quantidade_total: number;
    quantidade_vendida: number;
    data_inicio: string; // "DD/MM/YYYY"
    data_fim: string;
    ativo: boolean;
  };
  
  type Evento = {
    id: string;
    titulo: string;
  };
  
  const CardConfigLotes = () => {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEventoModalOpen, onOpenChange: onEventoModalChange } = useDisclosure({ defaultOpen: true });
    const { showAlert } = useAlert();
  
    const loteSelecionado = lotes.find(l => l.id === selectedId);
  
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState<number>(0);
    const [quantidadeTotal, setQuantidadeTotal] = useState<number>(0);
    const [quantidadeVendida, setQuantidadeVendida] = useState<number>(0);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [ativo, setAtivo] = useState(true);
  
    const fetchEventos = async () => {
      try {
        const res = await fetch("http://localhost:5000/eventos");
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos", err);
      }
    };
  
    const fetchLotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/lotes");
        const data = await res.json();
        setLotes(data);
      } catch (err) {
        console.error("Erro ao buscar lotes", err);
      }
    };
  
    useEffect(() => {
      fetchEventos();
      fetchLotes();
    }, []);
  
    useEffect(() => {
      if (loteSelecionado) {
        setNome(loteSelecionado.nome);
        setPreco(loteSelecionado.preco);
        setQuantidadeTotal(loteSelecionado.quantidade_total);
        setQuantidadeVendida(loteSelecionado.quantidade_vendida);
        setDataInicio(loteSelecionado.data_inicio);
        setDataFim(loteSelecionado.data_fim);
        setAtivo(loteSelecionado.ativo);
      }
    }, [loteSelecionado]);
  
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
        await fetch(`http://localhost:5000/lotes/${selectedId}`, { method: "DELETE" });
        setLotes(prev => prev.filter(l => l.id !== selectedId));
        showAlert("Lote deletado com sucesso", "success");
      } catch (err) {
        console.error(err);
        showAlert("Erro ao deletar lote", "danger");
      } finally {
        closeDeleteModal();
      }
    };
  
    const handleSaveLote = async () => {
      if (!selectedId) return;
      const loteAtualizado = { nome, preco, quantidade_total: quantidadeTotal, quantidade_vendida: quantidadeVendida, data_inicio: dataInicio, data_fim: dataFim, ativo };
      try {
        const res = await fetch(`http://localhost:5000/lotes/${selectedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loteAtualizado),
        });
        const loteSalvo = await res.json();
        setLotes(prev => prev.map(l => l.id === selectedId ? { ...l, ...loteSalvo } : l));
        showAlert("Lote atualizado com sucesso", "success");
      } catch (err) {
        console.error(err);
        showAlert("Erro ao atualizar lote", "danger");
      } finally {
        closeEditModal();
      }
    };
  
    const handleCreateLote = async () => {
      if (!eventoSelecionado) return;
      const novoLote: Lote = {
        id: crypto.randomUUID(),
        evento_id: eventoSelecionado,
        nome,
        preco,
        quantidade_total: quantidadeTotal,
        quantidade_vendida: 0,
        data_inicio: dataInicio,
        data_fim: dataFim,
        ativo,
      };
      try {
        await fetch("http://localhost:5000/lotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoLote),
        });
        setLotes(prev => [...prev, novoLote]);
        onOpenChange();
        resetForm();
      } catch (err) {
        console.error("Erro ao criar lote", err);
      }
    };
  
    const resetForm = () => {
      setNome("");
      setPreco(0);
      setQuantidadeTotal(0);
      setQuantidadeVendida(0);
      setDataInicio("");
      setDataFim("");
      setAtivo(true);
    };
  
    const lotesFiltrados = lotes.filter(l => l.evento_id === eventoSelecionado);
  
    const columns = [
      { key: "nome", label: "NOME" },
      { key: "preco", label: "PREÇO" },
      { key: "quantidade_total", label: "QTD TOTAL" },
      { key: "quantidade_vendida", label: "QTD VENDIDA" },
      { key: "data_inicio", label: "INÍCIO" },
      { key: "data_fim", label: "FIM" },
      { key: "ativo", label: "ATIVO" },
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
                <Button key={evento.id} onPress={() => {
                  setEventoSelecionado(evento.id);
                  onEventoModalChange();
                }}>
                  {evento.titulo}
                </Button>
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
  
        {/* Área principal */}
        <div className="flex justify-center items-center mt-1 p-4 w-[1000px]">
          <div className="w-full h-[600px] bg-[#636262] rounded-2xl">
            <div className="rounded-md bg-cover h-[75px] w-full bg-[url('/assets/images.jpg')] bg-no-repeat" />
            <Table className="p-4" aria-label="Tabela de Lotes">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={lotesFiltrados}>
                {(lote) => (
                  <TableRow className="!bg-[#353536]" key={lote.id}>
                    <TableCell>{lote.nome}</TableCell>
                    <TableCell>R$ {lote.preco}</TableCell>
                    <TableCell>{lote.quantidade_total}</TableCell>
                    <TableCell>{lote.quantidade_vendida}</TableCell>
                    <TableCell>{lote.data_inicio}</TableCell>
                    <TableCell>{lote.data_fim}</TableCell>
                    <TableCell>{lote.ativo ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button isIconOnly onPress={() => openEditModal(lote.id)}>
                          <ModeEditOutlineOutlinedIcon />
                        </Button>
                        <Button isIconOnly onPress={() => openDeleteModal(lote.id)}>
                          <DeleteForeverOutlinedIcon className="text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
  
        {/* Botão Adicionar */}
        <div className="relative mb-6">
          <Button onPress={onOpen} className="absolute right-6 bottom-6 px-6 py-2 rounded-full text-white font-semibold bg-[#255F47] border border-[#00FF94] hover:bg-[#2c7358] transition w-[170px] h-[50px]">
            <AddIcon className="-mr-2" />
            Adicionar lote
          </Button>
        </div>
  
        {/* Modal Excluir */}
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} placement="top-center">
          <ModalContent>
            <ModalHeader>Confirmar Exclusão</ModalHeader>
            <ModalBody>Tem certeza que deseja excluir este lote?</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeDeleteModal}>Cancelar</Button>
              <Button color="primary" variant="flat" onPress={handleDelete}>Excluir</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Modal Editar Lote */}
        <Modal isOpen={isEditModalOpen} placement="top-center" onOpenChange={setIsEditModalOpen}>
          <ModalContent>
            <ModalHeader>Editar Lote</ModalHeader>
            <ModalBody>
              <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <Input label="Preço" type="number" value={preco.toString()} onChange={(e) => setPreco(Number(e.target.value))} />
              <Input label="Quantidade Total" type="number" value={quantidadeTotal.toString()} onChange={(e) => setQuantidadeTotal(Number(e.target.value))} />
              <Input label="Quantidade Vendida" type="number" value={quantidadeVendida.toString()} onChange={(e) => setQuantidadeVendida(Number(e.target.value))} />
              <Input label="Data de Início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              <Input label="Data de Fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              <Switch isSelected={ativo} onValueChange={setAtivo}>Ativo</Switch>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeEditModal}>Fechar</Button>
              <Button color="primary" onPress={handleSaveLote}>Salvar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Modal Novo Lote */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="bg-[#353536] text-white">
            <ModalHeader>Criar Novo Lote</ModalHeader>
            <ModalBody>
              <Input label="Nome" placeholder="Nome do lote" onChange={(e) => setNome(e.target.value)} />
              <Input label="Preço" type="number" placeholder="Preço" onChange={(e) => setPreco(Number(e.target.value))} />
              <Input label="Quantidade Total" type="number" placeholder="Quantidade total" onChange={(e) => setQuantidadeTotal(Number(e.target.value))} />
              <Input label="Data Início" placeholder="DD/MM/YYYY" onChange={(e) => setDataInicio(e.target.value)} />
              <Input label="Data Fim" placeholder="DD/MM/YYYY" onChange={(e) => setDataFim(e.target.value)} />
              <Switch isSelected={ativo} onValueChange={setAtivo}>Ativo</Switch>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onOpenChange}>Cancelar</Button>
              <Button color="primary" onPress={handleCreateLote}>Salvar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default CardConfigLotes;
  