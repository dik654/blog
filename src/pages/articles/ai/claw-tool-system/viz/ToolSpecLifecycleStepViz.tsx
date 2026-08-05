import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { clawViz, comparisonAccent } from '../../claw-viz-tokens';

const AXES = [
  ['입력', 'input_schema', 'input schema + custom validateInput'],
  ['출력', '자유 Value / 문자열 결과', 'outputSchema와 도구별 result renderer'],
  ['활성화', '항상 등록', 'isEnabled feature flag, 모델/환경 의존'],
  ['프롬프트', '&apos;static str', 'async description/prompt, feature별 문구 변경'],
  ['권한', 'required_permission 단일 enum', '도구별 checkPermissions, bash/path/mode 검증'],
  ['검색', '도구명/설명 중심', 'searchHint, shouldDefer, ToolSearch로 지연 노출'],
] as const;

export default function ToolSpecLifecycleStepViz() {
  return (
    <StepViz steps={AXES.map(([axis, claw, original]) => ({
      label: axis,
      body: `claw: ${claw}\n원본: ${original}`,
    }))}>
      {(step) => {
        const [axis, claw, original] = AXES[step];
        const color = step === 4 ? clawViz.danger : comparisonAccent(step);
        return (
          <svg viewBox="0 0 390 280" className="w-full h-auto" style={{ maxWidth: 720, width: '100%' }}>
            <text x={195} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill={clawViz.text}>
              ToolSpec과 buildTool의 정보량 비교
            </text>
            <rect x={30} y={52} width={330} height={36} rx={6} fill={clawViz.panelAlt} fillOpacity={0.38} stroke={color} strokeOpacity={0.55} />
            <line x1={48} y1={87} x2={342} y2={87} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
            <text x={195} y={75} textAnchor="middle" fontSize={14} fontWeight={800} fill={color}>{axis}</text>
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
              <rect x={32} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={44} y1={138} x2={82} y2={138} stroke={clawViz.claw} strokeWidth={2} strokeLinecap="round" />
              <text x={103} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.claw}>claw-code</text>
              <foreignObject x={44} y={160} width={118} height={50}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{claw}</div>
              </foreignObject>
            </motion.g>
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, delay: 0.08 }}>
              <rect x={216} y={124} width={142} height={94} rx={6} fill={clawViz.panel} stroke={clawViz.border} />
              <line x1={228} y1={138} x2={266} y2={138} stroke={clawViz.original} strokeWidth={2} strokeLinecap="round" />
              <text x={287} y={150} textAnchor="middle" fontSize={11} fontWeight={800} fill={clawViz.original}>원본 Claude Code</text>
              <foreignObject x={228} y={160} width={118} height={50}>
                <div className="flex h-full items-center justify-center text-center text-[10px] font-semibold leading-snug text-foreground">{original}</div>
              </foreignObject>
            </motion.g>
            <line x1={174} y1={172} x2={216} y2={172} stroke={color} strokeWidth={1.4} strokeDasharray="4 3" />
            <foreignObject x={34} y={238} width={322} height={34}>
              <div className="flex h-full items-center justify-center text-center text-[9px] font-medium leading-snug text-muted-foreground">
                claw는 도구를 함수 spec으로 압축하고, 원본은 도구를 UI와 권한을 가진 lifecycle 객체로 확장한다.
              </div>
            </foreignObject>
          </svg>
        );
      }}
    </StepViz>
  );
}
