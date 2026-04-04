import Overview from './diffusion-models/Overview';
import ForwardReverse from './diffusion-models/ForwardReverse';
import UNet from './diffusion-models/UNet';
import StableDiffusion from './diffusion-models/StableDiffusion';

export default function DiffusionModelsArticle() {
  return (
    <>
      <Overview />
      <ForwardReverse />
      <UNet />
      <StableDiffusion />
    </>
  );
}
