import { PossibleDiagnoses } from '../schema';

export const parsePossibleDiagnoses = () => {
  const possibleDiagnosesString = process.env.NEXT_PUBLIC_DIAGNOSES || '';
  const possibleDiagnosesArray = possibleDiagnosesString.split(',');

  return possibleDiagnosesArray.reduce((acc, diagnosis) => {
    acc[diagnosis] = true;
    return acc;
  }, {} as PossibleDiagnoses);
};
