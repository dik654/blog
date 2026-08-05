export default function Patterns() {
  return (
    <section id="patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. 실전 사고 패턴 카탈로그</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. DDoS</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 1 초 또는 1 분 단위 packet rate 폭증. SYN flood (TCP), UDP amp (DNS · NTP · memcached), L7 HTTP flood.</li>
          <li><strong>원인 IP 분포</strong> — 정상 트래픽은 ISP 별 분산, DDoS 는 botnet 의 특정 ASN 집중 또는 spoofed source.</li>
          <li><strong>대응</strong> — Cloudflare / AWS Shield 같은 CDN scrub, BGP blackhole, anycast 분산.</li>
          <li><strong>식별 시간</strong> — 보통 1~5 분 내 (volume 기반). L7 flood 는 더 오래 (정상 패턴과 유사).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. Data Exfiltration (slow drain)</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 평소 outbound 의 5~10x 증가 + 새 외부 IP / 도메인. 수 시간 ~ 수 일에 걸쳐.</li>
          <li><strong>난독화 패턴</strong> — DNS tunneling (TXT / NULL record), HTTPS 위장, ICMP tunnel, encoded payload in image (steganography).</li>
          <li><strong>대응</strong> — DLP (Data Loss Prevention) 제품 + egress NetworkPolicy + 알 수 없는 외부 도메인 block.</li>
          <li><strong>식별 시간</strong> — 평균 207 일 (IBM 2024 보고서). 가장 늦게 발견되는 사고.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. Lateral Movement</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 평소 안 통신하던 내부 호스트 간 연결. SMB / RDP / SSH brute force.</li>
          <li><strong>K8s</strong> — 평소 namespace 격리되던 Pod 가 다른 namespace 의 Pod 와 통신.</li>
          <li><strong>대응</strong> — micro-segmentation (NetworkPolicy default-deny), Zero Trust 인증.</li>
          <li><strong>도구</strong> — Tetragon · Falco 의 process / network 결합 신호.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. C2 Beaconing (Command &amp; Control)</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 일정한 주기 (예: 매 60s ± 5s) 의 외부 connection. 사람 작업과 다른 정확한 timing.</li>
          <li><strong>jitter 분석</strong> — 진짜 사람 / 정상 자동화는 jitter 가 자연스러움. 봇은 너무 정확.</li>
          <li><strong>도메인 패턴</strong> — DGA (Domain Generation Algorithm) — 임의 문자열 도메인 매번 다른.</li>
          <li><strong>대응</strong> — Suricata rule + DNS filter (Pi-hole / Cloudflare for Family 같은 차단 list).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. Cryptojacking</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 마이닝 풀 IP 로 outbound (xmr.pool · 도메인 list 알려짐). CPU / GPU 사용률 평소 baseline 초과.</li>
          <li><strong>K8s containers</strong> — Pod CPU 100% + 알 수 없는 process 실행. Falco rule.</li>
          <li><strong>대응</strong> — 알려진 마이닝 풀 도메인 차단, runtime security 도구.</li>
          <li><strong>경제 영향</strong> — 클라우드 비용이 갑자기 5~10x → 청구서 알람도 보조 신호.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-6. Supply Chain Attack</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 정상 application 이 의외 endpoint 와 통신. 새 버전 배포 직후 outbound 패턴 변화.</li>
          <li><strong>케이스</strong> — Codecov bash uploader (2021), shai-hulud npm worm (2025), SolarWinds (2020).</li>
          <li><strong>대응</strong> — 빌드 시점 SBOM + 런타임 outbound 알람. 새 의존성 추가 시 stage 격리.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-7. Internal threat (내부자)</h3>
        <ul className="leading-7">
          <li><strong>로그 신호</strong> — 평소 안 접근하던 데이터 / 시스템 접근, 평소와 다른 시간대 (예: 새벽 4시), USB / 외부 드라이브 사용.</li>
          <li><strong>대응</strong> — UEBA (User Entity Behavior Analytics). 사용자별 baseline + 편차 검출.</li>
          <li><strong>윤리 / 법규</strong> — 직원 모니터링은 사전 동의 + 정책 명시 필요.</li>
        </ul>
      </div>
    </section>
  );
}
