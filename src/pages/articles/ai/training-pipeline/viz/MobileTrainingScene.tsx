interface MobileFlowItem {
  label: string;
  detail: string;
  accent?: string;
}

export interface MobileTrainingSceneData {
  eyebrow: string;
  items: MobileFlowItem[];
  oracle: string;
}

export default function MobileTrainingScene({ scene }: { scene: MobileTrainingSceneData }) {
  return (
    <div className="min-h-[260px] w-full py-2 sm:hidden" data-mobile-training-scene>
      <p className="font-mono text-[11px] font-bold uppercase text-muted-foreground">{scene.eyebrow}</p>
      <ol className="mt-3 divide-y divide-border border-y border-border">
        {scene.items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-3">
            <span
              className="flex h-7 w-7 items-center justify-center border-l-2 font-mono text-xs font-black"
              style={{ borderColor: item.accent ?? 'var(--muted-foreground)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-snug text-foreground">{item.label}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-l-2 border-foreground pl-3 text-xs font-semibold leading-relaxed text-foreground">
        {scene.oracle}
      </p>
    </div>
  );
}
