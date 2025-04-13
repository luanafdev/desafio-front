import { Avatar, Button } from '@heroui/react';
import { Input } from '@heroui/input';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { Link } from '@heroui/link';

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
    url_foto:string;
};

interface CardMeuPerfilProps {
    usuario: UserData | null;
}

const CardMeuPerfil: React.FC<CardMeuPerfilProps> = ({ usuario }) => {
    return(
        <div className='flex justify-center items-center mt-4 p-4 w-[900px]'>


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
                    <Input label="Nome" color="default" />
                    <Input label="Email" type="email" />
                    <Input label="Telefone" />
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
                            <Link className='font-light font-poppins cursor-pointer text:bg-blue-32'>Resetar senha</Link>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Button className="absolute right-6 bottom-6 rounded-2xl w-32 bg-[#14AE5C]">   Editar   </Button>
                </div>
                

            </div>
            
        </div>
        
    );
  
}

export default CardMeuPerfil;