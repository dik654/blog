import { useMemo, useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type PresetId = 'deepseek' | 'qwen';

const presets = {
  deepseek: {
    label: 'DeepSeek-V3',
    hidden: 7168,
    intermediate: 2048,
    moeLayers: 58,
    routedExperts: 256,
    activeExperts: 8,
    sharedExperts: 1,
    reportedTotal: 671,
    reportedActive: 37,
    note: '61 layers 중 앞 3개는 dense, 뒤 58개가 MoE다.',
  },
  qwen: {
    label: 'Qwen3-235B-A22B',
    hidden: 4096,
    intermediate: 1536,
    moeLayers: 94,
    routedExperts: 128,
    activeExperts: 8,
    sharedExperts: 0,
    reportedTotal: 235,
    reportedActive: 22,
    note: '94개 layer 모두 MoE이며 shared expert를 두지 않는다.',
  },
} as const;

function compact(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  return `${(value / 1e6).toFixed(2)}M`;
}

export default function MoeParameterLedgerLab() {
  const [presetId, setPresetId] = useState<PresetId>('deepseek');
  const result = useMemo(() => {
    const preset = presets[presetId];
    const expertWeights = 3 * preset.hidden * preset.intermediate;
    const totalBankLayer = (preset.routedExperts + preset.sharedExperts) * expertWeights;
    const activeBankLayer = (preset.activeExperts + preset.sharedExperts) * expertWeights;
    const allLayerBank = totalBankLayer * preset.moeLayers;
    const allLayerActive = activeBankLayer * preset.moeLayers;
    const bankRatio = 100 * activeBankLayer / totalBankLayer;
    const reportedRatio = 100 * preset.reportedActive / preset.reportedTotal;
    const activeGap = preset.reportedActive * 1e9 - allLayerActive;
    return { preset, expertWeights, totalBankLayer, activeBankLayer, allLayerBank, allLayerActive, bankRatio, reportedRatio, activeGap };
  }, [presetId]);

  return (
    <div data-moe-ledger-lab className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background">
      <header className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">EXPERT PARAMETER LEDGER · 보고 숫자를 matrix에서 복원</p>
          <h3 className="mt-2 text-lg font-bold">Active ratio 하나로는 실행량을 설명할 수 없다</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Expert bank 안에서 켜지는 비율과 모델 전체의 reported active 비율을 분리한다. Attention, embedding, dense prefix는 routed expert 밖에서도 계속 실행된다.</p>
        </div>
        <SegmentedControl
          label="MoE parameter preset"
          options={[
            { value: 'deepseek', label: 'DeepSeek-V3' },
            { value: 'qwen', label: 'Qwen3-A22B' },
          ]}
          value={presetId}
          onChange={setPresetId}
        />
      </header>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold text-muted-foreground">공개 config</p>
          <dl className="mt-4 grid grid-cols-2 gap-px border border-border bg-border">
            <LedgerCell label="hidden d" value={result.preset.hidden.toLocaleString()} />
            <LedgerCell label="expert 중간폭 m" value={result.preset.intermediate.toLocaleString()} />
            <LedgerCell label="MoE layers" value={String(result.preset.moeLayers)} />
            <LedgerCell label="routed / active / shared" value={`${result.preset.routedExperts} / ${result.preset.activeExperts} / ${result.preset.sharedExperts}`} />
          </dl>
          <p className="mt-4 border-l-2 border-amber-600/45 bg-amber-500/[0.04] px-3 py-2 text-xs leading-relaxed text-muted-foreground">{result.preset.note}</p>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold">Expert bank 내부 활성 비율</span>
              <span data-bank-active-ratio={result.bankRatio.toFixed(2)} className="font-mono font-black">{result.bankRatio.toFixed(2)}%</span>
            </div>
            <div className="mt-2 h-3 border border-border bg-muted/50">
              <span className="block h-full bg-violet-600 transition-[width] duration-300" style={{ width: `${result.bankRatio}%` }} />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">(active routed + shared) / (all routed + shared). 모델 전체 active ratio가 아니다.</p>
          </div>
        </section>

        <section className="min-w-0 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-px border border-border bg-border">
            <Metric label="Expert 하나" value={compact(result.expertWeights)} detail={`3 × ${result.preset.hidden.toLocaleString()} × ${result.preset.intermediate.toLocaleString()}`} dataName="data-expert-params" />
            <Metric label="Layer expert bank 전체" value={compact(result.totalBankLayer)} detail="routed와 shared expert weight 모두" dataName="data-total-bank-layer" />
            <Metric label="Token당 활성 expert path" value={compact(result.activeBankLayer)} detail="top-k routed와 shared만" dataName="data-active-bank-layer" />
            <Metric label="모든 MoE layer의 expert bank" value={compact(result.allLayerBank)} detail={`${result.preset.moeLayers}개 bank 합`} dataName="data-reconstructed-total-bank" />
          </div>

          <div className="mt-5 border-y border-border">
            <div className="grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="text-xs font-bold">Expert path 재구성</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">모든 MoE layer에서 이 token이 통과하는 expert weight 합</p>
              </div>
              <p data-reconstructed-active-bank={compact(result.allLayerActive)} className="font-mono text-xl font-black">{compact(result.allLayerActive)}</p>
            </div>
            <div className="grid gap-4 border-t border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="text-xs font-bold">보고된 model-wide active</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{result.preset.reportedActive}B / {result.preset.reportedTotal}B. Attention·embedding·dense path 포함</p>
              </div>
              <p data-reported-ratio={result.reportedRatio.toFixed(2)} className="font-mono text-xl font-black">{result.reportedRatio.toFixed(2)}%</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            보고 active에서 expert path 재구성값을 빼면 약 <strong className="text-foreground">{compact(result.activeGap)}</strong>가 남는다. 이는 always-on 경로의 크기를 감지하는 잔차이지, 공개되지 않은 세부 항목을 정확히 분해한 값은 아니다.
          </p>
        </section>
      </div>
    </div>
  );
}

function LedgerCell({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 bg-background p-3"><dt className="text-[10px] font-semibold text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-mono text-sm font-black">{value}</dd></div>;
}

function Metric({ label, value, detail, dataName }: { label: string; value: string; detail: string; dataName: string }) {
  return (
    <div className="min-w-0 bg-background p-4" {...{ [dataName]: value }}>
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-lg font-black leading-none">{value}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
