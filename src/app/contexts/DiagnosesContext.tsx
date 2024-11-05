'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DiagnosesContextProps {
  diagnoses: { [key: string]: boolean };
  setDiagnoses: (diagnoses: { [key: string]: boolean }) => void;
}

const DiagnosesContext = createContext<DiagnosesContextProps | undefined>(
  undefined,
);

export const DiagnosesProvider = ({ children }: { children: ReactNode }) => {
  const diagnosesString = process.env.NEXT_PUBLIC_DIAGNOSES || '';
  const diagnosesArray = diagnosesString.split(',');

  // Initialize the state with all values set to true
  const initialDiagnosesState = diagnosesArray.reduce((acc, diagnosis) => {
    acc[diagnosis] = true;
    return acc;
  }, {} as { [key: string]: boolean });

  const [diagnoses, setDiagnoses] = useState<{
    [key: string]: boolean;
  }>(initialDiagnosesState);

  return (
    <DiagnosesContext.Provider value={{ diagnoses, setDiagnoses }}>
      {children}
    </DiagnosesContext.Provider>
  );
};

export const useDiagnoses = () => {
  const context = useContext(DiagnosesContext);
  if (!context) {
    throw new Error('useDiagnoses must be used within a DiagnosesProvider');
  }
  return context;
};
