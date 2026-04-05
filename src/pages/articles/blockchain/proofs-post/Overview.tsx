import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoSt 개요</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} WindowPoSt vs WinningPoSt</strong> — WindowPoSt는 "지금도 저장 중" 증명
          <br />
          WinningPoSt는 "블록 생산 권한" 증명. 목적이 완전히 다름
        </p>

        {/* ── PoSt 2 types ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2가지 PoSt 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2 Types of PoSt:

// WindowPoSt ("Proof of Time"):
// - 목적: "여전히 저장 중"
// - 빈도: 매 24시간
// - 범위: all active sectors
// - challenges: 10 per sector
// - deadline: 30분 window
// - 실패 시: fault fee + slashing
// - 역할: 지속적 보관 증명

// WinningPoSt ("Proof of Election"):
// - 목적: "block 생산 권한"
// - 빈도: 매 epoch (VRF 당첨 시)
// - 범위: 1 random sector
// - challenges: ~few per sector
// - deadline: ~40초
// - 실패 시: miss block (no penalty)
// - 역할: consensus 참여

// 공통점:
// - SNARK proof 기반
// - Groth16 sensitive
// - Merkle proofs on tree R
// - Poseidon hash
// - GPU accelerated

// 차이점:
// - frequency: 24h vs 30s
// - scope: all vs 1
// - urgency: low vs high
// - slashing: yes vs no

// Storage Power 연동:
// WindowPoSt 성공:
// - sector remains in active set
// - storage power 유지
// - block rewards 가능
//
// WindowPoSt 실패:
// - sector declared fault
// - storage power 감소
// - fault fee 매 epoch
// - 14-day recovery window
//
// WinningPoSt 성공:
// - 해당 epoch block 생산
// - reward 받음
//
// WinningPoSt 실패:
// - block 생산 놓침
// - 다른 winner가 승리
// - no direct penalty

// Proof submission:
// WindowPoSt:
// - SubmitWindowedPoSt message
// - per partition
// - within deadline
//
// WinningPoSt:
// - embedded in block
// - block header field
// - submitted with block

// 성능:
// WindowPoSt partition: ~30 min
// WinningPoSt: 20-40s (critical)
// partitions parallel (multi-GPU)`}
        </pre>
        <p className="leading-7">
          2 PoSt: <strong>WindowPoSt (24h, all sectors) + WinningPoSt (election, 1 sector)</strong>.<br />
          same crypto, different urgency + scope.<br />
          WindowPoSt → storage power, WinningPoSt → block reward.
        </p>
      </div>
    </section>
  );
}
