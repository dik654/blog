import Overview from './alignment-methods/Overview';
import DPO from './alignment-methods/DPO';
import ConstitutionalAI from './alignment-methods/ConstitutionalAI';
import ORPO from './alignment-methods/ORPO';
import KTO from './alignment-methods/KTO';

export default function AlignmentMethodsArticle() {
  return (
    <>
      <Overview />
      <DPO />
      <ConstitutionalAI />
      <ORPO />
      <KTO />
    </>
  );
}
