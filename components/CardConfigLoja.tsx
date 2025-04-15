import { Alert, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Select, useDisclosure } from '@heroui/react';
import { Input } from '@heroui/input';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import { useAlert } from '@/contexts/AlertContext';
import InputImage from './InputImage';
import { Banner } from './InputImage';

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
  desconto: number;
  qtdMin: number;
};

interface CardConfigLoja {
  usuario: UserData | null;
}

const CardConfigLoja: React.FC<CardConfigLoja> = ({ usuario }) => {

  const [nomeFantasia, setNomeFantasia] = useState(usuario?.nomeFantasia);
  const [razaoSocial, setRazaoSocial] = useState(usuario?.razaoSocial);
  const [desconto, setDesconto] = useState(usuario?.desconto);
  const [qtdMin, setQtdMin] = useState(usuario?.qtdMin);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [cores, setCores] = useState<string[]>([]);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const { mensagem, tipoAlerta } = useAlert();
  const { showAlert } = useAlert();

  const handleUpdateUser = async () => {
    if (!usuario?.id) {
      showAlert("ID do usuário inválido", "danger");
      return;
    }
  
    const dadosAtualizados = {
        razaoSocial,
        nomeFantasia,
        desconto, 
        qtdMin
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
        showAlert("Configurações de loja atualizadas!", "success");
      } else {
        const errorData = await response.json();
        showAlert("Erro ao configurar.", "danger");
        console.error("Erro:", errorData);
      }
    } catch (error) {
      showAlert("Erro na requisição.", "danger");
      console.error("Erro ao atualizar:", error);
    }

    if (banners.length > 0) {
        try {
          const response = await fetch("http://localhost:5000/banners", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(banners),
          });
      
          if (!response.ok) {
            throw new Error("Erro ao salvar os banners");
          }
        } catch (error) {
          console.error(error);
          showAlert("Erro ao salvar os banners", "danger");
        }
    }
  };
  
  useEffect(() => {

    const fetchBanners = async () => {
        try {
          const response = await fetch(`http://localhost:5000/banners?id_usuario=${usuario?.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            setBanners(data);
          } else {
            const errorData = await response.json();
            showAlert("Erro ao buscar banners.", "danger");
            console.error("Erro:", errorData);
          }
        } catch (error) {
          showAlert("Erro na conexão com o servidor.", "danger");
          console.error("Erro:", error);
        }
      };

      fetchBanners();
  }, [usuario?.id]);
  

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


        <div className="grid grid-cols-3 gap-4 p-8 py-2">

            {/* Inputs normais ocupando 2/3 */}
            <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-4">
            <Input
                label="Razão Social"
                defaultValue={usuario?.razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
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
                label="Nome Fantasia"
                defaultValue={usuario?.nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
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

            <NumberInput
                label="Desconto"
                value={usuario?.desconto}
                onValueChange={setDesconto}
                startContent={
                <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">%</span>
                </div>
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
                }}
            />

            <NumberInput
                label="Qtd. Min. para desconto"
                defaultValue={usuario?.qtdMin}
                onValueChange={setQtdMin}
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
                }}
            />
            </div>
            
            {/* Input de imagem ocupando 1/3 */}
            <div className="flex flex-col justify-center items-center">
                <label className='font-light font-poppins -mt-4 -ml-[170px] mb-2'>Banners</label>
                <InputImage banners={banners} onChange={setBanners}/>
            </div>
        </div>


          <div className="grid w-1/2 p-6 -mt-8">
            <h2 className="text-sm font-light font-poppins mt-16">Documento</h2>

            <div className="flex items-center gap-2 mt-4">
              <div className="h-10 w-10 rounded-full bg-[#14AE5C]/15 flex items-center justify-center text-white">
                <DocumentScannerOutlinedIcon className="w-5 h-5 text-[#14AE5C]" />
              </div>
              <h2 className="text-sm font-light font-poppins text-white">{usuario?.cnpj}</h2>
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
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                        Close
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

export default CardConfigLoja;