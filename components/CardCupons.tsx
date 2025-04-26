import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Modal, ModalContent, ModalHeader, ModalBody, Input,
    ModalFooter, DatePicker
  } from "@heroui/react";
  import { useEffect, useState } from "react";
  import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
  import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
  import { useAlert } from "@/contexts/AlertContext";
  import { CalendarDate, parseDate } from "@internationalized/date";
  import { DateValue } from "@react-types/calendar";
  
  type Cupom = {
    id: string;
    titulo: string;
    quantidade: number;
    validade: string; // "DD/MM/YYYY"
  };
  
  const CardConfigCupons = () => {
    const [cupons, setCupons] = useState<Cupom[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
    const cupomSelecionado = cupons.find(c => c.id === selectedId);
  
    const [titulo, setTitulo] = useState<string | null>(null);
    const [quantidade, setQuantidade] = useState<number | null>(null);
    const [validade, setValidade] = useState<CalendarDate | null>(null);
  
    const { showAlert } = useAlert();
  
    useEffect(() => {
      setTitulo(cupomSelecionado?.titulo ?? null);
      setQuantidade(cupomSelecionado?.quantidade ?? null);
      setValidade(stringToDateValue(cupomSelecionado?.validade ?? ""));
    }, [cupomSelecionado]);
  
    const fetchCupons = async () => {
      try {
        const res = await fetch("http://localhost:5000/cupons");
        if (!res.ok) throw new Error("Erro ao buscar cupons");
        const data = await res.json();
        setCupons(data);
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCupons();
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
        const res = await fetch(`http://localhost:5000/cupons/${selectedId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erro ao deletar cupom");
        setCupons(prev => prev.filter(c => c.id !== selectedId));
        showAlert("Cupom deletado com sucesso!", "success");
      } catch (err) {
        console.error("Erro ao deletar:", err);
        showAlert("Erro ao deletar cupom", "danger");
      } finally {
        closeDeleteModal();
      }
    };
  
    const handleSaveCupom = async () => {
      if (!selectedId) return;
  
      const cupomAtualizado = {
        titulo,
        quantidade,
        validade: validade ? formatDateValueToBR(validade) : ""
      };
  
      try {
        const res = await fetch(`http://localhost:5000/cupons/${selectedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cupomAtualizado),
        });
  
        if (!res.ok) throw new Error("Erro ao salvar cupom");
  
        const cupomSalvo = await res.json();
        setCupons(prev =>
          prev.map(c => (c.id === selectedId ? { ...c, ...cupomSalvo } : c))
        );
        showAlert("Cupom atualizado com sucesso", "success");
      } catch (err) {
        console.error("Erro ao salvar cupom:", err);
        showAlert("Erro ao salvar cupom", "danger");
      } finally {
        closeEditModal();
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
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return parseDate(trimmed);
      }
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        const [dia, mes, ano] = trimmed.split("/");
        return parseDate(`${ano}-${mes}-${dia}`);
      }
      console.warn("Formato de data inválido:", dateStr);
      return null;
    }
  
    const columns = [
      { key: "titulo", label: "TÍTULO" },
      { key: "quantidade", label: "QUANTIDADE" },
      { key: "validade", label: "VALIDADE" },
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
              <p className="p-4 text-white">Carregando cupons...</p>
            ) : (
              <Table className="p-4" aria-label="Tabela de Cupons">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={cupons}>
                  {(cupom) => (
                    <TableRow className="!bg-[#353536]" key={cupom.id}>
                      <TableCell>{cupom.titulo}</TableCell>
                      <TableCell>{cupom.quantidade}</TableCell>
                      <TableCell>{cupom.validade}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly onPress={() => openEditModal(cupom.id)}>
                            <ModeEditOutlineOutlinedIcon />
                          </Button>
                          <Button isIconOnly onPress={() => openDeleteModal(cupom.id)}>
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
  
        {/* Modal Excluir */}
        <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Confirmação</ModalHeader>
                <ModalBody>
                  <h2>Deseja mesmo excluir esse cupom permanentemente?</h2>
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
  
        {/* Modal Editar Cupom */}
        <Modal isOpen={isEditModalOpen} placement="top-center" onOpenChange={setIsEditModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Editar Cupom</ModalHeader>
                <ModalBody>
                  <Input
                    label="Título"
                    value={titulo ?? ""}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <Input
                    label="Quantidade"
                    type="number"
                    value={quantidade !== null ? String(quantidade) : ""}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                  />
                  <DatePicker
                    label="Validade"
                    className="max-w-[284px]"
                    defaultValue={validade}
                    onChange={(novaData) => setValidade(novaData)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Fechar
                  </Button>
                  <Button color="primary" onPress={handleSaveCupom}>
                    Salvar Alterações
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  export default CardConfigCupons;
  