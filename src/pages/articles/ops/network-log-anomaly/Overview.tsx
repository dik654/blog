import TrafficAnomalyViz from './viz/TrafficAnomalyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — 네트워크 로그에서 이상 신호 판별</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          네트워크 로그 이상 감지는 <strong>baseline 학습 + 편차 검출 + 맥락 평가</strong> 의 3 단계.
          <br />
          단순 임계 알람은 false positive 폭주. 평소 패턴 + 비즈니스 컨텍스트와의 비교가 핵심.
        </p>
      </div>

      <TrafficAnomalyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">이상 패턴 5 분류</h3>
        <ul className="leading-7">
          <li><strong>Volume spike</strong> — DDoS · flash crowd · 봇 트래픽. 짧은 시간 폭증.</li>
          <li><strong>Slow drain</strong> — Data exfiltration · cryptojacking. 오랜 기간 점진 증가.</li>
          <li><strong>Pattern shift</strong> — 프로토콜 / 포트 / 목적지 분포 변화. 새 악성 채널 의심.</li>
          <li><strong>Periodicity</strong> — beaconing C2 (예: 매 60s 정확히 외부 호출). 자동화 신호.</li>
          <li><strong>Geographic anomaly</strong> — 평소 안 가던 국가 / ASN 으로 connection.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>로그 종류와 수집</strong> — flow log · firewall · DNS · TLS handshake · proxy.</li>
          <li><strong>baseline 학습</strong> — 시계열 (Prophet · ARIMA) · 분포 (KS test) · ML (isolation forest).</li>
          <li><strong>signature 검출</strong> — 알려진 IoC (Indicator of Compromise) · TTPs · MITRE ATT&amp;CK.</li>
          <li><strong>실전 사고 패턴</strong> — DDoS · ransomware · 내부자 · supply chain · cryptojacking.</li>
          <li><strong>도구 스택</strong> — Suricata · Zeek · Falco · Wazuh · Splunk · Grafana.</li>
        </ol>
      </div>
    </section>
  );
}
