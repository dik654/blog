export default function Evolution({ title }: { title?: string }) {
  const generations = [
    {
      name: 'SEV', year: '2016', proc: 'EPYC 7001 (Naples)',
      color: '#6366f1',
      features: ['게스트 VM 메모리 AES-128 암호화', 'VM별 고유 암호화 키', '하이퍼바이저로부터 메모리 기밀성 보호'],
      limits: ['레지스터 상태 보호 없음', 'CPU 상태(VMSA) 미암호화', '제한적 원격 증명'],
    },
    {
      name: 'SEV-ES', year: '2020', proc: 'EPYC 7002 (Rome) / 7003 (Milan)',
      color: '#0ea5e9',
      features: ['SEV 기능 전부 포함', 'CPU 레지스터 상태 암호화 (VMSA)', 'GHCB(Guest-Host Communication Block)로 안전한 VMEXIT 처리', '하이퍼바이저가 게스트 레지스터 접근 불가'],
      limits: ['메모리 무결성 검증 없음 (변조 탐지 불가)', '메모리 재매핑 공격 취약'],
    },
    {
      name: 'SEV-SNP', year: '2022', proc: 'EPYC 7003+ (Milan) / 9004 (Genoa) / 9005 (Turin)',
      color: '#10b981',
      features: ['SEV-ES 기능 전부 포함', 'RMP (Reverse Map Table) — 메모리 페이지 소유권 추적', 'VMPL (VM Permission Level 0-3) — 게스트 내부 권한 계층', '강력한 원격 증명 (SNP Report)', '메모리 재매핑·재배치 공격 방어', '측정 체인: 부트부터 런타임까지'],
      limits: ['Milan은 일부 모델만 지원', '이전 세대 대비 초기 셋업 복잡도 증가'],
    },
  ];

  return (
    <section id="evolution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '세대별 발전: SEV → SEV-ES → SEV-SNP'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p>
          AMD SEV는 3세대에 걸쳐 보안 범위를 단계적으로 확장했습니다.<br />
          각 세대는 이전 세대의 취약점을 보완하면서 새로운 기능을 추가합니다.
        </p>
      </div>
      <div className="not-prose space-y-4">
        {generations.map(g => (
          <div key={g.name} className="rounded-xl border p-5"
            style={{ borderColor: g.color + '30', background: g.color + '06' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-lg font-bold" style={{ color: g.color }}>{g.name}</span>
              <span className="text-sm text-foreground/50">{g.year} · {g.proc}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wide">기능</p>
                <ul className="space-y-1">
                  {g.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span style={{ color: g.color }} className="mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/40 mb-2 uppercase tracking-wide">한계</p>
                <ul className="space-y-1">
                  {g.limits.map(l => (
                    <li key={l} className="flex items-start gap-2 text-sm text-foreground/50">
                      <span className="mt-0.5 flex-shrink-0">–</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
