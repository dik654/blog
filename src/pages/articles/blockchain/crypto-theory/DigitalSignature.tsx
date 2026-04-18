import M from '@/components/ui/math';
import DigitalSigViz from './viz/DigitalSigViz';

export default function DigitalSignature() {
  const algorithms = [
    { name: 'RSA', basis: 'Factoring', key: '3072+', sig: '384 B', usage: '전통적' },
    { name: 'ECDSA', basis: 'ECDLP', key: '256 bit', sig: '64-72 B', usage: 'BTC, ETH' },
    { name: 'EdDSA', basis: 'ECDLP', key: '256 bit', sig: '64 B', usage: '현대 표준' },
    { name: 'BLS', basis: 'Pairing', key: '256 bit', sig: '48 B', usage: 'ETH 2.0' },
    { name: 'Schnorr', basis: 'ECDLP', key: '256 bit', sig: '64 B', usage: 'BTC (Taproot)' },
  ];

  return (
    <section id="digital-signature" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디지털 서명: ECDSA, EdDSA, BLS</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          메시지 무결성과 발신자 인증을 동시에 보장하는 서명 알고리즘 비교.
        </p>
      </div>
      <div className="not-prose"><DigitalSigViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">디지털 서명 알고리즘 비교</h3>
      </div>

      {/* --- 비교 테이블 --- */}
      <div className="not-prose overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-foreground/10">
              {['알고리즘', '기반 문제', '키 크기', '서명 크기', '사용처'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs text-foreground/50 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {algorithms.map(a => (
              <tr key={a.name} className="border-b border-foreground/5">
                <td className="py-2 px-3 font-mono font-semibold text-indigo-400">{a.name}</td>
                <td className="py-2 px-3 text-foreground/70">{a.basis}</td>
                <td className="py-2 px-3 text-foreground/70">{a.key}</td>
                <td className="py-2 px-3 text-foreground/70">{a.sig}</td>
                <td className="py-2 px-3 text-foreground/70">{a.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ECDSA --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">ECDSA 서명 생성</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li><M>{'k'}</M> = 랜덤 nonce</li>
            <li><M>{'R = k \\cdot G'}</M>, <M>{'r = R_x \\bmod n'}</M></li>
            <li><M>{'s = k^{-1}(\\text{hash}(m) + r \\cdot \\text{priv}) \\bmod n'}</M></li>
            <li>서명 = <M>{'(r,\\; s)'}</M></li>
          </ol>
          <p className="text-xs text-rose-400 mt-3">nonce <code className="text-xs">k</code> 재사용 시 private key 노출 (Sony PS3 해킹 사례)</p>
        </div>

        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">ECDSA 검증</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li><M>{'u_1 = \\text{hash}(m) \\cdot s^{-1} \\bmod n'}</M></li>
            <li><M>{'u_2 = r \\cdot s^{-1} \\bmod n'}</M></li>
            <li><M>{"R' = u_1 \\cdot G + u_2 \\cdot \\text{pub}"}</M></li>
            <li><M>{"r \\stackrel{?}{=} R'_x"}</M></li>
          </ol>
        </div>
      </div>

      {/* --- Ed25519 --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Ed25519 (EdDSA, Curve25519)</p>
          <p className="text-xs text-foreground/50 mb-2 font-semibold">서명 과정</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li><M>{'r = \\text{SHA512}(\\text{priv} \\| m)'}</M></li>
            <li><M>{'R = r \\cdot G'}</M></li>
            <li><M>{'S = r + \\text{SHA512}(R \\| \\text{pub} \\| m) \\cdot \\text{priv}'}</M></li>
            <li>서명 = <M>{'(R,\\; S)'}</M></li>
          </ol>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Ed25519 장점</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li><strong>Deterministic</strong> — nonce 재사용 문제 없음</li>
            <li><strong>Batch verification</strong> — 다수 서명 일괄 검증 가능</li>
            <li>더 강한 보안 보장</li>
            <li>구현이 단순</li>
          </ul>
        </div>
      </div>

      {/* --- BLS + Schnorr --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-2">BLS (Boneh-Lynn-Shacham)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>짧은 서명 (48 bytes)</li>
            <li>Pairing 기반</li>
            <li><strong>Signature aggregation</strong> 가능</li>
          </ul>
          <M display>{'\\sigma_{\\text{agg}} = \\sigma_1 \\cdot \\sigma_2 \\cdots \\sigma_n'}</M>
          <p className="text-sm text-foreground/70 mt-1">수천 서명을 하나로 집계 — ETH 2.0 validator, Polygon, Dfinity</p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-2">Schnorr Signatures</p>
          <p className="text-xs text-foreground/50 mb-2 font-semibold">서명 과정</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li><M>{'R = k \\cdot G'}</M></li>
            <li><M>{'s = k + \\text{hash}(R \\| \\text{pub} \\| m) \\cdot \\text{priv}'}</M></li>
            <li>서명 = <M>{'(R,\\; s)'}</M></li>
          </ol>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">장점</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>선형성(linearity) → 집계 쉬움</li>
            <li><code className="text-xs">MuSig</code> 프로토콜 (multi-sig)</li>
            <li><code className="text-xs">Taproot</code> (Bitcoin BIP-340)</li>
          </ul>
        </div>
      </div>

      {/* --- 블록체인별 사용 --- */}
      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5">
        <p className="font-semibold text-sm text-foreground/60 mb-3">블록체인별 서명 알고리즘</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { chain: 'Bitcoin', sigs: 'ECDSA + Schnorr (Taproot)' },
            { chain: 'Ethereum', sigs: 'ECDSA + BLS (consensus)' },
            { chain: 'Solana', sigs: 'Ed25519' },
            { chain: 'Cosmos', sigs: 'Ed25519' },
            { chain: 'Polkadot', sigs: 'sr25519 (Schnorr variant)' },
          ].map(c => (
            <div key={c.chain} className="rounded border border-foreground/5 bg-background/50 p-2.5 text-center">
              <p className="font-semibold text-xs text-indigo-400">{c.chain}</p>
              <p className="text-xs text-foreground/60 mt-1">{c.sigs}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
