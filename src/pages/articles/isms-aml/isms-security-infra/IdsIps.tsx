import IdsIpsViz from './viz/IdsIpsViz';
import IdsDetectionInline from './viz/IdsDetectionInline';
import FalsePositiveInline from './viz/FalsePositiveInline';

export default function IdsIps() {
  return (
    <section id="ids-ips" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IDS/IPS — 침입 탐지와 차단</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <IdsIpsViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">IDS와 IPS의 차이</h3>
        <p>
          IDS(Intrusion Detection System, 침입탐지시스템)는 네트워크 트래픽을 감시하여 공격을 <strong>탐지</strong>하고 관리자에게 알림을 보내는 장비.<br />
          IPS(Intrusion Prevention System, 침입방지시스템)는 탐지에서 한 걸음 더 나아가 공격 트래픽을 <strong>자동으로 차단</strong>하는 장비.<br />
          핵심 차이: IDS는 "탐지만", IPS는 "탐지 + 차단".
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">IDS (침입탐지)</th>
                <th className="text-left px-3 py-2 border-b border-border">IPS (침입방지)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">동작</td>
                <td className="px-3 py-1.5 border-b border-border/30">탐지 → 알림(Alert)</td>
                <td className="px-3 py-1.5 border-b border-border/30">탐지 → 차단(Block) + 알림</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">배치</td>
                <td className="px-3 py-1.5 border-b border-border/30">트래픽 복사본 분석 (미러링/SPAN 포트)</td>
                <td className="px-3 py-1.5 border-b border-border/30">트래픽 경로에 직접 배치 (인라인)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서비스 영향</td>
                <td className="px-3 py-1.5 border-b border-border/30">없음 — 장애 시에도 트래픽 흐름 유지</td>
                <td className="px-3 py-1.5 border-b border-border/30">있음 — 장애 시 트래픽 중단 가능 (바이패스 모드로 완화)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대응 속도</td>
                <td className="px-3 py-1.5 border-b border-border/30">느림 — 관리자가 알림 확인 후 수동 대응</td>
                <td className="px-3 py-1.5 border-b border-border/30">즉각 — 밀리초 단위 자동 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">적합 용도</td>
                <td className="px-3 py-1.5">모니터링, 포렌식 데이터 수집, 정책 튜닝 기간</td>
                <td className="px-3 py-1.5">실시간 공격 차단, 경계 방어</td>
              </tr>
            </tbody>
          </table>
        </div>

        <IdsDetectionInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">탐지 방식 3가지</h3>

        <p><strong>1. 시그니처 기반 탐지 (Signature-based)</strong></p>
        <p>
          알려진 공격 패턴을 데이터베이스(시그니처 DB)에 저장해두고, 트래픽과 패턴을 매칭하는 방식.<br />
          대표적 시그니처 규칙 형식은 Snort 규칙(Rule)으로, "특정 포트로 향하는 트래픽에서 특정 문자열이 포함되면 알림"과 같은 조건을 정의한다.
        </p>
        <ul>
          <li><strong>장점</strong> — 알려진 공격에 대해 높은 정확도. 오탐(False Positive, 정상을 공격으로 잘못 판단)이 적다</li>
          <li><strong>한계</strong> — 시그니처 DB에 없는 새로운 공격(제로데이)은 탐지 불가. DB를 최신 상태로 유지하는 것이 필수</li>
        </ul>

        <p className="mt-4"><strong>2. 이상행위 기반 탐지 (Anomaly-based)</strong></p>
        <p>
          정상 트래픽의 기준선(Baseline)을 학습한 뒤, 기준에서 크게 벗어나는 행위를 탐지하는 방식.<br />
          예: 평소 업무시간에 10Mbps인 트래픽이 새벽 3시에 갑자기 500Mbps로 급증하면 이상 징후로 판단.
        </p>
        <ul>
          <li><strong>장점</strong> — 알려지지 않은 공격(제로데이)도 탐지 가능. 내부자 위협이나 데이터 유출 시도에 효과적</li>
          <li><strong>한계</strong> — 오탐이 많다. 정상적인 업무 변동(이벤트 트래픽 급증 등)도 공격으로 오인할 수 있다. 학습 기간이 필요</li>
        </ul>

        <p className="mt-4"><strong>3. 프로토콜 분석 (Protocol Analysis)</strong></p>
        <p>
          각 프로토콜(HTTP, DNS, FTP 등)의 RFC 표준 사양을 기준으로, 비정상적 사용을 탐지하는 방식.<br />
          예: DNS 쿼리(Query)에 비정상적으로 긴 도메인명이 포함되면 DNS 터널링(데이터를 DNS 쿼리에 숨겨 유출하는 기법) 의심.
        </p>
        <ul>
          <li><strong>장점</strong> — 프로토콜 표준에서 벗어나는 공격을 체계적으로 탐지</li>
          <li><strong>한계</strong> — 암호화된 트래픽(HTTPS)은 내용 분석 불가. TLS 복호화 기능과 함께 사용해야 효과적</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">배치 위치: 인라인 vs 미러링</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">배치 방식</th>
                <th className="text-left px-3 py-2 border-b border-border">동작</th>
                <th className="text-left px-3 py-2 border-b border-border">장점</th>
                <th className="text-left px-3 py-2 border-b border-border">단점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">인라인 (Inline)</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 트래픽이 장비를 통과. 악성 트래픽 즉시 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">실시간 차단, 공격 즉각 중지</td>
                <td className="px-3 py-1.5 border-b border-border/30">장비 장애 시 네트워크 단절. 오탐이 곧 서비스 장애</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">미러링 (Mirroring)</td>
                <td className="px-3 py-1.5">스위치의 SPAN 포트에서 트래픽 복사본을 받아 분석</td>
                <td className="px-3 py-1.5">서비스 영향 없음, 포렌식 데이터 수집에 적합</td>
                <td className="px-3 py-1.5">차단 불가. 탐지 후 다른 장비(방화벽 등)에 차단 요청 필요</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          실무에서 자주 사용하는 전략: 초기 도입 시 미러링(IDS) 모드로 운영하며 시그니처를 튜닝한 뒤,
          오탐이 충분히 줄어들면 인라인(IPS) 모드로 전환.<br />
          장비 장애 대비로 IPS에 바이패스(Bypass) 기능을 설정 — 장비가 응답하지 않으면 트래픽을 그대로 통과시켜 서비스 중단을 방지.
        </p>

        <FalsePositiveInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">오탐(False Positive) 관리</h3>
        <p>
          오탐이란 정상 트래픽을 공격으로 잘못 판단하는 것. IPS에서 오탐은 곧 정상 서비스 차단을 의미하므로 치명적.<br />
          미탐(False Negative)은 실제 공격을 놓치는 것으로, 보안 사고로 직결된다.
        </p>
        <ul>
          <li><strong>초기 학습 기간</strong> — 도입 후 2~4주는 탐지만(IDS 모드) 운영하며 정상 트래픽 패턴을 파악</li>
          <li><strong>화이트리스트(White List)</strong> — 반복적으로 오탐이 발생하는 정상 트래픽 패턴은 예외 등록. 단, 예외가 너무 많아지면 보안 구멍이 되므로 주기적 재검토 필수</li>
          <li><strong>시그니처 튜닝</strong> — 시그니처의 민감도(Threshold, 기준값)를 환경에 맞게 조정. 너무 민감하면 오탐 증가, 너무 둔감하면 미탐 증가</li>
          <li><strong>커스텀 시그니처</strong> — 자사 서비스에 특화된 규칙 직접 작성. 범용 시그니처만으로는 커버되지 않는 공격 패턴 탐지</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">VASP 특화 탐지 규칙</h3>
        <p>
          가상자산사업자(VASP)는 일반적인 웹 서비스와 다른 고유한 공격 벡터가 존재.
          IDS/IPS에 다음과 같은 커스텀 규칙을 추가해야 한다:
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">탐지 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">시나리오</th>
                <th className="text-left px-3 py-2 border-b border-border">탐지 기준</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">비정상 API 호출</td>
                <td className="px-3 py-1.5 border-b border-border/30">출금 API에 대한 비정상적 대량 요청 — 자동화 도구에 의한 출금 시도</td>
                <td className="px-3 py-1.5 border-b border-border/30">동일 IP에서 출금 API 호출 N회/분 초과</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">크리덴셜 스터핑</td>
                <td className="px-3 py-1.5 border-b border-border/30">유출된 ID/PW 목록으로 대량 로그인 시도</td>
                <td className="px-3 py-1.5 border-b border-border/30">다수 계정에 대한 순차적 로그인 실패 (분산 IP 포함)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">내부 측면 이동</td>
                <td className="px-3 py-1.5 border-b border-border/30">하나의 서버 장악 후 내부망의 다른 서버로 확산 시도</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 서버 간 비표준 포트 스캔, SSH 브루트포스</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">DNS 터널링</td>
                <td className="px-3 py-1.5">DNS 쿼리를 이용한 데이터 유출</td>
                <td className="px-3 py-1.5">비정상 도메인 길이, 높은 DNS 쿼리 빈도, TXT 레코드 과다 요청</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} IDS와 IPS의 병행 운용</strong><br />
          경계에는 IPS를 인라인으로 배치하여 알려진 공격을 즉시 차단하고,
          내부망에는 IDS를 미러링으로 배치하여 내부 트래픽을 모니터링하는 것이 일반적 구성.
          IDS의 탐지 결과는 SIEM으로 전송하여 다른 로그와 상관분석에 활용한다.
          두 장비를 병행하면 "차단(IPS)"과 "가시성 확보(IDS)"를 동시에 달성할 수 있다.
        </p>

      </div>
    </section>
  );
}
