import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const STEPS = [
  { label: 'SEND_START — TEK 유도', body: '소스 PSP가 대상 PDH(Platform Diffie-Hellman)로 TEK(Transport Encryption Key) 유도' },
  { label: 'SEND_UPDATE_DATA — 페이지 재암호화', body: '각 페이지를 VEK로 복호 → TEK로 재암호화 + HMAC 생성 후 전송' },
  { label: 'RECEIVE_START — 대상 준비', body: '대상 PSP가 TEK 유도, 새 ASID/VEK 할당' },
  { label: 'RECEIVE_UPDATE_DATA — 복원', body: 'TEK로 복호 → 새 VEK로 재암호화, RMP 엔트리 설정 (SNP)' },
  { label: 'FINISH — 마이그레이션 완료', body: '소스 VM 폐기, 대상 VM 실행 개시' },
];

const srcX = 30, dstX = 310, pspW = 180, pspH = 130;

export default function MigrationProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Source host */}
          <rect x={srcX} y={10} width={pspW} height={pspH} rx={8}
            fill={step <= 1 ? `${C.indigo}10` : `${C.indigo}05`}
            stroke={step <= 1 ? C.indigo : '#88888840'} strokeWidth={step <= 1 ? 1.5 : 0.8} />
          <text x={srcX + pspW / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={step <= 1 ? C.indigo : 'var(--muted-foreground)'}>소스 호스트</text>
          {/* Source PSP */}
          <rect x={srcX + 15} y={40} width={pspW - 30} height={28} rx={5}
            fill={step === 0 ? `${C.amber}20` : 'var(--card)'} stroke={C.amber} strokeWidth={step === 0 ? 1.5 : 0.8} />
          <text x={srcX + pspW / 2} y={58} textAnchor="middle" fontSize={10} fill={C.amber}>PSP (TEK 유도)</text>
          {/* Source memory pages */}
          {[0, 1, 2].map(i => (
            <motion.rect key={`sp${i}`} x={srcX + 20 + i * 48} y={80} width={40} height={22} rx={4}
              animate={{
                fill: step === 1 ? `${C.green}20` : `${C.indigo}10`,
                stroke: step === 1 ? C.green : C.indigo,
                strokeWidth: step === 1 ? 1.5 : 0.8,
              }} />
          ))}
          {step === 1 && <text x={srcX + pspW / 2} y={96} textAnchor="middle" fontSize={10} fill={C.green}>VEK복호→TEK재암호</text>}
          {step !== 1 && <text x={srcX + pspW / 2} y={96} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">메모리 페이지</text>}
          {/* Destination host */}
          <rect x={dstX} y={10} width={pspW} height={pspH} rx={8}
            fill={step >= 2 ? `${C.green}10` : `${C.green}05`}
            stroke={step >= 2 ? C.green : '#88888840'} strokeWidth={step >= 2 ? 1.5 : 0.8} />
          <text x={dstX + pspW / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={step >= 2 ? C.green : 'var(--muted-foreground)'}>대상 호스트</text>
          {/* Dest PSP */}
          <rect x={dstX + 15} y={40} width={pspW - 30} height={28} rx={5}
            fill={step === 2 ? `${C.amber}20` : 'var(--card)'} stroke={C.amber} strokeWidth={step === 2 ? 1.5 : 0.8} />
          <text x={dstX + pspW / 2} y={58} textAnchor="middle" fontSize={10} fill={C.amber}>PSP (TEK+새VEK)</text>
          {/* Dest memory pages */}
          {[0, 1, 2].map(i => (
            <motion.rect key={`dp${i}`} x={dstX + 20 + i * 48} y={80} width={40} height={22} rx={4}
              animate={{
                fill: step === 3 ? `${C.green}20` : `${C.green}08`,
                stroke: step >= 3 ? C.green : '#88888840',
                strokeWidth: step === 3 ? 1.5 : 0.8,
              }} />
          ))}
          {step >= 3 && <text x={dstX + pspW / 2} y={96} textAnchor="middle" fontSize={10} fill={C.green}>TEK복호→새VEK암호</text>}
          {/* Transfer arrow */}
          {(step === 1 || step === 3) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}>
              <line x1={srcX + pspW + 5} y1={90} x2={dstX - 5} y2={90}
                stroke={C.amber} strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#migArrow)" />
              <rect x={235} y={78} width={52} height={14} rx={3} fill="var(--card)" />
              <text x={261} y={88} textAnchor="middle" fontSize={10} fill={C.amber}>TEK 암호</text>
            </motion.g>
          )}
          {/* Finish indicator */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={srcX + pspW / 2} y1={145} x2={srcX + pspW / 2} y2={165} stroke="#88888860" strokeWidth={1} />
              <text x={srcX + pspW / 2} y={175} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">VM 폐기</text>
              <line x1={dstX + pspW / 2} y1={145} x2={dstX + pspW / 2} y2={165} stroke={C.green} strokeWidth={1} />
              <text x={dstX + pspW / 2} y={175} textAnchor="middle" fontSize={10} fill={C.green} fontWeight={600}>실행 개시</text>
            </motion.g>
          )}
          <defs>
            <marker id="migArrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
