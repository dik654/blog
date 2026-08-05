import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  InternalLink,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';

export default function Modeling() {
  return (
    <section id="modeling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">후보 생성과 실패 진단</h2>
      <QuestionLead
        question="ACF/PACF, AICc, Ljung–Box 중 누가 최종 모델을 고르는가?"
        answer="셋 다 단독으로 고르지 않는다. ACF/PACF는 후보를 만들고, AICc는 같은 학습 창의 후보를 선별하며, Ljung–Box는 남은 자기상관을 찾는다. 최종 권한은 운영 horizon을 그대로 재현한 rolling-origin 검증에 있다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          모델링의 목적은 ACF 모양을 보고 정답 차수를 맞히는 것이 아니다. 설명 가능한 작은 후보군을 만들고, <strong>학습 구간 안의 정보 기준 → 잔차 진단 → 시간 순서를 지킨 바깥 검증</strong>의 서로 다른 관문에서 틀린 후보를 제거하는 것이다.
        </p>

        <h3>1. ACF와 PACF로 후보만 좁힌다</h3>
        <p>
          ACF는 <M>Y_t</M>와 <M>{"Y_{t-k}"}</M>가 함께 움직이는 정도를 측정한다. PACF는 그 사이 lag들의 선형 영향을 제거한 뒤 lag <M>k</M>가 추가로 주는 관계를 본다. 순수한 AR(<M>p</M>) 과정에서는 PACF가 <M>p</M> 뒤에서 끊기고, 순수한 MA(<M>q</M>) 과정에서는 ACF가 <M>q</M> 뒤에서 끊기는 교과서 패턴이 나타난다.
        </p>
        <div className="not-prose my-5 divide-y divide-border border-y border-border text-sm">
          <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
            <strong className="font-mono text-teal-700 dark:text-teal-300">AR(p) 후보</strong>
            <span className="text-muted-foreground">PACF가 p 이후 약해지고 ACF가 서서히 감소하는지 본다.</span>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
            <strong className="font-mono text-blue-700 dark:text-blue-300">MA(q) 후보</strong>
            <span className="text-muted-foreground">ACF가 q 이후 약해지고 PACF가 서서히 감소하는지 본다.</span>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
            <strong className="font-mono text-foreground">ARMA 후보</strong>
            <span className="text-muted-foreground">둘 다 서서히 감소할 수 있으므로 인접한 작은 p·q 조합을 비교한다.</span>
          </div>
        </div>
        <p>
          실제 데이터에서는 유한 표본, 계절성, 구조 변화, 여러 AR·MA 항의 혼합 때문에 “절단”이 흐려진다. 신뢰구간 밖 spike 하나도 여러 lag를 동시에 보면 우연히 생길 수 있다. 따라서 ACF/PACF는 <strong>탐색 범위를 줄이는 시각적 prior</strong>이지 자동 판정기가 아니다.
        </p>
        <M display>{'\\underbrace{\\pm\\frac{1.96}{\\sqrt{T}}}_{\\text{백색잡음 가정의 점별 근사 기준선}}'}</M>
        <FormulaNote
          meaning="표본 수 T가 커지면 우연한 표본 자기상관의 흔들림이 작아져 기준선이 좁아진다. 이 선은 각 lag를 따로 볼 때의 근사선이다. 여러 lag를 동시에 검사하면 하나쯤 우연히 넘을 가능성이 커지므로 차수 확정선으로 쓰지 않는다."
          symbols={[
            ['T', 'ACF 또는 PACF 계산에 사용한 시계열 표본 수'],
            ['1.96', '큰 표본 정규 근사에서 양쪽 95% 범위에 해당하는 값'],
            ['\\pm', '0을 중심으로 위와 아래에 같은 폭의 기준선을 둔다는 뜻'],
          ]}
        />

        <h3>2. 같은 학습 창에서 AICc를 비교한다</h3>
        <p>
          후보마다 우도는 좋아질수록 유리하지만 파라미터를 늘리면 거의 항상 더 잘 맞는다. AICc는 적합 이득에서 복잡도와 작은 표본의 추가 벌점을 빼는 역할을 한다. <strong>변환과 d·D를 먼저 고정한 뒤</strong> 같은 관측 구간과 같은 우도 정의를 사용한 p·q·P·Q 후보끼리만 비교한다. 차분 횟수가 다르면 적합에 쓰인 값과 표본 수가 달라져 점수를 곧바로 비교할 수 없다.
        </p>
        <M display>{"\\begin{aligned}\\mathrm{AICc}&=\\underbrace{-2\\ln L}_{\\text{데이터를 못 설명한 비용}}+\\underbrace{2k}_{\\text{파라미터 수 벌점}}\\\\&\\quad+\\underbrace{\\frac{2k(k+1)}{n-k-1}}_{\\text{작은 표본의 추가 벌점}}\\end{aligned}"}</M>
        <FormulaNote
          meaning="첫 항은 현재 후보가 관측 데이터를 얼마나 잘 설명하는지, 둘째와 셋째 항은 그 설명을 얻기 위해 모델을 얼마나 복잡하게 만들었는지를 측정한다. AICc가 가장 작다는 것은 후보 집합 안에서 유망하다는 뜻이지, 모델이 올바르거나 미래 예측이 좋다는 증명은 아니다."
          symbols={[
            ['L', '현재 후보가 학습 데이터에 부여한 최대 우도. 클수록 첫 비용은 작아진다.'],
            ['k', 'AR·MA 계수, 상수항과 혁신 분산 등 구현이 자유 파라미터로 세는 수. 라이브러리 규약을 확인한다.'],
            ['n', '동일한 학습 창을 변환·차분한 뒤 실제 우도 적합에 사용한 관측값 수'],
            ['2k', '파라미터를 추가해 학습 데이터만 더 잘 맞추는 것을 막는 기본 벌점'],
            ['\\frac{2k(k+1)}{n-k-1}', 'n이 작거나 k가 클 때 급격히 커지는 유한 표본 보정'],
          ]}
        />
        <p>
          표본이 충분히 크면 AICc는 AIC에 가까워진다. BIC는 <M>k\ln n</M> 벌점을 사용해 보통 더 작은 모델을 선호한다. AICc는 학습 데이터의 최대우도와 파라미터 수로 후보를 선별하는 값이지, 운영의 24-step 손실을 직접 측정한 값이 아니다. 따라서 AICc 승자와 24-step 승자가 달라도 이상하지 않다. 서로 다른 라이브러리의 상수·분산·우도 규약도 다를 수 있으므로 점수를 섞지 않는다. 최종 판정 권한은 언제나 별도의 rolling-origin 검증에 있다.
        </p>

        <h3>3. 잔차가 백색잡음에 가까운지 묻는다</h3>
        <p>
          잔차에 반복 패턴이 남아 있다는 것은 모델이 아직 사용할 수 있는 신호를 놓쳤다는 뜻이다. 잔차의 시간 플롯과 ACF를 보고, 여러 lag를 함께 검사하는 Ljung–Box 검정을 사용한다. 실패하면 무작정 차수만 키우지 말고 빠진 계절성, 이상치, 구조 변화, 잘못된 변환까지 되돌아본다.
        </p>
        <M display>{"\\begin{aligned}\\underbrace{Q}_{\\text{여러 잔차 lag의 총 신호}}&=\\underbrace{n(n+2)}_{\\text{표본 크기 보정}}\\sum_{k=1}^{h}\\\\&\\quad\\underbrace{\\frac{\\widehat{\\rho}_k^2}{n-k}}_{\\text{lag k에 남은 자기상관}}\\end{aligned}"}</M>
        <FormulaNote
          meaning="Ljung–Box 통계량은 잔차 ACF의 여러 lag를 한꺼번에 모아 '모두 0에 가깝다'는 귀무가설을 검사한다. 작은 p-value는 남은 구조의 경보다. 큰 p-value는 구조가 없음을 증명하는 것이 아니라, 선택한 h와 현재 표본에서 발견하지 못했다는 뜻이다."
          symbols={[
            ['Q', 'lag 1부터 h까지 남은 잔차 자기상관을 합친 검정 통계량'],
            ['n', '잔차의 개수'],
            ['h', '함께 검사할 최대 lag. 계절 주기와 예측 horizon을 고려해 미리 정한다.'],
            ['\\widehat{\\rho}_k', '잔차와 k시점 전 잔차 사이의 표본 자기상관'],
            ['n-k', '큰 lag에서 비교 가능한 잔차 쌍이 줄어드는 것을 반영하는 분모'],
          ]}
        />
        <p>
          적합한 ARIMA의 Ljung–Box 검정은 추정한 AR·MA 항 수 <M>K</M>를 반영해 자유도를 <M>{'\\ell-K'}</M>로 조정한다. 최대 lag는 비계절이면 <M>{'\\ell=\\min(10,T/5)'}</M>, 계절 주기 <M>s</M>가 있으면 <M>{'\\ell=\\min(2s,T/5)'}</M>를 출발점으로 삼되, 분석 전에 정하고 라이브러리의 반올림 규약을 기록한다. 잔차 평균이 0에 가깝고 자기상관이 남지 않는 것은 point forecast의 핵심 진단이다. 이 검정은 ARCH 같은 이분산이나 정규성을 검사하지 않는다. 잔차 분산과 분포 가정은 예측 구간의 신뢰도에서 별도로 확인한다.
        </p>

        <h3>4. 구조 변화는 “어느 lag가 빠졌나”와 다른 실패다</h3>
        <p>
          한 시점만 튀고 돌아오면 spike outlier, 한 번 점프한 뒤 새 중심이 유지되면 level shift,
          계수와 변동성 자체가 달라지면 regime change로 구분한다. spike는 그 시점만 1인 변수,
          알려진 영구 shift는 이후 계속 1인 step 변수로 설명할 수 있다. 사건 뒤 관계 자체가 달라졌다면
          오래된 체제를 억지로 평균내지 않고 post-break 또는 짧은 rolling window로 다시 적합한 후보도 비교한다.
        </p>
        <p>
          이 선택에도 미래 정보가 새면 안 된다. 과거 fold를 평가하면서 전체 기간을 보고 break 날짜를 정하거나,
          미래에야 분명해진 “영구 변화”를 과거 시점에서 이미 알았던 것처럼 쓰면 누출이다. 각 origin에서 당시
          감지할 수 있었던 사건과 데이터만으로 처리 방식을 정한다.
        </p>

        <h3>5. 바깥 검증에서 기준선을 넘지 못하면 채택하지 않는다</h3>
        <p>
          AICc와 잔차 진단은 모두 학습 구간 안의 근거다. 마지막 판단은 운영과 같은 horizon을 가진 여러 rolling origin에서 수행한다. 중요한 점은 전체 시계열에서 d와 차수를 한 번 고른 뒤 과거 fold를 채점하지 않는 것이다. <strong>변환 적합, d·D 선택, 구조 변화 처리 방식, 후보 생성, AICc 선택과 ARIMA 적합을 각 fold 안에서 다시 실행</strong>해야 미래 구조가 과거 선택에 새어 들어오지 않는다.
        </p>
        <p>
          그 다음 ARIMA가 seasonal-naïve보다 평균 오차만 조금 낮은지, 대부분의 origin과 중요한 구간에서도 일관되게 낮은지, 예측 구간이 실제 포함률을 지키는지 확인한다. 모든 ARIMA 후보가 naïve에 지면 차수를 더 키우는 대신 ARIMA를 기각하고 ETS, 동적 회귀 또는 전역 모델로 올라간다.
        </p>
        <p>
          이 계약은 ARIMA에만 적용되지 않는다. LSTM, tree model, pretrained foundation model도 같은 origin과 같은 정보 가용성 아래에 놓아야 한다. 구현 단위의 검증 절차는{' '}
          <InternalLink slug="time-series-forecasting-evaluation" learningPathId="ai-timeseries-forecasting">
            시계열 예측 검증 글
          </InternalLink>
          로 이어진다.
        </p>

        <SourceNotes sources={[
          { label: 'FPP3 · Non-seasonal ARIMA models', href: 'https://otexts.com/fpp3/non-seasonal-arima.html', note: 'ACF/PACF의 역할, 점별 ±1.96/√T 근사 기준과 혼합 ARMA에서의 한계를 설명한 근거.' },
          { label: 'FPP3 · ARIMA modelling procedure', href: 'https://otexts.com/fpp3/arima-r.html', note: 'ACF/PACF 후보, AICc 탐색, 잔차 진단과 ARIMA Ljung–Box 자유도 조정의 근거.' },
          { label: 'FPP3 · Residual diagnostics', href: 'https://otexts.com/fpp3/diagnostics.html', note: '다중 lag 검정, 비계절 10·계절 2s와 T/5 상한 휴리스틱의 근거.' },
          { label: 'FPP3 · Time series cross-validation', href: 'https://otexts.com/fpp3/tscv.html', note: '미래를 쓰지 않는 rolling forecasting origin과 multi-step 오차 평가의 근거.' },
          { label: 'Hurvich & Tsai · Small-sample model selection (1989)', href: 'https://doi.org/10.1093/biomet/76.2.297', note: '작은 표본에서 AIC의 편향을 보정한 AICc 근거.' },
          { label: 'Ljung & Box · Lack-of-fit measure (1978)', href: 'https://doi.org/10.1093/biomet/65.2.297', note: '여러 잔차 lag를 함께 검사하는 portmanteau 통계량의 원 논문.' },
        ]} />
      </div>
    </section>
  );
}
