import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP vs PoRep: 왜 다른 증명이 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          PoRep은 데이터를 봉인해야 하므로 원본을 즉시 읽을 수 없음.<br />
          PDP는 원본 데이터를 그대로 저장하고 존재를 증명 — 핫스토리지에 적합
        </p>
      </div>
      <div className="not-prose"><ContextViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PDP vs PoRep 상세 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">PoRep (cold storage)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Sealing 3-6시간, unsealing ~1시간</li>
              <li>가격: <code className="text-xs bg-background px-1 rounded">$2-5/TiB/year</code></li>
              <li>용도: archival data, long-term</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">PDP (hot storage)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Sealing 없음, 즉시 접근</li>
              <li>가격: <code className="text-xs bg-background px-1 rounded">$5-10/TiB/year</code></li>
              <li>용도: CDN, live content</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">공통점</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Filecoin 생태계, 경제적 보장</li>
              <li>slashable collateral</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">차이점</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>access latency, compute cost</li>
              <li>price tier, use case fit</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">가격 비교 (연간)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>AWS S3: <code className="text-xs bg-background px-1 rounded">$276/TiB</code></li>
              <li>Glacier: <code className="text-xs bg-background px-1 rounded">~$48/TiB</code></li>
              <li>PoRep: <code className="text-xs bg-background px-1 rounded">$2-5/TiB</code></li>
              <li>PDP: <code className="text-xs bg-background px-1 rounded">$5-10/TiB</code></li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">FIP-0079 (2024)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>PDP 공식 제안</li>
              <li>Storacha adoption</li>
              <li>Onchain Cloud 통합, 2025 production</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          PDP = <strong>hot storage proof</strong>, PoRep = cold archival.<br />
          FIP-0079 (2024), Storacha first adopter.<br />
          Filecoin full spectrum: $2-10/TiB/year price tiers.
        </p>
      </div>
    </section>
  );
}
