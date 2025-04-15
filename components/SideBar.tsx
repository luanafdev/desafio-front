"use client"

import { useState } from "react";
import { useRouter } from 'next/router';
import { usePathname } from "next/navigation";

type SideBarItem = {
  icon: React.ElementType;
  content: React.ReactNode;
  tituloItem: string;
};

type SideBarProps = {
  titulo: string;
  conteudo: React.ReactNode;
  items?: SideBarItem[];
  className: string
};

export default function SideBar({ conteudo, items = [], className, titulo}: SideBarProps) {
  const [conteudoDireito, setConteudoDireito] = useState(conteudo);

  const router = usePathname();

  const [activeIndex, setActiveIndex] = useState<number | null>(router != '/settings'? 0 : null); // Add state for active index
  const [headerTitulo, setHeaderTitulo] = useState(titulo); // Add state for active index

  const handleSelection = (itemContent: React.ReactNode, index: number, titulo: string) => {
    setConteudoDireito(itemContent);
    setActiveIndex(index); // Update active index on selection
    setHeaderTitulo(titulo);
  };

  return (
    <div className={className + "w-[1328px] h-[700px] bg-[#2B2A2A] flex rounded-2xl -mt-4"}>
      <aside className="w-[50px] text-white shadow-lg p-6 bg-[#2B2A2A] rounded-xl drop-shadow-sm h-[700px]">
        <ul className="space-y-4 mt-16 flex flex-col items-center">
        {items.map(({ icon: Icon, content, tituloItem }, index) => {
            const isActive = index === activeIndex;

            return (
                <li
                key={index}
                className={`w-[50px] h-[50px] flex items-center justify-center rounded-md relative overflow-hidden mt-10 ${ // Adicione relative e overflow-hidden
                    isActive ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#35604A_0%] before:via-[#14AE5C_0%] before:via-[#17C964_0%] before:to-[#F9F9F9_100%] before:opacity-25" : ""
                }`}
                >
                <button onClick={() => handleSelection(content, index, tituloItem)} className="relative z-10"> {/* Adicione relative e z-10 */}
                    <Icon sx={{ color: isActive ? "#6EC698" : "#A1A1AA", width: 24, height: 24 }} className="!opacity-100"/>
                </button>
                </li>
            );
        })}
        </ul>
      </aside>
      <div className="flex-1 p-4 rounded-xl bg-[#2B2A2A] text-white ">
        <h1 className="text-2xl font-poppins text-[18px] font-light font-small text-[20px] mb-8">{headerTitulo}</h1>
        {conteudoDireito}
      </div>
    </div>
  );
}
