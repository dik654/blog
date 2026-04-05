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
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">진화 동인 — 학술 공격이 촉발</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 주요 학술 공격 → 각 세대 등장 배경

// SEV 1.0의 취약점 (2018~2019)
// [SEVered] (Morbitzer et al. 2018)
//   - Hypervisor가 NPT(Nested Page Tables) 조작
//   - 암호문 블록을 다른 VM으로 재매핑
//   - 다른 VM이 복호화 시도 → 오작동 유도
//   → 레지스터 상태 보호 필요 인식

// SEV-ES의 취약점 (2020~2021)
// [CrossLine] (Li et al. 2021)
//   - VMSA(레지스터 저장 구조체) 재활용 공격
//   - 다른 VM의 레지스터 블록을 주입
// [Cipherleaks] (Li et al. 2021)
//   - ciphertext 패턴 분석으로 AES 평문 일부 복구
//   - 동일 키로 오래 암호화 시 누출
//   → 메모리 무결성·replay 방어 필수

// SEV-SNP의 대응 (2022~)
//   - RMP로 페이지 소유권 강제
//   - VMPL로 guest 내부 권한 분리
//   - Version nonce로 replay 방어
//   - 더 강력한 attestation (nonce 포함)`}</pre>

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
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">

        <h3 className="text-xl font-semibold mt-8 mb-3">SNP 이후 발전</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SNP 마이너 개선 (2023~2024)

// [Genoa 추가 기능]
// - ASID 확장: 509 → 1006
// - VMPL 개선: 4 levels → 더 세밀한 권한
// - MPK(Memory Protection Keys) 통합

// [Turin 추가 기능]
// - Ciphertext Hiding (CH): 암호문 패턴 누출 방어
// - XSAVES/XRSTORS 내장 보호
// - 성능 개선: VMCB 캐싱

// 향후 방향 (AMD 공개 로드맵)
// - FS-SEV(File System SEV): disk 암호화 통합
// - Multi-party attestation
// - Confidential compute for PCIe devices`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: AMD SEV의 개발 철학</p>
          <p>
            <strong>Intel SGX vs AMD SEV 접근법 차이</strong>:<br />
            - SGX: 작은 enclave 단위, high-assurance, 앱 재작성 필요<br />
            - SEV: 전체 VM 단위, 기존 앱 그대로 실행, medium-assurance
          </p>
          <p className="mt-2">
            <strong>SEV의 실용주의</strong>:<br />
            ✓ 기존 cloud 워크로드 즉시 마이그레이션 가능<br />
            ✓ Hypervisor 투명성 — QEMU/KVM만 minor patch<br />
            ✓ 성능 오버헤드 적음 (~5-10%)
          </p>
          <p className="mt-2">
            <strong>trade-off</strong>:<br />
            ✗ Guest OS가 TCB에 포함 → 공격 표면 큼<br />
            ✗ 학술 공격에 여러 번 노출 (SNP에서 대부분 해결)<br />
            ✗ AMD-specific — vendor lock-in
          </p>
        </div>

      </div>
    </section>
  );
}
