import { useState } from 'react';
import { BadgeCheck, FlaskConical, Layers3, type LucideIcon } from 'lucide-react';

type LayerId = 'inherited' | 'stated' | 'tested';

type EvidenceLayer = {
  id: LayerId;
  label: string;
  icon: LucideIcon;
  question: string;
  owner: string;
  claims: string[];
  consequence: string;
};

const layers: EvidenceLayer[] = [
  {
    id: 'inherited',
    label: 'SDXL에서 상속',
    icon: Layers3,
    question: 'Checkpoint가 바뀌어도 어떤 실행 골격은 그대로인가?',
    owner: 'SDXL technical report와 호환 artifact',
    claims: [
      'Latent denoising과 VAE decode라는 공통 실행 계약',
      'SDXL license가 적용되는 배포 경계',
      'LoRA를 weight 변화량으로 적용할 수 있는 일반 원리',
    ],
    consequence: '이 층은 Illustrious v1.1만의 성과로 세지 않는다.',
  },
  {
    id: 'stated',
    label: 'v1.1 카드 명시',
    icon: BadgeCheck,
    question: '현재 공식 카드가 실제로 무엇을 말하는가?',
    owner: 'OnomaAIResearch/Illustrious-XL-v1.1 model card',
    claims: [
      'v1.0에서 이어진 stabilization hyperparameter 조정',
      '조금 나아진 character understanding과 2024-07 knowledge cutoff',
      'Color·anatomy·saturation의 작은 차이',
      '400 sample response에서 ELO 1617, v1.0은 1571',
    ],
    consequence: '표본과 평가 범위를 넘겨 모든 prompt의 우월성으로 일반화하지 않는다.',
  },
  {
    id: 'tested',
    label: '직접 실험 필요',
    icon: FlaskConical,
    question: '공식 카드만으로는 어떤 실사용 결론을 낼 수 없는가?',
    owner: 'Versioned workflow manifest와 local comparison',
    claims: [
      'Natural language와 tag prompt 중 어느 쪽이 더 안정적인가',
      '특정 LoRA·VAE·sampler 조합이 호환되는가',
      'Character identity·anatomy·color가 실제 작업에서 개선됐는가',
      'Merge나 full tune 뒤 일반 SDXL 능력이 얼마나 회귀하는가',
    ],
    consequence: '한 번에 한 변수만 바꾸고 결과를 checkpoint에 잘못 귀속하지 않는다.',
  },
];

export default function IllustriousEvidenceLab() {
  const [activeId, setActiveId] = useState<LayerId>('inherited');
  const active = layers.find((layer) => layer.id === activeId) ?? layers[0];
  const Icon = active.icon;

  return (
    <div
      data-illustrious-evidence-lab
      data-layer={activeId}
      className="not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Evidence layers</p>
        <h3 className="mt-1 text-base font-bold">파생 checkpoint의 주장을 세 층으로 분리한다</h3>
      </header>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        {layers.map((layer) => {
          const LayerIcon = layer.icon;
          const activeLayer = layer.id === activeId;
          return (
            <button
              key={layer.id}
              type="button"
              aria-label={layer.label}
              aria-pressed={activeLayer}
              onClick={() => setActiveId(layer.id)}
              className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left transition-colors ${
                activeLayer ? 'bg-blue-500/[0.07]' : 'hover:bg-muted/35'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayerIcon className={`h-4 w-4 shrink-0 ${activeLayer ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                <span className="break-words text-xs font-bold">{layer.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(17rem,0.9fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{active.question}</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                근거 owner · {active.owner}
              </p>
            </div>
          </div>
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {active.claims.map((claim, index) => (
              <li key={claim} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-6">{claim}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">판정 규칙</p>
          <p className="mt-2 text-sm font-semibold leading-6">{active.consequence}</p>
          <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            카드가 짧을수록 빈칸을 관행으로 채우지 않는다. 빈칸은 실험 항목으로 남긴다.
          </p>
        </aside>
      </div>
    </div>
  );
}
