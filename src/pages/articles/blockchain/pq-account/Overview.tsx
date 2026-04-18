import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">양자 위협 &amp; AA 해결책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Shor 알고리즘은 이산 로그 문제를 다항 시간에 해결합니다.
          이더리움의 ECDSA(secp256k1)는 이산 로그에 기반하므로,
          충분한 큐비트의 양자 컴퓨터가 등장하면 <strong>공개키에서 개인키를 복원</strong>할 수 있습니다.
        </p>
        <p>
          해결책: <strong>격자 기반 서명(CRYSTALS-Dilithium)</strong>을 Account Abstraction과 결합합니다.
          AA 스마트 계정은 서명 검증 로직을 코드로 교체할 수 있으므로,
          ECDSA 대신 양자 내성 서명을 사용할 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('handle-ops', codeRefs['handle-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleOps()</span>
          <CodeViewButton onClick={() => onCodeRef('dilithium-keygen', codeRefs['dilithium-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">keygen()</span>
        </div>
      </div>
      <div className="mt-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">양자 위협 타임라인</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Shor 알고리즘 (1994)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>이산 로그 polynomial time 해결</li>
              <li>큰 정수 인수분해 polynomial time</li>
              <li>RSA, ECDSA, DH 모두 취약</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">큐비트 요구량</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div><code>RSA-2048</code>: ~4,000 logical qubits</div>
              <div><code>ECDSA secp256k1</code>: ~2,500 logical qubits</div>
              <div><code>현재 최대</code>: ~1,000 physical (noisy)</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Fault-tolerant 1 logical = ~1,000 physical → 필요한 physical qubits: <strong>~2,500,000</strong></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">현실적 타임라인</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">2024</p><p className="font-mono">~1,000 noisy qubits</p></div>
              <div><p className="text-muted-foreground">2030</p><p className="font-mono">100k logical?</p></div>
              <div><p className="text-muted-foreground">2040</p><p className="font-mono">crypto-relevant QC?</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">"Harvest now, decrypt later" 위협</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>지금 데이터 수집 &rarr; 나중에 복호화</li>
              <li>블록체인은 public data &rarr; 특히 취약</li>
              <li>장기 보안 필요한 자산 위험</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">NIST PQC 표준화 (2024)</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div><code>ML-KEM</code> &mdash; key encapsulation</div>
              <div><code>ML-DSA</code> &mdash; digital signature (= Dilithium)</div>
              <div><code>SLH-DSA</code> &mdash; stateless hash-based signature</div>
              <div><code>FN-DSA</code> &mdash; fast lattice signature</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ERC-4337 AA + PQC 조합</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">ERC-4337 (Account Abstraction) 2023</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Smart contract accounts 표준</li>
              <li>Custom signature verification</li>
              <li><code>EntryPoint</code>가 user operations 처리</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">핵심: <code>validateUserOp(userOp, signature)</code> &mdash; 개발자가 직접 구현, ECDSA 대신 Dilithium 가능</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">PQC Smart Account 구조</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><code>PQSmartAccount</code>: <code>IAccount</code> 구현, <code>dilithiumPublicKey</code> 저장</li>
              <li><code>validateUserOp()</code> &mdash; <code>verifyDilithium(pk, hash, sig)</code>로 서명 검증</li>
              <li>실패 시 <code>SIG_VALIDATION_FAILED</code> 반환</li>
              <li>통과 시 <code>missingAccountFunds</code>만큼 gas 선지불 후 0 반환</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">장점</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>양자 안전 (post-quantum)</li>
                <li>ECDSA 기반 infrastructure와 호환</li>
                <li>Gradual migration 가능</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">단점</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Signature 크기 증가 (2.4KB vs 65B)</li>
                <li>Gas 비용 증가 (on-chain verify 비쌈)</li>
                <li>아직 표준화 진행 중</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
