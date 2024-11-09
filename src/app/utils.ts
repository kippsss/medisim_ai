export const selectRandomDiagnosis = (possibleDiagnosesLabels: string[]) => {
  return possibleDiagnosesLabels[
    Math.floor(Math.random() * possibleDiagnosesLabels.length)
  ];
};
