import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">사이드채널 공격이란</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">사이드채널의 본질</h3>
        <p>
          <strong>사이드채널(Side-Channel)</strong>: 암호문이 아닌 <strong>부수적 정보</strong>로 비밀 유추<br />
          <strong>부수 정보</strong>: 실행 시간, 캐시 hit/miss, 전력 소비, EM 방사, 메모리 접근 패턴<br />
          <strong>TEE의 한계</strong>: 메모리 암호화만으로는 방어 불가 — 실행 흐름 자체가 누출<br />
          <strong>위협 특성</strong>: 원격 공격 가능, 하드웨어 손상 없이 진행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">공격 카테고리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">관찰 대상</th>
                <th className="border border-border px-3 py-2 text-left">원격 가능?</th>
                <th className="border border-border px-3 py-2 text-left">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Timing</td>
                <td className="border border-border px-3 py-2">실행 시간</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">RSA timing, compare early-exit</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cache</td>
                <td className="border border-border px-3 py-2">캐시 상태</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">Prime+Probe, Flush+Reload</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Transient</td>
                <td className="border border-border px-3 py-2">투기 실행 잔재</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">Spectre, Meltdown, MDS</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Power</td>
                <td className="border border-border px-3 py-2">전력 소비</td>
                <td className="border border-border px-3 py-2">부분</td>
                <td className="border border-border px-3 py-2">DPA, PLATYPUS (RAPL)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Electromagnetic</td>
                <td className="border border-border px-3 py-2">EM 방사</td>
                <td className="border border-border px-3 py-2">No (물리)</td>
                <td className="border border-border px-3 py-2">SEMA, DEMA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Controlled-channel</td>
                <td className="border border-border px-3 py-2">페이지 fault 시퀀스</td>
                <td className="border border-border px-3 py-2">Host 권한 필요</td>
                <td className="border border-border px-3 py-2">Page-fault SGX attacks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 TEE가 사이드채널에 특히 취약한가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TEE의 신뢰 경계 특성

// 전통 VM 격리 (Hypervisor 신뢰)
// ┌─────────────────────────────┐
// │  VM_A            VM_B        │
// │                              │
// │    각 VM은 Hypervisor 신뢰   │
// │    Hypervisor가 side channel │
// │    완화 책임                 │
// └─────────────────────────────┘

// TEE 격리 (Hypervisor 불신)
// ┌─────────────────────────────┐
// │  TEE App                     │
// │  ─────────────               │
// │  Hypervisor (untrusted)      │
// │  Host OS (untrusted)         │
// │                              │
// │  공격자가 동일 CPU에서       │
// │  코드 실행 가능              │
// │  → LLC 공유, SMT 공유        │
// │  → side channel 거리 최소    │
// └─────────────────────────────┘

// TEE에서 공격자 능력
// ✓ Co-located 다른 VM 실행
// ✓ Hypervisor 레벨 명령 (context switch, IPI)
// ✓ 하드웨어 카운터 측정 (PMC)
// ✓ 무제한 실행 시간 (공격 반복)
// ✗ TEE 메모리 직접 읽기 (암호화됨)

// → Side channel이 유일한 관측 경로
// → 방어 난이도 극상`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 영향 — TEE별 타격</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX에 대한 공격 (시대순)

// 2017: Cache timing — 초기 SGX 공격
//   - Prime+Probe로 LLC line eviction 측정
//   - AES 키 복구 (수분 내)

// 2018: Foreshadow (L1TF)
//   - L1 cache 잔재로 EPC 페이지 평문 읽기
//   - 전체 enclave 데이터 유출
//   - Microcode 패치로 해결 (L1D flush)

// 2019: Plundervolt
//   - Voltage glitching으로 enclave 명령 오작동 유도
//   - RSA 서명 forge
//   - Undervolt MSR 잠금으로 해결

// 2020: SGAxe, CrossTalk
//   - Attestation key 탈취
//   - Intel SGX 재인증 필요

// 2022: ÆPIC Leak
//   - APIC MMIO register 누출
//   - Microcode 업데이트

// 2023: Downfall (GDS)
//   - GATHER 투기 실행 누출
//   - Microcode mitigation + AVX2 gather disable

// 공통 교훈
// - 새 공격 발견마다 TCB 업데이트
// - Attestation에 패치 상태 강제 반영
// - SW-only 완화 한계 명확`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TEE 위협 모델의 현실</p>
          <p>
            <strong>공식 위협 모델</strong>: 대부분 TEE 벤더가 "사이드채널은 범위 밖" 선언<br />
            Intel SGX: "physical attacks and side channels are out of scope"<br />
            AMD SEV: "not designed to defend against side channels"
          </p>
          <p className="mt-2">
            <strong>현실</strong>:<br />
            - 학계가 지속적으로 새 공격 발표<br />
            - 벤더가 case-by-case로 패치<br />
            - 완화 vs 방어 차이 큼
          </p>
          <p className="mt-2">
            <strong>실무 접근</strong>:<br />
            - Defense-in-depth: TEE + 앱 레벨 hardening<br />
            - Constant-time crypto 필수<br />
            - Oblivious algorithms 검토<br />
            - SMT 비활성화 (데이터센터)<br />
            - TCB 패치 주기적 적용
          </p>
        </div>

      </div>
    </section>
  );
}
