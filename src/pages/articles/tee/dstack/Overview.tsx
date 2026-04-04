import TrustFlowViz from './viz/TrustFlowViz';

export default function Overview({ title }: { title?: string }) {
  const components = [
    {
      name: 'VMM',
      color: '#6366f1',
      desc: 'QEMU/KVM 기반 VM 생명주기 관리. TDX 활성화, CID 풀 관리, Supervisor 통신.',
    },
    {
      name: 'Guest Agent',
      color: '#10b981',
      desc: 'VM 내부에서 실행. TDX Quote 요청, KMS 키 수령, 인증서 관리, 4개 RPC 서비스.',
    },
    {
      name: 'KMS',
      color: '#f59e0b',
      desc: '계층적 키 유도 (HKDF-SHA256). 디스크 암호화·환경변수 암호화·K256 앱 키 발급.',
    },
    {
      name: 'Gateway',
      color: '#8b5cf6',
      desc: 'TLS 역방향 프록시. RA-TLS로 Guest Agent 인증, 외부 트래픽 라우팅.',
    },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 아키텍처'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          dStack은 Intel TDX(Trust Domain Extensions) 기반 기밀 VM 인프라 스택입니다.<br />
          Phala Network에서 개발했으며, AMD SEV와 달리 <strong>Intel TDX</strong>를 기반으로 합니다.<br />
          개발자는 Docker Compose 파일만 제공하면 전체 신뢰 체인이 자동 구성됩니다.
        </p>

        <h3>설계 목표</h3>
        <ul>
          <li>일반 Docker 워크플로우와 동일한 UX로 기밀 VM 배포</li>
          <li>TDX Quote 기반 원격 증명 — VM 내부 코드 무결성 보장</li>
          <li>KMS를 통한 결정론적 키 유도 — 재시작 후에도 동일한 키</li>
          <li>RA-TLS(Remote Attestation TLS) — 네트워크 레벨 신뢰</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {components.map(c => (
          <div key={c.name} className="rounded-xl border p-4"
            style={{ borderColor: c.color + '40', background: c.color + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.name}</p>
            <p className="text-sm mt-2 text-foreground/80 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>AMD SEV vs Intel TDX</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-foreground/60 font-medium">항목</th>
                <th className="text-left py-2 px-3 text-foreground/60 font-medium">AMD SEV-SNP</th>
                <th className="text-left py-2 px-3 text-foreground/60 font-medium">Intel TDX</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['보호 단위', 'VM (ASID 기반)', 'TD (Trust Domain)'],
                ['메모리 암호화', 'AES-128 (SME)', 'AES-128 (TME-MK)'],
                ['증명 보고서', 'SNP AttestationReport', 'TDX Quote (ECDSA-P256)'],
                ['Event Log', '없음 (측정 체인)', 'RTMR + Event Log'],
                ['하이퍼바이저 신뢰', '불필요 (RMP)', 'SEAM 모듈 필요'],
              ].map(([item, sev, tdx]) => (
                <tr key={item} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-foreground/70">{item}</td>
                  <td className="py-2 px-3 text-foreground/80">{sev}</td>
                  <td className="py-2 px-3 text-foreground/80">{tdx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <TrustFlowViz />
      </div>
    </section>
  );
}
