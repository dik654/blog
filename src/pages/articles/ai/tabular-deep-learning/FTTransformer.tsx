import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import FTTransformerViz from './viz/FTTransformerViz';

export default function FTTransformer() {
  return (
    <section id="ft-transformer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FT-Transformer: 피처 토크나이저</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FT-Transformer (Gorishniy et al., 2021) — "Feature Tokenizer + Transformer"의 약자<br />
          핵심 발상: 테이블의 <strong>각 피처를 하나의 토큰</strong>으로 변환하여 Transformer에 입력<br />
          NLP에서 단어 → 토큰, CV에서 패치 → 토큰이듯 — 테이블에서는 피처 → 토큰
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Feature Tokenizer — 피처를 토큰으로</h3>
        <p>
          테이블 피처는 수치형과 범주형이 혼재한다. FT-Transformer는 두 타입을 각각 다른 방식으로 d차원 토큰으로 변환한다.
        </p>

        <p><strong>수치형 피처 토크나이징:</strong></p>
        <M display>{'\\underbrace{t_j^{\\text{num}}}_{\\text{j 번째 토큰 } \\in \\mathbb{R}^d} = \\underbrace{x_j}_{\\text{스칼라 입력}} \\cdot \\underbrace{W_j}_{\\text{피처별 가중치}} + \\underbrace{b_j}_{\\text{편향}}'}</M>
        <FormulaNote
          meaning="수치 하나 x_j를 j번째 피처 전용 방향 W_j에 따라 d차원 공간으로 늘리고 bias를 더한다. 같은 값 10이라도 나이와 소득은 서로 다른 W_j와 b_j를 사용하므로 다른 의미의 토큰이 된다. 결측값 처리는 이 식 바깥에서 별도 인코딩해야 한다."
          symbols={[
            ['x_j\\in\\mathbb{R}', 'j번째 수치형 피처의 스칼라 값'],
            ['W_j\\in\\mathbb{R}^d', '그 피처의 값 변화가 토큰 공간에서 움직일 방향'],
            ['b_j\\in\\mathbb{R}^d', '값과 무관하게 피처 정체성을 담는 offset'],
            ['t_j^{\\mathrm{num}}', 'Transformer에 들어갈 d차원 수치 피처 토큰'],
          ]}
        />
        <p>
          각 수치형 피처 <M>{'x_j \\in \\mathbb{R}'}</M>에 <strong>피처별(feature-specific) 선형 투영</strong>을 적용한다.
          스칼라 값 하나를 d차원 벡터로 확장 — 피처마다 별도의 가중치 <M>{'W_j'}</M>를 학습하여
          "나이"와 "소득"이 서로 다른 의미 공간에 매핑된다.
        </p>

        <p><strong>범주형 피처 토크나이징:</strong></p>
        <M display>{'\\underbrace{t_j^{\\text{cat}}}_{\\text{j 번째 토큰 } \\in \\mathbb{R}^d} = \\underbrace{\\text{Embedding}_j(x_j)}_{\\text{룩업 테이블 } \\in \\mathbb{R}^{C_j \\times d}}'}</M>
        <FormulaNote
          meaning="범주 ID x_j를 j번째 피처 전용 embedding table의 행 번호로 사용해 d차원 벡터 하나를 꺼낸다. 서로 다른 피처가 같은 정수 ID를 가져도 별도 table을 쓰므로 의미가 섞이지 않는다. 미등록 범주는 전용 unknown row가 필요하다."
          symbols={[
            ['x_j\\in\\{1,\\ldots,C_j\\}', 'j번째 범주형 피처에서 관측한 category ID'],
            ['C_j', '그 피처가 가질 수 있는 범주의 수'],
            ['\\mathrm{Embedding}_j', '크기 C_j×d인 학습 가능한 lookup table'],
            ['t_j^{\\mathrm{cat}}', '선택된 행으로 만든 d차원 범주 피처 토큰'],
          ]}
        />
        <p>
          범주형 피처 <M>{'x_j \\in \\{1, \\dots, C_j\\}'}</M>는 룩업 테이블에서 d차원 임베딩 벡터를 추출한다.
          <M>{'C_j'}</M> = j번째 피처의 카디널리티(고유 값 개수).
          Word2Vec에서 단어를 임베딩하듯 — "서울", "부산", "IT", "금융" 등이 의미적 유사도를 반영하는 벡터가 된다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">수치형 토크나이징의 의의</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            기존 테이블 DL 모델(MLP, Wide&Deep)은 모든 수치형 피처를 하나의 벡터로 연결(concatenation)하여 입력했다.
            FT-Transformer는 각 피처를 <strong>독립적으로 토큰화</strong>하여 Transformer가 피처 간 관계를 self-attention으로 학습하게 한다.
            이것이 MLP 대비 성능 향상의 핵심 요인이다.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">[CLS] 토큰과 예측 헤드</h3>
        <p>
          BERT와 동일한 전략 — 학습 가능한 [CLS] 토큰을 피처 토큰 시퀀스 앞에 추가한다.
        </p>
        <M display>{'T_0 = [\\;\\underbrace{t_{\\text{CLS}}}_{\\text{학습 가능 시작 토큰}} \\;|\\; \\underbrace{t_1, t_2, \\ldots, t_k}_{\\text{k 개 피처 토큰}}\\;] \\in \\mathbb{R}^{(k+1) \\times d}'}</M>
        <FormulaNote
          meaning="k개 피처 토큰 앞에 학습 가능한 [CLS] 토큰 하나를 붙여 길이 k+1의 입력 행렬을 만든다. 각 행은 한 피처, 각 열은 embedding 차원이다. Transformer 뒤의 [CLS] 출력은 모든 피처와 attention을 주고받은 표 전체의 요약으로 사용된다."
          symbols={[
            ['t_{\\mathrm{CLS}}', '예측에 사용할 전역 표현을 모으는 학습 가능 토큰'],
            ['t_1,\\ldots,t_k', '수치형과 범주형을 동일한 d차원으로 바꾼 피처 토큰'],
            ['T_0\\in\\mathbb{R}^{(k+1)\\times d}', 'Transformer 첫 층에 들어가는 토큰 행렬'],
          ]}
        />
        <p>
          k = 전체 피처 수, d = 토큰 차원.
          Transformer를 L개 레이어 통과한 뒤 [CLS] 위치의 출력만 추출하여 예측 헤드(Linear → 분류/회귀)에 입력한다.
          [CLS]가 self-attention을 통해 모든 피처 정보를 집약하는 역할이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 블록 상세</h3>
        <p>
          표준 Transformer encoder 블록을 사용하되, 테이블에 맞는 조정이 있다:
        </p>
        <M display>{'\\text{MHSA}(T) = \\underbrace{\\text{Concat}(\\text{head}_1, \\dots, \\text{head}_H)}_{H \\text{개 헤드 결과 이어붙이기}} \\cdot \\underbrace{W^O}_{\\text{출력 투영}}'}</M>
        <M display>{'\\text{head}_h = \\underbrace{\\text{softmax}\\!\\left(\\frac{Q_h K_h^\\top}{\\sqrt{d/H}}\\right)}_{\\text{스케일된 attention 가중치}} \\cdot \\underbrace{V_h}_{\\text{값}}'}</M>
        <FormulaNote
          meaning="각 head는 피처 토큰 사이의 query-key 유사도를 계산해 어느 피처의 value를 얼마나 섞을지 정한다. H개 head가 서로 다른 상호작용을 병렬로 찾고, 이어 붙인 결과를 W^O로 다시 d차원에 합친다. attention weight가 곧 인과적 피처 중요도라는 뜻은 아니다."
          symbols={[
            ['Q_h,K_h,V_h', 'head h에서 입력 토큰을 각각 query, key, value로 투영한 행렬'],
            ['\\sqrt{d/H}', 'head 차원이 커질 때 dot product가 과도해지는 것을 막는 scale'],
            ['\\mathrm{head}_h', '한 종류의 피처 상호작용을 반영해 섞인 value'],
            ['W^O', 'H개 head 결과를 모델 차원 d로 결합하는 출력 투영'],
          ]}
        />
        <p>
          Q, K, V = 피처 토큰 시퀀스에서 각각 투영.
          핵심: 각 피처 토큰이 <strong>다른 모든 피처 토큰과 attention</strong>을 교환한다.
          "나이" 토큰이 "소득" 토큰과 높은 attention → 나이-소득 상호작용 자동 포착.
          GBM에서 수동으로 만들어야 하는 교차 피처(cross feature)가 attention으로 자동 학습된다.
        </p>

        <p>FFN(Feed-Forward Network):</p>
        <M display>{'\\text{FFN}(x) = \\underbrace{\\text{GELU}(xW_1 + b_1)}_{\\text{확장 + 비선형}} \\cdot W_2 + b_2 \\quad \\underbrace{}_{d \\to 4d \\to d}'}</M>
        <FormulaNote
          meaning="attention이 피처 사이에서 정보를 교환한 뒤, FFN은 각 토큰을 독립적으로 넓은 hidden 공간에 투영하고 GELU 비선형성을 적용한 다음 원래 d차원으로 압축한다. 4d는 대표적인 폭이며 반드시 고정된 규칙은 아니다."
          symbols={[
            ['W_1,b_1', '각 토큰을 d차원에서 넓은 hidden 차원으로 확장하는 파라미터'],
            ['\\mathrm{GELU}', '작은 음수도 부드럽게 통과시키는 비선형 활성함수'],
            ['W_2,b_2', 'hidden 표현을 다시 모델 차원 d로 되돌리는 파라미터'],
          ]}
        />
        <p>
          GELU 활성화 사용 — ReLU 대비 그래디언트 전달이 부드럽다.
          Pre-LayerNorm 구조 채택 — LayerNorm을 attention/FFN <strong>앞</strong>에 배치하여 학습 안정성 확보.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">FT-Transformer의 강점</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">특성</th>
                <th className="border border-border px-4 py-2 text-left">FT-Transformer</th>
                <th className="border border-border px-4 py-2 text-left">TabNet</th>
                <th className="border border-border px-4 py-2 text-left">MLP</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['피처 상호작용', 'Self-attention (자동)', 'Sequential (순차적)', '암시적 (은닉층)'],
                ['해석 가능성', 'Attention 맵', 'Feature mask', '없음'],
                ['순서 불변성', '완전 불변', '불변', '순서 의존'],
                ['학습 안정성', '높음 (Pre-LN)', '보통 (BN 의존)', '낮음'],
                ['하이퍼파라미터', '적음 (L, d, H)', '많음 (steps, γ, λ)', '적음 (층수, 폭)'],
              ].map(([feature, ft, tab, mlp]) => (
                <tr key={feature}>
                  <td className="border border-border px-4 py-2 font-medium">{feature}</td>
                  <td className="border border-border px-4 py-2">{ft}</td>
                  <td className="border border-border px-4 py-2">{tab}</td>
                  <td className="border border-border px-4 py-2">{mlp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">벤치마크 결과</h3>
        <p>
          Gorishniy et al. (2021) — 11개 공개 데이터셋 실험:
        </p>
        <p>
          FT-Transformer가 6개 데이터셋에서 GBM(XGBoost/CatBoost)과 동등 이상 성능<br />
          특히 <strong>대규모 + 범주형 풍부</strong> 조건에서 우위 — 고카디널리티 범주형의 임베딩 효과<br />
          반면 소규모 순수 수치형 데이터에서는 여전히 GBM이 우위 — 귀납 편향 차이
        </p>
      </div>

      <div className="not-prose my-8"><FTTransformerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Feature Tokenizer가 각 피처를 독립 토큰으로 변환 — <strong>수치형도 d차원 벡터로 확장</strong><br />
          요약 2: Self-attention이 피처 간 상호작용을 자동 학습 — 수동 교차 피처 불필요<br />
          요약 3: [CLS] 토큰이 모든 피처 정보를 집약 — BERT와 동일한 예측 전략
        </p>
      </div>
    </section>
  );
}
