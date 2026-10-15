import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import BootHandoffViz from "./linux-systemd-boot-change-incidents/viz/BootHandoffViz";
import RuleFlushViz from "./linux-systemd-boot-change-incidents/viz/RuleFlushViz";
import NetworkdStartViz from "./linux-systemd-boot-change-incidents/viz/NetworkdStartViz";
import StartLimitViz from "./linux-systemd-boot-change-incidents/viz/StartLimitViz";
import IncidentTimelineViz from "./linux-systemd-boot-change-incidents/viz/IncidentTimelineViz";
import { codeRefs } from "./linux-systemd-boot-change-incidents/codeRefs";
import { systemdIncidentTrees } from "./linux-systemd-boot-change-incidents/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxSystemdBootChangeIncidentsArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 같은 networkd가 부팅 때는 무사했고 재시작 때는 노드를 끊었습니다</h2>
          <div className={prose}>
            <p>
              인프라 면접에서 리눅스 질문은 자주 이런 모양으로 나옵니다. 서버를 재부팅했더니 서비스 하나가 안 뜹니다. 보안 패치를 적용한 다음 날 아침 장애가 났습니다. 둘 다 원인을 찾으려면
              리눅스가 서비스를 언제, 어떤 순서로 띄우는지 알아야 하고, 그 일을 맡은 프로그램이 대부분의 배포판에서 systemd입니다.
            </p>
            <p>
              이 글의 답을 먼저 적겠습니다. systemd는 서비스 사이의 순서(After·Before)와 요구(Wants·Requires)를 따로 적은 그래프로 부팅과 재시작을 합니다. 그래서 같은 프로그램이라도
              부팅 때 만나는 시스템 상태와 실행 중 재시작 때 만나는 상태가 달라 전혀 다른 결과를 낼 수 있습니다.
            </p>
            <p>
              2023년 3월 8일 Datadog 장애가 정확히 이 경우였습니다. 자동 보안 업데이트가 실행 중인 노드의 systemd-networkd를 재시작했고, networkd는 부팅 때라면 지울 것이 없었을 남의
              라우팅 규칙을 지웠습니다. Datadog이 예로 든 pod 하나짜리 노드에서는 5줄입니다. 수만 대의 노드가 한 시간 안에 네트워크에서 떨어졌습니다.
            </p>
            <p>
              이 답을 부팅 사슬, 규칙 7줄의 계산, 부팅과 재시작의 차이, 재시작 한도의 산수, 사건 순서, systemd v249 원문, 진단 명령, 변경 경로 순서로 따라갑니다. 서버 한 대의 증상을 좁히는 첫
              순서는 <Link to="/cs/cloud/linux-server-interview-incident-map#overview">리눅스 면접·장애 지도</Link>에서 먼저 볼 수 있습니다.
            </p>
          </div>
        </section>

        <section id="boot-chain" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 전원에서 PID 1까지 네 번 넘기고, 그다음은 unit 그래프입니다</h2>
          <div className={prose}>
            <p>
              리눅스 부팅 과정을 설명해 보라는 질문의 뼈대는 제어권이 넘어가는 순서입니다. 펌웨어가 하드웨어를 최소한으로 깨우고 boot loader를 실행합니다. boot
              loader는 커널과 initramfs를 메모리에 올리고 커널은 initramfs 안의 /init을 첫 사용자 프로세스로 실행합니다. 이 프로세스가 진짜 root 파일
              시스템을 mount한 뒤 디스크의 init에게 자리를 넘깁니다.
            </p>
            <p>
              커널 쪽 순서는 init/main.c의 kernel_init에 그대로 적혀 있습니다. initramfs의 /init이 있으면 그것을 먼저 실행하고, 찾을 이름은 커널 명령행의
              rdinit=으로 바꿀 수 있습니다.
            </p>
            <p>
              커널 명령행에 init=이 있으면 그것만 시도합니다. 없으면 빌드 설정 CONFIG_DEFAULT_INIT을 먼저 시도한 뒤 /sbin/init, /etc/init, /bin/init, /bin/sh
              순서로 찾고, 끝까지 못 찾으면 panic입니다.
            </p>
          </div>
          {code("kernel-init-order", "커널이 PID 1을 고르는 순서")}
          <BootHandoffViz />
          <div className={prose}>
            <p>
              PID 1이 systemd가 되는 순간부터 순서를 정하는 주체가 바뀝니다. 시작 스크립트를 위에서 아래로 실행하는 대신, systemd는 default.target에서 출발해 필요한 unit을 모으고 순서 제약이
              없는 unit은 동시에 시작합니다. bootup(7)은 이 과정이 크게 병렬화되어 있어 target에 도달하는 순서가 결정적이지 않다고 적습니다.
            </p>
            <p>
              unit은 systemd가 관리하는 대상 하나를 적은 설정 파일입니다. 서비스(.service), 묶음 지점(.target), 타이머(.timer)가 모두 unit입니다. 이 글에서 서비스가 뜨는 순서를 물으면 답은 늘
              이 그래프의 간선에서 찾습니다.
            </p>
          </div>
          <TermBreakdown
            title="면접 질문을 이 글의 절에 대응시키면"
            items={[
              { term: "부팅 과정을 설명해 주세요", description: "펌웨어, boot loader, 커널, initramfs, PID 1, target 그래프 순서로 제어권을 넘깁니다.", example: "2절 그림과 커널 init/main.c 1494–1533행", boundary: "UEFI가 커널을 직접 올리는 경로와 initramfs가 없는 경로도 있습니다." },
              { term: "재부팅 후 서비스가 안 떠요", description: "순서 제약이 실제 준비 상태를 기다렸는지와 재시작 한도에 걸렸는지를 먼저 봅니다.", example: "6절 RestartSec 1초가 7.5초에 멈추는 계산", boundary: "디스크 mount 실패나 권한 문제처럼 순서와 무관한 원인도 있습니다." },
              { term: "패치 뒤 장애가 났어요", description: "패키지 설치는 데몬을 실행 중에 재시작시키는 배포입니다. 부팅 때와 다른 상태에서 같은 코드가 돕니다.", example: "3·4·7절 Datadog 사례", boundary: "패치가 코드 자체를 바꿔 생긴 장애는 별도 회귀입니다." },
              { term: "systemd 로그는 어디서 보나요", description: "journalctl로 unit, 부팅 회차, 심각도를 골라 봅니다.", example: "10절 journalctl -u -b -p", boundary: "journal 보존 설정에 따라 이전 부팅 기록이 없을 수 있습니다." },
            ]}
          />
        </section>

        <section id="rule-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 규칙 7줄 중 커널이 만든 2줄만 남았습니다</h2>
          <div className={prose}>
            <p>
              먼저 Datadog이 사후 보고서에 예로 든 노드에서 사라진 것을 셉니다. pod가 하나뿐인 단순화한 예이고 실제 노드에는 pod마다 규칙이 더 있습니다. 리눅스는 패킷 하나의 길을 찾을 때 라우팅 표를 바로 보지 않고 번호가 붙은 규칙 목록을 번호가 작은 것부터 맞춰
              봅니다. 처음 맞는 규칙이 어느 라우팅 표를 쓸지 정합니다. 이 목록을 정책 라우팅 규칙(policy routing rule)이라 부르고 ip rule 명령으로 봅니다.
            </p>
            <p>
              새로 설치한 Ubuntu 노드에는 규칙이 3줄뿐입니다. 0번이 local 표, 32766번이 main 표, 32767번이 default 표를 봅니다. 노드 자신의 주소로 온 패킷은 0번 local 표에서 걸려 노드 안으로
              배달됩니다.
            </p>
            <p>
              Datadog의 AWS 노드에는 Cilium이 5줄을 더 깔았습니다. pod로 들어가는 길(20번), pod에서 두 번째 인터페이스 ens6로 나가는 길(111번), L7 proxy로 보내는 표시(9번) 같은 규칙입니다.
              Cilium은 0번 local 규칙을 100번으로 옮겨 자기 규칙이 먼저 검사되게 했으므로 노드에는 9, 20, 100, 109, 111, 32766, 32767번 일곱 줄이 있었습니다.
            </p>
            <p>
              재시작한 networkd는 커널이 만든 줄만 남기고 나머지를 지웠습니다. 4.17 이후 커널은 규칙을 알려 줄 때 누가 만들었는지를 protocol 값으로 함께
              보내고, 부팅 때 스스로 만든 기본 규칙에는 kernel을 붙입니다.
            </p>
            <p>
              일곱 줄 가운데 kernel이 붙은 줄은 32766과 32767 두 줄입니다. 100번 local은 같은 local 표를 보지만 Cilium이 만든 줄이라 남의 규칙이 되었고 7 − 2 = 5줄이 사라졌습니다. 0번 local은 이미 Cilium이 옮겨
              없었으므로 아무도 되살리지 않았습니다.
            </p>
          </div>
          <RuleFlushViz />
          <div className={prose}>
            <p>
              결과는 두 가지 끊김입니다. 노드로 돌아오는 응답 패킷은 local 표를 못 만나 main 표의 기본 경로를 타고 ens5 밖으로 다시 나갑니다. 노드 자체가 망에서 사라진
              것입니다. AWS와 Azure의 pod 패킷은 111번 규칙이 없어 ens6 대신 ens5로 나가고 가상 망이 이 패킷을 버립니다.
            </p>
          </div>
        </section>

        <section id="boot-vs-restart" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 부팅 때는 지울 규칙이 없었고 재시작 때는 5줄이 있었습니다</h2>
          <div className={prose}>
            <p>
              같은 networkd가 2022년 11월부터 Datadog의 Ubuntu 22.04 노드를 새로 만들 때마다 시작했는데 왜 그동안은 아무 일도 없었을까요? networkd가
              시작할 때 실행하는 코드는 늘 같고 다른 것은 시작하는 순간 커널에 이미 들어 있던 규칙의 수뿐이기 때문입니다.
            </p>
            <p>
              새 노드나 재부팅한 노드에서는 networkd가 부팅 초반에 뜹니다. Cilium은 Kubernetes가 올린 pod로 그보다 한참 뒤에 규칙을 깝니다. networkd가
              규칙을 읽는 순간에는 커널 기본 규칙(IPv4 3줄)만 있어서 지울 것이 0줄입니다. 실행 중 노드에서 networkd만 다시 시작하면 Cilium의 5줄이 이미 있고 같은 코드가 그
              5줄을 지웁니다.
            </p>
          </div>
          <AlgorithmBlock
            title="systemd-networkd v249 시작 순서 (networkd.c 84–100행)"
            input={["커널에 이미 있는 규칙 목록", "networkd.conf (ManageForeignRoutingPolicyRules 기본 yes)", "관리 대상 link의 .network 파일"]}
            steps={[
              { code: "conf ← networkd.conf와 .network 읽기", note: "설정 파일이 비어 있으면 남의 규칙도 관리합니다." },
              { code: "rules ← RTM_GETRULE로 커널 규칙 전부 읽기", note: "IPv4 기준 부팅 직후 3줄, 실행 중 노드 7줄입니다." },
              { code: "각 줄: protocol이 kernel이면 kernel, 아니면 rules_foreign에 기억", note: "protocol이 오지 않는 옛 커널에서만 커널 규칙 표와 맞춰 봅니다. 부팅 노드 0줄, 실행 중 노드 5줄이 남의 규칙입니다." },
              { code: "sd_notify(READY)", note: "두 노드 모두 이 시점에 준비 완료를 알립니다. 아래 두 줄은 그 뒤 이벤트 루프에서 일어납니다." },
              { code: "link 정보가 도착하면 link마다 link_configure", note: "loopback이 아니고 KeepConfiguration=yes가 아니면 남의 설정을 정리합니다." },
              { code: "rules_foreign 각 줄: kernel 아님 ∧ .network에 없음 → RTM_DELRULE", note: "부팅 노드 0줄, 실행 중 노드 5줄을 지웁니다." },
            ]}
            output="부팅 노드: 지운 규칙 0줄, 이후 Cilium이 규칙을 더해 7줄이 됩니다. 실행 중 재시작 노드: 준비 완료를 알린 뒤 5줄을 지워 2줄만 남습니다."
          />
          <NetworkdStartViz />
          <div className={prose}>
            <p>
              Datadog은 이 점을 사고를 키운 악화 요인으로 꼽았습니다. 새 노드도 재부팅한 노드도 이 동작을 보이지 않으므로, 실행 중 노드에서 networkd를 업데이트하는 경우를 빼면 이 순서를 재현하는 뚜렷한
              시험이 없었다는 것입니다. 부팅 시험을 아무리 많이 해도 재시작 경로는 한 번도 지나가지 않습니다.
            </p>
          </div>
          <div id="paper-datadog-root-cause" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Datadog · 2023-03-08 Incident: Infrastructure connectivity issue affecting multiple regions (2023-05-16)" citeKey={1} href="https://www.datadoghq.com/blog/2023-03-08-multiregion-infrastructure-connectivity-issue/">
              <q>neither a fresh node nor a rebooted node exhibit this behavior</q> 같은 글은 그 이유로 정상 부팅에서는 systemd-networkd가 CNI plugin이 규칙을 깔기 전에 항상 먼저 시작한다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="ordering" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 순서와 요구는 서로 다른 두 줄로 적습니다</h2>
          <div className={prose}>
            <p>
              부팅 때 networkd가 Cilium보다 먼저 뜬 것은 누가 적어 둔 약속이었을까요? systemd에서 unit 사이의 관계는 두 종류이고 둘은 서로 독립입니다. 하나는
              순서이고 하나는 요구입니다.
            </p>
            <p>
              순서 관계(ordering dependency)는 After=와 Before=로 적습니다. a.service에 After=b.service가 있으면 둘 다 시작할 때 b가 시작을 마친 다음 a를 시작합니다. 멈출 때는 순서가 거꾸로라서 a를
              먼저 멈춥니다. 둘 다 시작하는 경우에만 의미가 있고, 순서 관계 자체는 b를 시작시키지 않습니다.
            </p>
            <p>
              요구 관계(requirement dependency)는 Wants=와 Requires=로 적습니다. a가 Wants=b이면 a를 시작할 때 b도 시작합니다. b가 실패해도
              a는 시작합니다. Requires=는 더 강한 요구지만 b가 실패했을 때 a를 시작하지 않는 것은 After=b도 함께 적었을 때입니다. 요구 관계는 순서를 정하지 않으므로
              After=가 없으면 a와 b는 동시에 시작하고 b의 실패를 기다리지 않습니다.
            </p>
            <p>
              그래서 네트워크가 실제로 설정된 뒤에 떠야 하는 서비스는 두 줄을 함께 적습니다. network-online.target을 Wants=로 끌어오고 After=로 그 뒤에 섭니다. network.target은 네트워크
              관리 프로그램이 스스로 끌어오는 수동적인 지점이라 주소 설정이 끝났다는 보장이 없습니다.
            </p>
          </div>
          <pre className="my-6 overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-6"><code>{`# /etc/systemd/system/api.service  (가정한 예)
[Unit]
Wants=network-online.target     # 요구: online target도 시작
After=network-online.target     # 순서: 그것이 끝난 다음 시작

[Service]
ExecStart=/usr/local/bin/api --listen 10.0.0.5:8080
Restart=on-failure              # 실패로 끝나면 다시 시작
RestartSec=2                    # 기본값은 100ms`}</code></pre>
          <div className={prose}>
            <p>
              부팅 때의 순서는 보통 kubelet이 network-online.target 뒤에 뜨고 Cilium이 그 kubelet이 올린 pod로 뜬다는 간접적인 흐름이 만듭니다. Datadog
              노드에 없었던 것은 재시작 쪽 연결입니다. networkd가 재시작하면 Cilium이 규칙을 다시 깔도록 묶어 둔 관계가 없었고, 노드가 끊긴 채 남았다는 결과가 그 사실을 보여 줍니다.
            </p>
          </div>
          <div id="paper-systemd-unit" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="systemd v249 · man/systemd.unit.xml · Before=, After=" citeKey={2} href="https://raw.githubusercontent.com/systemd/systemd/f6278558da0304ec6b646bb172ce4688c7f162a5/man/systemd.unit.xml">
              <q>independent of and orthogonal to the requirement dependencies</q> 같은 절은 After=와 Wants=에 같은 unit을 함께 적는 것이 흔한 패턴이라고 덧붙입니다. network-online.target을 Wants=로 끌어오고 그 뒤로 순서를 두라는 설명은 systemd.special(7)에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="restart-limit" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 빨리 재시작할수록 먼저 멈춥니다</h2>
          <div className={prose}>
            <p>
              재부팅 뒤 서비스가 안 뜨는 흔한 모양 하나를 숫자로 만들어 보겠습니다. (가정) api.service가 After=network.target만 적고 10.0.0.5:8080에 bind합니다. 부팅 직후에는 그 주소가 아직
              없어 bind가 EADDRNOTAVAIL로 실패하고 프로세스는 0.5초 만에 죽습니다. 주소는 부팅 9초에 생깁니다.
            </p>
            <p>
              Restart=on-failure이므로 systemd는 RestartSec만큼 기다렸다가 다시 시작합니다. 그런데 시작 요청에는 한도가 있습니다.
              StartLimitIntervalSec 10초 동안 StartLimitBurst 5번까지만 허락하고 unit 파일에 적지 않으면 이 두 값이 기본입니다. 재시작 간격을
              1초로 둔 경우와 2초로 둔 경우를 차례로 셉니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="RestartSec 1초와 2초의 시작 시각"
            question="0.5초 만에 실패하는 서비스는 몇 초에 시작 한도에 걸리고, 9초에 생기는 주소를 볼 수 있을까요?"
            scope="실행 0.5초와 주소 9초는 가정입니다. 시작 처리 자체에 걸리는 수 ms는 셈에서 뺍니다. 한도는 v249 기본값 10초 동안 5번입니다."
            steps={[
              { label: "한 바퀴", expression: "0.5초 실행 + RestartSec 1초", result: "1.5초", reason: "죽은 시각부터 RestartSec 뒤에 다음 시작 요청이 옵니다." },
              { label: "다섯 번", expression: "0, 1.5, 3, 4.5, 6초", result: "5번 허락", reason: "첫 시작이 10초 창을 엽니다. 창 안 횟수가 5보다 작을 때마다 통과합니다." },
              { label: "여섯째", expression: "5 × 1.5", result: "7.5초 ≤ 10초 → 거절", reason: "창이 열린 지 10초가 안 됐고 이미 5번을 셌습니다. 9초의 주소를 보기 전에 failed가 됩니다." },
              { label: "2초 간격", expression: "0.5 + 2", result: "2.5초", reason: "같은 계산을 RestartSec 2초로 다시 합니다." },
              { label: "다섯째", expression: "4 × 2.5", result: "10초 → 주소 있음", reason: "다섯째 시작은 아직 허락 범위이고 9초에 생긴 주소로 bind가 성공합니다." },
            ]}
            conclusion="재시작 간격이 짧은 쪽이 창 안에 시작을 더 빨리 채워 failed로 멈췄고, 간격이 긴 쪽은 주소가 생긴 뒤의 시도로 살아남았습니다."
            caveats={["수동 systemctl start도 같은 한도를 셉니다.", "주소가 끝내 오지 않으면 2.5초 간격은 12.5초에 창이 새로 열려 한도에 걸리지 않고 계속 재시작합니다."]}
          />
          <StartLimitViz />
          <ExplainedFormula
            question="재시작이 반복될 때 몇 번째 시작이 한도에 걸릴까요?"
            idea="시작 요청은 일정한 간격 p로 오고, 첫 시작부터 T초짜리 창 안에서 B번까지만 허락합니다. B+1번째 시작 시각이 창 안이면 거절입니다."
            formula={"t_k=(k-1)\\,p,\\qquad p=r+d,\\qquad \\text{거절}\\iff t_{B+1}=B\\,p\\le T"}
            annotatedFormula={"\\underbrace{t_k}_{k\\text{번째 시작 시각}}=(k-1)\\,\\underbrace{p}_{\\text{한 바퀴}},\\qquad p=\\underbrace{r}_{\\text{실행 시간}}+\\underbrace{d}_{\\text{RestartSec}},\\qquad \\text{거절}\\iff \\underbrace{B\\,p}_{B+1\\text{번째 시작}}\\le\\underbrace{T}_{\\text{StartLimitIntervalSec}}"}
            operations={[
              { expression: "p=r+d", annotation: ["0.5 + 1 = 1.5초,", "0.5 + 2 = 2.5초입니다."] },
              { expression: "t_{B+1}=B\\,p", annotation: ["B = 5이면 여섯째 시작 시각입니다.", "5 × 1.5 = 7.5초, 5 × 2.5 = 12.5초입니다."] },
              { expression: "B\\,p\\le T", annotation: ["7.5 ≤ 10이라 1초 간격은 거절됩니다.", "12.5 > 10이라 2초 간격은 창이 새로 열립니다."] },
            ]}
            terms={[
              { symbol: "t_k", name: "k번째 시작 시각", description: "첫 시작을 0초로 둔 시각입니다." },
              { symbol: "p", name: "한 바퀴", description: "실행 시간과 재시작 대기의 합입니다." },
              { symbol: "B", name: "StartLimitBurst", description: "한 창 안에서 허락하는 시작 횟수입니다. 기본 5입니다." },
              { symbol: "T", name: "StartLimitIntervalSec", description: "창의 길이입니다. 기본 10초입니다." },
            ]}
            assumptions={["실행 시간 r이 매번 같습니다.", "ratelimit.c는 창이 열린 지 T보다 오래 지났을 때만 창을 새로 엽니다. 정확히 T초는 같은 창입니다."]}
            interpretation="B·p ≤ T이면 서비스는 B번 실패한 뒤 failed로 멈추고 자동 재시작은 더 일어나지 않습니다. 창이 지난 뒤의 수동 시작이나 systemctl reset-failed로만 다시 움직입니다. 그보다 늦게 재시작하면 한도에 걸리지 않는 대신 원인이 사라지지 않는 한 끝없이 재시작합니다. 한도는 고장 난 서비스를 멈추는 장치이지 기다리는 장치가 아니므로, 기다림은 순서 관계로 적어야 합니다."
          />
          <div className={prose}>
            <p>
              이 서비스를 고치는 길은 재시작 간격을 맞추는 것보다 5절의 두 줄을 적는 것입니다. Wants=와 After=로 network-online.target 뒤에 서면 bind가 처음부터 성공합니다. 이미 한도에 걸린 서비스는
              systemctl reset-failed로 횟수를 비운 뒤 다시 시작합니다.
            </p>
            <p>
              멈출 때도 기본값이 있습니다. systemd는 서비스를 멈출 때 먼저 SIGTERM을 보내고, TimeoutStopSec(기본 90초) 안에 끝나지 않으면 SIGKILL을 보냅니다. KillMode 기본값 control-group은 이
              신호를 서비스의 cgroup에 남은 모든 프로세스에 보냅니다. 두 신호의 차이는{" "}
              <Link to="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·시그널·PID 1 글</Link>에서 봅니다.
            </p>
          </div>
        </section>

        <section id="timeline" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 2020년의 기본값이 2023년 아침 6시의 자동 업데이트에서 터졌습니다</h2>
          <div className={prose}>
            <p>
              Datadog의 두 번째 사후 보고서는 이야기를 2020년 12월에서 시작합니다. systemd v248이 networkd가 시작할 때 자기가 모르는 IP 규칙을 지우도록 바꿨고, v249가 이를 끌 수 있는
              ManageForeignRoutingPolicyRules= 설정을 더했습니다. 기본값은 지우는 쪽이었고 Ubuntu 22.04가 v249를 실었습니다.
            </p>
            <p>
              Ubuntu 20.04의 systemd v245는 이 변경을 받지 않았습니다. v245에도 같은 CVE의 패치가 나왔지만 그 버전의 networkd는 재시작할 때 규칙을 지우지 않아 20.04 노드는 무사했습니다.
              같은 패치라도 버전에 따라 재시작의 결과가 달랐던 것입니다.
            </p>
          </div>
          <IncidentTimelineViz />
          <div className={prose}>
            <p>
              여러 지역이 같은 시각에 쓰러진 이유는 타이머 두 개의 기본값입니다. apt-daily.timer는 매일 6시와 18시에 최대 12시간 무작위 지연으로 패키지를 내려받고, apt-daily-upgrade.timer는 매일 6시에
              최대 60분 무작위 지연으로 보안 업데이트를 설치합니다. 지역 사이에 직접 연결이 없어도 업데이트를 내려받은 22.04 노드가 같은 한 시간 안에 같은 패치를 설치했습니다.
            </p>
            <p>
              클라우드마다 반응이 달라 복구 경로도 갈렸습니다. AWS는 상태 검사에 실패한 인스턴스를 곧바로 종료하고 새로 만들어 08시까지 US1 지역 인스턴스의 약 60%를 교체했습니다.
              로컬 디스크에 둔 데이터 저장소는 그 데이터를 잃었습니다. Google Cloud와 Azure는 망만 끊긴 인스턴스를 그대로 두었고 재부팅이 가장 빠른 복구였습니다.
            </p>
          </div>
          <div id="paper-datadog-deep-dive" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Datadog · 2023-03-08 incident: A deep dive into the platform-level impact (2023-05-24)" citeKey={3} href="https://www.datadoghq.com/blog/engineering/2023-03-08-deep-dive-into-platform-level-impact/">
              <q>systemd-networkd flushes all IP rules it does not know about</q> v248의 변경을 설명한 문장입니다. 같은 글은 ip rule 출력 전후 비교, unattended-upgrades 타이머 설정, AWS의 TerminateInstances 비율, Google Cloud·Azure의 재부팅 복구를 함께 보여 줍니다.
            </CitationBlock>
          </div>
        </section>

        <section id="networkd-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. networkd는 시작할 때마다 남의 규칙을 읽고 지웁니다</h2>
          <div className={prose}>
            <p>
              이제 같은 일곱 줄을 systemd v249 원문에 통과시킵니다. networkd.c 84–100행이 시작 순서입니다. 설정 파일을 읽고(84–90행), 커널에 있는 것을 전부 읽고(92행), 관리를 시작합니다(96행).
              부팅이든 패키지 설치 뒤의 재시작이든 이 순서는 같습니다.
            </p>
            <p>
              networkd-manager.c 386–387행이 기본값입니다. manage_foreign_rules가 true이므로 664–679행의 manager_enumerate_rules가 커널에 RTM_GETRULE을 보내 일곱 줄을 모두 받습니다. 이 플래그가
              false였다면 671행에서 바로 돌아가 아무것도 읽지 않았을 것입니다.
            </p>
          </div>
          {code("networkd-main-order", "networkd 시작 네 단계")}
          {code("manage-foreign-default", "남의 규칙을 관리하는 기본값 true")}
          {code("enumerate-rules", "시작할 때 규칙 전부 읽기")}
          <div className={prose}>
            <p>
              받은 줄은 networkd-routing-policy-rule.c 982–987행과 1025–1043행에서 분류됩니다. 커널은 규칙마다 FRA_PROTOCOL을 붙여 보내고(fib_rules.c 1031행),
              부팅 때 만든 기본 규칙은 protocol이 kernel입니다(69행).
            </p>
            <p>
              사용자 공간이 protocol 없이 넣은 규칙은 unspec이 됩니다(559–560행). 그래서 Ubuntu 22.04의
              5.15 커널에서는 32766·32767만 kernel이고 Cilium의 100번 local은 남의 규칙입니다. 823–829행의 커널 규칙 표는 FRA_PROTOCOL을 보내지 않는 옛 커널에서만 쓰는 대체 수단입니다.
            </p>
            <p>
              지우는 시점은 link를 설정할 때입니다. networkd-link.c 1155–1161행은 loopback이 아니고 KeepConfiguration=yes가 아닌 link에서 997–1022행의 정리 함수를 부릅니다. 이 함수의 1017행은
              link 하나가 아니라 노드 전체의 남의 규칙을 지우는 함수를 부릅니다.
            </p>
            <p>
              마지막으로 644–668행이 실제로 지웁니다. protocol이 kernel인 줄은 건너뛰고(653–655행), .network 파일이 원하는 줄도 건너뜁니다(657–663행). Cilium의 다섯 줄은 둘 다 아니므로 665행에서
              RTM_DELRULE이 나갑니다. 3절에서 센 7 − 2 = 5가 이 반복문의 실행 횟수입니다.
            </p>
          </div>
          {code("remember-foreign", "규칙 한 줄을 kernel 또는 남의 규칙으로 분류")}
          {code("kernel-rules-table", "protocol이 없을 때 쓰는 커널 규칙 표")}
          {code("fib-rules-protocol", "커널이 만든 기본 규칙의 protocol")}
          {code("fib-rules-user-proto", "사용자 공간 규칙의 protocol")}
          {code("fib-rules-report", "규칙을 알릴 때 붙이는 FRA_PROTOCOL")}
          {code("link-configure-call", "link 설정 중 정리를 부르는 조건")}
          {code("link-drop-foreign", "노드 전체의 남의 규칙 정리")}
          {code("drop-foreign-wrapper", "foreign=true 포장 함수")}
          {code("drop-foreign-rules", "남의 규칙을 하나씩 RTM_DELRULE")}
          {code("networkd-conf", "기본 설정 파일의 두 손잡이")}
          <div id="paper-networkd-conf" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="systemd v249 · man/networkd.conf.xml · ManageForeignRoutingPolicyRules=" citeKey={4} href="https://raw.githubusercontent.com/systemd/systemd/f6278558da0304ec6b646bb172ce4688c7f162a5/man/networkd.conf.xml">
              <q>will remove rules that are not configured in .network files</q> 예외는 protocol이 kernel인 규칙뿐이고, false면 남의 규칙을 지우지 않으며 기본값은 yes라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="unit-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 시작 한도는 시작 요청마다 같은 창에서 셉니다</h2>
          <div className={prose}>
            <p>
              6절의 7.5초도 원문으로 확인합니다. 서비스 프로세스가 죽으면 service.c 1730–1762행이 Restart= 설정을 보고 재시작을 정합니다. on-failure는
              결과가 성공이 아니면 재시작이고 그러면 restart_usec(RestartSec)만큼 뒤에 타이머를 겁니다.
            </p>
            <p>
              타이머가 울리면 다시 시작 요청이 되고 시작 요청은 모두 service.c 2414–2448행의 service_start를 지납니다. 2444행이 unit.c
              1771–1791행의 unit_test_start_limit을 부르고 그 안의 ratelimit_below가 실제 셈을 합니다.
            </p>
            <p>
              ratelimit.c는 창이 열린 시각과 횟수 두 값만 기억합니다. 7.5초의 여섯째 요청이 오면 21–22행에서 7.5 &gt; 10이 아니므로 창을 새로 열지 않고
              30행에서 횟수 5가 burst 5보다 작지 않아 거절합니다. unit.c 1781행이 Start request repeated too quickly를 남기고 서비스는
              start-limit-hit 결과로 멈춥니다.
            </p>
          </div>
          {code("restart-decision", "죽은 뒤 RestartSec 타이머 예약")}
          {code("start-limit-check", "모든 시작 요청이 지나는 한도 검사")}
          {code("unit-start-limit", "repeated too quickly 경고")}
          {code("ratelimit", "창 시작 시각과 횟수만 기억하는 카운터")}
          {code("manager-defaults", "90초·100ms·10초 5번 기본값")}
          <div id="paper-start-limit" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="systemd v249 · man/systemd.unit.xml · StartLimitIntervalSec=, StartLimitBurst=" citeKey={5} href="https://raw.githubusercontent.com/systemd/systemd/f6278558da0304ec6b646bb172ce4688c7f162a5/man/systemd.unit.xml">
              <q>they apply to all kinds of starts (including manual)</q> 같은 절은 한도에 걸린 unit도 interval이 지난 뒤 수동이나 timer·socket으로 다시 시작할 수 있고, systemctl reset-failed가 횟수를 비운다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="diagnose" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 재부팅 뒤 안 뜨는 서비스는 상태·로그·순서 세 곳을 봅니다</h2>
          <div className={prose}>
            <p>
              면접에서 이 질문을 받으면 명령 이름보다 보는 순서를 말하는 편이 낫습니다. 지금 상태가 무엇인지, 이번 부팅에서 무슨 기록을 남겼는지, 무엇을 기다리고 섰는지를 차례로 봅니다. 6절의
              api.service라면 첫 명령에서 이미 답이 나옵니다.
            </p>
          </div>
          <TermBreakdown
            title="세 곳을 보는 명령"
            items={[
              { term: "systemctl status api.service", description: "현재 상태와 마지막 결과, 최근 로그 몇 줄을 함께 보여 줍니다.", example: "Active: failed (Result: start-limit-hit)이면 6절의 한도입니다.", boundary: "결과 문자열은 마지막 실패 하나만 말합니다. 그 전 다섯 번의 실패 이유는 로그에서 봅니다." },
              { term: "journalctl -u api.service -b", description: "이 unit의 기록 중 이번 부팅 것만 봅니다. -b -1은 직전 부팅입니다.", example: "bind 실패 다섯 줄과 Start request repeated too quickly가 이어서 나옵니다.", boundary: "journal을 디스크에 보존하지 않으면 이전 부팅 기록이 없습니다." },
              { term: "journalctl -b -p err", description: "이번 부팅에서 err(3) 이상으로 심각한 기록만 봅니다.", example: "다른 unit의 실패가 원인일 때 한 화면에 모입니다.", boundary: "-p에 한 단계만 주면 그보다 중요한 단계까지 모두 포함합니다." },
              { term: "systemctl list-dependencies --after api.service", description: "이 unit보다 먼저 시작하도록 순서가 잡힌 unit을 따라갑니다.", example: "network.target만 보이고 network-online.target이 없으면 5절의 두 줄이 빠진 것입니다.", boundary: "메모리에 올라온 unit만 보여 주므로 모든 역의존을 찾는 데 쓰지 않습니다." },
              { term: "systemd-analyze critical-chain api.service", description: "그 unit에 도달하기까지 시간이 걸린 사슬을 보여 줍니다.", example: "@는 활성화된 시각, +는 시작에 걸린 시간입니다.", boundary: "병렬 시작과 socket 활성화 때문에 오해를 줄 수 있고, timeout된 job은 보이지 않습니다." },
              { term: "systemd-analyze blame", description: "unit을 초기화에 걸린 시간 순으로 나열합니다.", example: "부팅이 느린 원인 후보를 고를 때 씁니다.", boundary: "Type=simple 서비스는 측정되지 않고, 남을 기다린 시간도 느린 것처럼 보입니다." },
            ]}
          />
          <div className={prose}>
            <p>
              Datadog 사례처럼 패치 뒤 노드가 끊겼다면 같은 세 곳을 다른 unit에 적용합니다. journalctl -u apt-daily-upgrade.service로 무엇이
              설치됐는지 보고 journalctl -u systemd-networkd로 재시작 시각을 맞춥니다. ip rule 출력을 정상 노드와 비교하면 3절의 7줄과 2줄 차이가 바로
              드러납니다.
            </p>
          </div>
          <div id="paper-journalctl" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="systemd v249 · man/journalctl.xml · -b, -p" citeKey={6} href="https://raw.githubusercontent.com/systemd/systemd/f6278558da0304ec6b646bb172ce4688c7f162a5/man/journalctl.xml">
              <q>all messages with this log level or a lower (hence more important) log level are shown</q> -p에 단계 하나를 줄 때의 동작입니다. 같은 문서는 -b의 빈 인자가 현재 부팅, -1이 직전 부팅이라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="change-path" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 자동 업데이트는 배포 도구가 모르는 두 번째 변경 경로입니다</h2>
          <div className={prose}>
            <p>
              Datadog은 평소 변경을 지역, cluster, 노드 순서로 조금씩 내보냅니다. 노드를 제자리에서 고치지 않고 새 노드로 바꾸며 실험 cluster에서 시작해
              staging, 가장 작은 지역의 한 zone, 그다음 지역으로 넓히고 단계 사이에 1주에서 한 달을 기다립니다. 22.04 자체도 이렇게 2022년 11월부터 천천히
              퍼졌습니다.
            </p>
            <p>
              그런데 기본 OS 이미지에 예전 보안 업데이트 경로가 켜져 있었습니다. 이 경로는 배포 도구를 거치지 않고 모든 노드에서 같은 시각에 패키지를 설치했습니다. 패키지 설치는
              데몬을 실행 중에 재시작하는 일이고 4절에서 본 대로 그것은 부팅 시험이 한 번도 지나가지 않은 경로입니다.
            </p>
            <p>
              사고 뒤 Datadog은 세 가지를 바꿨다고 적었습니다. 그 업데이트 경로를 모든 지역에서 껐고, networkd가 재시작해도 라우팅 표를 건드리지 않게 설정을 바꿨고, 비슷한 경로가 더 있는지
              점검했습니다. Datadog은 어떤 설정을 바꿨는지 적지 않았습니다. 같은 효과를 내는 v249 설정은 아래 drop-in이고, 이것은 글쓴이의 추론입니다.
            </p>
          </div>
          <pre className="my-6 overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-6"><code>{`# /etc/systemd/networkd.conf.d/keep-foreign.conf  (예시)
[Network]
ManageForeignRoutingPolicyRules=no   # 남이 만든 ip rule을 지우지 않음
ManageForeignRoutes=no               # 남이 만든 route를 지우지 않음`}</code></pre>
          <div className={prose}>
            <p>
              Ubuntu Server에는 needrestart도 있습니다. apt 작업이 끝날 때 업그레이드된 라이브러리를 쓰는 서비스와 재부팅을 기다리는 커널을 알려 줍니다. 제안
              글은 재시작이 기본 질문형이고 systemd-logind 재시작이 tty와 SSH 세션을 끊을 수 있어 자동 재시작은 선택 사항이라고 적습니다. 업데이트가 재시작을 부른다는
              사실을 운영자에게 드러내는 도구입니다.
            </p>
            <p>
              판단 규칙은 이렇습니다. 패키지 업데이트를 배포로 세고 같은 단계적 배포 도구에 태웁니다. 시험에는 새로 부팅한 노드뿐 아니라 일하고 있는 노드에서 데몬만 재시작하는 경우를 넣습니다.
              노드 상태 검사가 실패했을 때 클라우드가 노드를 바로 지우는지도 미리 알아 둡니다. 로컬 디스크 데이터의 운명이 거기서 갈립니다.
            </p>
            <p>
              변경을 관측하고 되돌리는 공통 원리는 <Link to="/cs/cloud/cloud-reliability-observability-iac#overview">클라우드 신뢰성·관측·IaC 글</Link>에, CNI가 노드에 까는 route와 경계는{" "}
              <Link to="/cs/cloud/kubernetes-network-packet-path#overview">Kubernetes 패킷 경로 글</Link>에 있습니다.
            </p>
          </div>
          <div id="paper-needrestart" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Ubuntu Discourse · needrestart for servers" citeKey={7} href="https://discourse.ubuntu.com/t/needrestart-for-servers/21552">
              <q>By default it will prompt with debconf interface if one wants to restart things.</q> 제안은 ubuntu-server metapackage가 needrestart를 권장 설치하게 하자는 것이고, 재시작은 혼란을 줄 수 있어 선택 사항으로 둡니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 이 분석은 v249 원문과 공개 사후 보고서까지만 말합니다</h2>
          <div className={prose}>
            <p>
              networkd 코드는 systemd v249 태그로 읽었습니다. Ubuntu 22.04는 이 버전에 배포판 패치를 얹은 249.11을 쓰고 이후 systemd 버전은
              기본값과 동작이 다를 수 있습니다. 운영 중인 버전의 networkd.conf(5)를 다시 확인해야 합니다.
            </p>
            <p>
              규칙 일곱 줄과 주소는 Datadog이 공개한 AWS 노드 예시입니다. Cilium의 다른 모드나 다른 CNI는 다른 규칙을 깔고 Datadog은 AWS CNI에서도 같은
              문제가 보고됐다고 적었습니다. 0.5초 실행과 9초 주소는 6절을 위한 가정이며 측정값이 아닙니다.
            </p>
          </div>
          <ContentBoundary article="linux-systemd-boot-change-incidents" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <ol>
              <li>Cilium이 0번 local 규칙을 그대로 두고 그 앞에 99번 규칙만 더했다면, networkd 재시작 뒤 노드 자신의 연결은 어떻게 됐을까요? (답: 3절, 8절)</li>
              <li>api.service가 RestartSec=1.5로 바뀌고 실행 시간이 그대로 0.5초라면 몇 초에 무슨 일이 생길까요? 9초의 주소는 볼 수 있을까요? (답: 6절)</li>
              <li>재부팅 시험만 하는 팀이 networkd 같은 데몬의 업데이트 위험을 잡으려면 시험 하나를 어떻게 바꿔야 할까요? (답: 4절, 11절)</li>
            </ol>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={systemdIncidentTrees}
        projectMetas={{
          systemd: { id: "systemd", label: "systemd v249 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
