/**
 * 데이터센터 공조 vs 수냉 vs 침지냉각 비교.
 */
export default function CoolingViz() {
  const W = 720;
  const H = 360;

  const cooling = [
    {
      name: 'Air Cooling (공조)',
      color: '#3b82f6',
      x: 20,
      properties: [
        { k: 'PUE', v: '1.5 ~ 2.0' },
        { k: 'TDP/rack', v: '~30 kW' },
        { k: '비용', v: '낮음 · 표준' },
        { k: '복잡도', v: '낮음' },
        { k: '소음', v: '큼 (대형 팬)' },
        { k: '한계', v: 'GPU 8 장 + CPU 의 ~700W/U' },
        { k: '적합', v: '일반 서버 · 검증자 · K8s' },
      ],
    },
    {
      name: 'DLC (Direct Liquid)',
      color: '#10b981',
      x: 240,
      properties: [
        { k: 'PUE', v: '1.1 ~ 1.3' },
        { k: 'TDP/rack', v: '~80 kW' },
        { k: '비용', v: '중 · 배관 인프라' },
        { k: '복잡도', v: '중 · CDU · 누수 위험' },
        { k: '소음', v: '작음' },
        { k: '한계', v: 'CPU/GPU 직접 cold plate' },
        { k: '적합', v: 'H100 / B200 학습 클러스터' },
      ],
    },
    {
      name: 'Immersion (침지)',
      color: '#8b5cf6',
      x: 460,
      properties: [
        { k: 'PUE', v: '1.05 ~ 1.1' },
        { k: 'TDP/rack', v: '150+ kW' },
        { k: '비용', v: '고가 · 유체 + 탱크' },
        { k: '복잡도', v: '높음 · 정비 어려움' },
        { k: '소음', v: '거의 없음' },
        { k: '한계', v: '서버 자체를 유체에 담금' },
        { k: '적합', v: '극한 밀도 (HPC · ASIC mining)' },
      ],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">데이터센터 냉각 3 종 — 공조 vs DLC vs 침지</text>

        {cooling.map((c) => (
          <g key={c.name}>
            <rect x={c.x} y={50} width={220} height={290} rx={8}
              fill={c.color} fillOpacity={0.06} stroke={c.color} strokeWidth={1.4} />
            <text x={c.x + 110} y={74} textAnchor="middle" fontSize={11} fontWeight={700} fill={c.color}>{c.name}</text>

            {c.properties.map((p, i) => {
              const y = 90 + i * 35;
              return (
                <g key={p.k}>
                  <rect x={c.x + 12} y={y} width={196} height={30} rx={3}
                    fill={c.color} fillOpacity={0.06} stroke={c.color} strokeWidth={0.4} />
                  <text x={c.x + 22} y={y + 13} fontSize={9} fontWeight={700} fill={c.color}>{p.k}</text>
                  <text x={c.x + 22} y={y + 25} fontSize={9} fill="var(--muted-foreground)">{p.v}</text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
