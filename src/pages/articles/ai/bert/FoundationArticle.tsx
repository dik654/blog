import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BertVisibilityViz } from "./viz/ModernBertViz";

export default function BertFoundationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          BERT는 문장을 생성하기보다 주어진 입력의 각 위치를 양쪽 문맥으로 다시
          표현합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 token row 하나와 그 row가 읽을 수 있는 key 위치를 봅니다.
            BERT의 핵심은 attention 이름이 아니라{" "}
            <strong>입력이 모두 주어진 encoder visibility</strong>입니다.
            왼쪽·오른쪽 실제 token은 열고 길이 맞춤 PAD는 닫습니다.
          </p>
        </div>
        <TermBreakdown
          title="양방향 encoder를 이루는 네 용어"
          items={[
            {
              term: "Input token",
              description: "문장이 이미 관측된 위치의 vocabulary ID입니다.",
              example: "‘은행에서 대출을 받았다’의 각 subword입니다.",
            },
            {
              term: "Query position i",
              description:
                "주변 문맥을 모아 새 representation을 만들 현재 위치입니다.",
              example: "‘대출’ 위치 i를 추적합니다.",
            },
            {
              term: "Visible key",
              description:
                "Query i가 attention weight를 줄 수 있도록 허용된 실제 token 위치입니다.",
              example: "i의 왼쪽 ‘은행’과 오른쪽 ‘받았다’를 모두 엽니다.",
            },
            {
              term: "Contextual state hᵢ",
              description:
                "허용된 token의 value를 섞어 만든 문장-instance별 vector입니다.",
              boundary:
                "Word type마다 하나로 고정된 static embedding과 다릅니다.",
            },
          ]}
        />
        <BertVisibilityViz />
        <ContentBoundary article="bert" />
      </section>
      <section id="visibility" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Visibility mask가 어떤 key를 읽을지 먼저 결정합니다
        </h2>
        <ExplainedFormula
          question="BERT query i는 어느 key에 attention weight를 줄 수 있나요?"
          idea={
            <p>
              실제 token이면 왼쪽·현재·오른쪽 모두 허용하고 PAD key만 logit에서
              제거합니다. 허용 집합 위에서만 softmax를 계산합니다.
            </p>
          }
          formula={String.raw`h_i=\sum_{j\in V_i}\alpha_{ij}v_j`}
          annotatedFormula={String.raw`\begin{aligned}V_i&=\underbrace{\{j:m_j=1\}}_{\text{실제 token key만 허용}}\\s_{ij}&=\underbrace{q_i^\top k_j/\sqrt d}_{\text{query와 key 관련성 측정}}\\\alpha_{ij}&=\underbrace{\operatorname{softmax}_{j\in V_i}(s_{ij})}_{\text{허용 key끼리 비율로 정규화}}\\h_i&=\underbrace{\sum_{j\in V_i}\alpha_{ij}v_j}_{\text{양쪽 문맥 정보를 한 state로 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{j:m_j=1\}`,
              annotation: ["padding flag를 검사해", "실제 content 위치만 선택"],
            },
            {
              expression: String.raw`q_i^\top k_j/\sqrt d`,
              annotation: [
                "현재 query와 각 key를 비교하고",
                "dimension scale로 score 폭을 안정화",
              ],
            },
            {
              expression: String.raw`\operatorname{softmax}_{j\in V_i}`,
              annotation: [
                "허용된 key score만",
                "합이 1인 attention weight로 변환",
              ],
            },
            {
              expression: String.raw`\sum_j\alpha_{ij}v_j`,
              annotation: [
                "각 value를 relevance로 가중해",
                "현재 위치의 contextual state 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "V_i",
              name: "Visible-key set",
              description:
                "Query i가 읽을 수 있는 실제 token index 집합입니다.",
            },
            {
              symbol: "m_j",
              name: "Padding mask",
              description: "실제 token이면 1, PAD이면 0인 표시입니다.",
            },
            {
              symbol: "h_i",
              name: "Contextual state",
              description: "양쪽 문맥이 반영된 i 위치 output vector입니다.",
            },
          ]}
          assumptions={[
            "입력 전체가 이미 관측되어 있습니다.",
            "PAD key는 모든 query에서 제외합니다.",
            "여러 head·projection은 self-attention 정본을 재사용합니다.",
          ]}
          interpretation="Length 5의 실제 token sequence에서 query 2는 0…4를 모두 볼 수 있습니다. 마지막 두 slot이 PAD라면 0…2만 남습니다."
        />
      </section>
      <section id="encoder-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          양방향은 두 방향으로 문장을 생성한다는 뜻이 아닙니다
        </h2>
        <TermBreakdown
          title="헷갈리기 쉬운 경계"
          items={[
            {
              term: "Causal decoder",
              description:
                "Position i가 prefix 0…i만 읽고 다음 token을 순차 생성합니다.",
              boundary: "BERT visibility와 목적이 다릅니다.",
            },
            {
              term: "Bidirectional encoder",
              description:
                "이미 주어진 input의 모든 실제 위치를 읽어 각 position state를 만듭니다.",
              example: "분류·NER·extractive QA의 input encoding입니다.",
            },
            {
              term: "Strict streaming",
              description:
                "오른쪽 token이 아직 오지 않은 시점의 prediction입니다.",
              boundary:
                "미래 입력을 요구하는 BERT mask를 그대로 쓸 수 없습니다.",
            },
          ]}
        />
      </section>
      <section id="paper-bert" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          원 논문의 주장은 pretraining recipe와 downstream transfer 범위에서
          읽습니다
        </h2>
        <div className="not-prose">
          <CitationBlock
            source="Devlin et al. — BERT"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1810.04805"
          >
            Deep bidirectional Transformer encoder를 MLM·NSP로 pretrain하고 여러
            language-understanding task에 fine-tuning합니다. 자유 형식 생성기나
            모든 encoder recipe의 보편 최적이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
