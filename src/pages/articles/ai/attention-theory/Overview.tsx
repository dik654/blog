import { CitationBlock } from '@/components/ui/citation';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import Seq2SeqScene from './viz/Seq2SeqScene';
import AttnOverviewDetailScene from './viz/AttnOverviewDetailScene';

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

      <div className="not-prose my-8"><Seq2SeqScene /></div>

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
          가장 단순한 전달 방식은 인코더 마지막 hidden state <M>{'h_T'}</M> 하나만 디코더에 넘기는 것.
          10단어든 100단어든 같은 크기의 <M>{'c'}</M> 하나에 압축된다.
          문장이 길어지면 앞쪽 토큰 정보가 이 벡터 안에서 밀린다 — 30단어 이상에서 BLEU 점수가 28.1에서 17.3으로 급락한다 (Cho et al. 2014).
        </p>
        <M display>{'\\underbrace{c}_{\\text{고정 벡터}} = h_T \\in \\mathbb{R}^{512} \\quad \\Rightarrow \\quad \\underbrace{c_t = \\sum_i \\alpha_{ti} \\cdot h_i}_{\\text{동적 컨텍스트 (Attention)}}'}</M>
        <FormulaNote
          meaning="왼쪽은 마지막 위치 하나만 읽는 fixed context. 오른쪽은 모든 hidden state를 남겨 두고, 디코더 step마다 분포 α_t로 필요한 위치를 섞는다."
          symbols={[
            ['h_T', '인코더의 마지막 hidden state. 고정 Seq2Seq에서는 전체 입력이 이 벡터 하나로 압축된다.'],
            ['α_ti', '디코더 step t가 입력 위치 i를 얼마나 볼지 나타내는 가중치. softmax로 합 1 분포가 된다.'],
            ['c_t', '현재 step 전용 context. 매 step 새 α_t를 쓰므로 같은 입력에서도 다른 위치 조합을 읽을 수 있다.'],
          ]}
        />
        <p>
          새 조각은 <M>{'\\alpha_t'}</M> 하나.
          각 <M>{'h_i'}</M>에 점수를 매기고, softmax로 합 1 분포를 만들고, 그 분포로 <M>{'h_i'}</M>들을 가중합한다.
          fixed Seq2Seq는 <M>{'\\alpha_t=(0,0,\\ldots,1)'}</M>인 특수 케이스 — 마지막 위치만 보는 경우.
          이 흐름에 나중 이름을 붙이면 Score, Weight, Aggregate다.
        </p>
        <M display>{'\\underbrace{e_{ti} = \\text{score}(s_t, h_i)}_{\\text{① Score (유사도)}}, \\quad \\underbrace{\\alpha_{ti} = \\frac{\\exp(e_{ti})}{\\sum_j \\exp(e_{tj})}}_{\\text{② Weight (softmax 정규화)}}, \\quad \\underbrace{c_t = \\sum_i \\alpha_{ti} \\cdot V_i}_{\\text{③ Aggregate (가중합)}}'}</M>
        <FormulaNote
          meaning="score는 아직 비교 점수일 뿐이다. softmax가 이를 선택 비율로 바꾸고, 가중합이 여러 위치의 정보를 한 벡터로 모은다."
          symbols={[
            ['s_t', '현재 디코더 상태. 지금 출력하려는 토큰의 문맥을 담는다.'],
            ['e_ti', 's_t와 h_i의 raw 비교 점수. score 함수 선택이 Bahdanau, Luong, scaled dot-product를 가른다.'],
            ['V_i', '가중합으로 실제 전달되는 정보. 이 overview에서는 h_i와 같은 입력 위치 정보를 가리킨다.'],
          ]}
        />
      </div>

      <div className="not-prose my-8"><AttnOverviewDetailScene /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Seq2Seq의 <strong>정보 병목</strong>이 attention 필요성을 만듦 — 30단어 이상 성능 급락.<br />
          요약 2: Attention은 <strong>fixed c를 동적 α_t 가중합으로 일반화</strong>.<br />
          요약 3: Score 함수 선택이 attention 변형들을 구분 — additive/multiplicative/scaled.
        </p>
      </div>
    </section>
  );
}
