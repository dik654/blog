import Overview from './gpu-witness-gen/Overview';
import R1csSolve from './gpu-witness-gen/R1csSolve';
import GpuApproach from './gpu-witness-gen/GpuApproach';
import StateOfArt from './gpu-witness-gen/StateOfArt';

export default function GpuWitnessGenArticle() {
  return (
    <>
      <Overview />
      <R1csSolve />
      <GpuApproach />
      <StateOfArt />
    </>
  );
}
