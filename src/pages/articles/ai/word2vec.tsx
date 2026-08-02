import ContextPairs from './word2vec/ContextPairs';
import PredictionObjectives from './word2vec/PredictionObjectives';
import NegativeSampling from './word2vec/NegativeSampling';
import GeometryAndLimits from './word2vec/GeometryAndLimits';
import ModernHandoff from './word2vec/ModernHandoff';

export default function Word2VecArticle() {
  return (
    <>
      <ContextPairs />
      <PredictionObjectives />
      <NegativeSampling />
      <GeometryAndLimits />
      <ModernHandoff />
    </>
  );
}
