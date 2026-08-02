/**
 * CI/CD 파이프라인 6 단계 — 가로 흐름 + 각 단계의 도구·게이트.
 * 색상은 단계 성격별 (코드 입력 / 빌드 / 검증 / 보안 / 배포).
 */
export default function PipelineFlowViz() {
  const stages = [
    { name: 'Commit · PR', tools: 'git push\nbranch protection\nrequired reviewers', color: '#3b82f6', risk: '입력 검증 시작점' },
    { name: 'Build', tools: 'docker buildx\nbazel · gradle\nlock 파일', color: '#10b981', risk: '재현 가능성' },
    { name: 'Test', tools: 'unit · integration\ne2e · contract\ndelta coverage', color: '#f59e0b', risk: '회귀 차단' },
    { name: 'Scan · Sign', tools: 'trivy · grype\ncosign keyless\nSLSA provenance', color: '#8b5cf6', risk: '공급망 게이트' },
    { name: 'Stage Deploy', tools: 'canary 1% → 50%\n자동 롤백 SLI\nenv protection', color: '#ec4899', risk: '카나리 검증' },
    { name: 'Prod Deploy', tools: 'rolling · b/g\nGitOps reconcile\nimmutable tag', color: '#06b6d4', risk: '무중단 패턴' },
  ];

  const W = 720;
  const H = 280;
  const stageW = 105;
  const stageH = 130;
  const gap = (W - stages.length * stageW) / (stages.length + 1);
  const yTop = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">CI/CD 파이프라인 6 단계 — 단계별 게이트와 도구</text>

        {stages.map((s, i) => {
          const x = gap + i * (stageW + gap);
          return (
            <g key={s.name}>
              {/* stage 박스 */}
              <rect x={x} y={yTop} width={stageW} height={stageH} rx={6}
                fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={1} />
              {/* stage 번호 */}
              <circle cx={x + 14} cy={yTop + 14} r={9}
                fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={1} />
              <text x={x + 14} y={yTop + 17} textAnchor="middle" fontSize={9} fontWeight={700}
                fill={s.color}>{i + 1}</text>
              {/* stage 이름 */}
              <text x={x + stageW / 2} y={yTop + 17} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={s.color}>{s.name}</text>
              {/* 도구 목록 */}
              {s.tools.split('\n').map((t, j) => (
                <text key={j} x={x + 8} y={yTop + 38 + j * 14} fontSize={9}
                  fill="var(--muted-foreground)">{t}</text>
              ))}
              {/* 게이트 라벨 */}
              <rect x={x + 4} y={yTop + stageH - 22} width={stageW - 8} height={16} rx={3}
                fill={s.color} fillOpacity={0.15} />
              <text x={x + stageW / 2} y={yTop + stageH - 11} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={s.color}>{s.risk}</text>
              {/* 화살표 */}
              {i < stages.length - 1 && (
                <g>
                  <line x1={x + stageW + 2} y1={yTop + stageH / 2} x2={x + stageW + gap - 2} y2={yTop + stageH / 2}
                    stroke="#94a3b8" strokeWidth={1.2} />
                  <polygon points={`${x + stageW + gap - 2},${yTop + stageH / 2} ${x + stageW + gap - 6},${yTop + stageH / 2 - 3} ${x + stageW + gap - 6},${yTop + stageH / 2 + 3}`}
                    fill="#94a3b8" />
                </g>
              )}
            </g>
          );
        })}

        {/* 회귀 화살표 (실패 시 롤백) */}
        <path d={`M ${W - gap - stageW / 2} ${yTop + stageH + 18} Q ${W / 2} ${H - 18}, ${gap + stageW / 2} ${yTop + stageH + 18}`}
          stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" fill="none" />
        <polygon points={`${gap + stageW / 2},${yTop + stageH + 18} ${gap + stageW / 2 + 5},${yTop + stageH + 14} ${gap + stageW / 2 + 5},${yTop + stageH + 22}`}
          fill="#ef4444" />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={9} fontStyle="italic"
          fill="#ef4444">실패 시 자동 롤백 (canary 메트릭 임계 초과 · prod 배포 후 smoke fail)</text>
      </svg>
    </div>
  );
}
