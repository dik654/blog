import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import SymptomCauseViz from "./linux-sre-metrics-slo-safe-change/viz/SymptomCauseViz";
import StagedRolloutViz from "./linux-sre-metrics-slo-safe-change/viz/StagedRolloutViz";
import { codeRefs } from "./linux-sre-metrics-slo-safe-change/codeRefs";
import { linuxSreTrees } from "./linux-sre-metrics-slo-safe-change/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxSreMetricsSloSafeChangeArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 수만 대 서버가 왜 같은 06:00 UTC에 한꺼번에 네트워크를 잃었나요?</h2>
          <div className={prose}>
            <p>
              2023년 3월 8일 06:00 UTC, Datadog의 다섯 지역·세 클라우드에 흩어진 Ubuntu 22.04 노드들이 한 시간 안에 차례로 네트워크를 잃었습니다. 지역 사이에는 아무 연결도 없었는데 전체 인스턴스의 60% 이상이 같은 시간대에 끊겼고, 복구에 하루 넘게 걸렸습니다.
            </p>
            <p>
              방아쇠는 systemd 보안 패치 하나였지만, 같은 시각에 모두 적용된 이유는 패치가 아니라 모든 노드에 기본으로 켜져 있던 apt-daily-upgrade.timer의 "06:00 + 최대 60분"이었습니다.
            </p>
            <p>
              답을 먼저 적겠습니다. 서버를 SRE 관점으로 운영한다는 것은 세 가지를 뜻합니다. 첫째, 호출(page)은 사용자가 겪는 증상 지표가 SLO를 깎는 속도에 걸며, CPU·디스크 같은 원인 지표는 "왜"를 찾는 대시보드에 둡니다. 둘째, 모든 변경은 한 경로로만, 비교 대상(control)을 남기며 단계적으로 넣되, 그 경로 밖에서 바뀐 것(drift)을 찾아냅니다.
            </p>
            <p>
              셋째, 반복 수작업(toil)을 각 사람 시간의 50% 아래로 묶고 남는 시간을 그 자동화에 씁니다.
            </p>
            <p>
              Datadog 사건은 둘째 원칙의 반례였습니다. 코드·설정·패치는 지역별·클러스터별·노드별로 일주일에서 한 달씩 재우며 넣는 조직이었는데, 노드 안의 타이머라는 두 번째 변경 경로가 그 절차를 우회해 전 지역을 한 시간에 바꿨습니다. 그 변경 경로가 systemd-networkd를 재시작했을 때 Cilium의 라우팅 규칙이 지워진 커널 쪽 사정은{" "} <a href="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd 글</a>에서 끝까지 따라갔습니다.
            </p>
            <p>
              이 글은 그 앞단, 곧 "왜 모두 같은 시각이었고 어떻게 막는가"를 SRE 원칙으로 일반화합니다. SLI·SLO·오류 예산의 정의와 다중 창 소진율 경보 표는 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">Kubernetes SRE 글</a>이 Google SRE 책 원문으로 다룹니다. 이 글은 그 정의를 서버 한 층 아래에서 씁니다. 서버 지표 가운데 무엇이 SLI가 되고 무엇이 대시보드에 남는지, OS 변경을 어떻게 넣는지, 서버 운영의 어떤 일이 toil인지입니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 관측·변경·노동, 세 고리가 한 서버 운영을 이룹니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 SRE식 서버 운영은 세 고리입니다. 관측 고리는 지표를 두 묶음으로 나눕니다. 사용자가 겪는 것(성공률·지연)을 SLI로 삼아 SLO 목표를 두고 그 목표가 깎이는 속도로
              호출합니다. 서버가 보여 주는 것(사용률·포화·오류)은 호출된 사람이 원인을 좁히는 대시보드가 됩니다. 어느 지표가 어느 묶음인지는 층마다 다릅니다.
            </p>
            <p>
              변경 고리는 서버에 들어가는 모든 바뀜(패키지·설정·커널·이미지)을 한 파이프라인으로 모읍니다. 파이프라인은 작은 비율부터 넣고 바뀐 쪽(canary)과 안 바뀐 쪽(control)의 지표를
              비교해 다음 단계로 갈지 정합니다. 그리고 파이프라인 밖에서 바뀐 서버가 없는지, 원하는 상태와 실제 상태를 주기적으로 맞춰 봅니다.
            </p>
            <p>
              노동 고리는 사람이 하는 일을 셉니다. 손으로 반복하고, 자동화할 수 있고, 끝나도 서비스가 나아지지 않고, 서버 수에 비례해 늘어나는 일이 toil입니다. 이것을 측정해 상한을 두고,
              남는 시간으로 자동화를 만듭니다. 그런데 자동화 자체도 변경이라 변경 고리를 통과해야 합니다. unattended-upgrades는 패치라는 toil을 없앤 자동화였지만 문(gate) 없이 돌아
              사고가 됐습니다.
            </p>
            <p>
              이 글은 세 고리를 (가정) 서버 100대 위의 API 하나와 Datadog의 실제 타임라인으로 따라갑니다. 각 서버 지표가 커널의 어느 파일에서 오는지는{" "}
              <a href="/cs/cloud/linux-observability-proc-psi-perf-ebpf#overview">서버를 관측하는 도구</a>가, 호출 뒤의 첫 60초 진단은{" "}
              <a href="/cs/cloud/linux-server-interview-incident-map#picture">면접·장애 지도</a>가 맡습니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 30일 99.9%의 예산은 43.2분이고, 노드 하나의 40분 장애가 그중 1.4%를 썼습니다</h2>
          <div className={prose}>
            <p>
              (가정) 서버 100대 위에서 초당 1,000 요청을 받는 API가 있습니다. SLI는 "성공한 요청 ÷ 전체 요청"이고 SLO는 30일 동안 99.9%입니다. 허용되는 실패는 0.1%입니다. 이것을
              시간으로 바꾸면 30 × 24 × 60 × 0.001 = 43.2분입니다. 한 달 동안 서비스가 완전히 멈춰도 되는 시간이 43.2분이라는 뜻이고, 이 몫을 오류 예산(error budget)이라고 부릅니다.
            </p>
            <p>
              어느 날 한 노드의 로그 디스크가 가득 차서 그 노드의 앱이 40분 동안 재시작을 반복했습니다. 100대 중 1대라 요청의 1%가 그 노드로 갔고, 그 요청은 절반쯤 실패했다고 합시다. 전체
              성공률은 98.5%, 오류율 1.5%입니다. 허용 오류율 0.1%의 15배이므로 소진율(burn rate)은 15입니다. 이 속도가 1시간 이어지면 예산의 15 × 1 ÷ 720 = 2.08%가 사라집니다. 40분
              이었으니 1.39%입니다.
            </p>
            <p>
              이 계산이 호출 기준을 줍니다. Google SRE workbook의 권장 표는 1시간 창에서 소진율 14.4(예산의 2%)를 호출 임계로 둡니다. 15는 그 위라 호출이 울립니다. 반대로 같은 디스크가
              94%까지 찼을 뿐 아직 아무 요청도 실패하지 않은 T+5분에는 성공률이 그대로라 호출이 울리지 않습니다. 그 시점에 울려야 할 것은 "4시간 뒤 가득 찬다"는 예측을 담은 ticket입니다.
            </p>
          </div>
          <figure className="not-prose my-6">
            <svg viewBox="0 0 480 120" className="h-auto w-full" role="img" aria-label="허용 오류율 0.1%와 장애 중 오류율 1.5%의 길이 비교, 그리고 43.2분 예산 가운데 0.6분 소진">
              <text x="0" y="12" fontSize="10" fontWeight="700" className="fill-foreground">소진율 = 장애 중 오류율 ÷ 허용 오류율</text>
              <rect x="0" y="18" width="30" height="12" rx="2" fill="#16a34a" />
              <text x="36" y="28" fontSize="9" className="fill-foreground">허용 0.1%</text>
              <rect x="0" y="34" width="450" height="12" rx="2" fill="#dc2626" />
              <text x="0" y="58" fontSize="9" fill="#dc2626" fontWeight="700">장애 중 1.5% = 허용의 15배 → 소진율 15</text>
              <text x="0" y="80" fontSize="10" fontWeight="700" className="fill-foreground">30일 예산 43.2분 = 2,592,000건</text>
              <rect x="0" y="86" width="480" height="20" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              <rect x="0" y="86" width="6.7" height="20" rx="1" fill="#dc2626" />
              <text x="12" y="100" fontSize="9" fill="#dc2626" fontWeight="700">40분 × 15 ÷ 43,200분 = 1.39% (0.6분, 36,000건)</text>
              <text x="478" y="100" fontSize="9" textAnchor="end" className="fill-muted-foreground">남은 98.61%</text>
            </svg>
            <figcaption className="mt-2 text-xs text-muted-foreground">위 두 막대의 길이 비가 소진율 15입니다. 아래 막대는 한 달 예산 전체이고 빨간 조각이 40분 장애가 쓴 1.39%입니다. 같은 조각이 70개 모이면 막대가 끝납니다.</figcaption>
          </figure>
          <CalculationWalkthrough
            title="오류 예산 43.2분과 40분 장애의 소진"
            question="30일 SLO 99.9%인 API에서 한 노드의 40분 장애가 예산의 몇 %를 쓸까요?"
            scope="초당 1,000 요청, 서버 100대, 장애 노드 1대의 요청 절반 실패로 가정합니다. 소진율 정의는 SRE workbook 5장(오류율 ÷ 허용 오류율)을 따릅니다."
            steps={[
              { label: "허용 오류율", expression: "1 − 0.999", result: "0.1%", reason: "SLO의 나머지가 예산입니다." },
              { label: "예산을 시간으로", expression: "30 × 24 × 60 × 0.001", result: "43.2분", reason: "완전 중단으로 환산한 한 달 허용 시간입니다. 요청 수로는 2,592,000,000 × 0.001 = 2,592,000건입니다." },
              { label: "장애 중 오류율", expression: "1% 노드 × 50% 실패 + 99% × 1% 평소 오류", result: "1.5%", reason: "장애 노드가 0.5%를 더하고, 평소 오류율 1%(가정)가 깔려 있습니다." },
              { label: "소진율", expression: "1.5% ÷ 0.1%", result: "15", reason: "허용 속도의 15배로 예산을 씁니다. workbook의 1시간 창 호출 임계 14.4를 넘습니다." },
              { label: "40분 동안 쓴 예산", expression: "15 × (40 ÷ 60) ÷ 720", result: "1.39%", reason: "소진율 × 창 길이 ÷ SLO 기간(720시간). 요청 수로는 40 × 60 × 1,000 × 1.5% = 36,000건 = 2,592,000의 1.39%입니다." },
            ]}
            conclusion="40분짜리 한 노드 장애가 한 달 예산의 1.4%를 썼습니다. 같은 일이 한 달에 70번 나면 예산이 바닥나므로, 호출은 이 속도(소진율)에 걸고 디스크 사용률 94%는 ticket으로 보냅니다."
            caveats={["평소 오류율 1%는 설명을 위해 높게 잡았습니다. 평소 오류율이 예산의 상당 부분을 늘 쓰고 있다면 SLO 자체를 다시 봐야 합니다.", "요청 기반 SLI는 트래픽이 적은 새벽에 몇 건의 실패로도 소진율이 튑니다. workbook은 저트래픽 서비스에 최소 요청 수 조건이나 합성 트래픽을 권합니다."]}
          />
        </section>

        <section id="symptom-cause" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 디스크 94%는 호출하지 않고, 성공률 98.5%는 호출합니다</h2>
          <div className={prose}>
            <p>
              3절의 장애를 시간순으로 다시 봅니다. T+5분에 한 노드의 디스크가 94%입니다. 사용자는 아무것도 느끼지 못합니다. T+40분에 디스크가 100%가 되고 앱이 로그를 못 써 죽기 시작하자
              성공률이 98.5%로 떨어집니다. 이때 호출이 울리며, 호출받은 사람은 원인 대시보드에서 디스크와 재시작 수가 빨간 것을 보고 디스크 글의 진단으로 갑니다.
            </p>
            <p>
              Google SRE 책 6장은 이 구분을 "무엇이 고장 났는가(what)와 왜(why)"로 적습니다. what이 증상이고 why가 원인입니다. 호출을 증상에 거는 이유는 둘입니다. 원인 지표는 사용자 영향
              없이도 움직이므로 거기 걸면 새벽에 사람을 깨우고도 할 일이 "지켜보기"뿐인 경보가 쌓이고, 경보가 잦아지면 사람이 경보를 건너뛰기 시작합니다. 그리고 원인은 여럿이라 다 열거할 수 없지만
              증상은 사용자가 겪는 몇 가지로 좁혀집니다.
            </p>
            <p>
              같은 장이 사용자 쪽 지표로 네 가지를 꼽습니다. 지연·트래픽·오류·포화, 이른바 golden signal입니다. 지연은 성공한 요청과 실패한 요청을 나눠 재야 하는데, DB 연결이 끊겨 즉시 돌아온
              500은 아주 빠르기 때문에 섞어 재면 평균이 좋아 보입니다. 포화는 "지금 트래픽의 두 배를 받을 수 있는가"라는 질문이고, 서버 쪽 USE의 포화와 이름이 같지만 층이 다릅니다.
            </p>
            <p>
              층이 다르다는 점이 마지막 열쇠입니다. 이 서비스 팀에게 "노드 디스크 100%"는 원인이지만, 노드를 제공하는 플랫폼 팀에게는 그것이 자기 사용자가 겪는 증상입니다. 책은 이것을 "한 사람의
              증상은 다른 사람의 원인"이라고 적습니다. 그래서 같은 서버 지표라도 어느 팀의 SLI가 될지는 그 팀의 사용자가 누구인지로 정합니다.
            </p>
          </div>
          <SymptomCauseViz />
          <div id="paper-sre-monitoring" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google · Site Reliability Engineering · Chapter 6 Monitoring Distributed Systems (sre.google, 2026-10-17 확인)" citeKey={1} href="https://sre.google/sre-book/monitoring-distributed-systems/">
              <q>The four golden signals of monitoring are latency, traffic, errors, and saturation.</q> 같은 장은 "what's broken"이 증상이고 "why"가 원인이라고 적고, 증상을 잡는 데 원인보다 훨씬 많은 노력을 들이되 원인은 "매우 확실하고 매우 임박한" 것만 신경 쓰라고 권합니다. 다층 시스템에서는 한 사람의 증상이 다른 사람의 원인이 된다는 문장도 이 장에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 증상 쪽은 SLI와 소진율, 변경 쪽은 canary와 drift, 노동 쪽은 toil입니다</h2>
          <div className={prose}>
            <p>
              앞 절들의 말에 표준 이름을 붙입니다. 서비스 수준을 수치로 잰 것이 SLI(service level indicator), 그 SLI의 목표가 SLO(objective), SLO를 어겼을 때의 결과를 적은 계약이
              SLA(agreement)입니다. 1 − SLO가 오류 예산이고, 지금 오류율을 허용 오류율로 나눈 배수가 소진율입니다. 소진율에 긴 창과 짧은 창을 함께 거는 다중 창 경보는 Kubernetes SRE
              글이 표로 다룹니다.
            </p>
            <p>
              변경 쪽에서는 바뀐 일부를 canary라고 부릅니다. 안 바뀐 나머지는 control입니다. SRE workbook 16장은 canarying을 "변경의 부분적이고 시간 제한된 배포와 그 평가"로 정의합니다.
              평가가 들어 있다는 점이 중요합니다. 일부에만 배포하고 보지 않으면 그것은 느린 배포이지 canary가 아닙니다. 평가를 통과해야 다음 비율로 넓어지는 지점이 문(gate)이고, 단계 사이에
              기다리는 시간이 bake입니다.
            </p>
            <p>
              서버의 "원하는 상태"(어떤 패키지 버전, 어떤 설정 파일)와 "실제 상태"가 어긋난 것을 configuration drift라고 합니다. drift는 보통 파이프라인 밖의 변경 경로에서 옵니다. 누군가
              SSH로 고친 설정, 노드 안의 자동 업데이트 타이머, 재부팅 뒤 되살아난 기본값 같은 것입니다. 구성 관리 도구가 주기적으로 두 상태를 맞춰 보는 일이 drift 감지입니다.
            </p>
            <p>
              노동 쪽의 이름은 toil입니다. SRE 책 5장은 toil을 "운영 서비스에 묶인 일 가운데 손으로 하고, 반복되고, 자동화할 수 있고, 전술적이고, 끝나도 남는 가치가 없고, 서비스가 커지는
              만큼 늘어나는 경향이 있는 일"로 정의합니다. 여섯 특성을 다 갖출 필요는 없고 많이 갖출수록 toil에 가깝습니다. 책이 특히 짚는 것은 "스크립트를 손으로 실행하는 시간"도 toil이라는
              점입니다.
            </p>
          </div>
          <div id="paper-sre-canary" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google · The Site Reliability Workbook · Chapter 16 Canarying Releases (sre.google, 2026-10-17 확인)" citeKey={2} href="https://sre.google/workbook/canarying-releases/">
              <q>We define canarying as a partial and time-limited deployment of a change in a service and its evaluation.</q> 같은 장의 예시는 5% canary가 20% 오류를 내면 전체 오류율은 1%라 예산 소모가 canary 크기에 비례한다는 점, 그리고 전체 지표만 보면 canary의 오류가 묻히므로 canary와 control을 나눠 봐야 한다는 점을 그림으로 보입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="change-path" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. Datadog에는 변경 경로가 둘 있었고, 둘째 경로에는 문이 없었습니다</h2>
          <div className={prose}>
            <p>
              Datadog의 사후 분석을 변경 경로라는 눈으로 다시 읽습니다. 첫째 경로는 조직의 파이프라인입니다. 새 코드·보안 패치·설정은 지역별, 클러스터별, 노드별로 들어가고 단계 사이에
              일주일에서 한 달을 재웁니다. 보안 패치는 이 경로에서 노드를 통째로 주기적으로 교체하는 방식으로 반영됐습니다. Ubuntu 22.04로의 이전도 이 경로로 수개월에 걸쳐 진행돼 사건 당시
              fleet의 90% 이상이 22.04였습니다.
            </p>
            <p>
              둘째 경로는 각 노드 안의 apt-daily-upgrade.timer입니다. Ubuntu 기본값 그대로였고, 06:00에 최대 60분 무작위 지연으로 unattended-upgrade를 돌려 -security 포켓의 패키지를 설치합니다. Datadog는 이 경로에 의존하지 않았지만 끄지도 않았습니다. "수년간 아무 문제 없었다"는 것이 그 이유였습니다.
            </p>
            <p>
              3월 7일 Ubuntu가 systemd CVE 패치(249.11-0ubuntu3.7)를 -security에 올렸고, 다음 날 06:00~07:00 UTC에 이 경로가 전 지역에서 동시에 그것을 설치했습니다.
            </p>
            <p>
              결과는 둘째 경로의 모양 그대로였습니다. 지역 사이에 아무 결합이 없는데도 모두 같은 한 시간에 바뀌었고, 바뀌지 않은 비교 대상이 없었습니다. 06:00에 첫 업그레이드가 돌고 3분 뒤 내부 모니터링이 경보를 올렸으며, 06:31에는 fleet의 상당 부분이 꺼져 사용자에게 보였습니다.
            </p>
            <p>
              AWS에서는 네트워크를 잃은 인스턴스를 Auto Scaling이 비정상으로 판정해 06:00~07:00 사이 10분마다 8% 이상을 종료·교체했고, 08:00까지 한 지역 인스턴스의 약 60%가 교체됐습니다.
            </p>
            <p>
              Datadog가 사후에 한 조치도 변경 경로의 언어로 읽힙니다. 둘째 경로(해당 보안 업데이트 채널)를 전 지역에서 껐고, 다음 번에 같은 재시작이 와도 라우팅 표를 건드리지 않도록 systemd-networkd 설정을 바꿨으며, 비슷한 "숨은 경로"가 또 없는지 인프라를 감사했습니다.
            </p>
            <p>
              패치 내용(networkd가 모르는 규칙을 지우는 동작)은 systemd 글의 몫이고, 이 글의 교훈은 "문 없는 변경 경로는 아무리 작아도 fleet 전체의 상관관계가 된다"입니다.
            </p>
          </div>
          <div id="paper-datadog-deep-dive" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Datadog Engineering · 2023-03-08 incident: A deep dive into our incident response · Part 2 platform-level impact (2026-10-17 확인)" citeKey={3} href="https://www.datadoghq.com/blog/engineering/2023-03-08-deep-dive-into-platform-level-impact/">
              <q>This configuration explains why all our hosts ran apt-upgrade between 06:00 and 07:00 UTC every day.</q> 같은 글은 apt-daily.timer(06:00·18:00, 최대 12시간 지연)와 apt-daily-upgrade.timer(06:00, 최대 60분 지연)의 유닛 파일을 인용하고, 22.04 노드가 fleet의 90% 이상이었으며 새 systemd 버전이 18:50 UTC 이후에야 받아져 그 전에 18:00 다운로드를 끝낸 노드는 무사했다고 적습니다. AWS 한 지역에서는 06:00~07:00 사이 10분마다 8% 넘는 인스턴스가 종료됐고 08:00까지 약 60%가 교체됐습니다.
            </CitationBlock>
          </div>
          <div id="paper-datadog-summary" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Datadog · 2023-03-08 Incident: Infrastructure connectivity issue affecting multiple regions (2026-10-17 확인)" citeKey={4} href="https://www.datadoghq.com/blog/2023-03-08-multiregion-infrastructure-connectivity-issue/">
              06:03 UTC 시작, 첫 번째 잘못된 업그레이드 3분 뒤 내부 모니터링 경보, 06:31 첫 상태 페이지 갱신, 09:13 웹 접근 복구, 16:44 첫 주요 서비스 정상, 3월 9일 08:58 전 지역 정상 선언. <q>Whenever we push new code, security patches or configuration changes to our platform, we do so region-by-region, cluster-by-cluster, node-by-node.</q> 그리고 자동 업데이트 시각이 OS 기본값으로 06:00~07:00 UTC에 고정돼 서로 연결되지 않은 지역들이 정확히 같은 시간에 영향을 받았다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="staged-rollout" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 1% → 10% → 50%로 넓히며 문을 두면 영향 범위가 문에서 멈춥니다</h2>
          <div className={prose}>
            <p>
              같은 패치를 (가정) 1,000대 fleet에 첫째 경로로 넣는다면 어떻게 되는지 봅니다. 1단계는 10대(1%)입니다. 나머지 990대가 control입니다. 하루를 재우며 두 묶음의 지표를 비교합니다. 사용자 쪽은 그 노드로 간 요청의 성공률과 p99, 서버 쪽은 재시작 수·PSI·네트워크 drop·커널 로그의 오류입니다. 차이가 없으면 100대(10%)로, 다시 하루 뒤 500대(50%)로 갑니다.
            </p>
            <p>
              이 패치가 Datadog의 것처럼 노드의 네트워크를 끊는다면 1단계에서 10대가 끊기고 거기서 멈춥니다. 영향은 fleet의 1%, 사용자 쪽 오류율로는 1% × 100% = 1%입니다. 3절의 예산 계산으로 하루 종일 방치해도 1 ÷ 0.1 = 소진율 10, 예산의 10 × 24 ÷ 720 = 33%입니다. 크지만 전부는 아니고, 실제로는 문이 몇 분 안에 닫힙니다. workbook의 표현으로 canary의 예산 소모는 canary 크기에 비례합니다.
            </p>
            <p>
              Viz의 3단계처럼 결함이 50%에서야 드러나는 경우도 있습니다. 특정 인스턴스 타입이나 커널 버전에서만 나는 결함은 표본이 커져야 보입니다. 그래서 workbook은 단계마다 보는 지표를 달리하라고 적습니다. 작은 단계에서는 "가장 확실하게 나쁜 것"(크래시·연결 끊김)을, 큰 단계에서는 분산이 큰 지표(지연 분포·대기열)를 봅니다. 그리고 전체 평균이 아니라 canary와 control을 나눠 봐야 합니다.
            </p>
            <p>
              5% canary가 20% 오류를 내도 전체는 1%라 다른 잡음과 구분되지 않기 때문입니다. 이 방식의 비용은 시간입니다. 세 단계에 하루씩이면 패치가 fleet 전체에 닿기까지 사흘입니다. 보안 패치처럼 급한 변경은 단계를 시간 단위로 줄이되 문은 없애지 않습니다. Datadog의 첫째 경로가 "일주일에서 한 달"을 재우는 것도 같은 저울질의 결과이고, 그 경로를 우회한 둘째 경로가 사흘이 아니라 한 시간 만에 전부를 바꿨습니다.
            </p>
          </div>
          <StagedRolloutViz />
          <AlgorithmBlock
            title="문이 있는 단계적 롤아웃"
            input={["fleet: 1,000대 (가정)", "변경: OS 패키지 한 벌 (systemd 패치 등)", "단계: 1% → 10% → 50% → 100%, 단계마다 bake 1일 (가정)", "지표: 사용자 쪽(성공률·p99), 서버 쪽(재시작·PSI·drop·커널 오류)"]}
            steps={[
              { code: "for stage in [1%, 10%, 50%, 100%]:", note: "비율은 예시입니다. 급한 보안 패치는 bake를 시간 단위로 줄이되 단계 자체는 유지합니다." },
              { code: "  canary = pick(stage) ; control = rest", note: "canary는 여러 지역·인스턴스 타입·커널을 대표하도록 고릅니다. 한 지역에서만 고르면 지역 특유 결함을 못 봅니다." },
              { code: "  apply(canary) ; sleep(bake)", note: "적용은 파이프라인이 합니다. 노드 안의 타이머가 아니라 바깥에서 밀어 넣어야 '언제 누가 바꿨는지'가 남습니다." },
              { code: "  if |metric(canary) − metric(control)| > tolerance: rollback(canary); stop", note: "문입니다. 전체 평균이 아니라 두 묶음의 차이를 봅니다. 3단계에서 20% vs 1%면 500대를 되돌리고 멈춥니다." },
              { code: "  record(stage, metrics)", note: "통과한 단계의 지표를 남겨 둡니다. 다음 변경의 tolerance를 정하는 근거가 됩니다." },
              { code: "drift_check(): for node in fleet: assert actual(node) == desired(node)", note: "롤아웃과 별개로 주기적으로 돕니다. 파이프라인 밖에서 바뀐 노드(둘째 경로)를 찾아내는 유일한 방법입니다." },
            ]}
            output="변경이 fleet 전체에 닿거나, 어느 단계의 문에서 멈춰 그 단계까지만 영향을 받고 되돌려집니다. 어느 쪽이든 '무엇이 언제 어디까지 바뀌었는지'가 기록에 남습니다."
            repeatUntil="100% 단계의 bake가 끝나고 drift_check가 0건을 보고할 때까지입니다."
          />
        </section>

        <section id="config-drift" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 원하는 상태를 코드로 적어 두어야 실제 상태와의 차이를 셀 수 있습니다</h2>
          <div className={prose}>
            <p>
              7절의 drift_check가 성립하려면 "원하는 상태"가 어딘가에 적혀 있어야 합니다. 어떤 노드에 어떤 패키지 버전과 어떤 설정 파일이 있어야 하는지를 코드(이미지 정의, Ansible·Puppet
              선언, Terraform)로 두고 버전 관리하는 것이 그 전제입니다. 적혀 있지 않은 상태는 비교할 수 없으며, 비교할 수 없는 drift는 발견되지 않습니다.
            </p>
            <p>
              SRE workbook 14장은 설정 변경에도 코드와 같은 규율을 요구합니다. 커밋 시점에 의미를 검증해 잘못된 설정을 막으며, 전역 일괄 반영을 피해 점진적으로 밀어 넣어 100% 중단 전에 멈출
              수 있게 하며, 되돌리기를 임시 수정보다 우선합니다. Kubernetes가 Pod를 한꺼번에 바꾸지 않고 rolling update를 쓰는 이유도 같은 문단에서 설명합니다.
            </p>
            <p>
              drift의 흔한 출처는 셋입니다. 사람이 SSH로 들어가 고친 설정은 다음 배포 때 덮이거나 영원히 남아 그 노드만 다르게 만듭니다. 노드 안의 자동화(unattended-upgrades, dnf-automatic, cron)는 파이프라인 모르게 패키지를 바꿉니다. 재부팅은 메모리에만 있던 변경(sysctl, ip rule)을 지워 "원하는 상태"가 어디였는지를 되묻습니다.
            </p>
            <p>
              Datadog의 둘째 경로가 두 번째 출처였고, Reddit의 2023년 Pi-Day 장애는 클러스터마다 손으로 쌓인 구성 차이("inconsistency")가 업그레이드 때 터진 첫 번째 출처의 예입니다.
            </p>
            <p>
              감지한 drift를 어떻게 할지는 두 갈래입니다. 자동으로 원하는 상태로 되돌리면(수렴) 사람이 급히 고친 것도 지워지므로, 되돌리기 전에 "왜 달라졌는가"를 기록하는 쪽이 안전합니다. 어느 쪽이든 drift 건수 자체를 지표로 두면 둘째 경로가 열려 있는지를 사고 전에 알 수 있습니다.
            </p>
            <p>
              Datadog의 노드들은 매일 06:00~07:00에 패키지 버전이 조금씩 바뀌고 있었으며, 그 변화를 세는 눈이 있었다면 둘째 경로는 2020년 12월의 systemd 변경 이후 2년 동안 보였을 것입니다.
            </p>
          </div>
          <div id="paper-sre-config" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google · The Site Reliability Workbook · Chapter 14 Configuration Design and Best Practices (sre.google, 2026-10-17 확인)" citeKey={5} href="https://sre.google/workbook/configuration-design/">
              <q>When deploying a new configuration, it is important to avoid a global all-at-once push.</q> 점진적으로 밀어 넣어야 100% 중단 전에 문제를 감지하고 중단할 수 있으며 Kubernetes가 rolling update를 쓰는 이유가 이것이라고 적습니다. 이어 되돌리기가 임시 수정보다 사고 시간을 더 빨리 줄인다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 원문은 06:00과 60분을 세 줄로 적고, 배포판이 달라도 같은 창입니다</h2>
          <div className={prose}>
            <p>
              Debian apt 저장소의 debian/apt-daily-upgrade.timer는 열두 줄입니다. OnCalendar=*-*-* 6:00, RandomizedDelaySec=60m, Persistent=true. Datadog 글이 인용한 파일이 이것이고, 이 세 줄이 "모든 노드가 06:00~07:00"을 만듭니다. 무작위 지연 60분은 한 서버 안에서는 분산이지만 fleet로 보면 한 시간 창에 전부가 들어옵니다.
            </p>
            <p>
              지역 사이의 상관관계를 끊으려면 지연이 아니라 서버마다 다른 OnCalendar이 필요한데, 그것이 곧 단계적 롤아웃입니다.
            </p>
            <p>
              apt-daily.timer(다운로드)는 06:00과 18:00에 최대 12시간 지연이라 사실상 하루 종일 흩어져 돕니다. 이 흩어짐이 Datadog에서 피해 범위를 줄였습니다. 새 systemd가 Google Cloud 저장소에 18:50 UTC에 올라왔는데, 18:00 다운로드를 그 전에 끝낸 노드는 다음 날 06:00 업그레이드 때 설치할 것이 없었기 때문입니다.
            </p>
            <p>
              apt-daily-upgrade.service의 After= 줄에는 systemd-networkd.service가 들어 있어, 업그레이드가 networkd 뒤에 돌고 그 업그레이드가 systemd 패키지면 networkd를 재시작한다는 순서도 원문에서 보입니다.
            </p>
            <p>
              어떤 패키지를 자동으로 올릴지는 /etc/apt/apt.conf.d/50unattended-upgrades의 Allowed-Origins가 정합니다. Ubuntu 기본은 release 포켓과 -security 포켓이고 -updates·-proposed· -backports는 주석으로 꺼져 있습니다. "보안만"이라는 범위 제한이 변경 횟수를 줄여 주지만, 보안 패치 자체가 데몬 재시작을 동반하는 경우는 걸러 주지 못합니다.
            </p>
            <p>
              systemd CVE 패치가 바로 그 경우였습니다. RHEL·Fedora 계열의 dnf-automatic은 기본이 다릅니다. dnf-automatic.timer는 같은 06:00 + 60분이지만 automatic.conf의 apply_updates가 no라 내려받기만 하고 설치하지 않습니다. upgrade_type은 default(모든 업데이트)이고 reboot는 never입니다.
            </p>
            <p>
              설치까지 하려면 apply_updates = yes로 바꾸거나 dnf-automatic-install.timer를 켜야 합니다. 배포판에 따라 둘째 경로가 기본으로 열려 있는지(Ubuntu) 닫혀 있는지(RHEL 계열)가 다르다는 점은 fleet를 섞어 쓰는 조직이 알아 둘 사실입니다.
            </p>
            <p>
              고칠 곳은 셋 중 하나입니다. 둘째 경로를 끄고(timer disable 또는 unattended-upgrades 제거) 패치를 첫째 경로에만 태우거나, 경로를 남기되 Allowed-Origins를 더 좁히고 노드 묶음마다 OnCalendar를 다르게 두어 자체 단계를 만들거나, 최소한 Automatic-Reboot와 재시작을 동반하는 패키지(systemd·커널·libc)를 Package-Blacklist로 빼는 것입니다.
            </p>
            <p>
              어느 쪽이든 결정은 8절의 "원하는 상태"에 적혀 drift_check의 대상이 되어야 합니다.
            </p>
          </div>
          {code("apt-upgrade-timer", "apt-daily-upgrade.timer")}
          {code("apt-download-timer", "apt-daily.timer")}
          {code("apt-upgrade-service", "apt-daily-upgrade.service")}
          {code("unattended-origins", "50unattended-upgrades Allowed-Origins")}
          {code("unattended-readme", "unattended-upgrades 기본 동작")}
          {code("dnf-automatic-timer", "dnf-automatic.timer")}
          {code("dnf-automatic-conf", "automatic.conf 기본값")}
          {code("dnf-automatic-doc", "apply_updates 문서")}
        </section>

        <section id="toil" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 패치는 toil이고, toil을 없앤 자동화도 변경이라 문을 거쳐야 합니다</h2>
          <div className={prose}>
            <p>
              서버 운영에서 toil은 어디에 있을까요. 5절의 여섯 특성에 대 보면 금방 보입니다. 보안 패치를 서버마다 손으로 적용하는 일, 가득 찬 디스크의 로그를 지우는 일, 메모리가 새는 데몬을
              주기적으로 재시작하는 일, 인증서를 갱신하는 일. 모두 손으로 하고, 반복되고, 자동화할 수 있고, 끝나도 서비스가 나아지지 않으며, 서버 수에 비례해 늘어납니다. 100대에서 10분이면
              1,000대에서 100분입니다.
            </p>
            <p>
              Google SRE 책 5장은 이 일을 각 SRE 시간의 50% 아래로 묶는다고 적습니다. 나머지 50% 이상은 앞으로의 toil을 줄이거나 서비스 기능을 더하는 엔지니어링에 씁니다. 이 비율을 공개
              목표로 두는 이유는 toil이 두면 100%를 채우기 때문이고, 그렇게 되면 SRE 조직이 서비스 크기에 비례해 커져야 하는 Ops 팀이 되기 때문입니다. 책은 분기 설문에서 평균 약 33%가 나왔다고
              덧붙입니다.
            </p>
            <p>
              unattended-upgrades는 이 관점에서 정확히 "패치라는 toil을 없앤 자동화"입니다. 그런데 Datadog 사건은 자동화의 두 번째 조건을 보여 줍니다. toil을 자동화로 바꾸면 그 자동화는
              변경 고리로 들어가야 합니다. 사람이 손으로 하던 패치는 느려서라도 서버마다 시차가 있었는데, 자동화는 그 시차를 한 시간 창으로 압축했고 문은 없었습니다. 자동화가 toil을 줄였지만
              변경의 상관관계는 키운 것입니다.
            </p>
            <p>
              그래서 서버 운영의 toil 줄이기는 두 단계입니다. 먼저 반복 작업을 셉니다. 책이 권하듯 "스크립트를 손으로 돌리는 시간"까지 포함해 toil 비율을 재면 어디부터 자동화할지가 보입니다. 그다음 자동화를 파이프라인에 넣습니다. 패치 자동화라면 노드 안의 타이머가 아니라 바깥의 롤아웃 도구가 단계적으로 밀어 넣으며, 디스크 정리 자동화라면 그 스크립트의 배포도 단계적으로 합니다.
            </p>
            <p>
              Kubernetes에서 이 역할을 하는 것이 controller와 operator인데, 그 쪽은 Kubernetes SRE 글이 다룹니다.
            </p>
          </div>
          <div id="paper-sre-toil" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google · Site Reliability Engineering · Chapter 5 Eliminating Toil (sre.google, 2026-10-17 확인)" citeKey={6} href="https://sre.google/sre-book/eliminating-toil/">
              <q>Our SRE organization has an advertised goal of keeping operational work (i.e., toil) below 50% of each SRE's time.</q> 같은 장은 toil을 manual·repetitive·automatable·tactical·no enduring value·O(n) with service growth 여섯 특성으로 정의하고, 자동화 스크립트를 손으로 실행하는 시간도 toil이라고 적습니다. 분기 설문의 평균 toil은 약 33%라고 덧붙입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 호출은 소진율에, 변경은 한 경로에, 노동은 50% 아래에 두되 한계를 압니다</h2>
          <div className={prose}>
            <p>
              경보부터 바꿉니다. CPU 80%·디스크 90% 같은 서버 임계 경보를 호출에서 ticket으로 내리며, 호출은 서비스 SLI의 소진율에 겁니다. 서버 지표는 대시보드에 USE 격자 모양으로 두어
              호출받은 사람이 바로 "왜"로 내려갈 수 있게 합니다. 예외는 SRE 책이 말하는 "매우 확실하고 매우 임박한" 원인, 예컨대 4시간 뒤 가득 찰 것이 확실한 디스크입니다.
            </p>
            <p>
              변경은 한 경로로 모읍니다. 서버 안의 자동 업데이트 타이머·cron·사람의 SSH 변경을 찾아 끄거나 파이프라인으로 옮기며, 남긴 것은 "원하는 상태"에 적어 drift_check 대상으로 둡니다.
              파이프라인은 canary·control 비교라는 문을 단계마다 두고, 급한 변경은 bake를 줄이되 문은 없애지 않습니다. 사후에는 Datadog처럼 같은 종류의 숨은 경로가 또 없는지 감사합니다.
            </p>
            <p>
              한계도 적어 둡니다. 사용자가 명확하지 않은 내부 서버(빌드 머신, 배치 노드)는 SLI를 정하기 어렵고 그때는 그 서버를 쓰는 팀을 사용자로 삼습니다. 요청이 적은 서비스는 소진율이 몇 건의 실패로 튀어 최소 요청 수 조건이 필요합니다. 단계적 롤아웃은 시간을 쓰므로 공격이 진행 중인 보안 패치에서는 bake를 분 단위로 줄이는 판단이 필요합니다.
            </p>
            <p>
              drift 감지는 적어 둔 것만 비교하므로 적지 않은 상태(메모리의 sysctl, 수동 ip rule)는 재부팅 뒤에야 드러납니다.
            </p>
            <p>
              이 글의 수치 가운데 서버 100대·초당 1,000 요청·1,000대 fleet·단계 비율은 가정이고, Datadog의 시각·비율은 그 회사의 사후 분석에 적힌 것만 옮겼습니다. 사고가 난 뒤 비난 없이
              사실을 적는 postmortem의 작성 기준과 blameless 원칙은 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">Kubernetes SRE 글</a>이 SRE 책 15장으로
              다루며, Datadog의 두 글 자체가 그 형식의 좋은 예입니다.
            </p>
          </div>
          <ContentBoundary article="linux-sre-metrics-slo-safe-change" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 사례로 다음 숫자를 예상해 보세요</h2>
          <div className={prose}>
            <p>
              3절의 API가 SLO를 99.95%로 올리면 예산은 몇 분이 되고, 같은 40분 장애는 예산의 몇 %를 쓸까요? 호출 임계 14.4는 그대로일 때 호출이 울릴까요? (답: 3절) 7절의 1,000대 fleet에서 1단계를 1%가 아니라 5%로 시작했고 패치가 그 노드를 모두 끊었다면, 사용자 쪽 오류율과 한 시간 동안의 예산 소진은 얼마일까요? (답: 7절)
            </p>
            <p>
              RHEL 계열 노드에 dnf-automatic을 설치만 하고 설정을 바꾸지 않았다면 Datadog과 같은 사건이 날 수 있을까요? 어느 설정 한 줄이 그 답을 정하나요? (답: 9절)
            </p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxSreTrees}
        projectMetas={{
          apt: { id: "apt", label: "Debian apt 원문 (main, 2026-10-12)", badgeClass: "bg-rose-500/10 border-rose-500 text-rose-700" },
          "unattended-upgrades": { id: "unattended-upgrades", label: "unattended-upgrades 원문", badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700" },
          dnf: { id: "dnf", label: "dnf 4.23.0 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
