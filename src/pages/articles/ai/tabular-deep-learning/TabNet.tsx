import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import TabNetViz from './viz/TabNetViz';

export default function TabNet() {
  return (
    <section id="tabnet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TabNet: 어텐션 기반 피처 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TabNet (Arik & Pfister, 2019) — Google Research에서 제안한 테이블 전용 딥러닝 모델<br />
          핵심 아이디어: <strong>인스턴스별(instance-wise) 피처 선택</strong>을 어텐션 메커니즘으로 구현<br />
          트리 기반 모델의 장점(피처 선택, 해석 가능성)을 DL에 이식하려는 시도
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sequential Attention — 핵심 구조</h3>
        <p>
          TabNet은 입력을 <strong>여러 스텝(step)</strong>에 걸쳐 순차적으로 처리한다.
          각 스텝 i에서 일어나는 과정:
        </p>
        <p>
          <strong>1. Attentive Transformer</strong> — 이전 스텝의 처리 정보 <M>{'a_{i-1}'}</M>를
          입력받아 <strong>희소 어텐션 마스크</strong> <M>{'M_i'}</M>를 생성<br />
          <strong>2. Feature Selection</strong> — 마스크를 원본 피처에 곱해 <M>{'M_i \\odot f'}</M>
          (f = 정규화된 입력 피처)<br />
          <strong>3. Shared + Decision Encoder</strong> — 선택된 피처를 FC + BN + GLU로 인코딩<br />
          <strong>4. Split</strong> — 인코딩 결과를 두 갈래로 분리: 다음 스텝 입력 + 현재 스텝 출력 기여분
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">sparsemax — 진정한 희소 선택</h3>
        <p>
          softmax는 모든 출력이 0보다 큰 값을 가진다 — 완전한 "선택/비선택" 구분이 불가능<br />
          sparsemax(Martins & Astudillo, 2016)는 일부 출력을 <strong>정확히 0</strong>으로 만든다
        </p>
        <M display>{'\\underbrace{\\text{sparsemax}(z)}_{\\text{희소 확률 (대부분 0)}} = \\arg\\min_{\\underbrace{p \\in \\Delta^d}_{\\text{확률 simplex}}} \\| p - z \\|^2'}</M>
        <FormulaNote
          meaning="sparsemax는 score 벡터 z와 가장 가까우면서 원소가 음수가 아니고 합이 1인 벡터 p를 찾는다. softmax처럼 지수함수를 써 모든 원소를 양수로 만들지 않기 때문에, simplex 경계에 투영된 피처는 정확히 0이 되어 선택에서 빠질 수 있다."
          symbols={[
            ['z\\in\\mathbb{R}^d', 'd개 피처에 대해 attentive transformer가 만든 원시 score'],
            ['\\Delta^d', '각 원소가 0 이상이고 전체 합이 1인 확률 simplex'],
            ['\\arg\\min_p\\|p-z\\|^2', 'z와 유클리드 거리가 가장 가까운 허용 마스크 p를 선택하는 투영'],
          ]}
        />
        <p>
          <M>{'\\Delta^d'}</M> = 확률 심플렉스(simplex, 모든 원소 ≥ 0이고 합 = 1인 집합)<br />
          z를 심플렉스에 유클리드 투영하는 것과 동일 — 작은 값들이 0으로 절단된다.
          결과적으로 마스크의 대부분이 0이 되어 소수의 피처만 선택 — GBM의 split과 유사한 효과
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Prior Scales — 반복 선택 방지</h3>
        <p>
          동일 피처가 매 스텝에서 반복 선택되면 다양한 패턴 학습이 불가능하다.
          TabNet은 <strong>prior scale</strong> 메커니즘으로 이를 방지한다:
        </p>
        <M display>{'\\underbrace{P_i}_{i \\text{ 번째 스텝의 prior}} = \\prod_{j=1}^{i-1} \\underbrace{(\\gamma - M_j)}_{\\text{이전 스텝 선택 페널티}}'}</M>
        <FormulaNote
          meaning="각 피처별 prior는 이전 decision step들의 마스크를 누적해 계산한다. 앞에서 크게 선택된 피처는 γ-M_j가 작아져 다음 step의 attention에서 덜 유리해지고, γ가 크면 같은 피처를 다시 사용할 여지가 커진다. 곱셈은 벡터의 원소별 연산이다."
          symbols={[
            ['P_i', 'i번째 step 직전에 남아 있는 피처별 선택 가능성'],
            ['M_j', 'j번째 step에서 사용한 피처별 sparse attention mask'],
            ['\\gamma', '피처 재사용 강도를 조절하는 relaxation factor'],
            ['\\prod_{j=1}^{i-1}', '이전 모든 step의 페널티를 피처별로 누적하는 곱'],
          ]}
        />
        <p>
          <M>{'\\gamma'}</M> = relaxation factor (1~2 사이, 기본값 1.3)<br />
          이전 스텝에서 이미 선택된 피처(M_j 값이 큰 피처)의 prior가 감소 → 다음 스텝에서 다른 피처 선택 유도<br />
          <M>{'\\gamma = 1'}</M>이면 한 피처는 정확히 한 스텝에서만 선택, <M>{'\\gamma = 2'}</M>면 제약 없음
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">설계 인사이트</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            TabNet의 sequential attention은 의사결정 트리의 분기(split)를 모방한다.
            트리에서 각 노드가 하나의 피처로 분기하듯, TabNet의 각 스텝이 소수 피처를 선택하여 처리한다.
            차이점: 트리는 이산적(discrete) 분기, TabNet은 연속적(continuous) 가중치.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">GLU (Gated Linear Unit)</h3>
        <p>
          인코더 내부에서 사용하는 활성화 함수:
        </p>
        <M display>{'\\text{GLU}(x) = \\underbrace{\\sigma(W_1 x + b_1)}_{\\text{게이트 (밸브 } \\in (0,1)\\text{)}} \\odot \\underbrace{(W_2 x + b_2)}_{\\text{값 (선형 변환)}}'}</M>
        <FormulaNote
          meaning="GLU는 한 선형 변환으로 0~1 사이의 게이트를 만들고, 다른 선형 변환이 만든 값 벡터에 원소별로 곱한다. 따라서 각 좌표의 정보를 얼마나 통과시킬지 입력에 따라 연속적으로 조절한다. 두 선형 변환은 서로 다른 파라미터를 학습한다."
          symbols={[
            ['\\sigma(W_1x+b_1)', '각 좌표의 통과 비율을 정하는 sigmoid gate'],
            ['W_2x+b_2', '게이트가 조절할 후보 정보'],
            ['\\odot', '같은 위치끼리 곱하는 element-wise product'],
          ]}
        />
        <p>
          <M>{'\\sigma'}</M> = 시그모이드 게이트 — 정보 흐름을 제어하는 "밸브" 역할<br />
          ReLU 대비 그래디언트 흐름이 안정적이며, 테이블 데이터에서 일관되게 좋은 성능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">자기지도 사전학습</h3>
        <p>
          TabNet은 레이블 없는 데이터로 사전학습이 가능하다.
          방법: 입력 피처의 일부(~30%)를 랜덤 마스킹 → 나머지 피처로 마스킹된 값을 복원<br />
          BERT의 MLM(Masked Language Modeling)과 동일한 전략을 테이블에 적용한 것이다.
        </p>
        <p>
          사전학습의 효과 — Arik & Pfister (2019) 보고:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">데이터셋</th>
                <th className="border border-border px-4 py-2 text-left">레이블 비율</th>
                <th className="border border-border px-4 py-2 text-left">Scratch AUC</th>
                <th className="border border-border px-4 py-2 text-left">사전학습 AUC</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Forest Cover', '100%', '0.963', '0.966'],
                ['Forest Cover', '10%', '0.921', '0.952'],
                ['Higgs Boson', '100%', '0.788', '0.790'],
                ['Higgs Boson', '10%', '0.751', '0.778'],
              ].map(([ds, ratio, scratch, pretrain]) => (
                <tr key={`${ds}-${ratio}`}>
                  <td className="border border-border px-4 py-2">{ds}</td>
                  <td className="border border-border px-4 py-2">{ratio}</td>
                  <td className="border border-border px-4 py-2">{scratch}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{pretrain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          레이블이 10%만 있을 때 사전학습 효과가 극대화 — 의료·금융 등 레이블 확보 비용이 높은 도메인에서 실용적
        </p>
      </div>

      <div className="not-prose my-8"><TabNetViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: TabNet은 <strong>sequential attention + sparsemax</strong>로 인스턴스별 피처 선택 — 트리 분기의 DL 대응물<br />
          요약 2: Prior scales로 스텝 간 피처 다양성 확보 — 동일 피처 반복 선택 방지<br />
          요약 3: 마스킹 기반 자기지도 사전학습으로 <strong>레이블 부족 문제</strong> 완화
        </p>
      </div>
    </section>
  );
}
