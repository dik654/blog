export default function SeptViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD 메모리 공간 — Private vs Shared</text>

        {/* TD GPA 공간 */}
        <rect x={30} y={50} width={420} height={120} rx={10}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={240} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          TD Guest Physical Address (GPA) 공간
        </text>

        {/* Private */}
        <rect x={45} y={85} width={195} height={75} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
        <text x={142} y={105} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Private GPA
        </text>
        <text x={142} y={120} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          Shared bit = 0
        </text>
        <text x={142} y={134} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          S-EPT 매핑 (TD 전용)
        </text>
        <text x={142} y={147} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          TD 키 암호화
        </text>

        {/* Shared */}
        <rect x={250} y={85} width={195} height={75} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={347} y={105} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          Shared GPA
        </text>
        <text x={347} y={120} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          Shared bit = 1
        </text>
        <text x={347} y={134} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          일반 EPT (Host 제어)
        </text>
        <text x={347} y={147} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          KeyID 0 (공유 키)
        </text>

        {/* Lookup mechanism */}
        <rect x={30} y={185} width={420} height={65} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={202} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
          CPU 메모리 접근 흐름
        </text>
        <text x={240} y={218} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          1. GPA의 Shared bit 검사
        </text>
        <text x={240} y={230} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          2. Shared=0 → S-EPT walk · Shared=1 → 일반 EPT walk
        </text>
        <text x={240} y={242} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          3. HPA 획득 → MKTME가 해당 KeyID로 암/복호화
        </text>
      </svg>
    </div>
  );
}
