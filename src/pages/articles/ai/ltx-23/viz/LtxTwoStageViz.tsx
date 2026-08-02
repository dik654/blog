import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  { label: '1. prompt encoder가 positive/negative context를 만든다', body: 'Gemma text encoder는 prompt와 negative prompt를 각각 encoding한다. LTX pipeline은 video context와 audio context를 분리해서 꺼낸다.' },
  { label: '2. Stage 1은 절반 해상도 latent를 guidance와 함께 생성한다', body: '공개 2단계 파이프라인 코드에서 stage 1 output shape는 width/2, height/2다. 이 단계는 full model + CFG/STG/modality guidance를 쓴다.' },
  { label: '3. spatial upsampler가 video latent를 키운다', body: 'Stage 1 결과 video latent를 upsampler가 먼저 2x로 키운다. 현재 공개 파이프라인은 spatial upscaler checkpoint를 요구한다.' },
  { label: '4. Stage 2는 distilled LoRA와 fixed sigmas로 refine한다', body: 'Stage 2는 upscaled video latent와 stage 1 audio latent를 initial_latent로 받아 high-res latent를 다시 denoise한다.' },
  { label: '5. VAE decoder와 audio decoder가 최종 media를 만든다', body: '마지막에 video decoder가 frame iterator를 만들고 audio decoder가 audio output을 만든다.' },
];

const W = 650;
const H = 305;

function Arrow({ x1, y1, x2, y2, color = '#64748b' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#arrow)" />;
}

export default function LtxTwoStageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
          <DataBox x={26} y={44} w={110} label="prompt" sub="+ negative" color="#2563eb" autoFit />
          <ModuleBox x={170} y={34} w={126} label="PromptEncoder" sub="Gemma → v/a ctx" color="#2563eb" autoFit />
          <Arrow x1={136} y1={60} x2={168} y2={58} color="#2563eb" />

          {step >= 1 && (
            <g>
              <ActionBox x={332} y={28} w={126} label="Stage 1 denoise" sub="half resolution" color="#0f766e" autoFit />
              <StatusBox x={500} y={26} w={108} label="guidance" sub="CFG/STG/A2V" color="#0f766e" progress={0.7} autoFit />
              <Arrow x1={296} y1={58} x2={330} y2={50} color="#0f766e" />
              <Arrow x1={458} y1={50} x2={498} y2={50} color="#0f766e" />
            </g>
          )}

          {step >= 2 && (
            <g>
              <DataBox x={64} y={148} w={132} label="stage1 video latent" sub="low-res" color="#0f766e" autoFit />
              <ActionBox x={238} y={144} w={118} label="Spatial upscaler" sub="x2 latent" color="#f97316" autoFit />
              <Arrow x1={196} y1={164} x2={236} y2={163} color="#f97316" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <ActionBox x={394} y={136} w={128} label="Stage 2 refine" sub="distilled LoRA" color="#db2777" autoFit />
              <DataBox x={64} y={206} w={132} label="stage1 audio latent" sub="carried forward" color="#7c3aed" autoFit />
              <Arrow x1={356} y1={163} x2={392} y2={156} color="#db2777" />
              <Arrow x1={196} y1={222} x2={392} y2={174} color="#7c3aed" />
            </g>
          )}

          {step >= 4 && (
            <g>
              <ModuleBox x={190} y={250} w={116} label="VideoDecoder" sub="latents → frames" color="#16a34a" autoFit />
              <ModuleBox x={350} y={250} w={116} label="AudioDecoder" sub="latents → audio" color="#16a34a" autoFit />
              <DataBox x={508} y={258} w={102} label="mp4 output" sub="video + audio" color="#16a34a" autoFit />
              <Arrow x1={452} y1={178} x2={250} y2={250} color="#16a34a" />
              <Arrow x1={452} y1={178} x2={408} y2={250} color="#16a34a" />
              <Arrow x1={466} y1={272} x2={506} y2={274} color="#16a34a" />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
