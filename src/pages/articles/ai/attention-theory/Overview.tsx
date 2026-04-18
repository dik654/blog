import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import Seq2SeqViz from './viz/Seq2SeqViz';
import AttnOverviewDetailViz from './viz/AttnOverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seq2Seq 한계와 어텐션의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Seq2Seq — 인코더가 입력을 <strong>하나의 고정 길이 벡터</strong>로 압축, 디코더가 이를 참조해 출력 생성<br />
          문장이 길어지면 <strong>정보 병목(Bottleneck, 하나의 벡터에 모든 정보를 담아야 하는 제약)</strong> 발생<br />
          어텐션 — 디코더가 매 출력 스텝마다 인코더의 <strong>모든 히든 스테이트를 동적으로 참조</strong>하여 병목 해소
        </p>

        <CitationBlock source="Bahdanau et al., 2015 — Neural Machine Translation by Jointly Learning to Align and Translate"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1409.0473">
          <p className="italic">"A potential issue with this encoder-decoder approach is that a neural
          network needs to compress all information into a fixed-length vector."</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8"><Seq2SeqViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">어텐션 메커니즘의 발전 단계</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">이름</th>
                <th className="border border-border px-4 py-2 text-left">연도</th>
                <th className="border border-border px-4 py-2 text-left">핵심 아이디어</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Bahdanau (Additive)', '2015', 'MLP로 정렬 점수 계산'],
                ['Luong (Multiplicative)', '2015', '내적(dot-product)으로 점수 계산'],
                ['Self-Attention', '2017', '입력 자신에 대한 어텐션'],
                ['Multi-Head', '2017', '여러 어텐션 헤드 병렬 적용'],
              ].map(([name, year, idea]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  <td className="border border-border px-4 py-2">{year}</td>
                  <td className="border border-border px-4 py-2">{idea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq의 정보 병목과 Attention 프레임워크</h3>
        <p>
          Seq2Seq에서 인코더 마지막 hidden state h_T만이 디코더에 전달된다.
          10단어든 100단어든 동일한 고정 차원 벡터 하나에 압축 — 30단어 이상에서 BLEU 점수가 28.1에서 17.3으로 급락한다 (Cho et al. 2014).
          Bahdanau(2015)는 디코더가 매 스텝마다 인코더의 모든 hidden state를 동적으로 참조하는 방식으로 이 병목을 해소했다.
        </p>
        <M display>{'\\underbrace{c}_{\\text{고정 벡터}} = h_T \\in \\mathbb{R}^{512} \\quad \\Rightarrow \\quad \\underbrace{c_t = \\sum_i \\alpha_{ti} \\cdot h_i}_{\\text{동적 컨텍스트 (Attention)}}'}</M>
        <p>
          Attention의 본질은 3단계 — Score, Weight, Aggregate.
          Query와 Key의 유사도를 측정하고, softmax로 확률 분포를 만든 뒤, Value의 가중합으로 출력을 생성한다.
        </p>
        <M display>{'e_{ti} = \\text{score}(s_t, h_i), \\quad \\alpha_{ti} = \\frac{\\exp(e_{ti})}{\\sum_j \\exp(e_{tj})}, \\quad c_t = \\sum_i \\alpha_{ti} \\cdot V_i'}</M>
      </div>

      <div className="not-prose my-8"><AttnOverviewDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Seq2Seq의 <strong>정보 병목</strong>이 attention 필요성을 만듦 — 30단어 이상 성능 급락.<br />
          요약 2: Attention의 본질은 <strong>Query-Key 유사도로 Value 가중합</strong>.<br />
          요약 3: Score 함수 선택이 attention 변형들을 구분 — additive/multiplicative/scaled.
        </p>
      </div>
    </section>
  );
}
