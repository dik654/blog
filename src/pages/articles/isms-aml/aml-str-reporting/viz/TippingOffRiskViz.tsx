import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { danger: '#ef4444', safe: '#10b981', law: '#6366f1', warn: '#f59e0b' };

const STEPS = [
  { label: 'Tipping-off 시 발생하는 피해', body: '증거 인멸, 자산 도피, 공범 통보, 도주 — 수개월 수사가 한 번의 누설로 무력화.' },
  { label: '허용 vs 금지 표현', body: '"내부 보안 점검" OK / "AML 관련 조치" NG. 고객이 SAR 사실을 추론할 수 없어야 한다.' },
  { label: 'Safe Harbor 면책 보호', body: '선의의 보고에 대해 민·형사 면책. 보고가 미보고보다 안전한 인센티브 구조.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tor-arrow)" />;
}

export default function TippingOffRiskViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tor-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>Tipping-off 시 연쇄 피해</text>
              <ModuleBox x={160} y={25} w={160} h={36} label="SAR 사실 누설" sub="Tipping-off 발생" color={C.danger} />
              {/* Four consequences */}
              <Arrow x1={200} y1={61} x2={75} y2={82} color={C.danger} />
              <Arrow x1={220} y1={61} x2={195} y2={82} color={C.danger} />
              <Arrow x1={260} y1={61} x2={315} y2={82} color={C.danger} />
              <Arrow x1={280} y1={61} x2={415} y2={82} color={C.danger} />
              {[
                { label: '증거 인멸', sub: '기록 삭제·대화 파기', x: 10 },
                { label: '자산 도피', sub: '믹서·프라이버시 코인', x: 130 },
                { label: '공범 통보', sub: '네트워크 전체 경고', x: 250 },
                { label: '도주', sub: '국외 도피 시도', x: 370 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + 0.12 * i }}>
                  <ActionBox x={item.x} y={85} w={100} h={40} label={item.label} sub={item.sub} color={C.danger} />
                </motion.g>
              ))}
              <AlertBox x={60} y={142} w={360} h={34} label="수개월 수사가 한 번의 누설로 무위" sub="특금법 제4조의2 위반 → 3년 이하 징역 또는 2천만 원 이하 벌금" color={C.danger} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">허용 vs 금지 표현</text>
              {/* Forbidden */}
              <ModuleBox x={20} y={30} w={200} h={36} label="금지 표현" sub="고객이 SAR 추론 가능" color={C.danger} />
              {[
                '"FIU에 보고했습니다"',
                '"AML 관련 조치"',
                '"자금세탁 의심으로 정지"',
              ].map((text, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + 0.1 * i }}>
                  <rect x={25} y={75 + i * 26} width={190} height={22} rx={3} fill={`${C.danger}08`} stroke={C.danger} strokeWidth={0.5} />
                  <text x={120} y={90 + i * 26} textAnchor="middle" fontSize={8} fill={C.danger}>{text}</text>
                </motion.g>
              ))}
              {/* Allowed */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={260} y={30} w={200} h={36} label="허용 표현" sub="SAR 추론 불가능" color={C.safe} />
                {[
                  '"내부 보안 점검"',
                  '"정기 확인 절차"',
                  '"자금 출처 서류 제출 요청"',
                ].map((text, i) => (
                  <g key={i}>
                    <rect x={265} y={75 + i * 26} width={190} height={22} rx={3} fill={`${C.safe}08`} stroke={C.safe} strokeWidth={0.5} />
                    <text x={360} y={90 + i * 26} textAnchor="middle" fontSize={8} fill={C.safe}>{text}</text>
                  </g>
                ))}
              </motion.g>
              <rect x={60} y={160} width={360} height={22} rx={4} fill={`${C.warn}08`} stroke={C.warn} strokeWidth={0.5} />
              <text x={240} y={175} textAnchor="middle" fontSize={8.5} fill={C.warn}>
                핵심: "왜 이 조치가 취해졌는지" 고객이 추론할 수 없도록
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>Safe Harbor — 선의의 보고 면책</text>
              <ModuleBox x={140} y={28} w={200} h={36} label="특금법 제4조의3" sub="Safe Harbor 규정" color={C.law} />
              {/* Three protections */}
              <Arrow x1={200} y1={64} x2={90} y2={84} color={C.safe} />
              <Arrow x1={240} y1={64} x2={240} y2={84} color={C.safe} />
              <Arrow x1={280} y1={64} x2={390} y2={84} color={C.safe} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DataBox x={20} y={87} w={140} h={36} label="오보 면책" sub="합리적 근거 있었으면 OK" color={C.safe} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <DataBox x={170} y={87} w={140} h={36} label="고객 손해 면책" sub="계정 정지 손해 면책" color={C.safe} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <DataBox x={320} y={87} w={140} h={36} label="정보 제공 면책" sub="개인정보보호법 예외" color={C.safe} />
              </motion.g>
              {/* Limit */}
              <AlertBox x={60} y={140} w={360} h={38} label="전제: '선의'" sub="고의 허위 보고·경쟁사 해하기 위한 보고는 면책 불가. 미보고도 Safe Harbor 적용 안 됨." color={C.danger} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
