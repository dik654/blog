import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'MMR vs Merkle Tree', body: 'Merkle Tree: 단일 완전 이진 트리, O(log n) 랜덤 I/O, 임의 수정. MMR: 감소하는 높이의 트리 리스트, O(1) 순차 쓰기, append-only.' },
  { label: 'MMR 구조: 산봉우리(Peaks)', body: '11개 원소 추가 후 MMR — Peak 14(높이 3), Peak 17(높이 1), Peak 18(높이 0). Root = Hash(모든 Peak 해시). 증명 크기: O(log n).' },
  { label: 'ADB: 인증 데이터베이스', body: 'adb::any — 키가 어떤 시점에 값을 가졌음 증명. adb::current — 키의 현재 값 증명(Activity 비트 + Grafting). 둘 다 MMR 기반.' },
  { label: 'QMDB: 극한 성능', body: 'LayerZero 협력. 1 SSD read(조회), O(1) SSD I/O(업데이트), 메모리 내 Merkleization. 2.3 bytes/entry, 최대 2.28M 업데이트/초.' },
];

export default function StorageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['', 'Merkle Tree', 'MMR'].map((h, i) => (
                <text key={i} x={[60, 200, 360][i]} y={20} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={[, C1, C2][i] ?? 'var(--foreground)'}>{h}</text>
              ))}
              <line x1={20} y1={26} x2={420} y2={26} stroke="var(--border)" strokeWidth={0.5} />
              {[
                { attr: '구조', mt: '완전 이진 트리', mmr: '감소 높이 리스트' },
                { attr: '업데이트', mt: 'O(log n) 랜덤', mmr: 'O(1) 순차 쓰기' },
                { attr: '수정', mt: '임의 위치 가능', mmr: 'Append-only' },
                { attr: 'SSD', mt: '낮음 (랜덤)', mmr: '높음 (순차)' },
                { attr: 'GC', mt: '필요', mmr: '불필요' },
              ].map((r, i) => (
                <g key={i}>
                  <text x={60} y={46 + i * 24} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">{r.attr}</text>
                  <text x={200} y={46 + i * 24} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.mt}</text>
                  <text x={360} y={46 + i * 24} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>{r.mmr}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Peak 14 (height 3) */}
              <circle cx={80} cy={30} r={12} fill={`${C1}12`} stroke={C1} strokeWidth={0.8} />
              <text x={80} y={34} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>14</text>
              {/* Level 2 */}
              {[50, 110].map((x, i) => (
                <g key={i}>
                  <line x1={80} y1={42} x2={x} y2={58} stroke="var(--border)" strokeWidth={0.5} />
                  <circle cx={x} cy={68} r={10} fill={`${C1}08`} stroke={C1} strokeWidth={0.5} />
                  <text x={x} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{[6, 13][i]}</text>
                </g>
              ))}
              {/* Leaves hint */}
              <text x={80} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">···leaves···</text>
              {/* Peak 17 */}
              <circle cx={200} cy={68} r={10} fill={`${C2}12`} stroke={C2} strokeWidth={0.8} />
              <text x={200} y={72} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>17</text>
              {/* Peak 18 */}
              <circle cx={260} cy={100} r={8} fill={`${C3}12`} stroke={C3} strokeWidth={0.8} />
              <text x={260} y={104} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>18</text>
              <text x={80} y={140} fontSize={10} fill="var(--foreground)">
                Root = Hash(Peak 14, Peak 17, Peak 18)
              </text>
              <text x={300} y={30} fontSize={10} fill="var(--muted-foreground)">Peaks = [14, 17, 18]</text>
              <text x={300} y={48} fontSize={10} fill="var(--muted-foreground)">11개 원소, 19개 노드</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'adb::any', sub: '"키가 값을 가졌던 적 있음" 증명', c: C1 },
                { label: 'adb::current', sub: '"키의 현재 값" 증명 (Activity + Grafting)', c: C2 },
              ].map((a, i) => (
                <g key={i}>
                  <rect x={40} y={20 + i * 70} width={360} height={50} rx={5} fill="var(--card)" />
                  <rect x={40} y={20 + i * 70} width={360} height={50} rx={5}
                    fill={`${a.c}08`} stroke={a.c} strokeWidth={0.8} />
                  <text x={220} y={42 + i * 70} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.c}>{a.label}</text>
                  <text x={220} y={58 + i * 70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{a.sub}</text>
                </g>
              ))}
              <text x={220} y={158} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                둘 다 MMR 기반 — append-only, O(1) 쓰기, SSD 최적화
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={220} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>QMDB 성능</text>
              {[
                { metric: '상태 읽기', value: '1 SSD read' },
                { metric: '상태 업데이트', value: 'O(1) SSD I/O' },
                { metric: 'Merkleization', value: '메모리 내 (0 SSD)' },
                { metric: '메모리', value: '2.3 bytes/entry' },
                { metric: '처리량', value: '최대 2.28M ops/sec' },
              ].map((m, i) => (
                <g key={i}>
                  <rect x={60} y={34 + i * 26} width={140} height={20} rx={3}
                    fill={`${C3}08`} stroke={C3} strokeWidth={0.5} />
                  <text x={130} y={48 + i * 26} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>{m.metric}</text>
                  <text x={300} y={48 + i * 26} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">{m.value}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
