import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'gRPC / REST API', color: '#6366f1', y: 10 },
  { label: 'BaseApp (ABCI)', color: '#8b5cf6', y: 50 },
  { label: 'SDK Modules', color: '#10b981', y: 90 },
  { label: 'MultiStore (IAVL)', color: '#f59e0b', y: 130 },
  { label: 'CometBFT', color: '#6b7280', y: 170 },
];

const STEPS = [
  { label: 'Cosmos SDK 레이어 스택', body: 'Application → SDK Modules → BaseApp → ABCI → CometBFT 순서로 구성.' },
  { label: 'API 진입점', body: '클라이언트가 gRPC/REST로 TX 전송. Protobuf 서비스로 정의.' },
  { label: 'BaseApp 처리', body: 'ABCI 메서드 구현체. AnteHandler 체인으로 서명/fee 검증 후 MsgRouter 디스패치.' },
  { label: 'Module 실행 & 저장', body: '각 모듈 Keeper가 비즈니스 로직 실행 후 IAVL MultiStore에 상태 기록.' },
  { label: 'CometBFT 합의', body: 'ABCI를 통해 블록 제안/검증/커밋. 즉시 최종성 보장.' },
];

const W = 220, LH = 32, LX = 80;

export default function CosmosStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = step === 0 || step === i + 1;
            return (
              <motion.g key={l.label}
                animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <motion.rect x={LX} y={l.y} width={W} height={LH} rx={6}
                  fill={`${l.color}15`} stroke={l.color} strokeWidth={1.5}
                  animate={{ scale: active ? 1 : 0.97 }}
                  style={{ transformOrigin: `${LX + W / 2}px ${l.y + LH / 2}px` }}
                  transition={{ duration: 0.3 }} />
                <text x={LX + W / 2} y={l.y + LH / 2 + 4}
                  textAnchor="middle" fontSize={10} fontWeight="700" fill={l.color}>
                  {l.label}
                </text>
                {/* Arrow to next layer */}
                {i < LAYERS.length - 1 && (
                  <motion.line x1={LX + W / 2} y1={l.y + LH}
                    x2={LX + W / 2} y2={l.y + LH + 8}
                    stroke={l.color} strokeWidth={1.5} opacity={0.4} />
                )}
              </motion.g>
            );
          })}
          {/* Animated packet flowing down */}
          {step >= 1 && step <= 4 && (
            <motion.circle r={5} fill={LAYERS[step - 1].color}
              animate={{
                cx: [LX + W / 2, LX + W / 2],
                cy: [LAYERS[step - 1].y + LH, LAYERS[Math.min(step, 4)].y],
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
