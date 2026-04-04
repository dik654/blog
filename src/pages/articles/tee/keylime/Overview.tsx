import ArchFlowViz from './viz/ArchFlowViz';

export default function Overview() {
  const components = [
    { name: 'Agent', color: '#10b981', desc: '검증 대상 시스템에서 실행. TPM과 직접 통신하여 Quote 생성, IMA 로그 수집, 페이로드 복호화를 수행.' },
    { name: 'Verifier', color: '#6366f1', desc: 'Tornado 기반 검증 서버. 등록된 Agent들의 TPM 상태를 주기적으로 검증하고 정책 위반 시 철회 처리.' },
    { name: 'Registrar', color: '#f59e0b', desc: 'TPM 공개키 데이터베이스. 모든 Agent의 EK/AIK 공개키를 저장하고 Verifier에 제공.' },
    { name: 'Tenant', color: '#8b5cf6', desc: 'CLI 관리 도구. 에이전트 프로비저닝, TPM/IMA 정책 설정, 암호화된 페이로드 전송을 담당.' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <p className="leading-7 mb-6">
        Keylime은 TPM(Trusted Platform Module) 기반 오픈소스 원격 증명 프레임워크입니다.<br />
        하드웨어 기반 신뢰 부트스트래핑으로 원격 머신의 무결성을 검증합니다.<br />
        암호화된 페이로드를 안전하게 배포합니다.<br />
        IMA(Integrity Measurement Architecture)와 통합하여 런타임 파일 무결성을 지속 모니터링합니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {components.map(c => (
          <div key={c.name} className="rounded-xl border p-4"
            style={{ borderColor: c.color + '40', background: c.color + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.name}</p>
            <p className="text-sm mt-2 text-foreground/80 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">컴포넌트 간 데이터 흐름</h3>
      <ArchFlowViz />
    </section>
  );
}
