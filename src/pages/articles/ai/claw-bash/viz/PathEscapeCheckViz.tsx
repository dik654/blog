export default function PathEscapeCheckViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">check_working_dir() — 심링크 이스케이프 방지</text>

        <defs>
          <marker id="pec-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Workspace boundary */}
        <rect x={24} y={54} width={512} height={60} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={38} y={72} fontSize={10} fontWeight={700} fill="#10b981">
          workspace_root: /home/user/project
        </text>
        {/* Inside workspace */}
        <rect x={70} y={80} width={120} height={26} rx={4}
          fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={1} />
        <text x={130} y={97} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#10b981">
          /project/src
        </text>
        <rect x={210} y={80} width={120} height={26} rx={4}
          fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={1} />
        <text x={270} y={97} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#10b981">
          /project/tests
        </text>
        {/* Malicious symlink */}
        <rect x={350} y={80} width={178} height={26} rx={4}
          fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={1.5} />
        <text x={360} y={97} fontSize={9} fontFamily="monospace" fill="#ef4444">
          /project/link → /etc (symlink)
        </text>

        {/* LLM request */}
        <rect x={24} y={142} width={200} height={44} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={124} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          LLM 요청
        </text>
        <text x={124} y={176} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          wd: &quot;/project/link&quot;
        </text>

        {/* canonicalize arrow */}
        <line x1={224} y1={164} x2={260} y2={164} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pec-arr)" />
        <text x={242} y={158} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#8b5cf6">
          canonicalize()
        </text>

        {/* Resolved path */}
        <rect x={264} y={142} width={160} height={44} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={344} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          실제 경로
        </text>
        <text x={344} y={176} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          /etc
        </text>

        {/* starts_with check */}
        <line x1={424} y1={164} x2={460} y2={164} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pec-arr)" />

        {/* Boundary check */}
        <rect x={462} y={142} width={76} height={44} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.5} />
        <text x={500} y={164} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          ✗ Deny
        </text>
        <text x={500} y={178} textAnchor="middle" fontSize={8.5} fill="#ef4444">
          outside ws
        </text>

        {/* Code snippet */}
        <rect x={24} y={206} width={512} height={74} rx={6}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={36} y={224} fontSize={10} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
          let canonical = wd.canonicalize()?;
        </text>
        <text x={36} y={240} fontSize={10} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
          if !canonical.starts_with(&amp;workspace_root) {`{`}
        </text>
        <text x={56} y={256} fontSize={10} fontFamily="monospace" fill="#ef4444">
          return Err(&quot;working dir outside workspace&quot;);
        </text>
        <text x={36} y={272} fontSize={10} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
          {`}`}
        </text>

        {/* Bottom note */}
        <text x={280} y={302} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
          canonicalize()가 심링크·../·. 전부 해석 → starts_with로 prefix 일치만 확인
        </text>
      </svg>
    </div>
  );
}
