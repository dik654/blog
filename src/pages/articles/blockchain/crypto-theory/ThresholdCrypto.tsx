import M from '@/components/ui/math';
import ThresholdViz from './viz/ThresholdViz';

export default function ThresholdCrypto() {
  return (
    <section id="threshold-crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비밀 분산 & 임계값 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Shamir(1979) — 비밀을 여러 share로 분산하여 t개 이상 모여야 복원. 단일 장애점 제거.
        </p>
      </div>
      <div className="not-prose"><ThresholdViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Shamir's Secret Sharing</h3>
        <p>
          비밀 <M>{'s'}</M>를 <M>{'n'}</M>개 share로 분산하되,
          <M>{'t'}</M>개 이상 모이면 복원하고 <M>{'t-1'}</M>개 이하면 정보가 0인 체계.
          원리는 <strong>다항식 보간(polynomial interpolation)</strong>
        </p>
      </div>

      {/* --- Sharing + Reconstruction --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">Sharing (분산)</p>
          <ol className="text-sm text-foreground/80 space-y-2 list-decimal list-inside">
            <li>
              <M>{'t-1'}</M>차 다항식 생성 (<M>{'a_i'}</M>는 랜덤 계수)
              <M display>{'f(x) = s + a_1 x + a_2 x^2 + \\cdots + a_{t-1} x^{t-1}'}</M>
            </li>
            <li><M>{'n'}</M>개 share 생성: <M>{'\\text{share}_i = (i,\\; f(i))'}</M></li>
            <li><M>{'f(0) = s'}</M> — 상수항이 비밀</li>
          </ol>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Reconstruction (복원)</p>
          <p className="text-sm text-foreground/80 mb-2">
            <M>{'t'}</M>개의 <M>{'(x, y)'}</M> 점으로 라그랑주 보간
          </p>
          <M display>{'f(0) = \\sum_i y_i \\cdot L_i(0)'}</M>
          <p className="text-sm text-foreground/80 mt-2">
            <M>{'L_i'}</M>는 라그랑주 기저 다항식:
          </p>
          <M display>{'L_i(x) = \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}'}</M>
        </div>
      </div>

      {/* --- 예시 --- */}
      <div className="not-prose rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 mb-4">
        <p className="font-semibold text-sm text-amber-400 mb-2">예시: <M>{'t=3,\\; n=5'}</M></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/80">
              비밀 <M>{'s = 100'}</M>, 다항식 <M>{'f(x) = 100 + 5x + 2x^2'}</M>
            </p>
            <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">생성된 shares</p>
            <div className="flex flex-wrap gap-2">
              {[
                [1, 107], [2, 118], [3, 133], [4, 152], [5, 175],
              ].map(([x, y]) => (
                <span key={x} className="rounded border border-amber-500/10 bg-amber-500/5 px-2 py-0.5 font-mono text-xs text-foreground/70">
                  ({x}, {y})
                </span>
              ))}
            </div>
          </div>
          <div>
            <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
              <li>3개 모으면 <M>{'f(0) = 100'}</M> 복원 가능</li>
              <li>2개만 있으면 무한한 <M>{'f(x)'}</M>가 가능 — 정보 없음</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">보안 특성</p>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
              <li><M>{'t-1'}</M>개 share = 정보 이론적으로 0</li>
              <li>One-time pad 수준 안전</li>
              <li>Modular arithmetic으로 실제 구현</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Threshold Signatures --- */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3 className="text-xl font-semibold mb-3">Threshold Signatures</h3>
        <p>
          비밀 키를 SSS로 분산 → 서명도 분산 계산. 외부에서 보면 일반 서명과 동일
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">1. DKG (분산 키 생성)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>Distributed Key Generation</li>
            <li>아무도 full private key를 보지 못함</li>
            <li>각자 share만 보유</li>
          </ul>
        </div>
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">2. Signing (분산 서명)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li><M>{'t'}</M>개 참여자가 partial sig 생성</li>
            <li>Combine → full signature</li>
            <li>Verifier는 표준 검증만 수행</li>
          </ul>
        </div>
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">3. 외부 관점</p>
          <p className="text-sm text-foreground/80">일반 서명과 구분 불가 — 검증자는 threshold 구조를 알 필요 없음</p>
        </div>
      </div>

      {/* --- 구현 + 실무 --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-5">
          <p className="font-semibold text-sm text-foreground/60 mb-3">주요 구현</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Threshold BLS', desc: '가장 단순' },
              { name: 'FROST', desc: 'threshold Schnorr' },
              { name: 'GG18/GG20', desc: 'threshold ECDSA' },
              { name: 'DKLs19', desc: '최신 프로토콜' },
            ].map(p => (
              <div key={p.name} className="rounded border border-foreground/5 bg-background/50 p-2">
                <p className="font-mono text-xs font-semibold text-indigo-400">{p.name}</p>
                <p className="text-xs text-foreground/50 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">MPC Wallet 장점</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>Single point of failure 제거</li>
            <li>Seed phrase 보관 불필요</li>
            <li>Key rotation 가능</li>
            <li>더 나은 UX — 외부에선 일반 서명</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">사용처</p>
          <p className="text-sm text-foreground/70">
            Fireblocks, ZenGo, Coinbase / Validator key management / Multi-sig 대체 / HSM 분산화
          </p>
        </div>
      </div>
    </section>
  );
}
