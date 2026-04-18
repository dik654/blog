import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import Groth16Viz from './viz/Groth16Viz';

export default function Groth16Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="groth16-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 Verify — 증명 & 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Prover는 오프체인에서 witness를 R1CS → QAP로 변환한 뒤, 증명(A, B, C)을 생성한다.
          <br />
          증명 크기는 192 bytes. 검증 시간은 일정하다(O(1)).
          <CodeViewButton onClick={() => onCodeRef('rg-verifier', codeRefs['rg-verifier'])} />
        </p>
        <p className="leading-7">
          Verifier는 온체인에서 페어링 검증을 수행한다.
          <br />
          <code>e(A,B) == e(α,β) · e(vk_x,γ) · e(C,δ)</code>.
          EVM precompile(0x06, 0x07, 0x08)을 사용해서 약 250,000 gas가 든다.
        </p>
      </div>
      <div className="not-prose"><Groth16Viz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Pairing-based Verification</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Groth16 Proof 구조 (192 bytes)</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">A</p><p className="font-mono"><code>G1Point</code></p><p className="text-xs text-muted-foreground">~48 bytes</p></div>
              <div><p className="text-muted-foreground">B</p><p className="font-mono"><code>G2Point</code></p><p className="text-xs text-muted-foreground">~96 bytes</p></div>
              <div><p className="text-muted-foreground">C</p><p className="font-mono"><code>G1Point</code></p><p className="text-xs text-muted-foreground">~48 bytes</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Verification Equation</p>
            <div className="my-2 text-center">
              <M display>{'e(A, B) \\cdot e(-\\alpha, \\beta) \\cdot e(-\\mathit{vk}_x, \\gamma) \\cdot e(-C, \\delta) = 1'}</M>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mt-3">
              <div>
                <p className="font-medium text-foreground/80 mb-1">Verification key (trusted setup)</p>
                <p><M>{'\\alpha, \\beta, \\gamma, \\delta'}</M></p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">Public input combination</p>
                <p><M>{'\\mathit{vk}_x = \\gamma\\text{ABC}_0 + \\sum_{i=1}^{l} \\text{pub}_i \\cdot \\gamma\\text{ABC}_i'}</M></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">EVM 구현 (<code>verify()</code>)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>1)</strong> <M>{'\\mathit{vk}_x'}</M> 계산 &mdash; <code>Pairing.addition</code> + <code>scalar_mul</code> 반복</li>
                <li><strong>2)</strong> Pairing check (4 pairings) &mdash; <code>Pairing.pairingProd4()</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">EVM Precompiles</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>0x06</code>: <code>bn256Add</code> (~150 gas)</li>
                <li><code>0x07</code>: <code>bn256ScalarMul</code> (~6,000 gas)</li>
                <li><code>0x08</code>: <code>bn256Pairing</code> (~45K base + 34K/pair)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Gas 비교</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">Groth16</p><p className="font-mono font-semibold">~250K gas</p><p className="text-xs text-muted-foreground">L1 최적</p></div>
              <div><p className="text-muted-foreground">PLONK</p><p className="font-mono">~300K gas</p><p className="text-xs text-muted-foreground">더 복잡한 verifier</p></div>
              <div><p className="text-muted-foreground">STARK</p><p className="font-mono">~1M+ gas</p><p className="text-xs text-muted-foreground">Merkle/FRI 추가</p></div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Trusted Setup Ceremony</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Groth16 약점: per-circuit trusted setup</p>
            <p className="text-sm text-muted-foreground">각 circuit마다 secret values (toxic waste) 생성. 유출 시 가짜 proof 생성 가능.</p>
            <p className="text-sm text-muted-foreground mt-1"><strong>해결</strong>: MPC ceremony &mdash; 100~1,000명 참여, 한 명이라도 정직하면 안전</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Phase 1: Powers of Tau (universal)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>BN254 curve의 powers 생성</li>
                <li>모든 circuit에 공유 가능</li>
                <li>ZCash, Polygon, RAILGUN 등 재사용</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Phase 2: Per-circuit</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Circuit-specific 파생</li>
                <li>RAILGUN 자체 ceremony (2023, 수십 명 참여)</li>
                <li>Beacon (future block hash) + transcript 공개로 검증</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Trusted setup 문제 해결 시도</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2"><strong>PLONK</strong><br />universal setup<br /><span className="text-xs">(circuit-agnostic)</span></div>
              <div className="bg-muted/50 rounded p-2"><strong>Marlin</strong><br />universal + updatable</div>
              <div className="bg-muted/50 rounded p-2"><strong>Plonky2</strong><br />no setup<br /><span className="text-xs">(FRI-based)</span></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">RAILGUN이 Groth16 선택: L1 verify gas 최적 + MPC ceremony 참여 가능하면 충분히 안전. 단, 새 circuit 추가 시 새 ceremony 필요.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
