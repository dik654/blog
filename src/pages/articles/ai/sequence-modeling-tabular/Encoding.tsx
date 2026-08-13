import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import EncodingViz from "./viz/EncodingViz";

export default function Encoding() {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Event token은 의미·순번·실제 경과 시간을 서로 다른 신호로 합칩니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Event type은 discrete embedding으로, amount·duration 같은 numerical
          attributes는 projection으로 같은 hidden width에 맞춥니다. 여기에 sequence
          position과 직전 event부터 흐른 time delta를 더하거나 concat합니다.
          Position 3이라는 순번과 14일이 흘렀다는 간격은 irregular log에서 서로
          대체할 수 없는 정보입니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 event의 종류·속성·순서·시간 간격을 하나의 d차원 token으로 어떻게 만들까?"
        idea={<>각 신호를 d차원으로 변환한 뒤 같은 좌표계에서 더하는 한 가지 설계입니다. Concatenation을 쓴다면 뒤에 projection이 필요하며, 어느 쪽이든 신호별 source와 단위가 명확해야 합니다.</>}
        formula={String.raw`\begin{aligned}z_j={}&E_{\mathrm{type}}[a_j]+W_{\mathrm{num}}u_j\\&+p_j+g_{\psi}(\Delta t_j),\\z_j\in{}&\mathbb R^d.\end{aligned}`}
        terms={[
          { symbol: "a_j", name: "event type", description: "View·cart·purchase처럼 j번째 event의 categorical action ID입니다." },
          { symbol: "u_j", name: "numerical attributes", description: "Amount·device score처럼 event에 붙은 수치 vector이며 단위와 missing rule이 필요합니다." },
          { symbol: "p_j", name: "order signal", description: "Sequence 안에서 j번째라는 상대·절대 순번을 나타냅니다." },
          { symbol: "g_ψ(Δt_j)", name: "elapsed-time encoding", description: "직전 event 또는 cutoff와의 실제 시간 간격을 learned/fixed vector로 바꿉니다." },
        ]}
        assumptions={["모든 term이 같은 width d이거나 concat 뒤 projection됩니다.", "Δt의 단위·clipping·log transform이 artifact에 기록됩니다.", "Unknown event type과 simultaneous-event ordering rule이 있습니다."]}
        interpretation="Token 하나에 신호를 합쳐도 model이 의미·순번·간격을 같은 것으로 취급하는 것은 아닙니다. 서로 다른 parameter path가 각 역할을 구분합니다."
      />

      <div className="not-prose my-8"><EncodingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Padding과 truncation은 tensor shape 이상의 정책입니다</h3>
        <p>
          Batch의 짧은 sequence 뒤에 PAD를 붙이고 valid-length mask로 attention과
          pooling에서 제외합니다. Max length를 줄이면 memory는 절약되지만 잘린
          event는 복구되지 않습니다. 최근 L개 유지, 균등 sampling, 중요 event
          보존, 오래된 구간의 hierarchical summary가 어떤 target evidence를
          버리는지 length slice와 positive-pattern coverage로 비교합니다.
        </p>
        <p>
          Sequence length percentile만으로 cap을 정하지 않고 padding waste, peak
          memory, latency와 잘리는 label precursor의 비율을 함께 기록합니다. 같은
          raw log에서 training과 serving tokenizer가 완전히 같은 token IDs·delta·mask를
          만드는 golden fixture가 필요합니다.
        </p>
        <p>
          예를 들어 event가 1,000개인 history를 최근 128개로 제한하면 872개를
          버립니다. 이 숫자는 memory 절감량만 뜻하지 않습니다. Purchase 직전의
          precursor가 오래된 구간에 있었다면 recent-only 정책은 그 evidence도 함께
          없애므로, important-event 보존 정책과 같은 cutoff·split에서 비교해야 합니다.
        </p>
        <div className="not-prose my-8 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 따라 읽기 · Time2Vec</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Time2Vec은 scalar time을 linear coordinate와 학습 가능한 periodic
            coordinates로 바꿉니다. Event 사이의 Δt에 적용할 수 있지만, position과
            available-time 경계까지 대신 정해 주는 방법은 아닙니다.
          </p>
          <Link className="mt-3 inline-block text-sm font-medium text-primary hover:underline" to="/ai/time-features#paper-time2vec">
            시간 표현 정본 글의 수식·전제·근거 범위 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
