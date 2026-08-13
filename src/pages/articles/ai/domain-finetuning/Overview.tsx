import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return <section id="overview" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">도메인 적응은 모델을 더 학습시키기 전에 “무엇이 부족한가”를 가르는 일입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-8">도메인 성능이 낮다는 한 문장 안에는 서로 다른 문제가 섞여 있습니다. 전문 용어와 문서 형식을 잘 읽지 못할 수도 있고, 학습 이후 생긴 최신 사실을 모를 수도 있으며, 이미 아는 내용을 원하는 출력 형식으로 답하지 못할 수도 있습니다. 원인이 다르면 continued pretraining·RAG·supervised fine-tuning(SFT)·PEFT 가운데 선택도 달라집니다.</p>
      <p>예를 들어 최신 약가를 묻는 질문은 weight를 다시 학습시키기보다 검색 시점에 최신 자료를 넣는 RAG가 자연스럽습니다. 반면 수백만 건의 특허 문장에서 반복되는 전문 문체 자체를 잘 읽지 못한다면 unlabeled corpus로 continued pretraining을 시험할 수 있습니다. JSON schema와 abstention 규칙을 따르지 못하는 문제라면 정답 형식을 가진 demonstration으로 SFT하는 편이 직접적입니다.</p>
      <p>분포 변화의 종류와 negative transfer는 <Link to="/ai/transfer-learning-practice#domain-shift">transfer learning 정본</Link>, RAG의 source·citation 경계는 <Link to="/ai/rag-pipeline">RAG 정본</Link>, LoRA의 parameter 구조는 <Link to="/ai/lora-finetuning">LoRA 정본</Link>에서 이어집니다. 이 글은 진단에서 corpus·task data·평가 경계를 하나의 도메인 적응 계약으로 묶는 데 집중합니다.</p>
    </div>
    <ContentBoundary article="domain-finetuning" />
    <div className="not-prose my-8"><OverviewViz /></div>
    <ExplainedFormula
      question="Target 성능을 높이면서 일반 능력 회귀와 비용을 제한하려면 개입을 어떻게 고를까요?"
      idea={<>후보마다 같은 target holdout에서 얻은 gain, general regression set의 변화, 학습·서빙 비용을 측정합니다. 가장 높은 target gain을 고르되 허용한 회귀 ε와 예산 B 안에 있는 후보만 비교합니다.</>}
      formula={String.raw`a^*=\operatorname*{arg\,max}_{a\in\mathcal A}\Delta_{\mathrm{target}}(a)\quad\text{s.t.}\quad \Delta_{\mathrm{general}}(a)\ge-\varepsilon,\; C(a)\le B`}
      terms={[
        { symbol: "A", name: "intervention candidates", description: "No adaptation·RAG·DAPT/TAPT·SFT·PEFT 등 공정하게 비교할 후보 집합입니다." },
        { symbol: "Δtarget", name: "target gain", description: "같은 target split·seed에서 base 대비 도메인 주지표 변화입니다." },
        { symbol: "Δgeneral", name: "general-capability change", description: "Adaptation 전후 일반 회귀 suite의 변화이며 음수면 성능 저하입니다." },
        { symbol: "ε", name: "regression budget", description: "제품이 허용하기로 미리 정한 일반 능력 하락 한도입니다." },
        { symbol: "C(a), B", name: "cost and budget", description: "학습비·latency·memory·운영 복잡도와 허용 예산입니다." },
      ]}
      assumptions={["모든 후보는 같은 base checkpoint·data boundary·evaluation code·tuning budget에서 비교합니다.", "ε와 B는 test 결과를 본 뒤 유리하게 바꾸지 않고 사전에 정합니다.", "한 scalar 평균이 rare domain·safety slice를 가리지 않도록 hard constraints를 별도로 둘 수 있습니다."]}
      interpretation="가장 복잡한 방법이 아니라 목표와 제약을 만족하는 가장 작은 개입을 고릅니다. Retrieval baseline이 같은 정확도를 내면서 지식을 즉시 갱신할 수 있다면 weight adaptation은 추가 근거가 있어야 합니다."
    />
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h3>진단용 baseline을 먼저 만듭니다</h3>
      <p>Base model을 그대로 쓰는 조건, domain prompt만 추가한 조건, retrieval을 붙인 조건, 작은 labeled head 또는 SFT 조건을 먼저 비교합니다. 그 결과를 language/style·factual freshness·task behavior·system constraint의 네 축으로 나누면, 단순 prompting이나 retrieval로 풀리는 문제에 비싼 pretraining을 적용하는 일을 줄일 수 있습니다.</p>
      <p>Data provenance·license·민감정보·evaluation contamination을 확인한 뒤 adaptation을 시작하며, 이후 모든 checkpoint는 target 지표뿐 아니라 general capability와 운영 비용을 함께 평가합니다.</p>
    </div>
  </section>;
}
