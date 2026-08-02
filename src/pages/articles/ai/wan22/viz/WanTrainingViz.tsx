import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  {
    label: '1. 데이터 품질은 미감, 움직임, 해상도, 텍스트 정합성으로 걸러진다',
    body: 'Wan2.2 README는 더 큰 이미지/비디오 데이터와 미감 라벨을 언급한다. 다만 원본 데이터셋과 필터 구현 전체는 공개되어 있지 않다.',
  },
  {
    label: '2. VAE가 비디오를 작게 압축하고 DiT는 latent에서만 학습한다',
    body: '비디오 픽셀을 직접 처리하면 토큰 수가 너무 커진다. Wan2.2-VAE의 시간/공간 압축은 720p 비디오를 DiT가 다룰 수 있는 latent grid로 바꾸는 핵심 전제다.',
  },
  {
    label: '3. A14B 계열은 노이즈 구간에 따라 high/low expert를 나눈다',
    body: '초반 고노이즈 구간은 구도와 큰 움직임, 후반 저노이즈 구간은 질감과 세부 묘사에 집중한다. 각 step의 active parameter는 약 14B로 설명된다.',
  },
  {
    label: '4. 학습 손실은 노이즈 제거 목표값을 맞추는 쪽으로 읽으면 된다',
    body: '공개 설명만으로 정확한 optimizer, phase별 schedule, expert 전환 학습 전략까지 재현할 수는 없다. 대신 latent diffusion의 noise/velocity 예측 틀로 이해하면 구조를 따라가기 쉽다.',
  },
  {
    label: '5. 파인튜닝은 어떤 expert와 조건 경로를 건드리는지가 핵심이다',
    body: 'LoRA를 적용하더라도 전체 모델을 균일하게 바꾸는 것이 아니다. 움직임을 바꾸려는지, 질감/스타일을 바꾸려는지에 따라 고노이즈/저노이즈 expert 영향이 달라질 수 있다.',
  },
];

export default function WanTrainingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 720 330" className="w-full max-w-5xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wan-train-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <DataBox x={26} y={44} w={118} label="선별 데이터" sub="image / video" color="#2563eb" autoFit />
          <ActionBox x={172} y={40} w={128} label="품질 라벨" sub="미감 / 움직임" color="#0f766e" autoFit />
          <line x1={144} y1={62} x2={172} y2={62} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#wan-train-arrow)" />

          {step >= 1 && (
            <g>
              <line x1={300} y1={62} x2={352} y2={62} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#wan-train-arrow)" />
              <ModuleBox x={352} y={38} w={114} label="Wan VAE" sub="4×16×16 압축" color="#7c3aed" autoFit />
              <line x1={466} y1={62} x2={524} y2={62} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#wan-train-arrow)" />
              <DataBox x={524} y={46} w={126} label="latent tokens" sub="DiT input" color="#7c3aed" autoFit />
            </g>
          )}

          {step >= 2 && (
            <g>
              <ModuleBox x={138} y={132} w={138} label="high-noise expert" sub="구도 / 움직임" color="#f97316" autoFit />
              <ModuleBox x={444} y={132} w={138} label="low-noise expert" sub="texture / detail" color="#db2777" autoFit />
              <StatusBox x={302} y={128} w={112} label="t_moe" sub="SNR threshold" color="#f59e0b" progress={0.52} autoFit />
              <line x1={276} y1={156} x2={302} y2={156} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#wan-train-arrow)" />
              <line x1={414} y1={156} x2={444} y2={156} stroke="#64748b" strokeWidth={1.4} markerEnd="url(#wan-train-arrow)" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <ActionBox x={214} y={226} w={124} label="denoising loss" sub="eps/v target" color="#16a34a" autoFit />
              <ActionBox x={382} y={226} w={124} label="condition paths" sub="text / image" color="#2563eb" autoFit />
              <line x1={276} y1={180} x2={276} y2={226} stroke="#16a34a" strokeWidth={1.2} markerEnd="url(#wan-train-arrow)" />
              <line x1={520} y1={180} x2={450} y2={226} stroke="#2563eb" strokeWidth={1.2} markerEnd="url(#wan-train-arrow)" />
            </g>
          )}

          {step >= 4 && (
            <g>
              <AlertBox x={36} y={244} w={128} label="비공개 세부값" sub="mixture / schedule" color="#dc2626" autoFit />
              <ModuleBox x={548} y={244} w={128} label="fine-tuning 판단" sub="expert별 영향 확인" color="#16a34a" autoFit />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
