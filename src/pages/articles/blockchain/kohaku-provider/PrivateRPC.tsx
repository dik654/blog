import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrivateRPCViz from './viz/PrivateRPCViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PrivateRPC({ onCodeRef }: Props) {
  return (
    <section id="private-rpc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프라이빗 RPC: ORAM & TEE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ORAM(Oblivious RAM) — 실제 쿼리에 더미 쿼리를 섞어 보낸다.
          <br />
          서버 시점에서 K+1개 쿼리 중 어떤 것이 진짜인지 구별할 수 없다.
        </p>
        <p className="leading-7">
          식별 확률 = <code>1/(K+1)</code>. K=7이면 Pr = 12.5%.
          <br />
          K를 늘리면 프라이버시 강화, 대신 대역폭이 K배 증가한다.
        </p>
        <p className="leading-7">
          TEE(Trusted Execution Environment) 환경에서는 ORAM 프록시 자체를 enclave에서 실행한다.
          <br />
          서버 운영자도 쿼리 내용을 볼 수 없다.
        </p>
      </div>
      <div className="not-prose">
        <PrivateRPCViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-oram', codeRefs['kh-oram'])} />
          <span className="text-[10px] text-muted-foreground">oram.rs</span>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">ORAM 알고리즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Oblivious RAM for RPC queries

class RPCORAM {
    K: number = 7;  // 더미 쿼리 수 (privacy parameter)

    async query(realAddress: Address): Promise<Balance> {
        // 1) Generate K random dummy addresses
        const dummies = generateRandomAddresses(K);

        // 2) Mix real query with dummies
        const allQueries = shuffle([realAddress, ...dummies]);

        // 3) Parallel queries to RPC
        const responses = await Promise.all(
            allQueries.map(addr => rpc.getBalance(addr))
        );

        // 4) Find real result
        const realIndex = allQueries.indexOf(realAddress);
        return responses[realIndex];
    }
}

// Server perspective
// 서버가 보는 것: K+1 queries
// 서버가 모르는 것: 어떤 query가 진짜인지

// Privacy 분석
// - Query set size: K+1
// - Server guess accuracy: 1/(K+1)
// - K=7: 12.5% chance of guess
// - K=15: 6.25%
// - K=31: 3.1%

// 비용 trade-off
// Bandwidth: (K+1)× 증가
// Gas (if on-chain RPC): linear increase
// Server load: (K+1)× 증가

// 추가 최적화
// - Batch queries (Multicall) → amortize overhead
// - Caching (real + dummy 섞어서)
// - Temporal obfuscation (timing jitter)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 통합 시 보안 향상</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// TEE (SGX/TDX) 기반 ORAM Proxy

// 아키텍처
//
//  User (client)         TEE Proxy (server)        RPC Node
//  ──────────            ─────────────────        ─────────
//  Encrypted ──TLS──→   Enclave ─────→         Infura/Alchemy
//  query               ↓                       ↑
//                      Decrypt inside TEE      Plain response
//                      Apply ORAM
//                      Route queries

// TEE 보장
// - Enclave 내부 query 내용 비공개
// - Server admin 조차 접근 불가
// - Attestation으로 사용자가 검증

// 장점
// ✓ No bandwidth overhead (K=0 가능)
// ✓ Strong privacy guarantees
// ✓ Fast query response
// ✓ Trusted source (attested)

// 단점
// ✗ TEE vendor (Intel/AMD) trust 필요
// ✗ Side channel 공격 가능성
// ✗ Hardware dependency

// Hybrid 접근
// - TEE가 있으면 trusted path
// - TEE 없으면 ORAM fallback
// - 사용자가 선택 가능

// 사례
// - Oasis Signed Queries
// - Phala Phat Contract + RPC
// - MEVM (Metamask + TEE experiments)`}</pre>

      </div>
    </section>
  );
}
