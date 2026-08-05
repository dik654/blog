import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECDF 기반 이상치 점수 계산</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        차원별 좌·우 ECDF → 꼬리 확률에 -log 변환 → 왜도 방향을 포함한 세 집계 경로 → 최종 점수.<br />
        꼬리 확률 0.01은 4.6, 0.5는 0.69가 된다. 극단일수록 점수가 빠르게 커진다.
      </p>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mb-3">ECOD 수학적 정의</h3>

        <h4>1. 경험적 CDF (각 차원 j)</h4>
        <M display>{'\\begin{aligned} \\underbrace{\\hat F_{L,j}(x)}_{\\text{왼쪽 ECDF}} &= \\frac{1}{n}\\sum_{r=1}^{n}\\underbrace{\\mathbb{1}(X_{rj}\\le x)}_{\\text{x 이하를 셈}} \\\\ \\underbrace{\\hat F_{R,j}(x)}_{\\text{오른쪽 ECDF}} &= \\frac{1}{n}\\sum_{r=1}^{n}\\underbrace{\\mathbb{1}(X_{rj}\\ge x)}_{\\text{x 이상을 셈}} \\end{aligned}'}</M>
        <FormulaNote
          meaning="j번째 피처에서 x 이하와 x 이상인 샘플 비율을 각각 직접 센다. 분포 모양을 가정하지 않고 양쪽 순위를 모두 보존하기 위해 두 ECDF가 필요하다. 등호를 포함하므로 같은 값의 tie 처리와 새 샘플을 어느 기준 집합에 넣는지는 구현 계약이 된다."
          symbols={[
            ['X_{rj}', '기준 집합의 r번째 샘플에 있는 j번째 피처 값'],
            ['\\mathbb{1}(\\cdot)', '괄호 안 조건이 참이면 1, 거짓이면 0인 지시함수'],
            ['n', 'ECDF를 만드는 학습 샘플 수'],
            ['\\hat F_{L,j},\\hat F_{R,j}', 'j번째 피처의 왼쪽·오른쪽 경험적 꼬리 비율'],
          ]}
        />

        <h4>2. 꼬리 확률 → 이상치 점수</h4>
        <M display>{'\\begin{aligned} u_{L,ij} &= \\underbrace{-\\log \\hat F_{L,j}(x_{ij})}_{\\text{작은 값의 왼쪽 점수}} \\\\ u_{R,ij} &= \\underbrace{-\\log \\hat F_{R,j}(x_{ij})}_{\\text{큰 값의 오른쪽 점수}} \\end{aligned}'}</M>
        <FormulaNote
          meaning="값이 왼쪽 끝에 있으면 왼쪽 ECDF가, 오른쪽 끝에 있으면 오른쪽 ECDF가 작아진다. -log는 이런 작은 꼬리확률을 큰 이상 점수로 바꾼다. 기준 집합 안의 값을 등호 포함 ECDF로 세면 최솟값은 1/n이라 0이 되지 않는다. 고정 ECDF 밖의 새 값을 별도로 평가하거나 exclusive rank를 쓰는 구현만 0 경계 처리 규칙이 추가로 필요하다."
          symbols={[
            ['u_{L,ij}', '샘플 i의 j번째 값이 비정상적으로 작은 정도'],
            ['u_{R,ij}', '샘플 i의 j번째 값이 비정상적으로 큰 정도'],
            ['-\\log p', '희귀한 꼬리확률 p를 가산 가능한 큰 점수로 바꾸는 변환'],
          ]}
        />

        <h4>3. 논문의 세 집계 경로와 최종 점수</h4>
        <M display>{'\\begin{aligned} O_L(i)&=\\sum_j u_{L,ij},\\qquad O_R(i)=\\sum_j u_{R,ij} \\\\ O_A(i)&=\\sum_j\\big[\\mathbb 1(\\gamma_j<0)u_{L,ij}+\\mathbb 1(\\gamma_j\\ge0)u_{R,ij}\\big] \\\\ O(i)&=\\underbrace{\\max\\{O_L(i),O_R(i),O_A(i)\\}}_{\\text{세 집계 경로 중 가장 극단적인 점수}} \\end{aligned}'}</M>
        <FormulaNote
          meaning="원 논문은 모든 피처에서 왼쪽만 쓴 점수, 오른쪽만 쓴 점수, 피처 왜도에 따라 방향을 고른 자동 점수를 각각 먼저 합산한 뒤 세 결과 중 최댓값을 채택한다. log 공간의 합은 피처별 꼬리확률의 곱과 같아 독립 근사를 구현한다. 따라서 단일 피처의 극단은 설명하기 쉽지만 피처 사이 관계 자체가 이상한 경우는 놓칠 수 있다."
          symbols={[
            ['O_L(i),O_R(i)', '모든 피처에 같은 왼쪽 또는 오른쪽 방향을 적용한 집계 점수'],
            ['\\gamma_j', 'j번째 피처의 표본 왜도. 자동 경로가 꼬리 방향을 고르는 신호'],
            ['O_A(i)', '피처마다 왜도 부호에 맞는 꼬리를 고른 자동 점수'],
            ['O(i)', '세 집계 전략 가운데 가장 큰 샘플 i의 ranking score'],
          ]}
        />

        <p>
          <strong>논문과 코드 경계:</strong>{' '}
          <a href="https://arxiv.org/abs/2201.00382" target="_blank" rel="noreferrer">원 논문</a>은 세 집계 경로를 정의한다.
          반면 현재 <a href="https://github.com/yzhao062/pyod/blob/master/pyod/models/ecod.py" target="_blank" rel="noreferrer">PyOD reference code</a>는 <code>U_l</code>, <code>U_r</code>,
          <code>U_skew</code>의 최댓값을 <em>피처별로</em> 만든 뒤 <code>sum(axis=1)</code>한다.
          위 논문 식처럼 세 경로를 각각 합산한 뒤 최댓값을 취하는 순서와 일반적으로 같지 않다.
          논문 재현과 PyOD 호환 중 무엇이 목표인지 먼저 고정해야 한다.
        </p>

        <div className="not-prose grid grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { sym: 'F̂L / F̂R', name: '양쪽 경험적 CDF', desc: 'x 이하와 x 이상인 비율. 분포 모양을 가정하지 않는다' },
            { sym: '-log(p)', name: '점수 변환', desc: '확률 0.01 → 4.6, 확률 0.5 → 0.7. 꼬리일수록 점수 급증' },
            { sym: 'γⱼ', name: '왜도 자동 경로', desc: '피처 분포가 길게 늘어진 방향에 맞춰 사용할 꼬리를 고른다' },
            { sym: 'max(OL, OR, OA)', name: '논문 최종 집계', desc: '왼쪽·오른쪽·자동 경로를 각각 합한 뒤 가장 극단적인 점수를 채택' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">구현 전에 고정할 네 가지</h3>
        <ul>
          <li><strong>tie:</strong> 같은 값을 모두 같은 ECDF 확률로 둘 것인가.</li>
          <li><strong>reference set:</strong> train ECDF를 고정할 것인가, test batch를 합쳐 다시 셀 것인가.</li>
          <li><strong>aggregation:</strong> 논문의 세 경로 max인가, PyOD의 피처별 max 후 합인가.</li>
          <li><strong>label budget:</strong> raw score만 제공할 것인가, contamination으로 상위 비율을 자를 것인가.</li>
        </ul>
        <p className="leading-7">
          요약 1: <strong>양쪽 ECDF → -log → 세 집계 경로 → max</strong>가 논문의 계산 순서다.<br />
          요약 2: 구현에서는 tie, 기준 집합, log(0), 집계 순서를 고정해야 한다.<br />
          요약 3: <strong>차원 독립 가정</strong>이 깨지는 데이터라면 상관 구조를 다루는 별도 detector와 비교해야 한다.
        </p>
      </div>
    </section>
  );
}
