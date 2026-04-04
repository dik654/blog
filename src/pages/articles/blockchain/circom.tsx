import Overview from './circom/Overview';
import TemplateSignal from './circom/TemplateSignal';
import R1CSGen from './circom/R1CSGen';
import SnarkjsIntegration from './circom/SnarkjsIntegration';
import CircuitExamples from './circom/CircuitExamples';

export default function CircomArticle() {
  return (
    <>
      <Overview />
      <TemplateSignal />
      <R1CSGen />
      <SnarkjsIntegration />
      <CircuitExamples />
    </>
  );
}
