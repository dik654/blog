import M from '@/components/ui/math';
import KeyExchangeViz from './viz/KeyExchangeViz';

export default function KeyExchange() {
  return (
    <section id="key-exchange" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 교환: ECDH</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          안전하지 않은 채널에서 공유 비밀을 수립하는 프로토콜. DH(1976)가 원조, ECDH가 현대 표준.
        </p>
      </div>
      <div className="not-prose"><KeyExchangeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Diffie-Hellman 원리</h3>
        <p>
          공개 파라미터: 큰 소수 <M>{'p'}</M>, 원시근(generator) <M>{'g \\in \\mathbb{Z}_p^*'}</M>
        </p>
      </div>

      {/* --- Alice & Bob DH --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">Alice</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li>랜덤 <M>{'a'}</M> 선택 (비밀)</li>
            <li><M>{'A = g^a \\bmod p'}</M> 계산</li>
            <li><M>{'A'}</M>를 Bob에게 전송 (공개 채널)</li>
            <li>Bob으로부터 <M>{'B'}</M> 수신</li>
            <li>공유 비밀: <M>{'s = B^a \\bmod p'}</M></li>
          </ol>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Bob</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li>랜덤 <M>{'b'}</M> 선택 (비밀)</li>
            <li><M>{'B = g^b \\bmod p'}</M> 계산</li>
            <li><M>{'B'}</M>를 Alice에게 전송</li>
            <li>Alice로부터 <M>{'A'}</M> 수신</li>
            <li>공유 비밀: <M>{'s = A^b \\bmod p'}</M></li>
          </ol>
        </div>
      </div>

      {/* --- 수학적 결과 --- */}
      <div className="not-prose rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 mb-4">
        <p className="font-semibold text-sm text-amber-400 mb-2">수학적 결과: 같은 비밀 공유</p>
        <M display>{'s_{\\text{Alice}} = B^a = (g^b)^a = g^{ab} \\bmod p'}</M>
        <M display>{'s_{\\text{Bob}} = A^b = (g^a)^b = g^{ab} \\bmod p'}</M>
        <p className="text-sm text-foreground/70 mt-2">
          공격자 Eve는 <M>{'A, B, g, p'}</M>를 모두 관찰할 수 있지만,
          <M>{'a'}</M> 또는 <M>{'b'}</M>를 구해야 <M>{'s'}</M>를 계산할 수 있다 — Discrete Logarithm Problem(이산로그 문제)이므로 어렵다
        </p>
      </div>

      {/* --- ECDH --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">ECDH (Elliptic Curve DH)</p>
          <p className="text-sm text-foreground/80 mb-2">타원곡선 위의 더 효율적인 버전</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li><M>{'G'}</M>: curve의 generator point</li>
            <li>Alice 공개키: <M>{'A = a \\cdot G'}</M></li>
            <li>Bob 공개키: <M>{'B = b \\cdot G'}</M></li>
            <li>공유 비밀: <M>{'s = b \\cdot A = a \\cdot B = ab \\cdot G'}</M></li>
          </ul>
          <p className="text-xs text-foreground/50 mt-3 mb-1 font-semibold">장점</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>RSA 3072-bit = ECC 256-bit 동등 보안</li>
            <li>계산 빠름, 키 짧음</li>
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Curve25519 예시</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>Alice priv: 32 bytes random</li>
            <li>Alice pub: <code className="text-xs">x25519(priv, 9)</code></li>
            <li>Bob priv: 32 bytes random</li>
            <li>Bob pub: <code className="text-xs">x25519(priv, 9)</code></li>
            <li>Shared: <code className="text-xs">x25519(Alice.priv, Bob.pub)</code>
              {' '}= <code className="text-xs">x25519(Bob.priv, Alice.pub)</code></li>
          </ul>
        </div>
      </div>

      {/* --- 실무 적용 + MitM --- */}
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-5">
          <p className="font-semibold text-sm text-foreground/60 mb-2">실무 적용</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { proto: 'TLS 1.3', detail: 'key_share extension' },
              { proto: 'Signal', detail: 'X3DH protocol' },
              { proto: 'SSH', detail: 'curve25519-sha256' },
              { proto: 'WireGuard', detail: 'VPN' },
            ].map(p => (
              <div key={p.proto} className="rounded border border-foreground/5 bg-background/50 p-2">
                <p className="font-mono text-xs font-semibold text-indigo-400">{p.proto}</p>
                <p className="text-xs text-foreground/50 mt-0.5">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="font-semibold text-sm text-rose-400 mb-2">MitM 공격 방어</p>
          <p className="text-sm text-foreground/80">
            DH 자체는 인증이 없어 공격자가 중간에서 키를 교체할 수 있다
          </p>
          <p className="text-sm text-foreground/80 mt-2">
            <strong>해결:</strong> 디지털 서명으로 공개키 인증 — TLS 인증서, PGP 등
          </p>
        </div>
      </div>
    </section>
  );
}
