import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  src: '#0ea5e9',
  asp: '#8b5cf6',
  net: '#f59e0b',
  tgt: '#10b981',
};

const STEPS = [
  { label: '① Source ASP — VEK_src로 복호화', body: 'guest_address의 페이지를 ASP 내부에서 평문화' },
  { label: '② TEK로 재암호화 → trans_buf', body: '같은 ASP가 즉시 transport key로 다시 암호화' },
  { label: '③ 네트워크로 trans_buf + hdr 전송', body: 'IV·nonce·sequence 포함 → replay 방어' },
  { label: '④ Target ASP — TEK로 복호화', body: '받은 암호문을 ASP 내부에서 평문화' },
  { label: '⑤ 새 VEK_tgt로 재암호화 → 대상 GPA 저장', body: '평문은 절대 ASP 외부로 노출 안 됨' },
];

export default function MigrationPageReencryptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={26} w={130} h={50} label="Source Host" sub="VEK_src" color={C.src} />
          <ModuleBox x={170} y={26} w={140} h={50} label="Network" sub="public" color={C.net} />
          <ModuleBox x={330} y={26} w={130} h={50} label="Target Host" sub="VEK_tgt" color={C.tgt} />

          <motion.g animate={{ opacity: step <= 1 ? 1 : 0.3 }}>
            <ActionBox x={20} y={86} w={130} h={50} label="Source ASP" sub="re-encrypt" color={C.asp} />
            {step === 0 && (
              <DataBox x={20} y={146} w={130} h={36} label="src page → 평문 (ASP)" color={C.src} outlined />
            )}
            {step === 1 && (
              <DataBox x={20} y={146} w={130} h={36} label="평문 → TEK 암호문" color={C.net} outlined />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 2 ? 1 : 0.3 }}>
            <ActionBox x={170} y={86} w={140} h={50} label="trans_buf + hdr" sub="TEK 암호화 + nonce" color={C.net} />
            {step === 2 && (
              <motion.line x1={150} y1={111} x2={170} y2={111}
                stroke={C.net} strokeWidth={1.2} markerEnd="url(#mp1)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
            {step === 2 && (
              <motion.line x1={310} y1={111} x2={330} y2={111}
                stroke={C.net} strokeWidth={1.2} markerEnd="url(#mp2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.3 }}>
            <ActionBox x={330} y={86} w={130} h={50} label="Target ASP" sub="re-encrypt" color={C.asp} />
            {step === 3 && (
              <DataBox x={330} y={146} w={130} h={36} label="TEK 암호문 → 평문 (ASP)" color={C.tgt} outlined />
            )}
            {step === 4 && (
              <DataBox x={330} y={146} w={130} h={36} label="평문 → VEK_tgt 암호문" color={C.tgt} outlined />
            )}
          </motion.g>

          {/* Bottom insight */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} key={`note-${step}`}>
            <DataBox x={20} y={196} w={440} h={32}
              label={
                step === 0 ? 'Source가 RAM에서 페이지 가져오기 → ASP가 VEK_src로 복호화' :
                step === 1 ? '평문은 ASP 내부에서만 머묾 — host 미노출' :
                step === 2 ? 'pre-copy: dirty bitmap 반복 / post-copy: 수신 측 on-demand' :
                step === 3 ? '받은 암호문이 platform 간 안전 전달 완료' :
                '결과: source/target 모두 평문 보지 못함, 네트워크도 암호문만'
              }
              color={C.asp} outlined />
          </motion.g>

          <defs>
            <marker id="mp1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.net} />
            </marker>
            <marker id="mp2" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.net} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
