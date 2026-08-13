import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import VisibilityViz from "./viz/VisibilityViz";
export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BERT는 다음 token 생성보다 각 입력 위치의 contextual representation을 목표로 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          BERT(Bidirectional Encoder Representations from Transformers)는 Transformer
          encoder를 unlabeled text로 pretraining한 뒤, task head와 함께 전체 weight를
          fine-tuning하는 recipe를 보편화했습니다. 각 token 위치가 왼쪽과 오른쪽의 실제
          token을 모두 볼 수 있으므로 classification·token labeling·extractive QA처럼
          입력 전체를 읽고 판단하는 작업에 자연스럽습니다.
        </p>
        <p>
          여기서 “bidirectional”은 문장을 앞뒤 방향으로 생성한다는 뜻이 아닙니다.
          Encoder self-attention의 visibility가 causal triangle로 제한되지 않는다는 뜻입니다.
          정답 위치의 token까지 그대로 보이면 그대로 복사할 수 있기 때문에, BERT는 일부
          입력을 오염시키고 원래 token을 복원하는 MLM을 사용했습니다.
        </p>
        <p>
          <Link to="/ai/transformer-architecture">Transformer block·position·mask 정본</Link>과
          <Link to="/ai/attention-theory"> Q·K·V 계산 정본</Link>은 앞 글에서 확인할 수 있습니다.
          이 글은 그 위에서 visibility가 pretraining objective와 downstream interface를
          어떻게 결정하는지 설명합니다.
        </p>
      </div>

      <ContentBoundary article="bert" />
      <VisibilityViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          원형 BERT는 encoder-only이며 left-to-right generation head나 cross-attention
          decoder를 포함하지 않습니다. 후대 library가 BERT class를 decoder mode로
          구성할 수 있다는 사실과 원 논문 architecture의 역할은 구분해야 합니다.
        </p>
      </div>

      <div id="paper-bert" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 원형 BERT</p>
        <p className="mt-2 text-sm font-semibold">BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          모든 encoder layer에서 양쪽 context를 함께 조건으로 쓰는 representation을
          MLM·NSP로 pretraining하고 여러 NLP task에 fine-tuning한 연구입니다. 보고된
          성능은 해당 architecture·corpus·training budget과 11개 task의 범위입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1810.04805" target="_blank" rel="noreferrer">원 논문의 문제·구조·평가 보기</a>
      </div>
    </section>
  );
}
