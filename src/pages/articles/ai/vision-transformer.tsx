import Overview from "./vision-transformer/Overview";
import PatchEmbedding from "./vision-transformer/PatchEmbedding";
import Architecture from "./vision-transformer/Architecture";
import Tradeoff from "./vision-transformer/Tradeoff";
import Practice from "./vision-transformer/Practice";

export default function VisionTransformerArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <PatchEmbedding />
      <Architecture />
      <Tradeoff />
      <Practice />
    </div>
  );
}
