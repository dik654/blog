import FaultViz from './viz/FaultViz';
import type { CodeRef } from '@/components/code/types';

export default function FaultRecovery({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="fault-recovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">장애 & 복구</h2>
      <div className="not-prose mb-8"><FaultViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 경제적 인센티브 설계</strong> — "저장하지 않는 것"의 비용을 높여
          <br />
          SP가 안정적으로 데이터를 유지하도록 강제
          <br />
          자연재해 등 불가항력은 14일 유예로 대응
        </p>

        {/* ── Fault Types ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fault Types &amp; Recovery</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Sector Faults:

// Fault Types:
//
// 1. Declared Fault:
//    - SP가 자발 선언
//    - "이 sector 일시 장애"
//    - fault fee only
//    - recovery 가능
//
// 2. Detected Fault:
//    - WindowPoSt 실패
//    - network에서 감지
//    - higher penalty
//    - 14-day recovery window
//
// 3. Termination:
//    - fault > 14 days
//    - sector 영구 삭제
//    - collateral slashed
//    - storage power 제거

// Fault Fee:
// fault_fee_per_epoch = ~2.14 * daily_reward(sector)
// - continuous charge
// - 14-day max: ~30 * daily_reward
// - incentivizes quick recovery

// Declared Fault Flow:
// 1. SP detects issue (hardware, data loss)
// 2. call DeclareFaults
// 3. pay fault fee per deadline
// 4. attempt recovery
// 5. call DeclareFaultsRecovered
// 6. pass next WindowPoSt
// 7. sector reactivated

// Detection Flow:
// 1. WindowPoSt 기간 도래
// 2. SP가 submit 안 함
// 3. on-chain auto-detect
// 4. sector marked faulty
// 5. fault fee start
// 6. power 감소
// 7. 14-day clock start

// Termination:
// 1. 14-day recovery window 만료
// 2. TerminateSectors called (SP or auto)
// 3. initial pledge slashed (~4 FIL)
// 4. remaining collateral returned
// 5. sector removed from chain
// 6. storage power 최종 감소

// Recovery Economics:
// - declare immediately: lower penalty
// - auto-detected: higher penalty
// - unrecovered: full slash
// - 14-day window: grace period

// Common fault causes:
// - disk failure
// - network outage
// - software bugs
// - missed deadline (operator error)
// - datacenter issues
// - natural disaster

// Prevention:
// - RAID storage
// - backup workers
// - monitoring alerts
// - deadline automation
// - insurance (3rd party)

// SP 대응:
// - 24/7 monitoring
// - automated deadline submission
// - GPU redundancy
// - storage redundancy
// - incident response plan

// Filecoin economic design:
// - fault fee < termination > reward
// - incentive alignment:
//   declare > hide > fail
// - SP 수익성: 99%+ uptime 필요`}
        </pre>
        <p className="leading-7">
          3 fault types: <strong>declared, detected, termination</strong>.<br />
          14-day recovery window, fault fee per epoch.<br />
          incentive: declare &gt; hide &gt; fail (economic alignment).
        </p>
      </div>
    </section>
  );
}
