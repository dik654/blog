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

      <h3 className="text-xl font-semibold mt-6 mb-3">Keylime이란</h3>
      <p className="leading-7 mb-4">
        <strong>Keylime</strong>: TPM 기반 오픈소스 원격 증명 프레임워크 (MIT 2015 시작)<br />
        <strong>CNCF Incubating</strong> 프로젝트 — 2022년 CNCF 채택<br />
        <strong>용도</strong>: 원격 머신 무결성 검증 + 암호화 페이로드 안전 배포<br />
        <strong>IMA 통합</strong>: 런타임 파일 무결성 지속 모니터링
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-3">왜 TPM 기반인가</h3>
      <div className="bg-muted p-4 rounded-lg mb-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// TPM (Trusted Platform Module) 특성
// - 별도 HW chip (discrete) 또는 firmware TPM
// - 전원 OFF 시에도 key 유지 (NV 저장소)
// - Measured Boot 지원 (PCR)
// - Quote 생성 (AIK 서명)

// Keylime의 가치
// - SGX/TDX 등 TEE 없는 머신도 원격 증명 가능
// - 기존 서버 그대로 활용 (TPM은 2015+ 거의 모든 서버)
// - 측정 부팅 → 런타임 감시 통합
// - 암호화 키 배포 자동화

// 대안 대비
// vs Intel SGX DCAP: TEE 없이 가능 (더 범용적)
// vs Grub/UEFI only: 런타임 감시 추가
// vs Tang/Clevis: dynamic policy, active monitoring`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">주요 구성요소</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {components.map(c => (
          <div key={c.name} className="rounded-xl border p-4"
            style={{ borderColor: c.color + '40', background: c.color + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.name}</p>
            <p className="text-sm mt-2 text-foreground/80 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3">컴포넌트 간 데이터 흐름</h3>
      <ArchFlowViz />

      <h3 className="text-xl font-semibold mt-8 mb-3">실전 배포 시나리오</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// 시나리오 1: Edge / IoT 디바이스 무결성
// - 원격지 서버 수백 대
// - 주기적 TPM quote로 상태 확인
// - 변조 감지 시 즉시 알림·격리

// 시나리오 2: K8s 노드 증명
// - 클러스터 node 신뢰성 검증
// - 악성 container 탐지 (IMA)
// - 암호 secret 자동 전달

// 시나리오 3: HPC 클러스터 보안
// - 계산 노드 TPM 검증
// - 민감 데이터 처리 전 integrity check
// - Job scheduler와 통합

// 시나리오 4: Confidential Computing + Keylime
// - SGX/TDX VM의 TPM + Keylime 보강
// - Runtime monitoring 추가
// - TEE 증명 + OS integrity 이중 보호`}</div>

      <h3 className="text-xl font-semibold mt-8 mb-3">Keylime 의존 스택</h3>
      <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono whitespace-pre overflow-x-auto">{`// 소프트웨어 요구사항

// Agent (target host)
// - Linux kernel 5.x+
// - TPM 2.0 HW 또는 firmware TPM
// - tpm2-tss (TPM Software Stack)
// - Python 3.8+ (또는 Rust agent)
// - IMA kernel config 활성화

// Verifier / Registrar
// - Python 3.8+
// - PostgreSQL or MySQL (DB)
// - Tornado web framework
// - Redis (optional, caching)

// Tenant (관리자 머신)
// - Python 3.8+ keylime package
// - 커맨드라인 도구

// 관련 표준
// - TCG TPM 2.0 specification
// - IETF RATS architecture
// - TCG TPM PC Client spec (PCR 할당)
// - Linux IMA/EVM framework`}</div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">인사이트: Keylime의 독특한 위치</p>
        <p className="text-sm">
          <strong>HW TEE가 아닌 TPM 기반</strong>:<br />
          - SGX/TDX/SEV와 다른 범주 (측정 부팅 → attestation)<br />
          - TPM은 측정만, 실행은 일반 CPU<br />
          - "Measured computing" vs "Confidential computing"
        </p>
        <p className="text-sm mt-2">
          <strong>Keylime만의 가치</strong>:<br />
          ✓ TEE 없는 레거시 서버도 원격 증명<br />
          ✓ 런타임 monitoring (IMA) — 한 번이 아닌 지속<br />
          ✓ 암호화 payload 배포 자동화<br />
          ✓ 풍부한 정책 표현력
        </p>
        <p className="text-sm mt-2">
          <strong>한계</strong>:<br />
          ✗ 메모리 기밀성 없음 (TEE 아님)<br />
          ✗ Root-compromised 시스템에서 우회 가능<br />
          ✗ TPM 성능 한계 (quote 초당 1~2회)<br />
          → TEE + Keylime 조합이 이상적
        </p>
      </div>
    </section>
  );
}
