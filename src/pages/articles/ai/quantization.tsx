import Overview from './quantization/Overview';
import PTQ from './quantization/PTQ';
import QAT from './quantization/QAT';
import GPTQAWQ from './quantization/GPTQAWQ';
import Practice from './quantization/Practice';

export default function QuantizationArticle() {
  return (
    <>
      <Overview />
      <PTQ />
      <QAT />
      <GPTQAWQ />
      <Practice />
    </>
  );
}
