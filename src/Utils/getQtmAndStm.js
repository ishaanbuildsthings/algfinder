export default function getQtmAndStm(solution) {
  const noSpacesPrimeOrDouble = solution.replace(/[ '2]/g, '');
  const totalSliceMoves = (noSpacesPrimeOrDouble.match(/[ESM]/g) || []).length;
  const sliceTurnMetric = noSpacesPrimeOrDouble.length;
  const halfTurnMetric = sliceTurnMetric + totalSliceMoves;
  return [sliceTurnMetric, halfTurnMetric];
}