export default function JugDripViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 320" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Jug.drip() — 이자율 갱신 함수</text>

        <defs>
          <marker id="jd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 입력 상태 */}
        <rect x={20} y={46} width={150} height={78} rx={6}
          fill="#06b6d4" fillOpacity={0.1} stroke="#06b6d4" strokeWidth={1} />
        <text x={95} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">입력 상태 (Ilk)</text>
        <text x={30} y={82} fontSize={10} fill="var(--muted-foreground)">duty</text>
        <text x={160} y={82} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">1.5e-9/s</text>
        <line x1={30} y1={87} x2={160} y2={87} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={30} y={100} fontSize={10} fill="var(--muted-foreground)">rho (last)</text>
        <text x={160} y={100} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">T-30d</text>
        <line x1={30} y1={105} x2={160} y2={105} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={30} y={118} fontSize={10} fill="var(--muted-foreground)">rate (old)</text>
        <text x={160} y={118} textAnchor="end" fontSize={10} fontWeight={600} fill="#f59e0b">1.0200 RAY</text>

        {/* 핵심 계산 */}
        <rect x={190} y={46} width={180} height={78} rx={6}
          fill="#f59e0b" fillOpacity={0.12} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={280} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          rpow 복리 계산
        </text>
        <text x={280} y={82} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          dt = now - rho
        </text>
        <text x={280} y={98} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          mult = rpow(duty, dt, RAY)
        </text>
        <text x={280} y={115} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          rate_new = rate × mult
        </text>

        <line x1={170} y1={85} x2={190} y2={85} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#jd-arr)" />
        <line x1={370} y1={85} x2={390} y2={85} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#jd-arr)" />

        {/* 출력 */}
        <rect x={390} y={46} width={110} height={78} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} />
        <text x={445} y={64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">결과</text>
        <text x={400} y={82} fontSize={10} fill="var(--muted-foreground)">rate (new)</text>
        <text x={490} y={82} textAnchor="end" fontSize={10} fontWeight={700} fill="#10b981">1.0209 RAY</text>
        <line x1={400} y1={87} x2={490} y2={87} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={400} y={100} fontSize={10} fill="var(--muted-foreground)">delta</text>
        <text x={490} y={100} textAnchor="end" fontSize={10} fontWeight={700} fill="#f59e0b">+0.0009</text>
        <line x1={400} y1={105} x2={490} y2={105} stroke="var(--border)" strokeWidth={0.3} opacity={0.4} />
        <text x={400} y={118} fontSize={10} fill="var(--muted-foreground)">rho (new)</text>
        <text x={490} y={118} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--foreground)">now</text>

        {/* 연쇄 동작 */}
        <text x={260} y={154} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">delta 전파 — Vat.fold()</text>

        {[
          {
            x: 20, label: 'Vat.fold(ilk, vow, delta)', detail: '모든 Vault에 적용', color: '#3b82f6',
          },
          {
            x: 186, label: 'ilk.rate += delta', detail: '전역 rate 업데이트', color: '#8b5cf6',
          },
          {
            x: 352, label: 'vow.dai += Art × delta', detail: '증가분 → Protocol 수익', color: '#10b981',
          },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={166} width={148} height={52} rx={6}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
            <text x={s.x + 74} y={186} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={s.color}>
              {s.label}
            </text>
            <text x={s.x + 74} y={203} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{s.detail}</text>
          </g>
        ))}
        <line x1={168} y1={192} x2={186} y2={192} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#jd-arr)" />
        <line x1={334} y1={192} x2={352} y2={192} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#jd-arr)" />

        {/* 왜 필요한가 */}
        <rect x={20} y={234} width={480} height={72} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={254} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">왜 drip() 필수 호출?</text>
        <text x={260} y={272} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">사용자 상호작용 (frob, grab, fork) 전에 반드시 drip() — 최신 rate 반영</text>
        <text x={260} y={288} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">각 사용자 잔고 수정 없이 <tspan fontWeight={700} fill="#f59e0b">전역 rate 곱셈 계수</tspan>로 이자 누적</text>
      </svg>
    </div>
  );
}
