import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { label: '클라이언트', color: P, x: 10, y: 15 },
  { label: 'walrus-service', color: P, x: 85, y: 15 },
  { label: 'EncodingConfig', color: P, x: 160, y: 15 },
  { label: 'BlobEncoder', color: S, x: 160, y: 55 },
  { label: 'Primary', color: S, x: 85, y: 55 },
  { label: 'Secondary', color: S, x: 235, y: 55 },
  { label: 'MerkleTree', color: A, x: 160, y: 95 },
  { label: 'Sui 체인', color: A, x: 85, y: 95 },
  { label: '스토리지 노드', color: A, x: 250, y: 95 },
];

const GROUPS = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

const STEPS = [
  { label: '전체 아키텍처', body: 'Walrus RedStuff 2D 이레이저 코딩의 전체 구조입니다.' },
  { label: '클라이언트 레이어', body: 'CLI에서 블롭을 업로드하고 BFT 인코딩 설정(n, f, k1, k2)을 계산합니다.' },
  { label: '인코딩 레이어', body: 'BlobEncoder가 2D Reed-Solomon으로 Primary(열)/Secondary(행) 슬라이버를 생성합니다.' },
  { label: '검증 & 배포', body: 'Merkle 트리로 검증 후 Sui 체인에 BlobId를 등록하고 노드에 슬라이버를 배포합니다.' },
];

export default function ErasureCodingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = step === 0
          ? NODES.map((_, i) => i)
          : GROUPS[step - 1] ?? [];
        return (
          <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {[[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [4, 8], [5, 8]].map(([fi, ti], ei) => {
              const f = NODES[fi], t = NODES[ti];
              const show = active.includes(fi) || active.includes(ti);
              return show && (
                <motion.line key={ei}
                  x1={f.x + 30} y1={f.y + 14} x2={t.x + 30} y2={t.y + 14}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map((n, i) => {
              const show = active.includes(i);
              return (
                <g key={i}>
                  <motion.rect x={n.x} y={n.y} width={60} height={26} rx={5}
                    animate={{ fill: `${n.color}${show ? '12' : '06'}`,
                      stroke: n.color, strokeWidth: show ? 1.5 : 1,
                      opacity: show ? 1 : 0.15 }}
                    transition={{ duration: 0.3 }} />
                  <text x={n.x + 30} y={n.y + 16} textAnchor="middle" fontSize={10}
                    fontWeight={500} fill={n.color} opacity={show ? 1 : 0.15}>{n.label}</text>
                </g>
              );
            })}
            {step > 0 && (
              <motion.text x={step === 1 ? 85 : step === 2 ? 170 : 170}
                y={step === 3 ? 128 : step === 2 ? 90 : 10}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                fontWeight={500} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
                {step === 1 ? '클라이언트 계층' : step === 2 ? '2D RS 인코딩' : '검증 & 배포'}
              </motion.text>
            )}
        </svg>
        );
      }}
    </StepViz>
  );
}
