import { motion } from 'framer-motion';
import { C } from './OverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: Degradation Problem ---- */
export function DegradationProblem() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Degradation Problem: 깊을수록 악화</text>

      {/* CIFAR-10 comparison */}
      <rect x={10} y={24} width={220} height={60} rx={6}
        fill={C.plain} fillOpacity={0.06} stroke={C.plain} strokeWidth={0.8} />
      <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={C.plain}>CIFAR-10 Plain CNN</text>
      <text x={30} y={56} fontSize={9} fill="var(--foreground)">
        20층: train error = 7.5%
      </text>
      <text x={30} y={72} fontSize={9} fontWeight={600} fill={C.plain}>
        56층: train error = 8.7% (악화!)
      </text>

      {/* insight box */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={24} width={220} height={60} rx={6}
          fill={C.accent} fillOpacity={0.06} stroke={C.accent} strokeWidth={0.8} />
        <text x={360} y={40} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={C.accent}>핵심 통찰 (He et al.)</text>
        <text x={260} y={56} fontSize={8} fill="var(--muted-foreground)">
          "추가 36층이 항등 함수만 학습해도
        </text>
        <text x={260} y={70} fontSize={8} fill="var(--muted-foreground)">
          56층이 20층보다 나쁠 수 없다"
        </text>
      </motion.g>

      {/* solution */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={10} y={92} width={460} height={34} rx={7}
          fill={C.resnet} fillOpacity={0.06} stroke={C.resnet} strokeWidth={1} />
        <text x={240} y={108} textAnchor="middle" fontSize={11} fontWeight={700}
          fill={C.resnet}>해결: y = F(x) + x (잔차 학습)</text>
        <text x={240} y={122} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">
          네트워크가 H(x) 대신 잔차 F(x) = H(x) - x를 학습 — 항등 함수는 skip으로 무료
        </text>
      </motion.g>

      {/* result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={60} y={134} width={160} height={18} rx={9}
          fill={C.resnet} fillOpacity={0.12} stroke={C.resnet} strokeWidth={0.6} />
        <text x={140} y={147} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.resnet}>ResNet-152: Top-5 3.57%</text>

        <rect x={260} y={134} width={160} height={18} rx={9}
          fill={C.accent} fillOpacity={0.12} stroke={C.accent} strokeWidth={0.6} />
        <text x={340} y={147} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.accent}>VGG-19보다 8배 깊지만 경량</text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: 깊이별 성능 변화 ---- */
export function DepthPerformance() {
  const data = [
    { layers: '18', plain: 27.94, resnet: 27.88 },
    { layers: '34', plain: 28.54, resnet: 25.03 },
    { layers: '50', plain: null, resnet: 22.85 },
    { layers: '101', plain: null, resnet: 21.75 },
    { layers: '152', plain: null, resnet: 21.43 },
  ];

  /* 수평 바 차트로 재설계 — 겹침 방지 */
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Plain Net vs ResNet (ImageNet Top-1 Error %)</text>

      {/* 헤더 */}
      <text x={60} y={32} fontSize={8} fontWeight={600} fill="var(--foreground)">층</text>
      <rect x={120} y={24} width={8} height={8} rx={1} fill={C.plain} fillOpacity={0.6} />
      <text x={132} y={32} fontSize={8} fill={C.plain}>Plain</text>
      <rect x={180} y={24} width={8} height={8} rx={1} fill={C.resnet} fillOpacity={0.6} />
      <text x={192} y={32} fontSize={8} fill={C.resnet}>ResNet</text>

      {/* 수평 바 행 */}
      {data.map((d, i) => {
        const y = 42 + i * 20;
        const maxErr = 30;
        const plainW = d.plain !== null ? (d.plain / maxErr) * 200 : 0;
        const resnetW = (d.resnet / maxErr) * 200;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <text x={45} y={y + 10} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="var(--foreground)">{d.layers}층</text>

            {/* Plain bar */}
            {d.plain !== null && (
              <>
                <rect x={70} y={y} width={plainW} height={8} rx={2}
                  fill={C.plain} fillOpacity={0.5} />
                <text x={74 + plainW} y={y + 7} fontSize={7} fill={C.plain}>{d.plain}%</text>
              </>
            )}

            {/* ResNet bar */}
            <rect x={70} y={y + 10} width={resnetW} height={8} rx={2}
              fill={C.resnet} fillOpacity={0.5} />
            <text x={74 + resnetW} y={y + 17} fontSize={7} fill={C.resnet}>{d.resnet}%</text>
          </motion.g>
        );
      })}

      {/* 관찰 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={10} y={148} width={225} height={14} rx={7}
          fill={C.plain} fillOpacity={0.1} />
        <text x={122} y={158} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.plain}>Plain: 18→34 오히려 악화</text>

        <rect x={245} y={148} width={225} height={14} rx={7}
          fill={C.resnet} fillOpacity={0.1} />
        <text x={357} y={158} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.resnet}>ResNet: 깊을수록 개선 (152까지)</text>
      </motion.g>
    </g>
  );
}
