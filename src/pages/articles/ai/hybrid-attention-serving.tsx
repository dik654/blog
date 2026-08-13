import Capacity from "./hybrid-attention-serving/Capacity";
import Deployment from "./hybrid-attention-serving/Deployment";
import KVCache from "./hybrid-attention-serving/KVCache";
import KVFundamentals from "./hybrid-attention-serving/KVFundamentals";
import Overview from "./hybrid-attention-serving/Overview";

export default function HybridAttentionServingArticle() {
  return (
    <>
      <Overview />
      <KVFundamentals />
      <KVCache />
      <Capacity />
      <Deployment />
    </>
  );
}
