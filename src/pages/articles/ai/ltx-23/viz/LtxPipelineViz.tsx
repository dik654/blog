import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  {
    label: '1. 공개 범위 확인',
    body: 'LTX-2.3은 weights, inference code, LoRA/full fine-tuning 도구, ComfyUI 워크플로우가 공개되어 있다. 하지만 전체 사전학습 데이터셋과 완전한 재현 절차는 공개 범위 밖이다.',
  },
  {
    label: '2. 비디오와 오디오를 각각 latent token으로 압축',
    body: '픽셀/파형을 그대로 diffusion transformer에 넣지 않고, modality-specific VAE가 비디오 latent와 오디오 latent로 압축한다. 이 단계가 긴 비디오 생성 비용을 낮추는 핵심이다.',
  },
  {
    label: '3. 비대칭 dual-stream DiT에서 두 흐름을 동시에 denoise',
    body: 'LTX-2 논문은 14B video stream과 5B audio stream을 두고, cross-attention으로 양방향 정보를 교환하는 구조를 설명한다.',
  },
  {
    label: '4. shared timestep conditioning과 modality CFG',
    body: '두 modality가 같은 diffusion 시간 축을 공유하면서도 video/audio 조건 세기를 따로 조절한다. 결과적으로 화면, 움직임, 소리의 동기화를 함께 맞춘다.',
  },
  {
    label: '5. decoder와 upscaler로 최종 결과 생성',
    body: 'denoise된 latent는 video/audio decoder를 통과하고, 현재 공개 pipeline에서는 spatial upscaler가 별도 단계로 붙어 최종 해상도를 끌어올린다.',
  },
];

const W = 640;
const H = 310;

function Arrow({ x1, y1, x2, y2, color = '#64748b' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#arrow)" />
    </g>
  );
}

export default function LtxPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <ModuleBox x={18} y={24} w={118} label="공개 자료" sub="paper/code/weights" color="#2563eb" autoFit />
          <DataBox x={178} y={28} w={92} label="Video" sub="frames" color="#0f766e" autoFit />
          <DataBox x={178} y={82} w={92} label="Audio" sub="waveform" color="#7c3aed" autoFit />
          <Arrow x1={136} y1={48} x2={176} y2={44} />
          <Arrow x1={136} y1={48} x2={176} y2={98} />

          <ActionBox x={312} y={24} w={108} label="Video VAE" sub="latent tokens" color="#0f766e" autoFit />
          <ActionBox x={312} y={82} w={108} label="Audio VAE" sub="latent tokens" color="#7c3aed" autoFit />
          <Arrow x1={270} y1={44} x2={310} y2={43} />
          <Arrow x1={270} y1={98} x2={310} y2={101} />

          <ModuleBox x={470} y={20} w={128} label="Dual-stream DiT" sub="video 14B / audio 5B" color="#db2777" autoFit />
          <Arrow x1={420} y1={43} x2={468} y2={44} />
          <Arrow x1={420} y1={101} x2={468} y2={68} />

          {step >= 2 && (
            <g>
              <rect x={456} y={118} width={154} height={74} rx={8} fill="var(--card)" stroke="#db2777" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={533} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="#db2777">cross-attention</text>
              <text x={533} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">audio ↔ video 동기화</text>
              <text x={533} y={176} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">temporal position 공유</text>
            </g>
          )}

          {step >= 3 && (
            <g>
              <StatusBox x={232} y={156} w={145} label="shared timestep" sub="same diffusion clock" color="#f59e0b" progress={0.72} autoFit />
              <DataBox x={48} y={170} w={115} label="modality CFG" sub="video/audio scale" color="#f59e0b" autoFit />
              <Arrow x1={164} y1={186} x2={230} y2={180} color="#f59e0b" />
              <Arrow x1={378} y1={180} x2={454} y2={155} color="#f59e0b" />
            </g>
          )}

          {step >= 4 && (
            <g>
              <ActionBox x={148} y={244} w={110} label="Decode" sub="latent → media" color="#16a34a" autoFit />
              <ActionBox x={302} y={244} w={118} label="Spatial upscaler" sub="2-stage pipeline" color="#16a34a" autoFit />
              <StatusBox x={466} y={235} w={118} label="Final output" sub="video + audio" color="#16a34a" progress={1} autoFit />
              <Arrow x1={533} y1={92} x2={258} y2={262} color="#16a34a" />
              <Arrow x1={258} y1={263} x2={300} y2={263} color="#16a34a" />
              <Arrow x1={420} y1={263} x2={464} y2={260} color="#16a34a" />
            </g>
          )}

          {step === 0 && (
            <AlertBox x={246} y={224} w={152} label="주의" sub="사전학습 절차는 비공개" color="#dc2626" autoFit />
          )}
        </svg>
      )}
    </StepViz>
  );
}
