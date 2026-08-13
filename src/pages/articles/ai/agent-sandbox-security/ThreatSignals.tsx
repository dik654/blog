const signals = [
  {
    signal: "/etc/passwd 읽기",
    direct: "container 내부 사용자·UID 정보 노출",
    escalation: "path traversal·filesystem 정찰과 함께 반복되는지 확인",
    verdict: "단독 영향은 낮지만 조사할 신호",
  },
  {
    signal: "내부 IP·port scan",
    direct: "reachable service 목록 추정",
    escalation: "인증 없는 service, SSRF, 보유 token과 결합되는지 확인",
    verdict: "정찰 신호이며 도달 가능한 capability가 위험을 결정",
  },
  {
    signal: "metadata endpoint 요청",
    direct: "cloud identity material 접근 시도",
    escalation: "획득한 token의 API 권한과 외부 전송 경로 확인",
    verdict: "credential→control plane으로 이어지는 고위험 경로",
  },
  {
    signal: "container UID 0",
    direct: "container 안의 넓은 파일·process 권한",
    escalation: "host mount·과도한 capability·kernel/runtime 취약점 확인",
    verdict: "즉시 host root는 아니지만 escape 시 blast radius를 키움",
  },
] as const;

export default function ThreatSignals() {
  return (
    <section id="threat-signals" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">신호와 실제 영향을 분리한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          “그 행위 자체가 사고인가?”와 “더 큰 공격의 앞 단계인가?”를 나눠야
          한다. 낮은 직접 영향도 무시하라는 뜻은 아니다. 같은 session의 tool
          trace, network flow, credential 사용과 묶어 경로가 완성되는지를 본다.
        </p>
        <div
          data-viz="agent-threat-signal-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[9rem_1fr_1.25fr_1fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>관찰 신호</span><span>직접 영향</span><span>다음 확인</span><span>판정</span>
          </div>
          <div className="divide-y divide-border/70">
            {signals.map((item) => (
              <article key={item.signal} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[9rem_1fr_1.25fr_1fr] md:gap-4">
                {[
                  ["관찰 신호", item.signal, "font-semibold"],
                  ["직접 영향", item.direct, "text-muted-foreground"],
                  ["다음 확인", item.escalation, "text-muted-foreground"],
                  ["판정", item.verdict, ""],
                ].map(([label, value, tone]) => (
                  <div key={label} className="min-w-0">
                    <span className="text-[11px] font-semibold text-muted-foreground md:hidden">{label}</span>
                    <p className={`break-words text-sm leading-6 ${tone}`}>{value}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
        <h3 id="container-root-boundary" className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold">
          container root와 host root는 같지 않지만 숫자 UID는 중요하다
        </h3>
        <p className="leading-7">
          namespace·capability·seccomp·LSM은 user namespace가 없어도 container의
          UID 0을 제한한다. 따라서 “root container면 이미 host root”는 틀리다.
          다만 user namespace로 ID를 재매핑하지 않은 UID 0은 host mount나 escape
          취약점과 결합될 때 피해를 키운다. <code>runAsNonRoot</code>는 이 결합
          위험을 줄이는 기본선이지 runtime isolation의 대체재가 아니다.
        </p>
      </div>
    </section>
  );
}
