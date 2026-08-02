import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  { label: '1. prompt extension은 구조 밖 전처리지만 품질에 직접 영향', body: 'Wan2.2 저장소는 Dashscope 또는 local Qwen으로 prompt를 확장하는 경로를 제공한다. T2V는 Qwen text, I2V는 Qwen-VL 계열을 쓴다.' },
  { label: '2. A14B 단일 GPU는 80GB급 VRAM을 전제로 안내된다', body: '공식 예시는 720p A14B single-GPU에 80GB 이상을 언급한다. OOM이면 offload_model, convert_model_dtype, t5_cpu 옵션을 쓴다.' },
  { label: '3. multi-GPU는 DiT FSDP + T5 FSDP + Ulysses로 sequence를 나눈다', body: 'FSDP는 model shard, Ulysses는 sequence parallel 성격으로 긴 video token inference를 분산한다.' },
  { label: '4. TI2V-5B는 24GB급 consumer GPU 경로다', body: 'README는 TI2V-5B를 4090 같은 consumer GPU에서 720P@24fps를 시도할 수 있는 모델로 안내한다.' },
];

export default function WanRuntimeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 650 300" className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
          <DataBox x={28} y={44} w={104} label="short prompt" sub="user input" color="#2563eb" autoFit />
          <ActionBox x={170} y={40} w={120} label="Prompt extend" sub="Dashscope / Qwen" color="#2563eb" autoFit />
          <DataBox x={332} y={44} w={120} label="rich prompt" sub="scene + motion" color="#2563eb" autoFit />
          <line x1={132} y1={60} x2={168} y2={60} stroke="#2563eb" strokeWidth={1.5} markerEnd="url(#arrow)" />
          <line x1={290} y1={60} x2={330} y2={60} stroke="#2563eb" strokeWidth={1.5} markerEnd="url(#arrow)" />

          {step >= 1 && (
            <g>
              <ModuleBox x={80} y={138} w={150} label="Single GPU A14B" sub="80GB VRAM path" color="#db2777" autoFit />
              <StatusBox x={270} y={136} w={138} label="memory relief" sub="offload / dtype / T5 CPU" color="#db2777" progress={0.55} autoFit />
              <line x1={452} y1={60} x2={230} y2={158} stroke="#db2777" strokeWidth={1.3} markerEnd="url(#arrow)" />
            </g>
          )}

          {step >= 2 && (
            <g>
              <ModuleBox x={456} y={128} w={150} label="Multi GPU A14B" sub="FSDP + Ulysses" color="#0f766e" autoFit />
              <line x1={408} y1={160} x2={454} y2={152} stroke="#0f766e" strokeWidth={1.5} markerEnd="url(#arrow)" />
            </g>
          )}

          {step >= 3 && (
            <g>
              <ModuleBox x={220} y={230} w={150} label="TI2V-5B" sub="24GB 4090 path" color="#f97316" autoFit />
              <DataBox x={412} y={240} w={120} label="720P@24fps" sub="T2V or I2V" color="#f97316" autoFit />
              <line x1={370} y1={252} x2={410} y2={256} stroke="#f97316" strokeWidth={1.5} markerEnd="url(#arrow)" />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
