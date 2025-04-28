import { Card, CardBody, Image, CardFooter, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";

type Evento = {
  id: string;
  titulo: string;
  local: string;
  descricao: string;
  data: string; // Formato esperado: "DD/MM/YYYY"
  banner: string;
};

interface CardEventoProps {
  evento: Evento;
}

const CardEvento: React.FC<CardEventoProps> = ({ evento }) => {
  const [dia, mes] = evento.data.split("/");
  const mesAbrev = new Date(+`20${mes.length === 2 ? '' : '0'}${mes}`, +mes - 1).toLocaleString("en", {
    month: "short",
  }).toUpperCase();

  const router = useRouter();

  function redirectToCheckout() {
    router.push(`/checkout/${evento.id}`);
  }

  return (
    <Card  isPressable onPress={redirectToCheckout} className=" overflow-hidden flex flex-col justify-between bg-white">
      <CardBody className="p-0 h-full">
        <Image
          src={evento.banner}
          removeWrapper
          alt="Imagem do evento"
          className="w-full h-[200px] object-cover"
        />
      </CardBody>

      <CardFooter className="mt-2 mb-4 h-1/2  flex items-start gap-4 p-4">
        {/* Data à esquerda */}
        <div className="flex flex-col items-center text-blue-600 font-bold">
          <span className="text-xs">{mesAbrev}</span>
          <span className="text-2xl">{dia}</span>
        </div>

        {/* Info do evento */}
        <div className="items-start">
          <h3 className="text-sm font-semibold text-gray-800">{evento.titulo}</h3>
          <p className="text-sm font-semibold text-gray-800">{evento.local}</p>
          <p className="text-sm text-gray-500 mt-1">{evento.descricao}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardEvento;
