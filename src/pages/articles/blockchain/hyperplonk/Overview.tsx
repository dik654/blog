import Math from '@/components/ui/math';
import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HyperPLONK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>HyperPLONK</strong> — Binyi Chen, Benedikt Bunz, Dan Boneh, Zhenfei Zhang가 2022년에 제안한 증명 시스템
          <br />
          <a href="/blockchain/plonk" className="text-indigo-400 hover:underline">PLONK</a>의 핵심 구조를 유지하면서, 다항식 표현과 증명 전략을 근본적으로 교체한 설계
        </p>

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">PLONK의 병목: FFT</h3>
        <p>
          PLONK은 <strong>단변수 다항식(univariate polynomial)</strong>으로 제약을 인코딩함
          <br />
          witness 다항식의 계수를 구하려면 <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT</a>가 필수 — 시간 복잡도 <Math>{'\\underbrace{O(n \\log n)}_{\\text{FFT 지배적}}'}</Math>
          <br />
          FFT는 순차적 butterfly 연산이라 GPU/FPGA 병렬화에 비효율적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">HyperPLONK의 해법</h3>
        <p>
          단변수 다항식 대신 <strong>다중선형 다항식(multilinear polynomial)</strong> 사용
          <br />
          FFT 대신 <strong>sumcheck 프로토콜</strong>로 제약 검증 — prover 복잡도 <Math>{'\\underbrace{O(n)}_{\\text{선형 시간}}'}</Math>
          <br />
          commitment scheme도 KZG 대신 <strong>다중선형 PCS</strong>(Dory, Zeromorph 등)로 교체
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 구성 요소</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 확장 (MLE)</h4>
            <p className="text-sm">
              <Math>{'\\underbrace{n}_{\\text{변수 수}}'}</Math>개 변수, 각 변수 차수 최대 1
              <br />
              <Math>{'\\underbrace{2^n}_{\\text{평가점 수}}'}</Math>개 평가값을 진리표처럼 인코딩
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Sumcheck 프로토콜</h4>
            <p className="text-sm">
              <Math>{'\\underbrace{\\sum_{x \\in \\{0,1\\}^n} f(x)}_{\\text{하이퍼큐브 전체 합}} = T'}</Math> 검증
              <br />
              <Math>{'\\underbrace{O(n)}_{\\text{라운드 수}}'}</Math> 라운드, 각 라운드 <Math>{'O(1)'}</Math> 통신
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 PCS</h4>
            <p className="text-sm">
              Dory — 투명 셋업, 로그 크기 증명
              <br />
              Zeromorph — KZG 기반 다중선형 commit
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">HyperPLONK 배경과 동기</h3>
        <p>
          <strong>논문</strong>: "HyperPlonk: Plonk with Linear-Time Prover and High-Degree Custom Gates"
          <br />
          저자 Binyi Chen, Benedikt Bunz, Dan Boneh, Zhenfei Zhang — 2022년 발표, EUROCRYPT 2023 게재
        </p>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mt-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <h4 className="font-medium text-sm mb-2">문제: PLONK의 FFT 병목</h4>
            <p className="text-sm text-muted-foreground">
              prover 복잡도 <Math>{'\\underbrace{O(n \\log n)}_{\\text{FFT 지배}}'}</Math> — 차수 <Math>{'n'}</Math> 다항식에 대한 FFT 연산이 지배적
              <br />
              FFT는 순차적 butterfly 의존성 때문에 GPU 병렬화가 어려움
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h4 className="font-medium text-sm mb-2">해법: 다중선형 + sumcheck</h4>
            <p className="text-sm text-muted-foreground">
              단변수 다항식 → 다중선형 다항식으로 교체
              <br />
              FFT → sumcheck 프로토콜로 교체
              <br />
              prover 복잡도 <Math>{'\\underbrace{O(n)}_{\\text{선형 시간}}'}</Math>
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">다항식 표현 비교</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">PLONK (단변수)</h4>
            <p className="text-sm text-muted-foreground">
              회로 <Math>{'n'}</Math>개 게이트, witness 다항식 <code>w(X)</code> 차수 <Math>{'n-1'}</Math>
              <br />
              도메인: <Math>{'\\underbrace{H = \\{1, \\omega, \\omega^2, \\ldots, \\omega^{n-1}\\}}_{n\\text{개 단위근 — FFT 도메인}}'}</Math>
              <br />
              FFT 필요: 보간, 랜덤 평가, 몫 다항식 계산
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">HyperPLONK (다중선형)</h4>
            <p className="text-sm text-muted-foreground">
              witness 다중선형 다항식 <Math>{'\\underbrace{f(x_1, \\ldots, x_{\\log n})}_{\\text{각 변수 차수 } \\leq 1}'}</Math>
              <br />
              도메인: <Math>{'\\underbrace{\\{0,1\\}^{\\log n}}_{\\text{불리언 하이퍼큐브}}'}</Math>
              <br />
              FFT 불필요 — 꼭짓점 평가는 단순 조회, 랜덤 점 평가는 <Math>{'O(n)'}</Math> 합산
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 다중선형이 회로에 자연스러운가</h3>
        <p>
          <Math>{'n'}</Math>개 게이트를 <Math>{'0'}</Math>부터 <Math>{'n-1'}</Math>까지 인덱싱하면 각 인덱스는 <Math>{'\\log n'}</Math>비트로 표현됨
        </p>
        <Math display>{'\\underbrace{w[i]}_{\\text{게이트 } i \\text{ witness}} = \\underbrace{f(b_1, b_2, \\ldots, b_{\\log n})}_{\\text{비트 분해 } i = (b_1 b_2 \\cdots b_{\\log n})_2}'}</Math>
        <p className="text-sm text-muted-foreground mt-2">w[i] = 게이트 i의 witness 값, f = 다중선형 다항식, b_j = 인덱스 i의 j번째 비트. 게이트 인덱스를 이진수로 펼치면 하이퍼큐브 꼭짓점 좌표와 1:1 대응 -- 다중선형 표현이 회로 인덱싱에 가장 자연스러운 이유.</p>
        <p>
          <Math>{'\\log n'}</Math>개 변수, 각 변수가 비트 위치 하나에 대응
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Sumcheck 프로토콜 (1992)</h3>

        {/* 목표 수식 */}
        <div className="not-prose">
          <Math display>{'\\underbrace{\\sum_{x \\in \\{0,1\\}^k} f(x)}_{\\text{하이퍼큐브 } 2^k \\text{개 점의 합}} = \\underbrace{S}_{\\text{주장값}}'}</Math>
          <p className="text-sm text-muted-foreground mt-2 mb-6 text-center">f = k개 변수 다항식, x = 불리언 벡터 (각 성분 0 또는 1), S = prover가 주장하는 전체 합. verifier는 f를 직접 2^k번 평가하지 않고 k라운드 상호작용으로 검증.</p>
        </div>

        {/* 단계별 카드 */}
        <div className="space-y-3 not-prose">
          {/* Step 0: 시작 */}
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">0</div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-2">시작: Prover가 합 S를 주장</h4>
              <p className="text-sm text-muted-foreground">
                Prover: "<Math>{'\\sum_{x \\in \\{0,1\\}^k} f(x) = S'}</Math>가 성립한다"
                <br />
                Verifier: "증명하라" — 직접 <Math>{'2^k'}</Math>번 평가하는 건 비용 <Math>{'O(2^k)'}</Math>이므로 대화형 축소 시작
              </p>
            </div>
          </div>

          {/* Step 1: 라운드 1 */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400">1</div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-2">라운드 1: 첫 번째 변수 분리</h4>
              <Math display>{'\\underbrace{g_1(X_1)}_{\\text{단변수 다항식}} = \\sum_{x_2, \\ldots, x_k \\in \\{0,1\\}} f(X_1, x_2, \\ldots, x_k)'}</Math>
              <p className="text-sm text-muted-foreground mt-2">
                Prover가 <Math>{'g_1(X_1)'}</Math>을 전송 — <Math>{'x_1'}</Math>만 자유변수로 남기고 나머지 <Math>{'k{-}1'}</Math>개 변수는 <Math>{'\\{0,1\\}'}</Math>에서 합산
                <br />
                Verifier 확인: <Math>{'\\underbrace{g_1(0) + g_1(1)}_{\\text{자유변수도 합산}} = S'}</Math> — 일치하면 랜덤 챌린지 <Math>{'r_1'}</Math> 전송
              </p>
            </div>
          </div>

          {/* Step 2: 라운드 i */}
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">2</div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-2">라운드 i: 변수 하나씩 고정</h4>
              <Math display>{'\\underbrace{g_i(X_i)}_{\\text{라운드 } i \\text{ 부분합}} = \\sum_{x_{i+1}, \\ldots, x_k \\in \\{0,1\\}} f(\\underbrace{r_1, \\ldots, r_{i-1}}_{\\text{이전 라운드에서 고정}}, X_i, x_{i+1}, \\ldots, x_k)'}</Math>
              <p className="text-sm text-muted-foreground mt-2">
                Verifier 확인: <Math>{'g_i(0) + g_i(1) = g_{i-1}(r_{i-1})'}</Math> — 이전 라운드 값과 일치 확인 후 랜덤 <Math>{'r_i'}</Math> 전송
                <br />
                매 라운드마다 자유변수 1개가 랜덤값으로 고정 — 합산 공간이 절반씩 축소
              </p>
            </div>
          </div>

          {/* Step 3: 최종 확인 */}
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-sm font-bold text-rose-400">3</div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-2">라운드 k: 오라클 질의로 최종 확인</h4>
              <Math display>{'\\underbrace{g_k(r_k)}_{\\text{마지막 부분합의 평가}} = \\underbrace{f(r_1, r_2, \\ldots, r_k)}_{\\text{오라클 질의 1회}}'}</Math>
              <p className="text-sm text-muted-foreground mt-2">
                모든 변수가 고정되어 단일 점 평가만 남음 — Verifier가 <Math>{'f(r_1, \\ldots, r_k)'}</Math>를 직접 확인(또는 PCS opening)
                <br />
                총 통신량: <Math>{'\\underbrace{O(k \\cdot d)}_{k \\text{ 라운드} \\times d \\text{ 차수}}'}</Math> 필드 원소 — 다중선형(<Math>{'d=1'}</Math>)이면 <Math>{'O(\\log n)'}</Math>개
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Prover 선형성</h3>
        <div className="not-prose">
          <Math display>{'\\underbrace{T_{\\text{prover}}}_{\\text{전체 prover 시간}} = \\underbrace{O(n)}_{\\text{MLE commit}} + \\underbrace{O(n)}_{\\text{sumcheck 합산}} + \\underbrace{T_{\\text{PCS}}}_{\\text{opening proof}}'}</Math>
          <p className="text-sm text-muted-foreground mt-2 text-center">n = 게이트 수. MLE commit은 2^k개 평가값에 대한 다중스칼라곱(MSM), sumcheck는 매 라운드 합산 크기가 절반씩 줄어 총합 O(n). PCS가 선형이면 전체 O(n).</p>
        </div>
        <div className="rounded-lg border p-4 not-prose mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-red-500/20 bg-red-500/5 p-3">
              <h4 className="font-medium text-sm mb-1">PLONK prover</h4>
              <p className="text-sm text-muted-foreground">
                NTT(FFT) 지배: <Math>{'\\underbrace{O(n \\log n)}_{\\text{butterfly 순차 연산}}'}</Math>
              </p>
            </div>
            <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-3">
              <h4 className="font-medium text-sm mb-1">HyperPLONK prover</h4>
              <p className="text-sm text-muted-foreground">
                sumcheck 지배: <Math>{'\\underbrace{O(n)}_{\\text{완전 병렬화 가능}}'}</Math>
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">다중선형 PCS 선택지</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Dory (Lee, 2021)</h4>
            <p className="text-sm text-muted-foreground">
              투명 셋업(trusted setup 불필요), 페어링 기반
              <br />
              증명 크기 <Math>{'\\underbrace{O(\\log n)}_{\\text{로그 크기}}'}</Math>, 검증 <Math>{'O(\\log n)'}</Math>
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Zeromorph (Kohrita-Towa, 2023)</h4>
            <p className="text-sm text-muted-foreground">
              KZG 기반 (trusted setup 필요), 다중선형 → 단변수 환원
              <br />
              증명 크기 <Math>{'\\underbrace{O(1)}_{\\text{상수 크기}}'}</Math>, <Math>{'\\log n'}</Math>회 KZG opening 필요
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Basefold (Zeilberger-Chen-Fisch, 2023)</h4>
            <p className="text-sm text-muted-foreground">
              Merkle 기반 투명 셋업, 페어링 불필요
              <br />
              증명 크기 <Math>{'\\underbrace{O(\\log^2 n)}_{\\text{준로그 크기}}'}</Math>, 빠른 prover
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Ligero++ / Brakedown</h4>
            <p className="text-sm text-muted-foreground">
              코드 기반(error-correcting code) 다중선형 commit
              <br />
              증명 크기 <Math>{'\\underbrace{O(\\sqrt{n})}_{\\text{루트 크기}}'}</Math> 또는 <Math>{'O(n^{0.5+\\epsilon})'}</Math>, 빠른 prover
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">커스텀 게이트</h3>
        <p>
          PLONK: 게이트 제약이 2차 다항식 — HyperPLONK: <strong>고차(high-degree) 커스텀 게이트</strong> 지원
        </p>
        <Math display>{'\\underbrace{C(w_1, w_2, \\ldots, w_d)}_{\\text{차수 } d \\text{ 커스텀 제약}} = 0 \\quad \\text{vs} \\quad \\underbrace{q_L \\cdot a + q_R \\cdot b + q_M \\cdot a \\cdot b + q_O \\cdot c + q_C}_{\\text{PLONK: 고정 2차 형태}} = 0'}</Math>
        <p className="text-sm text-muted-foreground mt-2">C = 커스텀 제약 다항식, w_i = witness 열, d = 제약의 최대 차수. PLONK은 q_L, q_R 등 셀렉터로 2차 제약만 표현 가능 -- HyperPLONK은 sumcheck가 임의 차수를 처리하므로 고차 게이트를 자유롭게 설계.</p>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mt-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Poseidon 해시 게이트</h4>
            <p className="text-sm text-muted-foreground"><Math>{'x^5'}</Math> S-box 직접 표현</p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">ECDSA 서명 게이트</h4>
            <p className="text-sm text-muted-foreground">타원곡선 연산 전용 제약</p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Range check 게이트</h4>
            <p className="text-sm text-muted-foreground">범위 검증 전용 제약</p>
          </div>
        </div>
        <p className="mt-3">제약 수를 극적으로 줄여 prover 성능 향상</p>

        <h3 className="text-xl font-semibold mt-8 mb-4">성능 벤치마크 (<Math>{'\\underbrace{n = 2^{20}}_{\\approx\\text{100만 게이트}}'}</Math>)</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">항목</th>
                <th className="text-left p-3 font-medium">PLONK</th>
                <th className="text-left p-3 font-medium">HyperPLONK</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3">Prover 시간</td>
                <td className="p-3">~30초 (FFT 지배)</td>
                <td className="p-3">~10초 (선형 시간)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3">증명 크기</td>
                <td className="p-3">~700 bytes</td>
                <td className="p-3">~5 KB</td>
              </tr>
              <tr>
                <td className="p-3">검증 시간</td>
                <td className="p-3">~2 ms</td>
                <td className="p-3">~5 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2">트레이드오프: 더 큰 증명 크기를 감수하고 더 빠른 prover를 얻는 구조</p>

        <h3 className="text-xl font-semibold mt-8 mb-4">구현체 및 활용</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">구현체</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>EspressoSystems/hyperplonk</code> (Rust)</li>
              <li>Basefold 구현 (yezhang1338)</li>
              <li>ProtoStar — 다중선형 기반 folding scheme</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">활용 분야</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Espresso sequencer</li>
              <li>일부 커스텀 zkEVM 설계</li>
              <li>연구 중심 구현체</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
