import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  {
    label: '1. 학습 샘플은 text, video, audio가 시간상 맞아야 한다',
    body: 'LTX-2의 핵심은 영상과 오디오를 함께 생성하는 것이므로, 학습 데이터도 장면 설명, 프레임, 파형이 서로 맞아야 한다. 이 동기화 품질은 공개 체크포인트 성능의 큰 부분이지만 전체 데이터 절차는 공개되어 있지 않다.',
  },
  {
    label: '2. 원본 media를 VAE latent로 바꾼 뒤 noise를 섞는다',
    body: '픽셀과 파형을 직접 예측하지 않고 video/audio VAE latent 위에서 diffusion 학습을 한다. timestep t를 뽑고 latent에 noise를 섞어 denoiser 입력을 만든다.',
  },
  {
    label: '3. dual-stream DiT는 같은 timestep에서 두 modality를 함께 denoise한다',
    body: '영상 흐름과 오디오 흐름은 각자 self-attention을 수행하면서 중간에 cross-attention으로 정보를 교환한다. 학습 타깃은 noise 또는 velocity 계열 예측으로 이해하면 된다.',
  },
  {
    label: '4. 조건 dropout은 추론 시 CFG를 가능하게 만든다',
    body: '일부 학습 step에서 text/audio/video 조건을 비우면, 추론 때 conditional prediction과 unconditional prediction의 차이를 guidance로 쓸 수 있다.',
  },
  {
    label: '5. 공개 trainer는 파인튜닝용이고, 사전학습 절차 전체는 아니다',
    body: 'LoRA/full fine-tuning 코드는 공개되어 있지만 데이터 혼합, 동기화 필터링, curriculum, 최적화 스케줄 전체를 재현할 수 있는 수준의 사전학습 절차는 공개 범위 밖이다.',
  },
];

export default function LtxTrainingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 720 330" className="w-full max-w-5xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ltx-train-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <DataBox x={28} y={32} w={118} label="text caption" sub="scene / action" color="#2563eb" autoFit />
          <DataBox x={28} y={92} w={118} label="video frames" sub="움직임 / 구도" color="#0f766e" autoFit />
          <DataBox x={28} y={152} w={118} label="audio waveform" sub="speech / sound" color="#7c3aed" autoFit />
          <line x1={160} y1={108} x2={226} y2={108} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#ltx-train-arrow)" />

          {step >= 1 && (
            <g>
              <ModuleBox x={226} y={62} w={138} label="modality VAE" sub="video/audio encode" color="#0f766e" autoFit />
              <line x1={364} y1={108} x2={430} y2={108} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#ltx-train-arrow)" />
              <ActionBox x={430} y={42} w={126} label="add noise at t" sub="latent + sigma(t)" color="#f97316" autoFit />
              <DataBox x={430} y={124} w={126} label="noisy latent" sub="z_t" color="#f97316" autoFit />
            </g>
          )}

          {step >= 2 && (
            <g>
              <line x1={556} y1={62} x2={606} y2={62} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#ltx-train-arrow)" />
              <ModuleBox x={586} y={40} w={112} label="dual-stream DiT" sub="predict eps/v" color="#db2777" autoFit />
              <line x1={642} y1={88} x2={642} y2={138} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#ltx-train-arrow)" />
              <StatusBox x={586} y={140} w={112} label="loss" sub="target prediction" color="#16a34a" progress={0.74} autoFit />
            </g>
          )}

          {step >= 3 && (
            <g>
              <ActionBox x={214} y={220} w={142} label="condition dropout" sub="uncond branch 학습" color="#2563eb" autoFit />
              <line x1={356} y1={239} x2={586} y2={170} stroke="#2563eb" strokeWidth={1.2} strokeDasharray="5 4" markerEnd="url(#ltx-train-arrow)" />
              <DataBox x={388} y={224} w={152} label="CFG/STG 가능" sub="추론 guidance 기반" color="#2563eb" autoFit />
            </g>
          )}

          {step >= 4 && (
            <g>
              <ModuleBox x={30} y={238} w={122} label="공개 trainer" sub="LoRA / full FT" color="#16a34a" autoFit />
              <AlertBox x={548} y={238} w={132} label="비공개 영역" sub="data / schedule" color="#dc2626" autoFit />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
