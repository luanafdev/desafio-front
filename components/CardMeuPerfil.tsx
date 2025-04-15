import { Alert, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { Input } from '@heroui/input';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { Link } from '@heroui/link';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { formatTelefone } from '@/expressoes-regulares/regex';
import { useAlert } from '@/contexts/AlertContext';


type UserData = {
  id: number | null;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  url_foto: string;
};

interface CardMeuPerfilProps {
  usuario: UserData | null;
}

const CardMeuPerfil: React.FC<CardMeuPerfilProps> = ({ usuario }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const { mensagem, tipoAlerta } = useAlert();
  const { showAlert } = useAlert();

  const handleUpdateUser = async () => {
    if (!usuario?.id) {
      showAlert("ID do usuário inválido", "danger");
      return;
    }
  
    const dadosAtualizados = {
      nome,
      email,
      telefone,
    };
  
    try {
      const response = await fetch(`http://localhost:5000/users/${usuario.id}`, {
        method: "PATCH", // ou "PUT" se quiser substituir tudo
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizados),
      });
  
      if (response.ok) {
        showAlert("Usuário atualizado com sucesso!", "success");
      } else {
        const errorData = await response.json();
        showAlert("Erro ao atualizar usuário.", "danger");
        console.error("Erro:", errorData);
      }
    } catch (error) {
      showAlert("Erro na requisição.", "danger");
      console.error("Erro ao atualizar:", error);
    }
  };
  

  return (
    <div className='flex justify-center items-center mt-1 p-4 w-[900px]'>

      
      <div className='w-full  h-[600px] bg-[#636262] rounded-2xl '>
        <div className=" rounded-md bg-cover h-[75px] w-full bg-[url('/assets/images.jpg')] bg-no-repeat"></div>

        <div className='flex p-8'>
          <Avatar className="w-20 h-20 text-large" src={usuario?.url_foto}></Avatar>
          <div className="text-white p-6 rounded-xl w-fit -mt-4">
            <h2 className="text-[20px] font-poppins font-light">{usuario?.nome}</h2>
            <div className="text-gray-400 text-[13px] mt-1 flex items-center gap-2 font-poppins">
              {usuario?.email}
            </div>
          </div>
        </div>


        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-6">

          <Input label="Nome" color="default" defaultValue={usuario?.nome} onChange={(e) => setNome(e.currentTarget.value)} classNames={{
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
          }} />

          <Input isRequired label="Email" type="email" color="default" defaultValue={usuario?.email} onChange={(e) => setEmail(e.currentTarget.value)} classNames={{
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
          }} />
          <Input isRequired label="Telefone" color="default" defaultValue  ={usuario?.telefone} onChange={(e) => setTelefone(formatTelefone(e.currentTarget.value))} classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/0",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }} />

          <div></div>

          <div className="grid w-1/2">
            <h2 className="text-sm font-light font-poppins mt-16">Documento</h2>

            <div className="flex items-center gap-2 mt-4">
              <div className="h-10 w-10 rounded-full bg-[#14AE5C]/15 flex items-center justify-center text-white">
                <DocumentScannerOutlinedIcon className="w-5 h-5 text-[#14AE5C]" />
              </div>
              <h2 className="text-sm font-light font-poppins text-white">{usuario?.cpf}</h2>
            </div>
          </div>

          <div className="-ml-64">
            <h2 className="text-sm font-light font-poppins mt-16 ml-8">Senha</h2>

            <div className="flex items-center gap-2 mt-4 ml-8">
              <div className="h-10 w-10 rounded-full bg-[#14AE5C]/15 flex items-center justify-center text-white">
                <KeyOutlinedIcon className="w-5 h-5 text-[#14AE5C]" />
              </div>
              <Link className='font-light font-poppins cursor-pointer text-[#82c9ed]' onPress={onOpen}>Resetar senha</Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <Button className="absolute right-6 bottom-6 rounded-2xl bg-[#14AE5C]" onPress={handleUpdateUser}>
            <SaveIcon></SaveIcon>
            Salvar alterações
          </Button>
        </div>

        <div className='flex justify-center items-center'>
            {/* Alerta */}
            {mensagem && tipoAlerta && (
                <div className="w-[500px] h-[20px] mb-4 flex items-center p-8">
                <Alert
                    color={tipoAlerta}
                    title={mensagem}
                />
                </div>
            )}
        </div>

        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Restauração de senha</ModalHeader>
              <ModalBody>
                <Input
                  
                  label="Email"
                  placeholder="Digite seu email"
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
               
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" className='text-white' onPress={() => showAlert("Senha temporária enviada para seu email!" , "success")}>
                  Restaurar senha
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>

    </div>

  );

}

export default CardMeuPerfil;