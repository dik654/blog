import { useState } from 'react';

export default function ScaledBalanceCalcViz() {
  const [years, setYears] = useState(2);
  const initialDeposit = 1000;
  const apy = 5; // 5%

  const index = Math.pow(1 + apy / 100, years);
  const scaledBalance = initialDeposit; // stored as-is at time 0 when index=1
  const actualBalance = scaledBalance * index;
  const interestEarned = actualBalance - initialDeposit;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">경과 기간</label>
        <input type="range" min={0} max={10} step={0.5} value={years}
          onChange={(e) => setYears(+e.target.value)} className="flex-1 accent-green-500" />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{years}년</span>
      </div>

      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Scaled Balance — 인덱스 기반 이자 계산</text>

        {/* 공식 */}
        <rect x={20} y={42} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          balanceOf(user) = scaledBalance × currentIndex / RAY
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          저장된 scaled 값은 변하지 않음 · 조회 시 index 곱해서 이자 포함 잔액 계산
        </text>

        {/* 3개 값 박스 */}
        <rect x={20} y={104} width={155} height={80} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={97} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          scaledBalance
        </text>
        <text x={97} y={152} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          {scaledBalance}
        </text>
        <text x={97} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          (storage, 불변)
        </text>

        <rect x={185} y={104} width={150} height={80} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={0.8} />
        <text x={260} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          liquidityIndex
        </text>
        <text x={260} y={152} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">
          {index.toFixed(4)}
        </text>
        <text x={260} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          ({apy}% APY × {years}년)
        </text>

        <rect x={345} y={104} width={155} height={80} rx={8}
          fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={1} />
        <text x={422} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          실제 잔액 (balanceOf)
        </text>
        <text x={422} y={152} textAnchor="middle" fontSize={20} fontWeight={700} fill="#10b981">
          {actualBalance.toFixed(2)}
        </text>
        <text x={422} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          USDC (조회 시 계산)
        </text>

        {/* 화살표 */}
        <defs>
          <marker id="sb-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#6b7280" />
          </marker>
        </defs>
        <line x1={175} y1={144} x2={185} y2={144} stroke="#6b7280" strokeWidth={1} />
        <line x1={335} y1={144} x2={345} y2={144} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#sb-arr)" />
        <text x={260} y={200} textAnchor="middle" fontSize={14} fontWeight={700} fill="#6b7280">×</text>

        {/* 이자 수익 */}
        <rect x={20} y={210} width={480} height={56} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={36} y={230} fontSize={11} fontWeight={700} fill="#10b981">누적 이자 수익:</text>
        <text x={484} y={230} textAnchor="end" fontSize={18} fontWeight={700} fill="#10b981">
          +{interestEarned.toFixed(2)} USDC
        </text>
        <text x={36} y={252} fontSize={10} fill="var(--muted-foreground)">
          {initialDeposit} × (1 + {apy}%)^{years} − {initialDeposit} · 사용자 행동 0 (자동 복리)
        </text>

        {/* rebase 대비 장점 */}
        <rect x={20} y={282} width={480} height={48} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
        <text x={260} y={302} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          rebase 대신 scaled balance = 가스 절감 + ERC20 호환성
        </text>
        <text x={260} y={320} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          매 블록 balance 수정 없음 · 모든 사용자에게 같은 index 적용 (O(1))
        </text>
      </svg>
    </div>
  );
}
