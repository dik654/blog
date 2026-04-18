import M from '@/components/ui/math';
import PrimeFieldViz from './viz/PrimeFieldViz';
import PrimeFieldDefViz from './viz/PrimeFieldDefViz';
import MultiplicativeGroupViz from './viz/MultiplicativeGroupViz';
import PrimitiveRootViz from './viz/PrimitiveRootViz';

export default function PrimeField() {
  return (
    <section id="prime-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소수체 & 원시근</h2>
      <div className="not-prose mb-8"><PrimeFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>소수체 정의</h3>
      </div>
      <div className="not-prose mb-8"><PrimeFieldDefViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-2">
        <h3>곱셈군 Fp*</h3>
      </div>
      <div className="not-prose mb-8"><MultiplicativeGroupViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>원시근 (Primitive Root)</h3>
      </div>
      <div className="not-prose mb-8"><PrimitiveRootViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>ZKP에서의 활용</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'NTT 단위근', desc: 'p-1이 2의 거듭제곱을 인수로 가지면 NTT 가능 (BN254: p-1 = 2²⁸ · ...)' },
            { name: 'Pedersen 생성원', desc: 'g, h를 이산로그 관계 미지인 두 생성원으로 선택' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-semibold text-sm text-indigo-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">소수체 및 원시근 심층</h3>

        {/* 소수체 정의 카드 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">Prime Field <M>{'\\mathbb{F}_p'}</M></p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="rounded bg-muted/50 p-2 text-center text-sm">
              <span className="font-semibold">집합</span><br />
              <span className="text-xs text-muted-foreground"><code>{'{0, 1, ..., p-1}'}</code></span>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center text-sm">
              <span className="font-semibold">덧셈</span><br />
              <span className="text-xs text-muted-foreground"><M>{'(a+b) \\bmod p'}</M></span>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center text-sm">
              <span className="font-semibold">곱셈</span><br />
              <span className="text-xs text-muted-foreground"><M>{'(a \\cdot b) \\bmod p'}</M></span>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center text-sm">
              <span className="font-semibold">조건</span><br />
              <span className="text-xs text-muted-foreground"><M>p</M> 소수 필수</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">모든 non-zero 원소가 곱셈 역원 보유 &mdash; 소수가 아니면 체가 되지 않는다.</p>
        </div>

        {/* 기본 정리 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">기본 정리</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Fermat 소정리</div>
            <M display>{'\\underbrace{a}_{\\text{체 원소}} ^{\\overbrace{p-1}^{\\text{체의 위수}}} \\equiv \\underbrace{1}_{\\text{항등원}} \\pmod{\\underbrace{p}_{\\text{소수}}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">a = 0이 아닌 체의 원소, p = 소수(체의 크기), p-1 = 곱셈군의 위수. 어떤 원소든 p-1번 거듭제곱하면 반드시 1로 돌아온다.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Euler 정리</div>
            <M display>{'\\underbrace{a}_{\\text{원소}} ^{\\overbrace{\\phi(n)}^{\\text{오일러 토션트}}} \\equiv \\underbrace{1}_{\\text{항등원}} \\pmod{\\underbrace{n}_{\\text{모듈러스}}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">phi(n) = n 이하에서 n과 서로소인 수의 개수(오일러 토션트 함수). gcd(a, n) = 1인 모든 a에 성립하며, n이 소수이면 Fermat 소정리와 동치.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Lagrange 정리</div>
            <p className="text-sm text-muted-foreground">부분군의 위수는 군의 위수를 나눈다</p>
          </div>
        </div>

        {/* 곱셈군 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">곱셈군 <M>{'\\mathbb{F}_p^*'}</M></h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-semibold mb-1">구조</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>집합: <code>{'{1, 2, ..., p-1}'}</code> (<M>p-1</M>개 원소)</li>
                <li>항상 <strong>순환군</strong> (<M>{'\\cong \\mathbb{Z}/(p{-}1)\\mathbb{Z}'}</M>)</li>
                <li><M>{'(p{-}1)'}</M>의 모든 약수 <M>d</M>마다 유일한 위수 <M>d</M> 부분군</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">원시근 (생성원)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><M>{'\\text{ord}(g) = p-1'}</M>이면 원시근</li>
                <li>개수: <M>{'\\phi(p-1)'}</M></li>
                <li><M>{'\\mathbb{F}_{17}'}</M> 예: <M>{'\\phi(16) = 8'}</M>개 &mdash; <code>{'{3,5,6,7,10,11,12,14}'}</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 원시근 탐색 알고리즘 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">원시근 탐색 알고리즘</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="space-y-2">
            {[
              { step: '1', text: <>소인수분해: <M>{'p-1 = \\prod q_i^{e_i}'}</M></> },
              { step: '2', text: <>랜덤 <M>{'x \\in \\{2, ..., p{-}1\\}'}</M> 선택</> },
              { step: '3', text: <>각 소인수 <M>{'q_i'}</M>에 대해 <M>{'x^{(p-1)/q_i} \\equiv 1'}</M>이면 거부</> },
              { step: '4', text: <>모두 통과하면 <M>x</M>가 원시근</> },
            ].map(s => (
              <div key={s.step} className="flex gap-3 items-start">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold shrink-0">{s.step}</span>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">기대 시도 횟수: <M>{'O(\\log\\log p)'}</M> &mdash; 밀도 <M>{'\\sim 1/\\log\\log p'}</M></p>
        </div>

        {/* ZK 전용 체 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">주요 ZK 체</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'BN254', adicity: '2-adicity 28', ntt: '2^{28}', use: 'Ethereum 프리컴파일' },
            { name: 'BLS12-381', adicity: '2-adicity 32', ntt: '2^{32}', use: 'Zcash, Filecoin, Eth 2.0' },
            { name: 'Goldilocks', adicity: '2-adicity 32', ntt: '2^{32}', use: 'Plonky2, Risc0 (u64 연산)' },
            { name: 'Mersenne 31', adicity: '2-adicity 1', ntt: '확장체 FFT', use: 'Stwo, Plonky3' },
          ].map(f => (
            <div key={f.name} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{f.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.adicity} &rarr; Max NTT <M>{f.ntt}</M></p>
              <p className="text-xs text-muted-foreground">{f.use}</p>
            </div>
          ))}
        </div>

        {/* 체 산술 최적화 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">체 산술 최적화</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Montgomery 형식</div>
            <p className="text-sm text-muted-foreground">
              <M>x</M>를 <M>{'xR \\bmod p'}</M>로 표현 (<M>{'R = 2^{256}'}</M>)<br />
              곱셈: <M>{'(xR \\cdot yR) \\cdot R^{-1} = (xy)R'}</M><br />
              나눗셈 불필요, 시프트만 &mdash; ~50% 성능 향상
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Barrett / Solinas</div>
            <p className="text-sm text-muted-foreground">
              Barrett: <M>{'2^k / p'}</M> 사전 계산으로 빠른 mod<br />
              Solinas: <M>{'p = 2^a - 2^b \\pm 1'}</M> &mdash; 시프트만으로 리덕션 (secp256k1)
            </p>
          </div>
        </div>

        {/* 역원 계산 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">역원 계산</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold">확장 유클리드</p>
            <p className="text-xs text-muted-foreground mt-1"><M>{'O(\\log p)'}</M> 반복. 대부분의 구현에서 사용</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold">Fermat 소정리</p>
            <p className="text-xs text-muted-foreground mt-1"><M>{'a^{-1} = a^{p-2}'}</M> &mdash; <M>{'O(\\log p)'}</M> 곱셈, 상수 시간</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-sm font-semibold">일괄 역원 (Montgomery trick)</p>
            <p className="text-xs text-muted-foreground mt-1"><M>n</M>개 동시 역원 &mdash; 비용: <M>{'3(n{-}1)'}</M> 곱셈 + 역원 1회</p>
          </div>
        </div>

        {/* 체 크기 고려 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
          <div className="text-sm font-semibold mb-1">체 크기 트레이드오프</div>
          <p className="text-sm text-muted-foreground">
            128-bit 보안: ECC 256-bit / RSA 3072-bit / 페어링 256-500 bit<br />
            작은 체 = 빠른 산술, 그러나 확장체 필요 가능 &mdash; ZK에서 큰 체는 네이티브 ECDSA, 작은 체는 빠른 prover
          </p>
        </div>
      </div>
    </section>
  );
}
