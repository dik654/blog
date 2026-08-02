import WhyDiffusion from './diffusion-models/WhyDiffusion';
import ForwardNoising from './diffusion-models/ForwardNoising';
import NoisePredictionTraining from './diffusion-models/NoisePredictionTraining';
import ReverseSampling from './diffusion-models/ReverseSampling';
import ConditioningAndArchitecture from './diffusion-models/ConditioningAndArchitecture';
import DDPMEvidence from './diffusion-models/DDPMEvidence';
import LDMSourceEvidence from './diffusion-models/LDMSourceEvidence';
import ModernDiffusion from './diffusion-models/ModernDiffusion';

export default function DiffusionModelsArticle() {
  return (
    <>
      <WhyDiffusion />
      <ForwardNoising />
      <NoisePredictionTraining />
      <ReverseSampling />
      <DDPMEvidence />
      <ConditioningAndArchitecture />
      <LDMSourceEvidence />
      <ModernDiffusion />
    </>
  );
}
