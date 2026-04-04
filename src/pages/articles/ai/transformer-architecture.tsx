import Overview from './transformer-architecture/Overview';
import DataPrep from './transformer-architecture/DataPrep';
import InputEmbedding from './transformer-architecture/InputEmbedding';
import QKVComputation from './transformer-architecture/QKVComputation';
import AttentionScore from './transformer-architecture/AttentionScore';
import SelfAttention from './transformer-architecture/SelfAttention';
import MultiHead from './transformer-architecture/MultiHead';
import MaskedAttention from './transformer-architecture/MaskedAttention';
import CrossAttention from './transformer-architecture/CrossAttention';
import PositionalEncoding from './transformer-architecture/PositionalEncoding';
import FeedForward from './transformer-architecture/FeedForward';
import LayerNorm from './transformer-architecture/LayerNorm';
import LinearSoftmax from './transformer-architecture/LinearSoftmax';
import Training from './transformer-architecture/Training';
import ScalingLaws from './transformer-architecture/ScalingLaws';
import Summary from './transformer-architecture/Summary';

export default function TransformerArchitecture() {
  return (
    <div className="space-y-12">
      <Overview />
      <DataPrep />
      <InputEmbedding />
      <QKVComputation />
      <AttentionScore />
      <SelfAttention />
      <MultiHead />
      <MaskedAttention />
      <CrossAttention />
      <PositionalEncoding />
      <FeedForward />
      <LayerNorm />
      <LinearSoftmax />
      <Training />
      <ScalingLaws />
      <Summary />
    </div>
  );
}
