import Overview from './transformer-architecture/Overview';
import SelfAttention from './transformer-architecture/SelfAttention';
import MultiHead from './transformer-architecture/MultiHead';
import PositionalEncoding from './transformer-architecture/PositionalEncoding';
import Summary from './transformer-architecture/Summary';

export default function TransformerArchitecture() {
  return (
    <div className="space-y-12">
      <Overview />
      <SelfAttention />
      <MultiHead />
      <PositionalEncoding />
      <Summary />
    </div>
  );
}
