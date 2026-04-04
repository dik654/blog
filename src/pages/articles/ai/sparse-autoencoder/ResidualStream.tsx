import { CitationBlock } from '@/components/ui/citation';
import ResidualStreamViz from './viz/ResidualStreamViz';

export default function ResidualStream() {
  return (
    <section id="residual-stream" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        잔차 흐름: 토큰이 레이어를 통과하는 과정
      </h2>
      <div className="not-prose mb-8"><ResidualStreamViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          문장의 각 단어 → 토큰 → <strong>임베딩 벡터</strong>로 변환<br />
          Gemma 2B 기준 임베딩 길이 = 2304<br />
          각 레이어는 <strong>Attention</strong>(문맥 파악) + <strong>MLP</strong>(비선형 변환) 블록으로 구성
        </p>

        <CitationBlock
          source="Elhage et al., 2021 — A Mathematical Framework for Transformer Circuits"
          citeKey={2} type="paper"
          href="https://transformer-circuits.pub/2021/framework"
        >
          <p className="italic">
            "The residual stream is a central object in transformer computation.
            Each layer reads from and writes to this shared communication channel."
          </p>
          <p className="mt-2 text-xs">
            잔차 흐름 = 모든 레이어가 공유하는 통신 채널
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">잔차 연결</h3>
        <p>
          블록 출력을 이전 입력에 <strong>더함</strong> = 잔차 흐름(Residual Stream)<br />
          26개 레이어를 모두 통과한 마지막 벡터 → 임베딩 행렬 곱 → softmax → 다음 단어 확률<br />
          SAE가 분석하는 대상 = 이 잔차 흐름의 특정 레이어 출력
        </p>
      </div>
    </section>
  );
}
