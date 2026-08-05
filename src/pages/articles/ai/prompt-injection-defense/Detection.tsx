export default function Detection() {
  return (
    <section id="detection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Detection — 자동 감지 + Red Team</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Layer 3 의 detection 을 더 깊이 살펴봄. 운영 maturity 의 차이가 가장 크게 드러나는 영역.
          rule-based + ML + human-in-the-loop + 정기 red team 의 결합.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Rule-based Detection — 1차 빠른 필터</h3>
        <p className="leading-7">
          간단한 정규식 + 키워드로 쉽게 잡히는 명백한 injection 시도. 정확도는 낮지만 false negative
          허용 영역 (보강 layer 라) 라 빠른 처리 가치.
        </p>

        <p className="leading-7">
          (1) <strong>Instruction override 키워드</strong> — "ignore previous", "disregard the",
          "new instructions", "system override", "developer mode". 다국어 변종 (한국어 "이전 명령
          무시", 일본어 등) 까지 cover.
        </p>

        <p className="leading-7">
          (2) <strong>Suspicious URL / 도메인</strong> — agent 의 출력 / tool call 인자에서 알려진
          악성 도메인, URL shortener, 짧은 IP 형태, sandbox 외 IP 의 검사.
        </p>

        <p className="leading-7">
          (3) <strong>Encoding 의심</strong> — 외부 데이터 안에 base64 / hex / URL-encoded 긴 문자열
          이 비정상적으로 많으면 hidden command 의심 신호.
        </p>

        <p className="leading-7">
          (4) <strong>Markdown image / link 패턴</strong> — exfiltration 의 흔한 vector.
          "![](evil.com/?leak=...)" 같은 패턴 + URL 의 query parameter 길이 검사.
        </p>

        <p className="leading-7">
          한계 명백 — 우회 쉬움 (한국어 / leetspeak / 신규 패턴), 새 공격은 못 잡음. 1차 필터로만
          신뢰, 단독 사용 X.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ML-based Detection — Classifier 와 LLM-as-judge</h3>
        <p className="leading-7">
          (1) <strong>Injection classifier</strong>. 작은 transformer (DeBERTa, BERT 류) 를
          injection 데이터셋으로 fine-tune. ProtectAI / Lakera 같은 회사가 제공하는 model 또는
          자체 학습. 입력 텍스트가 injection 인지 binary classification, threshold 로 차단.
        </p>
        <p className="leading-7">
          한계 — 학습 데이터에 없는 패턴 약함, false positive 도 있어 사용자 friction. 운영 측에서
          threshold tuning + 정기 retrain 부담.
        </p>

        <p className="leading-7">
          (2) <strong>LLM-as-judge</strong>. 큰 모델 (Claude, GPT-4) 에 "이 텍스트가 prompt
          injection 시도인지 평가" 요청. judge 자체가 injection 에 취약하다는 메타 위험 있어,
          judge 의 input / output 도 격리.
        </p>
        <p className="leading-7">
          비용 trade-off — 매 호출마다 judge LLM 추가 호출 = latency + cost 두 배. 모든 호출에
          적용 X, sensitive 영역 (외부 데이터가 들어가는 도구 결과) 만 적용.
        </p>

        <p className="leading-7">
          (3) <strong>Embedding-based anomaly</strong>. 외부 데이터의 임베딩 분포가 training corpus
          또는 정상 사용 baseline 과 크게 다른 경우 의심. 새 종류의 공격 발견 가능성, 다만 false
          positive 많음.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Behavioral Anomaly — UEBA + Step trace</h3>
        <p className="leading-7">
          개별 호출 검사보다 강력한 layer. Agent 의 행동 패턴 자체에서 deviation 감지.
        </p>

        <p className="leading-7">
          (1) <strong>Step pattern</strong>. 정상 task 의 step 수 / 도구 사용 분포 학습 후 outlier
          감지. "평소 5 step 으로 끝나는 task 가 50 step", "평소 read tool 만 쓰는 agent 가 write
          / network 도구 호출" 같은 패턴.
        </p>

        <p className="leading-7">
          (2) <strong>User behavior baseline</strong>. 사용자별 / 부서별 / 시간대별 평소 사용 패턴
          학습. 비정상 시간대, 비정상 데이터 접근, 비정상 도구 사용의 합성 score.
        </p>

        <p className="leading-7">
          (3) <strong>Cross-source correlation</strong>. SIEM 으로 endpoint + network + tool call
          + LLM provider 로그를 시간 축으로 묶어 "이 사용자의 이 시간대 활동" 통합 view. 단일
          source 에서 안 보이는 패턴 (DB scan + 외부 LLM 송신의 동반) 감지.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Honeypot / Canary — 가장 확실한 evidence</h3>
        <p className="leading-7">
          가짜 sensitive 데이터를 일부 환경에 박아두고 그것이 외부 또는 의도되지 않은 곳에 등장하면
          "injection 또는 exfiltration 성공했다" 의 직접 evidence.
        </p>

        <p className="leading-7">
          (1) <strong>Canary token</strong> — 고유 식별 가능한 가짜 customer record / 가짜 API
          token / 가짜 파일 경로. 외부에서 그 token 이 등장하면 alert.
        </p>

        <p className="leading-7">
          (2) <strong>Watermarked output</strong> — agent 의 출력에 invisible watermark (zero-width
          characters, 특정 단어 선택 패턴) 박고 외부 등장 monitor.
        </p>

        <p className="leading-7">
          (3) <strong>Honeypot data source</strong> — agent 가 fetch 할 수 있는 외부 source 에
          가짜 "민감해 보이는" 데이터 박아두고, 그것을 fetch 하는 행위 자체를 alert. 정상 task 가
          그 source 에 접근할 일 없으면 false positive 0.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Red Team — 정기 시뮬레이션</h3>
        <p className="leading-7">
          Detection 자체의 quality 검증. 새 공격 패턴이 계속 등장하므로 정기 (분기 / 반기) red team
          drill 로 방어 layer 의 회귀 detection.
        </p>

        <p className="leading-7">
          (1) <strong>외부 red team</strong> — 보안 vendor / 컨설턴트가 known + 새 패턴으로 시도.
          DEF CON 류 community engagement 가 base.
        </p>

        <p className="leading-7">
          (2) <strong>내부 red team</strong> — 보안팀이 의도적으로 injection 시도 후 detection 시간
          / 차단 시점 측정. MTTD (Mean Time to Detect) metric 추적.
        </p>

        <p className="leading-7">
          (3) <strong>자동 fuzzing</strong> — 알려진 injection corpus (PromptBench, garak, Lakera
          GandalfBench) 를 자동 fuzzer 로 돌려 매 deploy 마다 회귀 검증.
        </p>

        <p className="leading-7">
          (4) <strong>Bug bounty</strong> — 외부 연구자에게 보상. AI agent 자체에 bug bounty
          program 제공한 회사들의 사례 (Anthropic, OpenAI) 가 reference.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-6">
          <strong>운영 metric 4 가지</strong> — (a) MTTD prompt injection — 시도 → detection 시간,
          (b) False positive rate — 차단 중 정상 호출 비율, (c) Honeypot trigger rate — canary
          token 의 외부 등장, (d) Red team detection rate — drill 의 차단 / 통과 비율. 이
          metric 이 detection layer 의 maturity 를 정량 측정.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">금융권 환경의 특수 요구</h3>
        <p className="leading-7">
          카카오뱅크 같은 금융권의 추가 요건. (a) 사고 시 통지 의무 (개인정보보호법, 신용정보법)
          이라 MTTD 짧을수록 통지 시간 + 영향 범위 ↓. (b) 감독 당국 (KISA, 금융감독원) 의 정기
          점검에서 "AI 도구 보안 통제" 가 명시 항목으로 들어올 가능성 ↑. (c) Customer 영향
          직접이라 honeypot 류의 적극 layer 가 ROI 높음.
        </p>

        <p className="leading-7">
          ISMS-P 의 통제기준 위에 AI specific 추가 layer — prompt injection detection, agent
          behavior anomaly, AI 도구 supply chain (model weight, MCP server, prompt template) 의
          별도 track. 한국 금융권의 reference framework 가 만들어지고 있는 단계라 적극 contribute
          가치.
        </p>
      </div>
    </section>
  );
}
