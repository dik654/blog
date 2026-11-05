import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { KimiAxisViz } from "../kimi-k3-viz";
import {
  ModelArchitectureCaseLocator,
  ModelArchitectureCaseMapReturn,
} from "../shared/ModelArchitectureCaseLocator";

export default function KimiK3ArchitectureArticle() {
  return (
    <article id="overview" className="space-y-16">
      <ModelArchitectureCaseLocator current="kimi" />
      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="모델 이름보다 먼저 볼 것" title="K3는 크기 하나가 아니라 세 개의 정보 이동 축을 다시 설계한 모델이다">
          2.8T라는 숫자부터 외우면 architecture가 보이지 않습니다. 먼저 한 token이 <strong>과거 token</strong>, <strong>이전 layer</strong>, <strong>expert</strong> 사이에서 어떻게 이동하는지만 분리합니다.
        </LessonHeader>
        <KimiAxisViz />
        <TermLesson name="K3 axis factorization" oneLine="Sequence·depth·width를 서로 다른 병목으로 보고 각 축에 별도의 memory·routing mechanism을 배치하는 시스템 설계입니다." shape="sequence: KDA↔MLA · depth: Block AttnRes · width: Stable LatentMoE" example="긴 문맥 비용은 KDA가, 93층의 source 선택은 AttnRes가, 896 expert의 계산 폭은 LatentMoE가 담당합니다." boundary="세 component의 효과를 더해 2.5×라고 계산하거나, 어느 하나가 K3 전체 성능을 단독 설명한다고 보지 않습니다." />
      </section>

      <section id="axes" className="space-y-6">
        <LessonHeader number="01" eyebrow="각 축에 질문 하나씩" title="세 글로 분리해 배운 뒤에만 전체 구조로 다시 조합한다">
          Sequence 글은 과거를 어떻게 기억하는지, depth 글은 앞선 표현을 어떻게 고르는지, width 글은 어느 expert를 어떤 폭으로 계산하는지 답합니다.
        </LessonHeader>
        <div className="not-prose grid gap-3 md:grid-cols-3">
          {[
            ["Sequence mixer", "과거 token 전체를 저장할까, 고정 state로 압축할까?", "/cs/ai/kimi-k3-sequence-mixer"],
            ["Depth routing", "현재 layer는 직전 layer만 받을까, 이전 block을 골라 읽을까?", "/cs/ai/kimi-k3-depth-routing"],
            ["Latent MoE", "전문가 계산을 full width로 할까, routed path만 줄일까?", "/cs/ai/kimi-k3-latent-moe"],
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

      <section id="serving" className="space-y-6">
        <LessonHeader number="03" eyebrow="서빙 장비로 옮기면" title="길이에 따라 커지는 기록은 24개 MLA층에만 쌓인다">
          93층 전체가 KV를 남긴다고 세면 메모리를 크게 잘못 잡습니다. 문맥 길이에 비례하는 몫, request마다 고정인 몫, 가중치 몫을 따로 셉니다.
        </LessonHeader>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            문맥이 길어질수록 커지는 것은 24개 MLA층의 KV뿐입니다. Hugging Face config(revision f831ab6)의 kv_lora_rank는 512,
            qk_rope_head_dim은 64라 층마다 token 하나에 576개를 남깁니다. Kimi K2.5와 같은 폭이고 층 수만 61에서 24로 줄었습니다.
          </p>
          <p>
            나머지 69개 KDA층은 token이 늘어도 커지지 않는 request당 state를 둡니다. config의 KDA는 head 96개, head 폭 128이라 층마다
            128×128 행렬 96개입니다. 짧은 request를 많이 띄우면 이 고정 몫이 쌓입니다.
          </p>
          <p>
            두 몫은 tensor parallel에서도 다르게 나뉩니다. vLLM main(커밋 4c45411)의 K3 구현은 MLA cache를 KV head 1개로 등록하므로 rank마다
            같은 latent가 복제됩니다. KDA state는 head 96개를 TP로 나눕니다. 복제되는 MLA KV를 token 축으로 다시 나누는 설정이 decode context
            parallel(DCP)입니다.
          </p>
        </div>
        <CalculationWalkthrough
          title="K3 request 하나의 메모리 몫"
          question="1M token request 하나를 K3로 서빙하면 rank 한 장에 무엇이 얼마나 놓일까요?"
          scope="공개 config 기준 논리 용량입니다. MLA KV는 BF16, KDA state는 vLLM 기본값 float32로 가정하고 convolution state·block padding은 뺐습니다."
          steps={[
            { label: "token 하나의 MLA KV", expression: "24층 × 576 × 2byte", result: "27,648byte = 27KiB", reason: "KV를 남기는 층은 MLA 24개뿐입니다. K2.5의 70,272byte와 비교하면 약 39%입니다." },
            { label: "1M token 문맥", expression: "27KiB × 1,048,576", result: "27GiB", reason: "공개 최대 문맥 1,048,576 token을 꽉 채운 경우입니다." },
            { label: "TP만 쓸 때 rank 몫", expression: "KV head 1개 → 복제", result: "rank마다 27GiB", reason: "MLA는 나눌 KV head가 하나라 TP16이어도 16장 모두 같은 27GiB를 듭니다." },
            { label: "DCP16을 켤 때 rank 몫", expression: "27GiB ÷ 16", result: "약 1.7GiB", reason: "token을 16장에 번갈아 나눠 각 rank가 16분의 1만 듭니다." },
            { label: "request 하나의 KDA state", expression: "69층 × 96 × 128 × 128 × 4byte", result: "약 414MiB", reason: "문맥 길이와 무관합니다. TP16이면 rank마다 head 6개, 약 26MiB입니다." },
          ]}
          conclusion="1M 문맥에서 K3를 TP만으로 나누면 rank마다 MLA KV 27GiB가 똑같이 놓입니다. 긴 문맥을 여러 개 받으려면 DCP가 사실상 전제가 됩니다. (계산)"
          caveats={[
            "실제 cache dtype(FP8 등)과 vLLM의 block 단위 할당에 따라 값이 달라집니다.",
            "rank 몫은 vLLM main 4c45411의 할당 규칙을 따른 계산이고 측정값이 아닙니다.",
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            장비 수는 가중치가 먼저 정합니다. 공식 MXFP4 체크포인트의 Hugging Face 저장 크기는 1,561GB라 RTX PRO 6000 8장(768GB)에 들어가지 않습니다. 이 크기는 디스크 기준이고 실제 VRAM 상주량은 엔진과 포함 범위에 따라 조금 다를 수 있습니다.
          </p>
          <p>
            커뮤니티 기록(rtx6kpro 위키, 현장 경험)은 공식 MXFP4를 RTX PRO 6000 16장, TP16과 DCP16으로 돌렸습니다. 256 token prompt 하나만
            돌린 단일 시퀀스 속도는 draft 없이 55.8 tok/s, DSpark 122.7 tok/s, DFlash 155.1 tok/s입니다. 원문이 동시성 결과로 읽지 말라고
            적은 값입니다.
          </p>
          <p>
            공식 가중치 대신 2bit급 커뮤니티 양자화(QSRT-K2)를 쓰면 9장에 올린 기록이 있지만 품질 비교는 이 글의 범위 밖입니다. MLA KV가 rank마다 복제되는 이유는 <Link to="/cs/ai/kv-cache-fundamentals#parallel-budget">KV cache 기초 글의 21절</Link>, DCP의 비용은 <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">decode context parallel 글</Link>에서 이어 봅니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="space-y-6">
        <LessonHeader number="04" eyebrow="무엇이 사실이고 무엇이 해석인가" title="Configuration·component 실험·전체 scaling claim을 같은 근거로 읽지 않는다">
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
      <ModelArchitectureCaseMapReturn current="kimi" />
    </article>
  );
}
