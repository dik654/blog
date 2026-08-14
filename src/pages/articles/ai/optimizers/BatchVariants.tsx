import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BatchVariantsViz from "./viz/BatchVariantsViz";

export default function BatchVariants() {
  return (
    <section id="batch-variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Full batch·single sample·mini-batch는 같은 objective를 다른 비용으로 본다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Full batch는 dataset 전체를 합쳐 정확한 empirical gradient를 계산하고, single-sample SGD는 하나만 보고 update합니다. Mini-batch는 accelerator 병렬성을 활용하면서 estimate variance를 줄이는 중간점입니다. <Link to="/ai/math-variance-sampling#law-of-large-numbers">독립 평균의 1/B 관계</Link>가 이 비교의 수학적 기준입니다.</p></div>
      <BatchVariantsViz />
      <ExplainedFormula question="Micro-batch를 여러 번 누적하면 큰 batch 한 번과 언제 같은 gradient가 될까요?" idea={<>각 micro-batch loss를 전체 effective batch 기준으로 평균내고 parameter를 중간에 update하지 않으면, sample gradient 합은 한 번에 계산한 평균과 같습니다.</>} formula={String.raw`B_{\mathrm{eff}}=B_{\mathrm{micro}}K,\qquad g_{\mathrm{eff}}=\frac1K\sum_{k=1}^{K}g_k`} terms={[{symbol:"B_{\\mathrm{micro}}",name:"micro-batch size",description:"Memory에 한 번에 올려 forward·backward하는 sample 수입니다."},{symbol:"K",name:"accumulation steps",description:"Parameter update 전에 gradient를 누적하는 횟수입니다."},{symbol:"B_{\\mathrm{eff}}",name:"effective batch",description:"한 optimizer update가 평균낸 전체 sample 수입니다."}]} assumptions={["K번 동안 parameter가 바뀌지 않고 sample loss weighting이 동일합니다.","Loss reduction을 올바르게 나눠 gradient scale을 큰 batch와 맞춥니다.","BatchNorm 통계·dropout randomness·data order까지 실행이 완전히 같아진다는 뜻은 아닙니다."]} interpretation="Micro 4를 8번 누적하면 effective batch는 32입니다. Loss sum을 그대로 8번 더하고 나누지 않으면 gradient가 8배가 되어 같은 실험이 아닙니다." />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Batch를 키우면 독립 sample이라는 이상화 아래 variance는 줄지만 standard deviation은 1/√B로 줄어듭니다. Data correlation·without-replacement sampling·distributed sharding에서는 covariance와 finite-population 효과도 고려해야 하며, 처리량 이득도 kernel shape와 communication에 따라 달라집니다.</p></div>
    </section>
  );
}
