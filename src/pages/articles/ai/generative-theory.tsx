import DistributionProblem from './generative-theory/DistributionProblem';
import LikelihoodRoute from './generative-theory/LikelihoodRoute';
import LatentRoute from './generative-theory/LatentRoute';
import ImplicitRoute from './generative-theory/ImplicitRoute';
import ModelDecision from './generative-theory/ModelDecision';

export default function GenerativeTheoryArticle() {
  return (
    <>
      <DistributionProblem />
      <LikelihoodRoute />
      <LatentRoute />
      <ImplicitRoute />
      <ModelDecision />
    </>
  );
}
