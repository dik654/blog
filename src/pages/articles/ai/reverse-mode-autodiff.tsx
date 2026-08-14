import ForwardPass from "./backprop-optimization/ForwardPass";
import ChainRule from "./backprop-optimization/ChainRule";

export default function ReverseModeAutodiffArticle() {
  return (
    <article>
      <ForwardPass />
      <ChainRule />
    </article>
  );
}
