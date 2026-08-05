import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  { label: '1. A14B는 “총 27B, step당 14B active”로 이해한다', body: 'Wan2.2 설명에 따르면 high-noise expert와 low-noise expert가 각각 약 14B이고, denoising step마다 하나가 활성화된다.' },
  { label: '2. 초기 고노이즈 구간은 SNR이 낮다', body: '노이즈가 많을 때는 세부 질감보다 큰 배치와 움직임 계획이 중요하다. high-noise expert가 이 구간을 담당한다.' },
  { label: '3. threshold t_moe는 SNR 기준으로 expert 전환점을 잡는다', body: '공개 설명은 SNR_min의 절반에 해당하는 threshold step t_moe를 정의하고, t가 그보다 작아지면 low-noise expert로 전환한다고 설명한다.' },
  { label: '4. 후반 저노이즈 구간은 디테일 refinement가 핵심이다', body: '형태가 잡힌 뒤에는 질감, 조명, edge, temporal flicker를 다듬는다. low-noise expert의 역할이다.' },
];

export default function WanMoeSwitchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 650 305" className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <DataBox x={30} y={38} w={118} label="x_T" sub="almost noise" color="#7c3aed" autoFit />
          <ModuleBox x={190} y={30} w={132} label="High-noise expert" sub="layout / motion" color="#f97316" autoFit />
          <ActionBox x={360} y={36} w={96} label="t_moe" sub="SNR threshold" color="#64748b" autoFit />
          <ModuleBox x={494} y={30} w={132} label="Low-noise expert" sub="detail / texture" color="#db2777" autoFit />

          <line x1={148} y1={54} x2={188} y2={54} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <line x1={322} y1={54} x2={358} y2={54} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <line x1={456} y1={54} x2={492} y2={54} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)" />

          <rect x={50} y={130} width={550} height={30} rx={15} fill="var(--border)" opacity={0.35} />
          <rect x={50} y={130} width={275} height={30} rx={15} fill="#f9731625" stroke="#f97316" strokeWidth={0.8} />
          <rect x={325} y={130} width={275} height={30} rx={15} fill="#db277725" stroke="#db2777" strokeWidth={0.8} />
          <text x={188} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f97316">early / high noise / low SNR</text>
          <text x={462} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill="#db2777">late / low noise / higher SNR</text>
          <line x1={325} y1={118} x2={325} y2={172} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
          <text x={325} y={112} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">switch</text>

          {step >= 1 && <StatusBox x={88} y={210} w={160} label="global planning" sub="composition / semantic motion" color="#f97316" progress={0.45} autoFit />}
          {step >= 2 && <DataBox x={282} y={214} w={96} label="SNR(t)" sub="routing signal" color="#64748b" autoFit />}
          {step >= 3 && <StatusBox x={420} y={210} w={160} label="local refinement" sub="texture / lighting / edges" color="#db2777" progress={0.86} autoFit />}
        </svg>
      )}
    </StepViz>
  );
}
