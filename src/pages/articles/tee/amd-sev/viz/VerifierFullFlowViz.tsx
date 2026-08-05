import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = {
  recv: '#6366f1',
  kds: '#0ea5e9',
  chain: '#8b5cf6',
  sig: '#10b981',
  content: '#f59e0b',
  policy: '#ef4444',
};

const STEPS = [
  { label: '① Report 수신 + cpuid_1_eax 디코드', body: 'CPU 식별 (Genoa / Milan 등)' },
  { label: '② AMD KDS에서 VCEK 인증서 조회', body: 'chip_id + reported_tcb 조합으로 URL 구성' },
  { label: '③ 인증서 체인 검증 (Root → ARK → ASK → VCEK)', body: '오프라인 환경은 사전 캐싱 필요' },
  { label: '④ VCEK 공개키로 ECDSA 서명 검증', body: 'Report 본문 hash와 signature 비교' },
  { label: '⑤ 내용 검증 — nonce, measurement, TCB', body: 'report_data, expected_launch_digest, min_tcb' },
  { label: '⑥ 정책 적용 → ACCEPT / REJECT', body: 'VMPL, debug bits 등 추가 정책 확인' },
];

const NODES = [
  { x: 20, y: 26, w: 110, h: 36, label: '① Report 수신', sub: 'cpuid 디코드', color: C.recv },
  { x: 145, y: 26, w: 110, h: 36, label: '② KDS 조회', sub: 'chip_id + TCB', color: C.kds },
  { x: 270, y: 26, w: 110, h: 36, label: '③ 체인 검증', sub: 'Root→ARK→ASK→VCEK', color: C.chain },
  { x: 20, y: 84, w: 110, h: 36, label: '④ 서명 검증', sub: 'ECDSA P-384', color: C.sig },
  { x: 145, y: 84, w: 110, h: 36, label: '⑤ 내용 검증', sub: 'nonce/measure/TCB', color: C.content },
  { x: 270, y: 84, w: 110, h: 36, label: '⑥ 정책 적용', sub: 'VMPL/debug…', color: C.policy },
];

export default function VerifierFullFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => (
            <motion.g key={n.label} animate={{ opacity: step === i ? 1 : 0.3 }}>
              <ActionBox x={n.x} y={n.y} w={n.w} h={n.h} label={n.label} sub={n.sub} color={n.color} />
            </motion.g>
          ))}

          {/* connecting arrows */}
          {[
            { x1: 130, y1: 44, x2: 145, y2: 44 },
            { x1: 255, y1: 44, x2: 270, y2: 44 },
            { x1: 380, y1: 44, x2: 395, y2: 70 },
            { x1: 130, y1: 102, x2: 145, y2: 102 },
            { x1: 255, y1: 102, x2: 270, y2: 102 },
          ].map((a, i) => (
            <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke="var(--border)" strokeWidth={0.8} strokeDasharray="2 2" />
          ))}
          {/* row break arrow */}
          <path d="M 380 62 Q 410 80 380 102 L 130 102 Q 110 102 130 84"
            fill="none" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />

          {/* Step-specific detail */}
          <motion.g key={`detail-${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <>
                <DataBox x={20} y={146} w={440} h={36} label="cpu = decode_cpuid(report.cpuid_1_eax)" color={C.recv} />
                <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">"Genoa" / "Milan" / "Turin" 식별</text>
              </>
            )}
            {step === 1 && (
              <>
                <DataBox x={20} y={146} w={440} h={36}
                  label="kdsintf.amd.com/vcek/v1/{cpu}/{chip_id}?…" color={C.kds} outlined />
                <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  blSPL / teeSPL / snpSPL / ucodeSPL 쿼리 파라미터
                </text>
              </>
            )}
            {step === 2 && (
              <>
                <DataBox x={20} y={146} w={100} h={36} label="AMD Root" color={C.chain} outlined />
                <DataBox x={130} y={146} w={100} h={36} label="ARK" color={C.chain} outlined />
                <DataBox x={240} y={146} w={100} h={36} label="ASK" color={C.chain} outlined />
                <DataBox x={350} y={146} w={110} h={36} label="VCEK" color={C.chain} outlined />
                {[120, 230, 340].map((x, i) => (
                  <line key={i} x1={x} y1={164} x2={x + 10} y2={164} stroke={C.chain} strokeWidth={0.8} />
                ))}
              </>
            )}
            {step === 3 && (
              <ActionBox x={20} y={146} w={440} h={36}
                label="ecdsa_verify(signature, hash(report[:-512]), vcek_pubkey)"
                sub="실패 시 즉시 REJECT"
                color={C.sig} />
            )}
            {step === 4 && (
              <>
                <DataBox x={20} y={146} w={140} h={36} label="report_data == nonce" color={C.content} outlined />
                <DataBox x={170} y={146} w={140} h={36} label="measurement == 기대값" color={C.content} outlined />
                <DataBox x={320} y={146} w={140} h={36} label="TCB ≥ minimum" color={C.content} outlined />
              </>
            )}
            {step === 5 && (
              <>
                <ActionBox x={20} y={146} w={210} h={36} label="ACCEPT" sub="모든 검증 통과" color="#10b981" />
                <AlertBox x={250} y={146} w={210} h={36} label="REJECT" sub="어떤 단계든 실패" color="#ef4444" />
                <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  policy bits (debug, migrate, VMPL) 최종 확인
                </text>
              </>
            )}
          </motion.g>

          {step !== 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}>
              <ModuleBox x={140} y={196} w={200} h={26} label="다음 단계 →" sub="" color="#888" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
