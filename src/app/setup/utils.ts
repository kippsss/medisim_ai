import { PossibleDiagnoses } from '../schema';

export const parsePossibleDiagnoses = (): PossibleDiagnoses => {
  const possibleDiagnoses = JSON.parse(
    process.env.NEXT_PUBLIC_DIAGNOSES || '{}',
  );
  const parsedDiagnoses: { [key: string]: { [key: string]: boolean } } = {};

  for (const system in possibleDiagnoses) {
    parsedDiagnoses[system] = {};
    possibleDiagnoses[system].forEach((diagnosis: string) => {
      parsedDiagnoses[system][diagnosis] = true;
    });
  }
  return parsedDiagnoses;
};
