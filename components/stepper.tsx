import { useState } from "react";
import { Button } from "@heroui/button";
import { useAlert } from "@/contexts/AlertContext";
import { Alert } from "@heroui/alert";

interface Step {
  component: JSX.Element;
  icon: JSX.Element;
  validate: () => boolean;
}

interface StepperProps {
  steps: Step[];
  handle: () => void
}

export default function Stepper({ steps, handle}: StepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const { mensagem, tipoAlerta } = useAlert();

  const { showAlert} = useAlert(); 


  const nextStep = () => {
    if (steps[activeStep].validate()) {
      setError(""); // Reseta o erro se a validação for bem-sucedida
      if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
    } else {
      showAlert("Preencha todos os campos obrigatórios antes de continuar!", "danger");
    }
  };

  const prevStep = () => {
    setError(""); // Reseta o erro ao voltar
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="text-center">
      {/* Barra de progresso */}
      <div className="flex justify-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <Button isIconOnly color={activeStep === index ? "success" : "default"}>
              {step.icon}
            </Button>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 ${
                  activeStep >= index + 1 ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Conteúdo da etapa atual */}
      <div>{steps[activeStep].component}</div>

      {/* Alerta */}
      {mensagem && tipoAlerta && (
        <div className="w-full flex items-center p-8">
          <Alert color={tipoAlerta} title={mensagem}></Alert>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="mt-6 flex justify-center gap-4 mb-6">
        {activeStep > 0 && <Button onPress={prevStep}>Anterior</Button>}
        <Button onPress={activeStep === steps.length - 1? handle : nextStep}>
          {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
