import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'SDK: 엔클레이브 내부 라이브러리', body: 'trts(Trusted Runtime), tseal(봉인), selib(EGETKEY/EREPORT 래퍼), edger8r(EDL→C 코드 생성), tlibc(엔클레이브용 libc).' },
  { label: 'PSW: 호스트 측 서비스', body: 'urts(Untrusted Runtime), ae/pce(Provisioning Certificate Enclave), aesm_service(원격 증명 조율 데몬).' },
  { label: '전체 구조: 신뢰/비신뢰 경계', body: 'SDK는 엔클레이브 내부(Trusted)에서 실행. PSW는 호스트(Untrusted)에서 실행. ECALL/OCALL로 경계를 넘나듦.' },
];

const SDK = [
  { name: 'trts', desc: 'Trusted Runtime' },
  { name: 'tseal', desc: '데이터 봉인' },
  { name: 'selib', desc: 'EGETKEY/EREPORT' },
  { name: 'edger8r', desc: 'EDL 코드 생성' },
  { name: 'tlibc', desc: '엔클레이브 libc' },
];

const PSW = [
  { name: 'urts', desc: 'Untrusted Runtime' },
  { name: 'ae/pce', desc: 'PCE 프로비저닝' },
  { name: 'aesm', desc: '증명 데몬' },
];

export default function RepoStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* SDK column */}
          <motion.g animate={{ opacity: step === 0 || step === 2 ? 1 : 0.25 }}>
            <rect x={20} y={10} width={240} height={170} rx={8}
              fill="#6366f108" stroke="#6366f130" strokeWidth={1} />
            <text x={140} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="#6366f1">sdk/ (Trusted)</text>
            {SDK.map((m, i) => (
              <g key={m.name}>
                <rect x={35} y={38 + i * 28} width={210} height={22} rx={4}
                  fill="#6366f10a" stroke="#6366f120" strokeWidth={0.6} />
                <text x={48} y={53 + i * 28} fontSize={10} fontWeight={600}
                  fill="var(--foreground)">{m.name}/</text>
                <text x={230} y={53 + i * 28} textAnchor="end" fontSize={10}
                  fill="var(--muted-foreground)">{m.desc}</text>
              </g>
            ))}
          </motion.g>

          {/* PSW column */}
          <motion.g animate={{ opacity: step === 1 || step === 2 ? 1 : 0.25 }}>
            <rect x={280} y={10} width={240} height={170} rx={8}
              fill="#10b98108" stroke="#10b98130" strokeWidth={1} />
            <text x={400} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="#10b981">psw/ (Untrusted)</text>
            {PSW.map((m, i) => (
              <g key={m.name}>
                <rect x={295} y={38 + i * 28} width={210} height={22} rx={4}
                  fill="#10b9810a" stroke="#10b98120" strokeWidth={0.6} />
                <text x={308} y={53 + i * 28} fontSize={10} fontWeight={600}
                  fill="var(--foreground)">{m.name}/</text>
                <text x={490} y={53 + i * 28} textAnchor="end" fontSize={10}
                  fill="var(--muted-foreground)">{m.desc}</text>
              </g>
            ))}
          </motion.g>

          {/* Boundary arrow on step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <line x1={260} y1={95} x2={280} y2={95} stroke="#f59e0b" strokeWidth={1.5}
                markerEnd="url(#rarr)" />
              <rect x={252} y={104} width={40} height={16} rx={3} fill="var(--card)" />
              <text x={272} y={115} textAnchor="middle" fontSize={10} fill="#f59e0b"
                fontWeight={600}>ECALL</text>
              <line x1={280} y1={130} x2={260} y2={130} stroke="#f59e0b" strokeWidth={1.5}
                markerEnd="url(#rarr)" />
              <rect x={252} y={135} width={40} height={16} rx={3} fill="var(--card)" />
              <text x={272} y={146} textAnchor="middle" fontSize={10} fill="#f59e0b"
                fontWeight={600}>OCALL</text>
            </motion.g>
          )}

          <defs>
            <marker id="rarr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
