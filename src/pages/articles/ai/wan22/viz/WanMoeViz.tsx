import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  {
    label: '1. Wan2.2의 핵심은 노이즈 구간별 MoE 노이즈 제거',
    body: 'T2V-A14B와 I2V-A14B는 diffusion denoising 과정을 high-noise expert와 low-noise expert로 나누는 구조로 설명된다.',
  },
  {
    label: '2. 입력 조건은 text, image, audio, character task로 갈라진다',
    body: '공개 모델은 T2V, I2V, TI2V, S2V, Animate 변형을 제공한다. 이 글은 기본 구조를 T2V/I2V/TI2V 중심으로 설명한다.',
  },
  {
    label: '3. 고노이즈 구간은 큰 구도와 움직임을 잡는다',
    body: '초기 시간 단계는 latent가 거의 노이즈이므로 전역 구도, 피사체 배치, 장면 전환, 큰 움직임을 잡는 역할이 크다.',
  },
  {
    label: '4. 저노이즈 구간은 디테일과 질감을 정리한다',
    body: '후반 timestep은 형태가 이미 잡힌 상태라 텍스처, 조명, 가장자리, 미세한 움직임을 다듬는 데 집중한다.',
  },
  {
    label: '5. VAE decode와 optional prompt extension이 실사용 pipeline을 완성한다',
    body: 'Wan2.2 저장소는 Qwen/Dashscope 기반 prompt extension, FSDP+Ulysses multi-GPU inference, offload 옵션을 함께 제공한다.',
  },
];

const W = 650;
const H = 320;

function Arrow({ x1, y1, x2, y2, color = '#64748b', dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray={dashed ? '5 4' : undefined} markerEnd="url(#arrow)" />;
}

export default function WanMoeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <DataBox x={24} y={34} w={96} label="Prompt" sub="text/image" color="#2563eb" autoFit />
          <ActionBox x={150} y={30} w={118} label="Prompt extension" sub="Qwen/Dashscope" color="#2563eb" autoFit />
          <Arrow x1={120} y1={50} x2={148} y2={49} color="#2563eb" />

          <ModuleBox x={306} y={24} w={122} label="Text encoder" sub="condition tokens" color="#0f766e" autoFit />
          <Arrow x1={268} y1={49} x2={304} y2={48} color="#0f766e" />

          <DataBox x={30} y={132} w={94} label="Noisy latent" sub="video grid" color="#7c3aed" autoFit />
          <Arrow x1={370} y1={72} x2={124} y2={148} color="#0f766e" dashed />

          <rect x={178} y={118} width={286} height={82} rx={10} fill="var(--card)" stroke="var(--border)" strokeWidth={0.7} />
          <text x={321} y={140} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">Wan2.2 DiT denoiser</text>
          <text x={321} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">timestep에 따라 expert를 분리</text>
          <Arrow x1={124} y1={148} x2={176} y2={156} color="#7c3aed" />

          <ModuleBox x={210} y={168} w={108} label="High-noise" sub="layout / motion" color="#f97316" autoFit />
          <ModuleBox x={342} y={168} w={108} label="Low-noise" sub="detail / texture" color="#db2777" autoFit />

          {step >= 2 && (
            <g>
              <StatusBox x={96} y={238} w={160} label="early timesteps" sub="coarse structure" color="#f97316" progress={0.35} autoFit />
              <Arrow x1={218} y1={238} x2={254} y2={214} color="#f97316" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <StatusBox x={390} y={238} w={156} label="late timesteps" sub="refinement" color="#db2777" progress={0.85} autoFit />
              <Arrow x1={448} y1={238} x2={402} y2={214} color="#db2777" />
            </g>
          )}

          <ActionBox x={502} y={128} w={106} label="Wan VAE" sub="decode video" color="#16a34a" autoFit />
          <Arrow x1={464} y1={158} x2={500} y2={150} color="#16a34a" />
          <DataBox x={522} y={52} w={90} label="Output" sub="720p/24fps" color="#16a34a" autoFit />
          <Arrow x1={554} y1={128} x2={562} y2={86} color="#16a34a" />

          {step >= 1 && (
            <g>
              <DataBox x={48} y={250} w={86} label="T2V" sub="text only" color="#2563eb" autoFit />
              <DataBox x={266} y={250} w={86} label="I2V" sub="image + text" color="#0f766e" autoFit />
              <DataBox x={548} y={250} w={86} label="TI2V" sub="5B hybrid" color="#7c3aed" autoFit />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
