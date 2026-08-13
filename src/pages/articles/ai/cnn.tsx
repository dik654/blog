import Overview from "./cnn/Overview";
import ConvolutionLayer from "./cnn/ConvolutionLayer";
import InductiveBias from "./cnn/InductiveBias";
import Architectures from "./cnn/Architectures";
import Applications from "./cnn/Applications";
import CNNvsTransformer from "./cnn/CNNvsTransformer";

export default function CNNArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <ConvolutionLayer />
      <InductiveBias />
      <Architectures />
      <Applications />
      <CNNvsTransformer />
    </div>
  );
}
