export default function Detection() {
  return (
    <section id="detection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. 로그 수집과 baseline 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. 수집할 네트워크 로그 종류</h3>
        <ul className="leading-7">
          <li><strong>NetFlow / IPFIX / sFlow</strong> — packet header 메타 (src/dst IP, port, byte count). 전체 packet capture 보다 가벼움.</li>
          <li><strong>Firewall log</strong> — accept / deny 결정. iptables · nftables · pfsense · 클라우드 NSG.</li>
          <li><strong>DNS query log</strong> — 어느 도메인에 누가 질의했는가. C2 도메인 검출에 핵심.</li>
          <li><strong>TLS handshake</strong> — JA3 / JA4 fingerprint. 봇 / 자동화 도구 식별.</li>
          <li><strong>HTTP proxy log</strong> — URL · user-agent · response code · byte. application 레벨 가시성.</li>
          <li><strong>K8s NetworkPolicy log</strong> — Pod 간 통신 시도 / 차단. cilium hubble.</li>
          <li><strong>cloud VPC flow log</strong> — AWS · GCP · Azure 표준. 5-tuple + 결과.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. Baseline 학습 — 평소를 알아야 비정상을 알 수 있다</h3>
        <ul className="leading-7">
          <li><strong>시계열</strong> — Prophet (Facebook) · ARIMA · Holt-Winters. 매시간 / 매일 / 매주 패턴 학습.</li>
          <li><strong>분포 비교</strong> — Kolmogorov-Smirnov test · Chi-square. 같은 시간대의 이번주 vs 옛주 분포 차이.</li>
          <li><strong>ML 기반 anomaly</strong> — Isolation Forest · LOF (Local Outlier Factor) · Autoencoder reconstruction error.</li>
          <li><strong>학습 기간</strong> — 최소 4 주 (계절성 잡기). 신 환경은 작게 시작 + iterate.</li>
          <li><strong>holiday / 이벤트</strong> — 한국의 명절 · 블랙프라이데이 같은 특수 기간 미리 표시 → false positive 방지.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. 임계값 설정</h3>
        <ul className="leading-7">
          <li><strong>fixed threshold</strong> — &quot;1초당 100MB 초과&quot;. 단순, false positive ↑.</li>
          <li><strong>relative</strong> — baseline 대비 3σ 초과. 계절성 일부 흡수.</li>
          <li><strong>change-point detection</strong> — 갑작스런 평균 / 분산 변화. CUSUM · Bayesian.</li>
          <li><strong>multi-signal</strong> — 단일 메트릭 X, 여러 신호 동시 비정상이면 alert.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. Signature 기반 검출 (IoC)</h3>
        <ul className="leading-7">
          <li><strong>IP / 도메인 blocklist</strong> — Spamhaus · AbuseIPDB · 커뮤니티 IoC feed.</li>
          <li><strong>JA3 / JA4 fingerprint</strong> — TLS handshake 의 client 특성. 같은 봇은 같은 fingerprint.</li>
          <li><strong>YARA rules</strong> — payload 패턴. malware family 식별.</li>
          <li><strong>Suricata / Snort rules</strong> — 알려진 exploit / C2 통신 패턴.</li>
          <li><strong>MITRE ATT&amp;CK</strong> — 공격 단계별 매핑 (Initial Access · Persistence · C2 · Exfiltration).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-5. False positive 줄이기</h3>
        <ul className="leading-7">
          <li><strong>피드백 루프</strong> — 분석가가 alert 분류 → ML 모델 재학습. 정밀도 점진 향상.</li>
          <li><strong>화이트리스트</strong> — 알려진 정상 (CDN · 외부 서비스) 자동 제외.</li>
          <li><strong>multi-stage alert</strong> — 단일 신호 = WARN, 다중 신호 = PAGE.</li>
          <li><strong>contextual scoring</strong> — 사용자 / 디바이스 평판 + 행동 점수 합산. 한 신호 가중치.</li>
        </ul>
      </div>
    </section>
  );
}
