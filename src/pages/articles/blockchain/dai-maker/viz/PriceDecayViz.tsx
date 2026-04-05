import { useState } from 'react';

export default function PriceDecayViz() {
  const [cut, setCut] = useState(99); // percentage
  const [step, setStep] = useState(60); // seconds
  const marketPrice = 3000;
  const top = 3300;
  const totalMinutes = 30;

  // 가격 계산
  const points: { t: number; p: number }[] = [];
  const numPoints = 180;
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * totalMinutes * 60; // seconds
    const stepsElapsed = Math.floor(t / step);
    const price = top * Math.pow(cut / 100, stepsElapsed);
    points.push({ t: t / 60, p: price });
  }

  // 첫 시장가 도달 시점
  const breakEvenIdx = points.findIndex(p => p.p <= marketPrice);
  const breakEven = breakEvenIdx > 0 ? points[breakEvenIdx] : null;

  // 차트 좌표
  const w = 460;
  const h = 160;
  const padLeft = 52;
  const padBottom = 32;
  const minPrice = 2400;
  const maxPrice = 3400;

  const toX = (t: number) => padLeft + (t / totalMinutes) * w;
  const toY = (p: number) => 56 + h - ((p - minPrice) / (maxPrice - minPrice)) * h;

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.p)}`).join(' ');

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      {/* 슬라이더 */}
      <div className="mb-2 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">cut (감소율)</label>
        <input
          type="range"
          min={90}
          max={99.5}
          step={0.5}
          value={cut}
          onChange={(e) => setCut(+e.target.value)}
          className="flex-1 accent-blue-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{cut}%</span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs font-semibold text-muted-foreground min-w-[90px]">step (간격)</label>
        <input
          type="range"
          min={30}
          max={300}
          step={30}
          value={step}
          onChange={(e) => setStep(+e.target.value)}
          className="flex-1 accent-blue-500"
        />
        <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{step}s</span>
      </div>

      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">StairstepExponentialDecrease — cut · step 조정</text>
        <text x={260} y={40} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">price(t) = top × cut^⌊t/step⌋</text>

        {/* 축 */}
        <line x1={padLeft} y1={56 + h} x2={padLeft + w} y2={56 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />
        <line x1={padLeft} y1={56} x2={padLeft} y2={56 + h}
          stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Y축 */}
        {[2400, 2600, 2800, 3000, 3200, 3400].map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + w} y2={y}
                stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                ${v}
              </text>
            </g>
          );
        })}

        {/* X축 */}
        {[0, 5, 10, 15, 20, 25, 30].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={56 + h} x2={x} y2={56 + h + 3} stroke="var(--foreground)" strokeWidth={0.5} />
              <text x={x} y={56 + h + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}m
              </text>
            </g>
          );
        })}

        {/* 시장가 기준선 */}
        <line x1={padLeft} y1={toY(marketPrice)} x2={padLeft + w} y2={toY(marketPrice)}
          stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={padLeft + w + 5} y={toY(marketPrice) + 4} fontSize={9.5} fontWeight={600} fill="#f59e0b">
          시장가
        </text>

        {/* 시작 가격 라인 */}
        <line x1={padLeft} y1={toY(top)} x2={padLeft + w} y2={toY(top)}
          stroke="#6b7280" strokeWidth={0.6} strokeDasharray="2 2" opacity={0.5} />

        {/* 경매 곡선 */}
        <path d={pathData} stroke="#3b82f6" strokeWidth={2.5} fill="none" />

        {/* 시작점 */}
        <circle cx={toX(0)} cy={toY(top)} r={5} fill="#3b82f6" />
        <text x={toX(0) + 8} y={toY(top) - 6} fontSize={9.5} fontWeight={700} fill="#3b82f6">
          top ${top}
        </text>

        {/* 시장가 도달 점 */}
        {breakEven && (
          <>
            <circle cx={toX(breakEven.t)} cy={toY(breakEven.p)} r={6} fill="#10b981" stroke="var(--card)" strokeWidth={1.5} />
            <text x={toX(breakEven.t)} y={toY(breakEven.p) - 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
              시장가 도달
            </text>
          </>
        )}

        {/* 정보 박스 */}
        <g transform="translate(26, 244)">
          <rect x={0} y={0} width={156} height={46} rx={6}
            fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="var(--foreground)">시작 가격</text>
          <text x={146} y={18} textAnchor="end" fontSize={10} fontWeight={700} fill="#3b82f6">${top}</text>
          <text x={12} y={36} fontSize={10} fontWeight={700} fill="var(--foreground)">시장가</text>
          <text x={146} y={36} textAnchor="end" fontSize={10} fontWeight={700} fill="#f59e0b">${marketPrice}</text>
        </g>

        {breakEven && (
          <g transform="translate(186, 244)">
            <rect x={0} y={0} width={156} height={46} rx={6}
              fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
            <text x={12} y={18} fontSize={10} fontWeight={700} fill="#10b981">시장가 도달</text>
            <text x={146} y={18} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">
              {breakEven.t.toFixed(1)}분
            </text>
            <text x={12} y={36} fontSize={10} fill="var(--muted-foreground)">낙찰 가능 지점</text>
          </g>
        )}

        <g transform="translate(346, 244)">
          <rect x={0} y={0} width={148} height={46} rx={6}
            fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={12} y={18} fontSize={10} fontWeight={700} fill="#8b5cf6">권장값</text>
          <text x={138} y={18} textAnchor="end" fontSize={10} fontWeight={700} fill="#8b5cf6">cut=99, step=90s</text>
          <text x={12} y={36} fontSize={9} fill="var(--muted-foreground)">
            ETH-A 실사용 파라미터
          </text>
        </g>
      </svg>
    </div>
  );
}
