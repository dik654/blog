import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  { label: '1. CFG는 prompt 방향으로 prediction을 당긴다', body: 'conditional prediction과 text-unconditional prediction의 차이를 더해 prompt 충실도를 높인다.' },
  { label: '2. STG는 특정 transformer block perturbation을 이용한다', body: 'Spatio-Temporal Guidance는 일부 block을 perturb한 prediction에서 멀어지는 방향으로 temporal coherence를 높이는 guidance다.' },
  { label: '3. rescale은 과포화와 variance mismatch를 줄인다', body: '강한 guidance는 색 과포화나 detail collapse를 만들 수 있다. rescale은 guided prediction의 분산을 conditional prediction 쪽으로 맞춘다.' },
  { label: '4. modality CFG는 unsynced audio/video에서 멀어진다', body: 'LTX pipeline 문서는 modality_scale을 audio-video coherence를 높이는 guidance로 설명한다. video와 audio가 따로 노는 결과를 피하는 역할이다.' },
];

export default function LtxGuidanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 280" className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
          <ModuleBox x={248} y={28} w={136} label="Denoiser output" sub="noise / velocity pred" color="#64748b" autoFit />
          <line x1={316} y1={76} x2={316} y2={116} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#arrow)" />
          <DataBox x={238} y={118} w={156} label="guided prediction" sub="sampler에 전달" color="#16a34a" autoFit />

          <ActionBox x={40} y={46} w={138} label="CFG" sub="cond - uncond" color="#2563eb" autoFit />
          <line x1={178} y1={64} x2={246} y2={52} stroke="#2563eb" strokeWidth={1.4} markerEnd="url(#arrow)" />

          {step >= 1 && (
            <g>
              <ActionBox x={442} y={46} w={138} label="STG" sub="perturbed block" color="#f97316" autoFit />
              <line x1={442} y1={64} x2={386} y2={52} stroke="#f97316" strokeWidth={1.4} markerEnd="url(#arrow)" />
            </g>
          )}

          {step >= 2 && (
            <g>
              <ActionBox x={40} y={178} w={138} label="Rescale" sub="variance match" color="#0f766e" autoFit />
              <line x1={178} y1={196} x2={238} y2={146} stroke="#0f766e" strokeWidth={1.4} markerEnd="url(#arrow)" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <ActionBox x={442} y={178} w={138} label="Modality CFG" sub="sync penalty" color="#db2777" autoFit />
              <line x1={442} y1={196} x2={394} y2={146} stroke="#db2777" strokeWidth={1.4} markerEnd="url(#arrow)" />
              <rect x={224} y={198} width={184} height={42} rx={8} fill="#db277712" stroke="#db2777" strokeWidth={0.8} />
              <text x={316} y={218} textAnchor="middle" fontSize={10} fontWeight={700} fill="#db2777">avoid unsynced A/V</text>
              <text x={316} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">lip, foley, scene sound</text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
