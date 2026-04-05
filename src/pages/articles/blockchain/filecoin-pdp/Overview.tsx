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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoRep vs PDP 비교:
//
// PoRep (cold):
// - sealing 3-6h
// - unsealing 필요 (~1h)
// - $2-5/TiB/year
// - archival data
//
// PDP (hot):
// - no sealing
// - immediate access
// - $5-10/TiB/year
// - CDN/live content

// 공통:
// - Filecoin 생태계
// - 경제적 보장
// - slashable collateral

// 차이:
// - access latency
// - compute cost
// - price tier
// - use case fit

// Filecoin 접근:
// - PoRep: long-term archival
// - PDP: short-term / hot
// - 둘 다 제공 → full spectrum

// 대안 비교:
// - AWS S3: $23/TiB/mo = $276/year
// - Glacier: ~$48/TiB/year
// - PoRep: $2-5/TiB/year
// - PDP: $5-10/TiB/year

// FIP-0079 (2024):
// - PDP 공식 제안
// - Storacha adoption
// - Onchain Cloud 통합
// - 2025 production`}
        </pre>
        <p className="leading-7">
          PDP = <strong>hot storage proof</strong>, PoRep = cold archival.<br />
          FIP-0079 (2024), Storacha first adopter.<br />
          Filecoin full spectrum: $2-10/TiB/year price tiers.
        </p>
      </div>
    </section>
  );
}
