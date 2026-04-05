import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function PairStateViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">UniswapV2Pair — 상태 구조</text>

        {/* 중앙 Pair 컨트랙트 */}
        <ModuleBox x={195} y={108} w={130} h={80}
          label="UniswapV2Pair"
          sub="token0 < token1"
          color="#3b82f6" />

        {/* reserves */}
        <DataBox x={20} y={56} w={130} h={40}
          label="uint112 reserve0"
          sub="token0 준비금"
          color="#10b981" />
        <DataBox x={20} y={108} w={130} h={40}
          label="uint112 reserve1"
          sub="token1 준비금"
          color="#10b981" />
        <DataBox x={20} y={160} w={130} h={40}
          label="uint32 timestamp"
          sub="마지막 업데이트"
          color="#10b981" />

        {/* 1 slot packing 라벨 */}
        <rect x={10} y={48} width={150} height={164} rx={6}
          fill="transparent" stroke="#10b981" strokeWidth={0.5} strokeDasharray="3 2" opacity={0.6} />
        <text x={85} y={226} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#10b981">packed — 1 slot (256 bits)</text>
        <text x={85} y={239} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">112+112+32 = 256</text>

        {/* TWAP */}
        <DataBox x={370} y={56} w={130} h={40}
          label="price0Cumulative"
          sub="TWAP 누적 (token0)"
          color="#8b5cf6" />
        <DataBox x={370} y={108} w={130} h={40}
          label="price1Cumulative"
          sub="TWAP 누적 (token1)"
          color="#8b5cf6" />
        <DataBox x={370} y={160} w={130} h={40}
          label="kLast"
          sub="이전 k 값"
          color="#8b5cf6" />

        {/* 함수들 */}
        <ActionBox x={140} y={228} w={80} h={40}
          label="mint(to)"
          sub="LP 발행"
          color="#f59e0b" />
        <ActionBox x={225} y={228} w={80} h={40}
          label="burn(to)"
          sub="LP 소각"
          color="#f59e0b" />
        <ActionBox x={310} y={228} w={80} h={40}
          label="swap(...)"
          sub="스왑 실행"
          color="#ef4444" />

        {/* 연결선 */}
        <line x1={150} y1={76} x2={195} y2={130} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={150} y1={128} x2={195} y2={140} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={150} y1={180} x2={195} y2={156} stroke="var(--border)" strokeWidth={0.5} />

        <line x1={325} y1={130} x2={370} y2={76} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={325} y1={140} x2={370} y2={128} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={325} y1={156} x2={370} y2={180} stroke="var(--border)" strokeWidth={0.5} />

        <line x1={180} y1={228} x2={205} y2={188} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={265} y1={228} x2={265} y2={188} stroke="var(--border)" strokeWidth={0.5} />
        <line x1={350} y1={228} x2={315} y2={188} stroke="var(--border)" strokeWidth={0.5} />

        <text x={260} y={290} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">~200 LOC · 최소 코어 + 외부 Router 조합</text>
      </svg>
    </div>
  );
}
