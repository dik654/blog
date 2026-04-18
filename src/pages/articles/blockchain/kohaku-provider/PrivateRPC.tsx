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
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>RPCORAM</code> 쿼리 흐름</p>
            <p className="text-xs text-muted-foreground mb-2"><code>K = 7</code> (더미 쿼리 수, privacy parameter)</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) K개 랜덤 더미 주소 생성 — <code>generateRandomAddresses(K)</code></li>
              <li>2) 진짜 쿼리와 더미를 혼합 — <code>shuffle([realAddress, ...dummies])</code></li>
              <li>3) K+1개 쿼리를 RPC에 병렬 전송 — <code>Promise.all()</code></li>
              <li>4) 진짜 결과만 추출 — <code>allQueries.indexOf(realAddress)</code></li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Privacy 분석</p>
              <p className="text-xs text-muted-foreground mb-2">서버가 보는 것: K+1 queries / 서버가 모르는 것: 어떤 query가 진짜인지</p>
              <div className="grid grid-cols-3 gap-1 text-center text-xs mt-2">
                <div className="bg-background rounded px-2 py-2">
                  <p className="font-medium">K=7</p>
                  <p className="text-muted-foreground">12.5%</p>
                </div>
                <div className="bg-background rounded px-2 py-2">
                  <p className="font-medium">K=15</p>
                  <p className="text-muted-foreground">6.25%</p>
                </div>
                <div className="bg-background rounded px-2 py-2">
                  <p className="font-medium">K=31</p>
                  <p className="text-muted-foreground">3.1%</p>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">비용 Trade-off</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Bandwidth: (K+1)x 증가</li>
                <li>Gas (on-chain RPC): linear increase</li>
                <li>Server load: (K+1)x 증가</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">최적화 기법</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-background px-2 py-1 rounded">Batch queries (Multicall) → overhead 분산</span>
              <span className="bg-background px-2 py-1 rounded">Caching (real + dummy 섞어서)</span>
              <span className="bg-background px-2 py-1 rounded">Temporal obfuscation (timing jitter)</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE 통합 시 보안 향상</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">TEE (SGX/TDX) 기반 ORAM Proxy 아키텍처</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center mt-2">
              <div className="bg-background rounded px-2 py-3">
                <p className="font-medium">User (client)</p>
                <p className="text-muted-foreground mt-1">Encrypted query</p>
                <p className="text-muted-foreground">TLS →</p>
              </div>
              <div className="bg-background rounded px-2 py-3 border border-blue-300 dark:border-blue-700">
                <p className="font-medium text-blue-600 dark:text-blue-400">TEE Proxy (enclave)</p>
                <p className="text-muted-foreground mt-1">Decrypt → ORAM → Route</p>
              </div>
              <div className="bg-background rounded px-2 py-3">
                <p className="font-medium">RPC Node</p>
                <p className="text-muted-foreground mt-1">Infura / Alchemy</p>
                <p className="text-muted-foreground">Plain response</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">TEE 보장</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Enclave 내부 query 내용 비공개</li>
              <li>Server admin 조차 접근 불가</li>
              <li>Attestation으로 사용자가 검증</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">장점</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>No bandwidth overhead (K=0 가능)</li>
                <li>Strong privacy guarantees</li>
                <li>Fast query response</li>
                <li>Trusted source (attested)</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">단점</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>TEE vendor (Intel/AMD) trust 필요</li>
                <li>Side channel 공격 가능성</li>
                <li>Hardware dependency</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Hybrid 접근 & 사례</p>
            <p className="text-sm text-muted-foreground mb-2">TEE가 있으면 trusted path, 없으면 ORAM fallback — 사용자가 선택</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-background px-2 py-1 rounded">Oasis Signed Queries</span>
              <span className="bg-background px-2 py-1 rounded">Phala Phat Contract + RPC</span>
              <span className="bg-background px-2 py-1 rounded">MEVM (Metamask + TEE)</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
