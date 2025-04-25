import { Card, CardBody, Image, CardFooter, CardHeader } from "@heroui/react";


type Categoria = {
    id: string,
    descricao: string,
    image: string
}


interface CardCatergoriaProps {
    categoria: Categoria;
}


const CardEvento: React.FC<CardCatergoriaProps> = ({ categoria }) => {
    return(
        <Card isPressable key={categoria.id} className="h-[300px]">

            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <h1 className="text-white font-medium text-4xl">{categoria.descricao}</h1>
            </CardHeader>

            <Image
            isZoomed    
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={categoria.image}
            />

      </Card>
    )
}

export default CardEvento;