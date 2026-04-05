import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 전력/냉각이 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          전력 + 냉각은 <strong>데이터센터 설계의 핵심</strong>.<br />
          GPU TDP, 냉각 방식, 랙 설계가 상호 의존.<br />
          잘못된 선택 = 과열, downtime, 비용 폭발.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">데이터센터 PUE &amp; Power Budget</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PUE (Power Usage Effectiveness):
// PUE = total_facility_power / IT_equipment_power
// - ideal: 1.0 (impossible)
// - good: <1.3
// - typical: 1.5-1.8
// - poor: 2.0+

// PUE breakdown:
// - IT equipment: 100%
// - Cooling: 30-100%+
// - Power distribution: 5-10%
// - Lighting, misc: 2-5%

// Cooling overhead:
// - air cooling: ~50% overhead (PUE 1.5)
// - water cooling: ~20% overhead (PUE 1.2)
// - immersion cooling: ~10% overhead (PUE 1.1)
// - free cooling (cold regions): 5-10%

// Power density trends:
// - 2010: 5 kW per rack
// - 2015: 10 kW per rack
// - 2020: 30 kW per rack (GPU era)
// - 2024: 50-100 kW per rack (AI)
// - 2025+: 150+ kW per rack (H100/B200)

// Modern GPU rack:
// 8× H100 SXM per 4U chassis
// 8 × 700W = 5600W per chassis
// 10 chassis per rack = 56 kW IT load
// + cooling = 70-85 kW total
// requires advanced cooling

// Power sources:
// - 208V single-phase: 40 kW max
// - 415V three-phase: up to 100 kW
// - busbar systems: 250+ kW
// - DC power (400V): emerging

// Cooling technology evolution:
// - CRAC/CRAH (traditional): 10-15 kW/rack
// - row-based cooling: 20-30 kW/rack
// - rear-door heat exchangers: 50 kW/rack
// - direct-to-chip water: 100+ kW/rack
// - immersion cooling: 200+ kW/rack

// Cost implications:
// - power cost: $0.05-0.15/kWh
// - 100 kW rack × 24/7:
//   = 876,000 kWh/year
//   = $44K-131K/year (electricity)
// - cooling adds 30-50% more
// - 5-year electricity: ~$500K+

// Filecoin SP example:
// - 8× A100 server (3 kW)
// - 1 rack: 8-10 servers
// - 24-30 kW per rack
// - moderate cooling OK
// - $15-30K/year electricity

// Current datacenter constraints:
// - grid capacity limits
// - cooling water availability
// - land + real estate
// - environmental regulations
// - heat rejection`}
        </pre>
        <p className="leading-7">
          데이터센터 <strong>PUE 1.2-1.8, 50-100 kW/rack (AI era)</strong>.<br />
          cooling 오버헤드: air 50% → water 20% → immersion 10%.<br />
          2024+ 100 kW/rack 표준, direct-to-chip 필수.
        </p>
      </div>
    </section>
  );
}
