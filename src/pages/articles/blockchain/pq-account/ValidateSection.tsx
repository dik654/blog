import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ValidateViz from './viz/ValidateViz';
import { codeRefs } from './codeRefs';

export default function ValidateSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">validateUserOp() 검증 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>_validatePrepayment()</code>은 nonce 확인, 예치금 차감, 서명 검증을 순서대로 수행합니다.
          PQ 계정에서는 마지막 단계에서 ECDSA + Dilithium 하이브리드 서명을 검증합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validate-prepayment', codeRefs['validate-prepayment'])} />
          <span className="text-[10px] text-muted-foreground self-center">_validatePrepayment() 내부</span>
        </div>
        <p>
          <code>validationData</code>의 반환값 규약: 0은 성공, 1은 서명 실패,
          나머지 비트에는 유효 기간(validAfter, validUntil)이 인코딩됩니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — nonce를 검증 전에 증가시키는 이유: 실패한 UserOp가 재전송되는 것을 방지합니다.
          검증 실패해도 nonce가 소비되어, 동일 UserOp를 다시 번들에 포함할 수 없습니다.
        </p>
      </div>
      <div className="mt-8"><ValidateViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">PQ Account validateUserOp 구현</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>PQSmartAccount.validateUserOp()</code></p>
            <p className="text-xs text-muted-foreground mb-2">
              <code>validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingFunds)</code> &rarr; <code>uint256 validationData</code>
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>Signature 분리</strong> &mdash; hybrid: <code>userOp.signature[0:65]</code> = ECDSA (65B), <code>[65:]</code> = Dilithium (2420B)</li>
              <li><strong>ECDSA 1차 검증</strong> &mdash; <code>ECDSA.recover(userOpHash, ecdsaSig)</code> &rarr; <code>ecdsaOwner</code>와 비교, 실패 시 <code>SIG_VALIDATION_FAILED</code></li>
              <li><strong>Dilithium 본 검증</strong> &mdash; <code>DilithiumVerifier.verify(dilithiumPublicKey, userOpHash, dilithiumSig)</code>, 실패 시 <code>SIG_VALIDATION_FAILED</code></li>
              <li><strong>Prefund</strong> &mdash; <code>missingFunds &gt; 0</code>이면 <code>msg.sender</code>에 ETH 전송 (gas 선지불)</li>
              <li><strong>유효 기간</strong> (optional) &mdash; <code>_packValidationData(valid, validUntil, validAfter)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Hybrid 이점</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>ECDSA &mdash; 빠른 prefilter (<strong>3K gas</strong>)</div>
              <div>Dilithium &mdash; 진짜 보안 (<strong>2.5M gas</strong>)</div>
              <div>둘 다 유효해야 통과 &rarr; <strong>AND 조건</strong></div>
              <div>Classical + Quantum 이중 저항</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Gradual migration 가능: ECDSA only &rarr; Hybrid &rarr; PQ only</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">validationData 인코딩</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>validationData</code>: 256-bit packed value</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div className="rounded border border-border/40 p-2">
                <p className="text-muted-foreground text-xs">20B</p>
                <p className="font-mono font-semibold">authorizer</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-muted-foreground text-xs">6B</p>
                <p className="font-mono font-semibold">validUntil</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-muted-foreground text-xs">6B</p>
                <p className="font-mono font-semibold">validAfter</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground mt-3">
              <div><code>0x00...00</code>: success</div>
              <div><code>0x00...01</code>: sig failure</div>
              <div>else: paymaster address</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2"><code>_packValidationData()</code> helper</p>
            <p className="text-sm text-muted-foreground">
              <code>(valid ? 0 : 1) | (uint256(validUntil) &lt;&lt; 160) | (uint256(validAfter) &lt;&lt; 208)</code>
            </p>
            <p className="text-sm text-muted-foreground mt-2">EntryPoint가 후속 처리: block timestamp 확인 &rarr; timeRange 내인지 검증 &rarr; 실패 시 revert</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Time-based Access Control 사용 사례</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div><strong>예약 실행</strong> &mdash; <code>validAfter</code> 설정</div>
              <div><strong>만료 시간</strong> &mdash; <code>validUntil</code> 설정</div>
              <div><strong>Session key</strong> &mdash; 일정 기간만 유효</div>
              <div><strong>Recovery delay</strong> &mdash; 7일 후 활성화</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
