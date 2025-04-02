"use client"

import Stepper from "@/components/stepper";
import {MoonFilledIcon, SunFilledIcon, PersonIcon} from "@/components/icons"

export default function CadastroCliente() {
   
    function DadosPessoais(){
        return(
            <h1>Dados</h1>
        )
    }
    
    function Instituicao(){
        return(
            <h1>Instituicao</h1>
        )
    }
    
    function Login(){
        return(
            <h1>Login</h1>
        )
    }

     
    const steps = [
        { component: <DadosPessoais />, icon: <PersonIcon size={25} /> },
        { component: <Instituicao />, icon: <SunFilledIcon size={25} /> },
        { component: <Login />, icon: <MoonFilledIcon size={25} /> }
    ];


    return (
        <>  
           <Stepper steps={steps} />
        </>
    );
}