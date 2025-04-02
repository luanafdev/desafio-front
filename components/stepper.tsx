import { useState } from "react";
import { Button } from "@heroui/button";

export default function Stepper({ steps }) {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <Button 
              isIconOnly 
              color={activeStep === index ? "warning" : "default"}   
            >
            {step.icon}
            </Button>
            {index < steps.length - 1 && (
              <div style={{ width: "80px", height: "1.5px", backgroundColor: activeStep >= index + 1 ? "#F5A524" : "gray" }} />
            )}
          </div>
        ))}
      </div>

      <div>{steps[activeStep].component}</div>

      <div style={{ marginTop: "20px" }}>
        {activeStep > 0 && <Button onPress={prevStep}>Anterior</Button>}
        <Button onPress={nextStep} style={{ marginLeft: "10px" }}>
          {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}