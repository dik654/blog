import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'TX 수신', color: '#6366f1' },
  { label: 'SetUpCtx', color: '#0ea5e9' },
  { label: 'DeductFee', color: '#10b981' },
  { label: 'SigVerify', color: '#f59e0b' },
  { label: 'SetPubKey', color: '#8b5cf6' },
  { label: 'IncrSeq', color: '#ef4444' },
  { label: 'Msg 실행', color: '#6366f1' },
];

const STEPS = [
  { label: 'TX 수신', body: 'BaseApp이 트랜잭션을 수신하고 AnteHandler 체인을 시작합니다.' },
  { label: '수수료 차감', body: 'DeductFeeDecorator가 지정된 가스 가격으로 수수료를 선차감합니다.' },
  { label: '서명 검증', body: 'SigVerificationDecorator가 ECDSA/Ed25519 서명을 검증합니다.' },
  { label: '시퀀스 관리', body: '공개키 설정 후 계정 시퀀스(nonce)를 증가시켜 재전송을 방지합니다.' },
  { label: 'Msg 실행 진입', body: '모든 AnteHandler를 통과하면 MsgServer로 메시지 실행이 시작됩니다.' },
];

const visCount = (step: number) => [2, 3, 4, 6, 7][step];

export default function AnteHandlerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const cnt = visCount(step);
        return (
          <svg viewBox="0 0 560 55" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {NODES.map((n, i) => {
              const show = i < cnt;
              const x = 2 + i * 60;
              const glow = show && i === cnt - 1;
              return (
                <motion.g key={i} animate={{ opacity: show ? 1 : 0.08 }}>
                  {i > 0 && (
                    <motion.line x1={x - 4} y1={26} x2={x + 2} y2={26}
                      stroke="#888" strokeWidth={1} animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  <motion.rect x={x + 2} y={8} width={54} height={34} rx={5}
                    animate={{
                      fill: `${n.color}${show ? '20' : '08'}`,
                      stroke: n.color,
                      strokeWidth: glow ? 2.2 : show ? 1.2 : 0.5,
                    }} />
                  <text x={x + 29} y={29} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
