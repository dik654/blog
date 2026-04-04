import Overview from './stark-theory/Overview';
import ExecutionTrace from './stark-theory/ExecutionTrace';
import AIRConstraints from './stark-theory/AIRConstraints';
import LowDegreeExtension from './stark-theory/LowDegreeExtension';
import ProofPipeline from './stark-theory/ProofPipeline';
import Comparison from './stark-theory/Comparison';

export default function STARKTheory() {
  return (
    <>
      <Overview />
      <ExecutionTrace />
      <AIRConstraints />
      <LowDegreeExtension />
      <ProofPipeline />
      <Comparison />
    </>
  );
}
