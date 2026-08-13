import Overview from "./diffusion-models/Overview";
import ForwardReverse from "./diffusion-models/ForwardReverse";
import ContinuousTime from "./diffusion-models/ContinuousTime";
import UNet from "./diffusion-models/UNet";
import StableDiffusion from "./diffusion-models/StableDiffusion";

export default function DiffusionModelsArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ForwardReverse />
      <ContinuousTime />
      <UNet />
      <StableDiffusion />
    </div>
  );
}
