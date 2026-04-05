export default function FormatConversionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Anthropic ↔ OpenAI 포맷 변환</text>

        {/* Anthropic */}
        <rect x={25} y={54} width={234} height={178} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1} />
        <text x={142} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Anthropic 형식
        </text>

        <g transform="translate(36, 88)">
          <text x={0} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={10} y={28} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;role&quot;: &quot;assistant&quot;,</text>
          <text x={10} y={42} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;content&quot;: [</text>
          <text x={20} y={56} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123; &quot;type&quot;: &quot;text&quot;, ... &#125;,</text>
          <text x={20} y={70} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123; &quot;type&quot;: &quot;tool_use&quot;, ... &#125;</text>
          <text x={10} y={84} fontSize={9} fontFamily="monospace" fill="var(--foreground)">]</text>
          <text x={0} y={98} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;</text>
        </g>
        <text x={142} y={220} textAnchor="middle" fontSize={8.5} fontStyle="italic" fill="#3b82f6">
          배열 (혼재 가능)
        </text>

        {/* 화살표 */}
        <g transform="translate(274, 130)">
          <line x1={0} y1={0} x2={12} y2={12} stroke="var(--foreground)" strokeWidth={1.6} />
          <line x1={0} y1={24} x2={12} y2={12} stroke="var(--foreground)" strokeWidth={1.6} />
          <text x={0} y={46} fontSize={8.5} fontWeight={600} fill="var(--foreground)">변환</text>
        </g>

        {/* OpenAI */}
        <rect x={301} y={54} width={234} height={178} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
        <text x={418} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          OpenAI 형식
        </text>

        <g transform="translate(312, 88)">
          <text x={0} y={14} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#123;</text>
          <text x={10} y={28} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;role&quot;: &quot;assistant&quot;,</text>
          <text x={10} y={42} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;content&quot;: &quot;...&quot;,</text>
          <text x={10} y={56} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;tool_calls&quot;: [&#123;</text>
          <text x={20} y={70} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;function&quot;: &#123;</text>
          <text x={30} y={84} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&quot;arguments&quot;: &quot;...&quot;</text>
          <text x={10} y={98} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&#125;&#125;]</text>
        </g>
        <text x={418} y={220} textAnchor="middle" fontSize={8.5} fontStyle="italic" fill="#10b981">
          별도 필드
        </text>

        {/* 차이점 */}
        <rect x={45} y={246} width={470} height={42} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={264} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          OpenAI arguments는 문자열로 직렬화된 JSON (이중 파싱)
        </text>
        <text x={280} y={280} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
          tool_result도 별도 role:tool 메시지로 분리
        </text>
      </svg>
    </div>
  );
}
