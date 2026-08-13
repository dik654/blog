import ExplainedFormula from "@/components/ui/explained-formula";
import SmoteViz from "./viz/SmoteViz";

export default function Sampling() {
  return (
    <section id="sampling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Resampling은 model이 보는 training prevalence만 바꿉니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Random oversampling은 minority row의 노출 횟수를 늘리고 undersampling은 majority 정보를 버립니다. 둘 다 validation·test·production prevalence를 바꾸지 않습니다. 먼저 group·time split을 만든 뒤 각 training fold에서만 sampler를 fit해야 validation row가 neighbor나 synthetic sample에 섞이지 않습니다.</p></div>
      <ExplainedFormula question="SMOTE는 minority sample 사이에서 새 point를 어떻게 만들까?" idea={<>Minority point xi와 같은 class의 neighbor xj를 고르고, 두 점을 잇는 선분 안에서 λ만큼 이동합니다.</>} formula={String.raw`\tilde{x}=x_i+\lambda(x_j-x_i),\qquad \lambda\sim U(0,1)`} terms={[{symbol:"xᵢ",name:"minority seed",description:"Training fold 안의 원래 minority sample입니다."},{symbol:"xⱼ",name:"minority neighbor",description:"같은 fold와 class에서 metric으로 선택한 이웃입니다."},{symbol:"λ",name:"interpolation position",description:"두 점 사이에서 synthetic point의 위치를 정합니다."},{symbol:"x̃",name:"synthetic sample",description:"Model training에만 추가되는 새 feature vector입니다."}]} assumptions={["Feature distance와 선형 보간이 domain에서 의미 있습니다.","Neighbor search와 합성은 training fold 내부에서만 수행합니다."]} interpretation="One-hot category, sparse vector, time sequence에서는 선분 중간이 유효한 row가 아닐 수 있습니다. Borderline-SMOTE·ADASYN도 이 기본 geometry 가정을 없애지 않습니다." />
      <div id="paper-smote" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · Minority interpolation</p><p className="mt-2 text-sm font-semibold">SMOTE: Synthetic Minority Over-sampling Technique</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Minority neighbor 사이의 선분에 synthetic example을 만들고 ROC space에서 sampling 조합을 평가했습니다. 당시 dataset·classifier·continuous feature 조건의 근거이며, 모든 table과 time-series에서 realism을 보장하지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1613/jair.953" target="_blank" rel="noreferrer">원 논문의 algorithm과 평가 보기</a></div>
      <div className="not-prose my-8"><SmoteViz /></div>
    </section>
  );
}
