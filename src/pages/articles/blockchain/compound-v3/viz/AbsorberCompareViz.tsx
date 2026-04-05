export default function AbsorberCompareViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 400" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">청산자 관점 — Aave vs Compound V3 비교</text>

        {/* Aave 방식 */}
        <rect x={20} y={42} width={235} height={216} rx={8}
          fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={0.8} />
        <text x={137} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Aave V2/V3 (Bounty-based)
        </text>

        <rect x={32} y={76} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
        <text x={42} y={90} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">필요 자본</text>
        <text x={232} y={90} textAnchor="end" fontSize={11} fontWeight={700} fill="#ef4444">
          debt 전액
        </text>
        <text x={42} y={102} fontSize={8} fill="var(--muted-foreground)">
          10,000 USDC 필요 (예시)
        </text>

        <rect x={32} y={116} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
        <text x={42} y={130} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">보상 방식</text>
        <text x={232} y={130} textAnchor="end" fontSize={11} fontWeight={700} fill="#ef4444">
          담보 + 5-10% bonus
        </text>
        <text x={42} y={142} fontSize={8} fill="var(--muted-foreground)">
          청산자가 담보 직접 획득
        </text>

        <rect x={32} y={156} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.6} />
        <text x={42} y={170} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">진입 장벽</text>
        <text x={232} y={170} textAnchor="end" fontSize={11} fontWeight={700} fill="#ef4444">
          flash loan 필수
        </text>
        <text x={42} y={182} fontSize={8} fill="var(--muted-foreground)">
          자본 없이는 참여 불가
        </text>

        <rect x={32} y={196} width={211} height={52} rx={4}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
        <text x={42} y={212} fontSize={10} fontWeight={700} fill="#ef4444">실행 흐름</text>
        <text x={42} y={226} fontSize={9} fill="var(--muted-foreground)">
          1. debt asset 준비 (flash loan)
        </text>
        <text x={42} y={238} fontSize={9} fill="var(--muted-foreground)">
          2. liquidationCall → 3. 담보 매도
        </text>

        {/* Compound V3 방식 */}
        <rect x={265} y={42} width={235} height={216} rx={8}
          fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={0.8} />
        <text x={382} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Compound V3 (Storefront)
        </text>

        <rect x={277} y={76} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
        <text x={287} y={90} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">필요 자본</text>
        <text x={477} y={90} textAnchor="end" fontSize={11} fontWeight={700} fill="#10b981">
          0 (gas만)
        </text>
        <text x={287} y={102} fontSize={8} fill="var(--muted-foreground)">
          absorb() 누구나 호출 가능
        </text>

        <rect x={277} y={116} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
        <text x={287} y={130} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">보상 방식</text>
        <text x={477} y={130} textAnchor="end" fontSize={11} fontWeight={700} fill="#10b981">
          gas bonus only
        </text>
        <text x={287} y={142} fontSize={8} fill="var(--muted-foreground)">
          priorityFeeBonus × gasUsed
        </text>

        <rect x={277} y={156} width={211} height={32} rx={4}
          fill="var(--card)" stroke="#10b981" strokeWidth={0.6} />
        <text x={287} y={170} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">진입 장벽</text>
        <text x={477} y={170} textAnchor="end" fontSize={11} fontWeight={700} fill="#10b981">
          없음
        </text>
        <text x={287} y={182} fontSize={8} fill="var(--muted-foreground)">
          bot·스크립트로 자동화 쉬움
        </text>

        <rect x={277} y={196} width={211} height={52} rx={4}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
        <text x={287} y={212} fontSize={10} fontWeight={700} fill="#10b981">실행 흐름</text>
        <text x={287} y={226} fontSize={9} fill="var(--muted-foreground)">
          1. absorb() 호출 (gas만)
        </text>
        <text x={287} y={238} fontSize={9} fill="var(--muted-foreground)">
          2. 별도 차익거래자 → buyCollateral
        </text>

        {/* 역할 분리 */}
        <text x={260} y={284} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">V3의 역할 분리 — 2명의 서로 다른 주체</text>

        <rect x={20} y={296} width={235} height={72} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={137} y={316} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Absorber
        </text>
        <text x={137} y={336} textAnchor="middle" fontSize={10} fill="var(--foreground)">
          gas 지불 → bonus 수령
        </text>
        <text x={137} y={354} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          자본 없음 · 리스크 없음 · 작은 보상
        </text>

        <rect x={265} y={296} width={235} height={72} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={382} y={316} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          Buyer (차익거래자)
        </text>
        <text x={382} y={336} textAnchor="middle" fontSize={10} fill="var(--foreground)">
          USDC → 할인 담보 구매
        </text>
        <text x={382} y={354} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          자본 필요 · 할인율만큼 수익 · 언제든 실행
        </text>

        <text x={260} y={388} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">동일 문제 다른 접근 — Aave: 단일 청산자 · V3: 청산+판매 분리</text>
      </svg>
    </div>
  );
}
