import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { KimiAxisViz } from "../kimi-k3-viz";

export default function KimiK3ArchitectureArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="모델 이름보다 먼저 볼 것" title="K3는 크기 하나가 아니라 세 개의 정보 이동 축을 다시 설계한 모델이다">
          2.8T라는 숫자부터 외우면 architecture가 보이지 않습니다. 먼저 한 token이 <strong>과거 token</strong>, <strong>이전 layer</strong>, <strong>expert</strong> 사이에서 어떻게 이동하는지만 분리합니다.
        </LessonHeader>
        <TermLesson name="K3 axis factorization" oneLine="Sequence·depth·width를 서로 다른 병목으로 보고 각 축에 별도의 memory·routing mechanism을 배치하는 시스템 설계입니다." shape="sequence: KDA↔MLA · depth: Block AttnRes · width: Stable LatentMoE" example="긴 문맥 비용은 KDA가, 93층의 source 선택은 AttnRes가, 896 expert의 계산 폭은 LatentMoE가 담당합니다." boundary="세 component의 효과를 더해 2.5×라고 계산하거나, 어느 하나가 K3 전체 성능을 단독 설명한다고 보지 않습니다." />
        <KimiAxisViz />
      </section>

      <section id="axes" className="space-y-6">
        <LessonHeader number="01" eyebrow="각 축에 질문 하나씩" title="세 글로 분리해 배운 뒤에만 전체 구조로 다시 조합한다">
          Sequence 글은 과거를 어떻게 기억하는지, depth 글은 앞선 표현을 어떻게 고르는지, width 글은 어느 expert를 어떤 폭으로 계산하는지 답합니다.
        </LessonHeader>
        <div className="not-prose grid gap-3 md:grid-cols-3">
          {[
            ["Sequence mixer", "과거 token 전체를 저장할까, 고정 state로 압축할까?", "/ai/kimi-k3-sequence-mixer"],
            ["Depth routing", "현재 layer는 직전 layer만 받을까, 이전 block을 골라 읽을까?", "/ai/kimi-k3-depth-routing"],
            ["Latent MoE", "전문가 계산을 full width로 할까, routed path만 줄일까?", "/ai/kimi-k3-latent-moe"],
          ].map(([name, question, href]) => (
            <a key={name} href={href} className="border border-border p-5 transition-colors hover:border-primary">
              <p className="font-black">{name}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{question}</p><p className="mt-4 text-xs font-black text-primary">독립 수업 열기 →</p>
            </a>
          ))}
        </div>
      </section>

      <section id="configuration" className="space-y-6">
        <LessonHeader number="02" eyebrow="공식 숫자를 흐름으로 읽기" title="69 KDA와 24 MLA는 93개 hybrid block이 아니라 93개 main layer다">
          공개 구성은 23개의 <code>3 KDA + 1 MLA</code> block 뒤에 마지막 MLA 하나를 둡니다. 식을 component 수의 장부로 읽습니다.
        </LessonHeader>
        <ExplainedFormula question="왜 KDA는 23×3이고 MLA는 23×1에 1을 더할까요?" idea="각 hybrid block 안의 layer 종류를 먼저 세고, block 밖에 따로 있는 final MLA를 마지막에 더합니다." formula={String.raw`L_{\rm KDA}=23\times3=69,\quad L_{\rm MLA}=23\times1+1=24`} annotatedFormula={String.raw`\begin{aligned}L_{\rm KDA}&=\underbrace{23\times3}_{\substack{\text{KDA 3개를}\text{23번 배치}}}=69\\L_{\rm MLA,block}&=\underbrace{23\times1}_{\text{block 안 MLA}}=23\\L_{\rm MLA}&=\underbrace{L_{\rm MLA,block}+1}_{\text{마지막 MLA 추가}}=24\\L_{\rm main}&=\underbrace{69+24}_{\text{main layer 합계}}=93\end{aligned}`} operations={[{expression:String.raw`23\times3`,annotation:["block 수와 block당 KDA를 곱해","recurrent layer 수 계산"]},{expression:String.raw`23\times1+1`,annotation:["block 안 MLA에 final MLA를 더해","global layer 수 계산"]},{expression:String.raw`69+24`,annotation:["두 layer 종류를 합쳐","main depth 93 확인"]}]} terms={[{symbol:String.raw`L_{\rm KDA}`,name:"KDA layer count",description:"고정 recurrent state를 갱신하는 main layer 수입니다."},{symbol:String.raw`L_{\rm MLA}`,name:"MLA layer count",description:"causal token memory를 직접 조회하는 main layer 수입니다."}]} assumptions={["Embedding과 output head를 main-layer 93 계산에 넣지 않습니다.","공식 공개 configuration을 그대로 셉니다."]} interpretation="총 93층 중 sequence length에 따라 KV cache가 늘어나는 global MLA 경로는 24층입니다. KDA state 비용은 별도로 계산해야 합니다." />
        <TermLesson name="공개 configuration receipt" oneLine="모델명 대신 layer·width·expert·context·dtype를 version과 함께 고정한 재현 장부입니다." shape="2.8T total · 104B active · 93 layers · 896 experts · 1,048,576 context" example="Inference memory를 계산할 때 total parameter와 token당 active parameter를 분리하고, MXFP4 weight와 runtime state를 별도 항으로 둡니다." boundary="표의 수치는 품질·latency·가용 VRAM을 자동으로 보장하지 않습니다. Runtime kernel과 batching 조건이 필요합니다." />
      </section>

      <section id="evidence" className="space-y-6">
        <LessonHeader number="03" eyebrow="무엇이 사실이고 무엇이 해석인가" title="Configuration·component 실험·전체 scaling claim을 같은 근거로 읽지 않는다">
          숫자가 정확해 보여도 claim의 범위는 다릅니다. 공식 config는 재현 사실이고, 작은 model의 ablation은 제한된 비교이며, 2.5×는 architecture·data·training을 합친 전체 결과입니다.
        </LessonHeader>
        <TermLesson name="Frontier scaling evidence boundary" oneLine="구성 사실, 방법 식, component ablation, 종합 scaling, benchmark harness를 서로 다른 증거 층으로 분리하는 읽기 규칙입니다." shape="config → method → ablation → integrated scaling → system benchmark" example="K3가 같은 loss에 약 2.5× 적은 compute를 보고했다는 사실을 KDA 단독 2.5× 속도 향상으로 바꾸지 않습니다." boundary="Tool·reasoning budget·runtime이 섞인 benchmark를 model weight만의 인과 효과로 일반화하지 않습니다." />
        <div id="paper-kimi-k3" className="scroll-mt-24">
          <CitationBlock source="Kimi K3: Open Frontier Intelligence" citeKey={1} href="https://arxiv.org/abs/2607.24653">
            <EvidenceGrid problem="세 scaling 축을 동시에 확장할 때의 비용과 안정성" contribution="KDA–MLA, Block AttnRes, Stable LatentMoE를 2.8T system에 통합" assumptions="공개 model version·data·training·infrastructure 조건" scope="공식 configuration·method·보고된 scaling과 benchmark" notClaim="각 component의 full-scale 독립 기여나 모든 hardware에서의 보편 우위" />
          </CitationBlock>
        </div>
        <ConceptLadderViz title="K3 전체 구조를 읽는 순서" description="한 축씩 배운 뒤 마지막에만 전체 system claim을 조합합니다." steps={[{label:"축 분리",detail:"sequence·depth·width 질문을 나눕니다."},{label:"독립 학습",detail:"각 mechanism의 state·shape·boundary를 배웁니다."},{label:"구성 장부",detail:"93층·896 expert·context를 version과 고정합니다."},{label:"근거 결합",detail:"마지막에만 통합 scaling claim을 읽습니다."}]} />
        <ContentBoundary article="kimi-k3-architecture" />
      </section>
    </article>
  );
}
