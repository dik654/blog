import M from '@/components/ui/math';
import ContextViz from './viz/ContextViz';
import CryptoModelViz from './viz/CryptoModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대칭/비대칭 암호</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 신뢰 기반인 암호학의 핵심 개념과 응용.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><CryptoModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">대칭 vs 비대칭 암호 비교</h3>
      </div>

      {/* --- 대칭 암호 --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">대칭 암호 (Symmetric)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>암호화/복호화에 <strong>같은 키</strong> 사용</li>
            <li>속도: 빠름 (100 MB/s ~ GB/s)</li>
            <li>키 길이: 128 ~ 256 bits</li>
            <li>보안 기반: 치환(substitution) + 순열(permutation) 혼합</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">주요 알고리즘</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li><code className="text-xs">AES</code> — 128/192/256-bit, 모드: ECB, CBC, CTR, GCM, XTS</li>
            <li><code className="text-xs">ChaCha20-Poly1305</code> — 스트림 암호 + 인증, 모바일 친화적</li>
            <li><code className="text-xs">3DES</code> — legacy, deprecated</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">한계</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>키 교환 문제 — 어떻게 안전하게 전달하는가?</li>
            <li><M>{'n'}</M>명 통신 시 <M>{'n(n-1)/2'}</M>개 키 필요</li>
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">비대칭 암호 (Asymmetric / Public Key)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>공개키(encrypt) + 개인키(decrypt) 쌍</li>
            <li>속도: 느림 (KB/s ~ MB/s)</li>
            <li>키 길이: 256 ~ 4096 bits</li>
            <li>보안 기반: 수학적 난제 (인수분해, 이산로그, 격자)</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">주요 알고리즘</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li><code className="text-xs">RSA</code> — <M>{'n = p \\times q'}</M>, 2048/3072/4096-bit</li>
            <li><code className="text-xs">ECC</code> — secp256k1 (BTC/ETH), Curve25519 (Signal), P-256 (NIST)</li>
            <li><code className="text-xs">Ed25519 / X25519</code> — Curve25519 기반, 빠르고 안전</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">하이브리드</p>
          <p className="text-sm text-foreground/80">TLS: 비대칭으로 키 교환 → 대칭으로 데이터 암호화. 양쪽 장점을 결합</p>
        </div>
      </div>

      {/* --- 수학적 기반 --- */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3 className="text-xl font-semibold mt-6 mb-3">암호학의 수학적 기반</h3>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-1">1. Integer Factorization</p>
          <M display>{'n = p \\times q \\;\\text{에서}\\; p, q \\;\\text{찾기}'}</M>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside mt-2">
            <li><code className="text-xs">RSA</code> 기반</li>
            <li>2048-bit: 고전 컴퓨터로 수천 년</li>
            <li>양자 컴퓨터(Shor 알고리즘): 다항 시간</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-1">2. Discrete Logarithm (DLP)</p>
          <M display>{'g^x \\bmod p = y \\;\\text{에서}\\; x \\;\\text{찾기}'}</M>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside mt-2">
            <li><code className="text-xs">DH</code>, <code className="text-xs">DSA</code> 기반</li>
            <li>고전: 어려움 / 양자: Shor로 해결</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-1">3. Elliptic Curve DLP (ECDLP)</p>
          <M display>{'P = x \\cdot G \\;\\text{에서}\\; x \\;\\text{찾기}'}</M>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside mt-2">
            <li><code className="text-xs">ECDSA</code>, <code className="text-xs">EdDSA</code> 기반</li>
            <li>256-bit ECC = RSA 3072-bit 동등 보안</li>
            <li>양자: Shor 적용 가능</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-1">4. Lattice Problems</p>
          <p className="text-sm text-foreground/80 mt-1">SVP (Shortest Vector Problem), LWE (Learning With Errors)</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside mt-2">
            <li>Post-quantum 후보</li>
            <li><code className="text-xs">Kyber</code>, <code className="text-xs">Dilithium</code> (NIST 2022)</li>
          </ul>
        </div>
      </div>

      {/* --- Post-Quantum --- */}
      <div className="not-prose rounded-lg border border-rose-500/20 bg-rose-500/5 p-5">
        <p className="font-semibold text-sm text-rose-400 mb-2">양자 후 암호 (Post-Quantum) — 2022 NIST 표준</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {[
            { name: 'Kyber', desc: 'KEM (Lattice)' },
            { name: 'Dilithium', desc: '서명 (Lattice)' },
            { name: 'Falcon', desc: '서명 (Lattice)' },
            { name: 'SPHINCS+', desc: '서명 (Hash-based)' },
          ].map(a => (
            <div key={a.name} className="rounded border border-rose-500/10 bg-rose-500/5 p-2 text-center">
              <p className="font-mono text-xs font-semibold text-rose-300">{a.name}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{a.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground/70">
          전환 시기: 2024년 하이브리드 배포 시작 → 2030년 이후 양자 위협 현실화 → 완전 전환 필수
        </p>
      </div>
    </section>
  );
}
