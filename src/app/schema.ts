export interface PossibleDiagnoses {
  [system: string]: {
    [diagnosis: string]: boolean;
  };
}
