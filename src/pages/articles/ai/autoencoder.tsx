import Overview from "./autoencoder/Overview";
import Architecture from "./autoencoder/Architecture";
import ForwardExample from "./autoencoder/ForwardExample";
import LossAndBackprop from "./autoencoder/LossAndBackprop";
import DimensionReduction from "./autoencoder/DimensionReduction";
import Applications from "./autoencoder/Applications";
import Variants from "./autoencoder/Variants";

export default function AutoencoderArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Architecture />
      <ForwardExample />
      <LossAndBackprop />
      <DimensionReduction />
      <Applications />
      <Variants />
    </div>
  );
}
