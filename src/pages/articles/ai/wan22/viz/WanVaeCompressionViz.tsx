import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  { label: '1. 비디오는 T×H×W 전체가 비용이다', body: '5초 720p 24fps는 120프레임이다. 픽셀 공간 그대로 노이즈 제거를 하면 시퀀스 길이와 메모리가 폭발한다.' },
  { label: '2. Wan2.2-VAE는 4×16×16 압축을 사용한다', body: '시간 4배, 높이 16배, 너비 16배 압축이다. README는 overall compression rate 64와 high-quality reconstruction을 강조한다.' },
  { label: '3. TI2V-5B는 patchification까지 포함해 4×32×32 수준으로 더 줄인다', body: '작은 5B 모델이 720P@24fps를 consumer GPU에서 다룰 수 있는 이유는 모델 크기만이 아니라 latent/token 압축 설계다.' },
  { label: '4. 압축은 공짜가 아니다', body: '너무 강하게 압축하면 작은 글자, 세부 질감, 빠른 motion이 손상된다. 그래서 VAE 품질과 decoder 재구성이 모델 품질의 일부다.' },
];

export default function WanVaeCompressionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 650 295" className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
          <DataBox x={34} y={48} w={132} label="720p video" sub="T×H×W pixels" color="#2563eb" autoFit />
          <ActionBox x={218} y={44} w={116} label="Wan2.2 VAE" sub="encode" color="#0f766e" autoFit />
          <ModuleBox x={386} y={34} w={126} label="latent grid" sub="Tz, H/16, W/16" color="#0f766e" autoFit />
          <line x1={166} y1={64} x2={216} y2={63} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <line x1={334} y1={63} x2={384} y2={58} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrow)" />

          {step >= 1 && (
            <g>
              <StatusBox x={72} y={144} w={134} label="time" sub="4x smaller" color="#7c3aed" progress={0.25} autoFit />
              <StatusBox x={258} y={144} w={134} label="height" sub="16x smaller" color="#0f766e" progress={0.0625} autoFit />
              <StatusBox x={444} y={144} w={134} label="width" sub="16x smaller" color="#0f766e" progress={0.0625} autoFit />
            </g>
          )}

          {step >= 2 && (
            <g>
              <ActionBox x={192} y={230} w={122} label="Patchify" sub="토큰 시퀀스" color="#f97316" autoFit />
              <DataBox x={360} y={234} w={132} label="DiT tokens" sub="4×32×32 total" color="#f97316" autoFit />
              <line x1={314} y1={249} x2={358} y2={250} stroke="#f97316" strokeWidth={1.5} markerEnd="url(#arrow)" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <rect x={42} y={226} width={116} height={44} rx={8} fill="#dc262612" stroke="#dc2626" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={100} y={246} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">trade-off</text>
              <text x={100} y={260} textAnchor="middle" fontSize={9} fill="#dc2626">detail vs cost</text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
