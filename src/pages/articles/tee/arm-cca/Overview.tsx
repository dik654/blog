import ContextViz from './viz/ContextViz';
import FourWorldsViz from './viz/FourWorldsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCA 아키텍처 &amp; 4-World 모델</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">ARM CCA 등장 배경</h3>
        <p>
          <strong>ARM CCA</strong>(Confidential Compute Architecture): ARMv9-A 스펙(2021)의 일부<br />
          <strong>TrustZone</strong>의 2분법(Normal/Secure) 한계를 넘어 <strong>VM 단위 기밀 컴퓨팅</strong> 제공<br />
          <strong>첫 구현 실리콘</strong>: Arm Neoverse V3 / Cortex-X925 (2024) — 클라우드 + 모바일 대상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 TrustZone으론 부족한가</h3>
        <p>
          <strong>TrustZone(2003~)의 한계</strong>:
        </p>
        <ul>
          <li>Secure World는 1개 — OP-TEE 단독 점유</li>
          <li>여러 워크로드 격리 불가 (모든 TA가 같은 보안 영역)</li>
          <li>비대칭 구조 — Secure가 Normal 메모리 읽기 가능, 역방향 불가</li>
          <li>클라우드 멀티테넌트에 부적합</li>
        </ul>
        <p>
          <strong>CCA의 해결책</strong>: Realm이라는 <strong>동적 보안 영역</strong> 추가<br />
          Realm은 VM마다 독립 — 하이퍼바이저도 내부 접근 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-World 모델</h3>

        <FourWorldsViz />

        <p>
          <strong>NS(Non-Secure) + NSE(Non-Secure Extension) 비트 조합</strong>으로 4 세계 정의<br />
          각 World는 <strong>독립된 Physical Address Space(PAS)</strong> 보유<br />
          <strong>Monitor(EL3)</strong>만 World 전환 가능 — TF-A가 담당
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Exception Level과 매핑</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ARM 예외 레벨 (EL0=최하 · EL3=최상)

              Non-secure    Secure        Realm         Root
              ──────────    ──────────    ──────────    ────────
  EL3                                                    Monitor
                                                         (TF-A)
  EL2         Host Hyp      Secure Hyp    RMM            —
              (KVM, Xen)    (SPM)         (TF-RMM)
  EL1         Host Kernel   TEE OS        Realm OS       —
              (Linux)       (OP-TEE)      (Linux Guest)
  EL0         Apps          TAs           Realm Apps     —

// 핵심 신규 컴포넌트
// ┌───────────────────────────────────────────┐
// │  RMM(Realm Management Monitor, EL2 R)     │
// │  - Realm 생성/소멸                        │
// │  - Realm 페이지 테이블 관리               │
// │  - RMI/RSI 호출 처리                      │
// │  - Intel TDX Module의 ARM 버전            │
// └───────────────────────────────────────────┘`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">경쟁 기술 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Intel TDX</th>
                <th className="border border-border px-3 py-2 text-left">AMD SEV-SNP</th>
                <th className="border border-border px-3 py-2 text-left">ARM CCA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">격리 단위</td>
                <td className="border border-border px-3 py-2">TD (VM)</td>
                <td className="border border-border px-3 py-2">SNP-VM</td>
                <td className="border border-border px-3 py-2">Realm (VM)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">추가 TCB</td>
                <td className="border border-border px-3 py-2">TD Module (SEAM)</td>
                <td className="border border-border px-3 py-2">SEV Firmware (ASP)</td>
                <td className="border border-border px-3 py-2">RMM (EL2)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">메모리 보호</td>
                <td className="border border-border px-3 py-2">MKTME AES-XTS</td>
                <td className="border border-border px-3 py-2">RMP + per-VM key</td>
                <td className="border border-border px-3 py-2">GPT (no default encryption)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">무결성</td>
                <td className="border border-border px-3 py-2">1.5+ 28비트 MAC</td>
                <td className="border border-border px-3 py-2">RMP 필수</td>
                <td className="border border-border px-3 py-2">MEC(옵션)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">중첩 격리</td>
                <td className="border border-border px-3 py-2">TDX 1.5 Partitioning</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">Realm 내 planes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">도입</td>
                <td className="border border-border px-3 py-2">2022 (Sapphire Rapids)</td>
                <td className="border border-border px-3 py-2">2021 (Milan)</td>
                <td className="border border-border px-3 py-2">2024 (Neoverse V3)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCA의 핵심 컴포넌트</h3>
        <ul>
          <li><strong>RME (Realm Management Extension)</strong> — 하드웨어 확장. PAS·GPT·World 전환 로직</li>
          <li><strong>GPT (Granule Protection Table)</strong> — 물리 페이지별 World 소유권 기록</li>
          <li><strong>RMM (Realm Management Monitor)</strong> — EL2 펌웨어. Realm 라이프사이클 관리</li>
          <li><strong>RMI (Realm Management Interface)</strong> — Host → RMM 호출 규약</li>
          <li><strong>RSI (Realm Services Interface)</strong> — Realm Guest → RMM 호출 규약</li>
          <li><strong>CCA Attestation</strong> — Arm CCA Attestation Token (CoAP/EAT)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">TF-RMM — Arm 레퍼런스 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// github.com/TF-RMM/tf-rmm

// RMM은 EL2 Realm 펌웨어
// - 아키텍처 독립 (C로 구현)
// - Arm이 레퍼런스로 유지
// - 오픈소스 (BSD-3)

// 주요 모듈
lib/arch/     — ARM 아키텍처 인터페이스
lib/realm/    — Realm 데이터 구조
lib/rmm_el3_ifc/ — EL3(Monitor) 통신
plat/         — 플랫폼별 (fvp, arm)
runtime/      — 런타임 루프
  core/       — RMI 핸들러
  rsi/        — RSI 핸들러
  exit/       — Realm exit 처리`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCA의 철학 — Attestation First</p>
          <p>
            TDX/SEV-SNP가 "메모리 암호화 + 격리"에서 시작했다면<br />
            CCA는 "<strong>원격 검증 가능한 실행 환경</strong>"에서 시작
          </p>
          <p className="mt-2">
            <strong>증거</strong>:<br />
            - 메모리 암호화는 <strong>옵션</strong> (플랫폼 선택)<br />
            - RMM이 CCA Attestation Token 표준화<br />
            - CoAP/EAT(Entity Attestation Token) 기반 — IETF 표준
          </p>
          <p className="mt-2">
            <strong>이유</strong>:<br />
            - 모바일·IoT까지 대상 → 다양한 위협 모델<br />
            - 물리적 공격 우려 낮은 서버 vs 물리 접근 가능한 엣지 구분<br />
            - 증명 토큰 받으면 사용자가 정책 결정
          </p>
        </div>

      </div>
    </section>
  );
}
