import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const STEPS: StepDef[] = [
  {
    label: '1. patchifier: latent grid를 토큰 시퀀스로 바꾼다',
    body: 'Video VAE 출력은 [B, C, F, H, W] 형태의 spatiotemporal latent다. Transformer가 처리하려면 patchifier가 이를 sequence로 펼치고 위치 정보를 붙인다.',
  },
  {
    label: '2. video stream은 3D RoPE로 공간+시간 위치를 본다',
    body: 'Video token은 x, y, t 축을 모두 가진다. 그래서 video stream은 공간 배치와 시간 이동을 함께 추적해야 한다.',
  },
  {
    label: '3. audio stream은 1D temporal RoPE로 시간 정렬을 본다',
    body: 'Audio token은 영상처럼 2D 공간 좌표가 없다. 핵심은 시간 위치와 음향 이벤트의 순서다.',
  },
  {
    label: '4. 각 block은 self-attn → text cross-attn → A/V cross-attn → FFN 순서',
    body: '먼저 modality 내부 관계를 정리하고, 텍스트 조건을 주입한 뒤, video/audio가 서로를 참조한다. 마지막 FFN이 token feature를 정제한다.',
  },
  {
    label: '5. cross-modality AdaLN이 두 stream의 상태를 계속 맞춘다',
    body: 'LTX-Core 문서는 다른 modality hidden state로 AdaLN scale/shift를 조절한다고 설명한다. 이 경로가 sync 유지에 중요하다.',
  },
];

const W = 650;
const H = 330;

function Arrow({ x1, y1, x2, y2, color = '#64748b', dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.4} strokeDasharray={dashed ? '5 4' : undefined} markerEnd="url(#arrow)" />;
}

export default function LtxBlockViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-4xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <DataBox x={24} y={28} w={120} label="video latent" sub="[B,C,F,H,W]" color="#0f766e" autoFit />
          <ActionBox x={180} y={24} w={108} label="Patchifier" sub="grid → tokens" color="#0f766e" autoFit />
          <DataBox x={326} y={28} w={122} label="video tokens" sub="3D positions" color="#0f766e" autoFit />
          <Arrow x1={144} y1={44} x2={178} y2={43} color="#0f766e" />
          <Arrow x1={288} y1={43} x2={324} y2={44} color="#0f766e" />

          <DataBox x={24} y={86} w={120} label="audio latent" sub="mel/time grid" color="#7c3aed" autoFit />
          <ActionBox x={180} y={82} w={108} label="Patchifier" sub="time → tokens" color="#7c3aed" autoFit />
          <DataBox x={326} y={86} w={122} label="audio tokens" sub="1D positions" color="#7c3aed" autoFit />
          <Arrow x1={144} y1={102} x2={178} y2={101} color="#7c3aed" />
          <Arrow x1={288} y1={101} x2={324} y2={102} color="#7c3aed" />

          <ModuleBox x={496} y={20} w={120} label="Gemma 3" sub="text embeddings" color="#2563eb" autoFit />

          {step >= 1 && (
            <g>
              <rect x={62} y={156} width={232} height={132} rx={10} fill="var(--card)" stroke="#0f766e" strokeWidth={0.8} />
              <text x={178} y={180} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f766e">Video stream</text>
              <text x={178} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">14B path / 3D RoPE</text>
              <ActionBox x={92} y={216} w={76} label="Self-Attn" color="#0f766e" autoFit />
              <ActionBox x={184} y={216} w={78} label="Text-Attn" color="#2563eb" autoFit />
              <ActionBox x={92} y={254} w={76} label="A↔V Attn" color="#db2777" autoFit />
              <ActionBox x={184} y={254} w={78} label="FFN" color="#0f766e" autoFit />
            </g>
          )}

          {step >= 2 && (
            <g>
              <rect x={358} y={156} width={232} height={132} rx={10} fill="var(--card)" stroke="#7c3aed" strokeWidth={0.8} />
              <text x={474} y={180} textAnchor="middle" fontSize={12} fontWeight={700} fill="#7c3aed">Audio stream</text>
              <text x={474} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">5B path / 1D temporal RoPE</text>
              <ActionBox x={388} y={216} w={76} label="Self-Attn" color="#7c3aed" autoFit />
              <ActionBox x={480} y={216} w={78} label="Text-Attn" color="#2563eb" autoFit />
              <ActionBox x={388} y={254} w={76} label="A↔V Attn" color="#db2777" autoFit />
              <ActionBox x={480} y={254} w={78} label="FFN" color="#7c3aed" autoFit />
            </g>
          )}

          {step >= 3 && (
            <g>
              <Arrow x1={496} y1={54} x2={230} y2={216} color="#2563eb" dashed />
              <Arrow x1={556} y1={54} x2={526} y2={216} color="#2563eb" dashed />
              <Arrow x1={262} y1={268} x2={386} y2={268} color="#db2777" />
              <Arrow x1={388} y1={254} x2={264} y2={254} color="#db2777" />
            </g>
          )}

          {step >= 4 && (
            <g>
              <rect x={260} y={302} width={132} height={20} rx={5} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={326} y={316} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">cross-modality AdaLN</text>
              <Arrow x1={218} y1={288} x2={288} y2={302} color="#f59e0b" />
              <Arrow x1={434} y1={288} x2={364} y2={302} color="#f59e0b" />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
