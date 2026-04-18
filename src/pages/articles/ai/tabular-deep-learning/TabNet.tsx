import M from '@/components/ui/math';
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
        <M display>{'\\text{sparsemax}(z) = \\arg\\min_{p \\in \\Delta^d} \\| p - z \\|^2'}</M>
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
        <M display>{'P_i = \\prod_{j=1}^{i-1}(\\gamma - M_j)'}</M>
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
        <M display>{'\\text{GLU}(x) = \\sigma(W_1 x + b_1) \\odot (W_2 x + b_2)'}</M>
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
