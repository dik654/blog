import type { CodeRef } from "@/components/code/types";
import kernelMain from "./codebase/linux/init/main.c?raw";
import fibRules from "./codebase/linux/net/core/fib_rules.c?raw";
import networkdMain from "./codebase/systemd/src/network/networkd.c?raw";
import networkdManager from "./codebase/systemd/src/network/networkd-manager.c?raw";
import ruleC from "./codebase/systemd/src/network/networkd-routing-policy-rule.c?raw";
import ruleH from "./codebase/systemd/src/network/networkd-routing-policy-rule.h?raw";
import networkdLink from "./codebase/systemd/src/network/networkd-link.c?raw";
import networkdConf from "./codebase/systemd/src/network/networkd.conf?raw";
import serviceC from "./codebase/systemd/src/core/service.c?raw";
import unitC from "./codebase/systemd/src/core/unit.c?raw";
import ratelimitC from "./codebase/systemd/src/basic/ratelimit.c?raw";
import systemConf from "./codebase/systemd/src/core/system.conf.in?raw";

export const codeRefs: Record<string, CodeRef> = {
  "kernel-init-order": {
    path: "linux/init/main.c",
    highlight: [1494, 1533],
    desc: "커널이 부팅 마지막에 PID 1로 실행할 프로그램을 고르는 순서입니다.",
    annotations: [
      { lines: [1494, 1500], color: "sky", note: "initramfs가 있으면 그 안의 /init(162행 기본값)을 먼저 실행합니다. 성공하면 이 함수는 돌아오지 않는 대신 0을 돌려주고, 그 프로그램이 PID 1이 됩니다." },
      { lines: [1508, 1514], color: "amber", note: "커널 명령행에 init=을 줬다면 그것만 시도하고, 실패하면 다른 후보로 넘어가지 않고 panic합니다." },
      { lines: [1516, 1523], color: "emerald", note: "빌드 설정 CONFIG_DEFAULT_INIT이 있으면 아래 네 후보보다 먼저 시도합니다." },
      { lines: [1525, 1532], color: "violet", note: "아무 지정이 없으면 /sbin/init, /etc/init, /bin/init, /bin/sh 순서로 시도합니다. 대부분의 배포판에서 /sbin/init은 systemd를 가리킵니다." },
    ],
    code: kernelMain,
    lang: "c",
  },
  "networkd-main-order": {
    path: "systemd/src/network/networkd.c",
    highlight: [84, 100],
    desc: "systemd-networkd 프로세스가 시작할 때마다 밟는 네 단계입니다. 부팅이든 패키지 업데이트 뒤 재시작이든 같은 코드가 돕니다.",
    annotations: [
      { lines: [84, 90], color: "sky", note: "networkd.conf와 .network 파일을 읽습니다. ManageForeignRoutingPolicyRules=도 이때 정해집니다." },
      { lines: [92, 94], color: "amber", note: "커널에 이미 있는 link·주소·route·규칙을 netlink로 모두 읽어 옵니다. 실행 중인 노드라면 Cilium이 깐 규칙도 이 목록에 들어옵니다." },
      { lines: [96, 98], color: "rose", note: "manager_start는 속도 측정기와 상태 파일만 준비합니다. link 설정과 남의 규칙 삭제는 102행의 READY 알림 뒤 이벤트 루프에서 link 정보가 도착할 때 일어납니다(networkd-link.c 1155–1161행)." },
    ],
    code: networkdMain,
    lang: "c",
  },
  "manage-foreign-default": {
    path: "systemd/src/network/networkd-manager.c",
    highlight: [380, 392],
    desc: "Manager 구조체의 초기값입니다. 설정 파일이 아무 말도 하지 않으면 남이 만든 route와 규칙도 networkd가 관리합니다.",
    annotations: [
      { lines: [386, 387], color: "rose", note: "manage_foreign_routes와 manage_foreign_rules가 둘 다 true입니다. networkd.conf(5)의 Defaults to yes가 이 두 줄입니다." },
    ],
    code: networkdManager,
    lang: "c",
  },
  "enumerate-rules": {
    path: "systemd/src/network/networkd-manager.c",
    highlight: [664, 679],
    desc: "시작할 때 커널의 정책 라우팅 규칙을 전부 읽어 오는 함수입니다.",
    annotations: [
      { lines: [671, 672], color: "emerald", note: "ManageForeignRoutingPolicyRules=no면 여기서 바로 돌아갑니다. 읽은 규칙이 없으니 나중에 지울 목록도 비어 있습니다." },
      { lines: [674, 678], color: "sky", note: "RTM_GETRULE로 커널에 규칙 목록을 요청하고, 한 줄마다 manager_rtnl_process_rule을 부릅니다." },
    ],
    code: networkdManager,
    lang: "c",
  },
  "kernel-rules-table": {
    path: "systemd/src/network/networkd-routing-policy-rule.c",
    highlight: [823, 844],
    desc: "커널이 FRA_PROTOCOL을 보내지 않을 때만 쓰는 대체 목록입니다. 4.17 이후 커널은 protocol을 늘 보내므로 Datadog 노드(5.15)에서는 이 표가 아니라 protocol 값이 판정합니다.",
    annotations: [
      { lines: [824, 826], color: "sky", note: "IPv4는 0번 local, 32766번 main, 32767번 default입니다. IPv6는 0번과 32766번 두 줄입니다." },
      { lines: [839, 843], color: "amber", note: "protocol이 없는 옛 커널에서는 표의 한 줄과 우선순위·table·동작이 모두 같아야 커널 규칙으로 봅니다." },
    ],
    code: ruleC,
    lang: "c",
  },
  "fib-rules-protocol": {
    path: "linux/net/core/fib_rules.c",
    highlight: [56, 72],
    desc: "부팅 때 커널이 기본 규칙(0·32766·32767)을 직접 만드는 함수입니다. Ubuntu 22.04의 5.15 커널도 같은 코드를 갖고 있습니다.",
    annotations: [{ lines: [69, 69], color: "sky", note: "커널이 만든 규칙에는 protocol RTPROT_KERNEL을 붙입니다. networkd는 653–655행에서 이 값을 보고 건너뜁니다." }],
    code: fibRules,
    lang: "c",
  },
  "fib-rules-user-proto": {
    path: "linux/net/core/fib_rules.c",
    highlight: [555, 560],
    desc: "사용자 공간이 규칙을 넣을 때 protocol을 정하는 곳입니다.",
    annotations: [{ lines: [559, 560], color: "amber", note: "FRA_PROTOCOL 없이 넣은 규칙은 RTPROT_UNSPEC이 됩니다. Cilium의 규칙은 kernel이 아니므로 networkd가 남의 규칙으로 지웁니다." }],
    code: fibRules,
    lang: "c",
  },
  "fib-rules-report": {
    path: "linux/net/core/fib_rules.c",
    highlight: [1008, 1032],
    desc: "규칙 목록을 netlink로 알려 줄 때 한 줄을 채우는 함수입니다.",
    annotations: [{ lines: [1031, 1032], color: "rose", note: "모든 규칙에 FRA_PROTOCOL을 붙입니다. 그래서 networkd는 커널 규칙 표 대신 이 값으로 판정합니다." }],
    code: fibRules,
    lang: "c",
  },
  "remember-foreign": {
    path: "systemd/src/network/networkd-routing-policy-rule.c",
    highlight: [1025, 1043],
    desc: "커널에서 받은 규칙 한 줄을 커널 규칙, 이미 아는 규칙, 남의 규칙 중 하나로 분류합니다.",
    annotations: [
      { lines: [1025, 1028], color: "sky", note: "커널이 protocol을 붙여 보내지 않았으면 위 표와 비교해 kernel 또는 static을 붙입니다." },
      { lines: [1033, 1043], color: "rose", note: "networkd가 만든 적 없는 규칙은 rules_foreign 집합에 넣어 둡니다. 1036행의 조건은 routes 플래그를 보지만, 규칙 플래그가 꺼져 있으면 671행에서 애초에 읽지 않습니다." },
    ],
    code: ruleC,
    lang: "c",
  },
  "drop-foreign-rules": {
    path: "systemd/src/network/networkd-routing-policy-rule.c",
    highlight: [644, 668],
    desc: "기억해 둔 남의 규칙을 하나씩 지우는 함수입니다.",
    annotations: [
      { lines: [651, 655], color: "sky", note: "protocol이 kernel인 규칙만 건너뜁니다. Cilium 규칙 9·20·100·109·111번은 여기를 통과하지 못합니다." },
      { lines: [657, 663], color: "amber", note: ".network 파일이 같은 규칙을 원하면 남깁니다. Cilium 규칙은 .network 파일에 없으므로 남지 않습니다." },
      { lines: [665, 667], color: "rose", note: "netlink로 RTM_DELRULE을 보냅니다. 노드가 끊기는 순간입니다." },
    ],
    code: ruleC,
    lang: "c",
  },
  "drop-foreign-wrapper": {
    path: "systemd/src/network/networkd-routing-policy-rule.h",
    highlight: [64, 70],
    desc: "foreign=true로 같은 함수를 부르는 얇은 포장입니다.",
    annotations: [{ lines: [65, 67], color: "sky", note: "link 하나를 설정할 때 이 함수가 노드 전체의 남의 규칙을 지웁니다. except 인자가 NULL이라 어떤 link도 예외가 아닙니다." }],
    code: ruleH,
    lang: "c",
  },
  "link-drop-foreign": {
    path: "systemd/src/network/networkd-link.c",
    highlight: [997, 1022],
    desc: "link 하나를 설정하기 전에 남이 만든 route·주소·이웃·규칙을 정리합니다.",
    annotations: [
      { lines: [1003, 1015], color: "sky", note: "route와 주소는 link 단위로 정리합니다." },
      { lines: [1017, 1019], color: "rose", note: "규칙은 link 단위가 아니라 manager 전체 목록을 지웁니다. 관리하는 link 하나만 있어도 노드의 모든 남의 규칙이 대상입니다." },
    ],
    code: networkdLink,
    lang: "c",
  },
  "link-configure-call": {
    path: "systemd/src/network/networkd-link.c",
    highlight: [1155, 1161],
    desc: "link_configure 안에서 정리 함수를 부르는 조건입니다.",
    annotations: [{ lines: [1157, 1158], color: "amber", note: "loopback이 아니고 KeepConfiguration=yes가 아니면 정리합니다. .network 파일 쪽에서 막는 다른 손잡이입니다." }],
    code: networkdLink,
    lang: "c",
  },
  "networkd-conf": {
    path: "systemd/src/network/networkd.conf",
    highlight: [16, 20],
    desc: "패키지에 들어 있는 기본 설정 파일입니다. 주석은 컴파일된 기본값을 보여 줍니다.",
    annotations: [{ lines: [18, 19], color: "emerald", note: "Datadog은 사고 뒤 networkd가 재시작해도 라우팅 표를 건드리지 않도록 설정을 바꿨다고 적었지만 어느 설정인지는 밝히지 않았습니다. 이 두 줄을 no로 바꾸는 drop-in은 같은 효과를 내는 설정이라는 글쓴이의 추론입니다." }],
    code: networkdConf,
    lang: "c",
  },
  "restart-decision": {
    path: "systemd/src/core/service.c",
    highlight: [1730, 1762],
    desc: "서비스 프로세스가 죽은 뒤 자동 재시작을 예약하는 부분입니다.",
    annotations: [
      { lines: [1736, 1741], color: "sky", note: "Restart= 설정과 종료 결과로 재시작 여부를 정합니다. on-failure는 정상 종료가 아니면 재시작합니다(1675–1676행)." },
      { lines: [1750, 1758], color: "amber", note: "RestartSec(restart_usec)만큼 뒤에 타이머를 걸고 auto-restart 상태로 기다립니다. 기본 100ms입니다." },
    ],
    code: serviceC,
    lang: "c",
  },
  "start-limit-check": {
    path: "systemd/src/core/service.c",
    highlight: [2414, 2448],
    desc: "시작 요청이 들어올 때마다 시작 횟수 한도를 먼저 확인합니다. 자동 재시작도 이 함수를 지납니다.",
    annotations: [
      { lines: [2443, 2448], color: "rose", note: "한도를 넘으면 start-limit-hit 결과로 failed 상태가 되고 자동 재시작도 허락하지 않습니다(false 인자)." },
    ],
    code: serviceC,
    lang: "c",
  },
  "unit-start-limit": {
    path: "systemd/src/core/unit.c",
    highlight: [1771, 1791],
    desc: "unit마다 하나씩 있는 rate limiter를 확인하고, 넘으면 Start request repeated too quickly를 남깁니다.",
    annotations: [{ lines: [1781, 1782], color: "amber", note: "journalctl에서 보는 그 경고 문장이 여기서 나옵니다." }],
    code: unitC,
    lang: "c",
  },
  ratelimit: {
    path: "systemd/src/basic/ratelimit.c",
    highlight: [11, 38],
    desc: "창의 시작 시각과 그 안의 횟수만 기억하는 단순한 고정 창 카운터입니다.",
    annotations: [
      { lines: [21, 27], color: "sky", note: "첫 요청이거나 창이 시작된 지 interval보다 오래 지났으면 창을 새로 열고 횟수를 0으로 되돌립니다. 정확히 10초는 아직 같은 창입니다(> 비교)." },
      { lines: [30, 33], color: "rose", note: "같은 창 안에서 이미 burst번 허락했다면 거절합니다. 5번까지 통과하고 6번째가 막힙니다." },
    ],
    code: ratelimitC,
    lang: "c",
  },
  "manager-defaults": {
    path: "systemd/src/core/system.conf.in",
    highlight: [44, 49],
    desc: "unit 파일이 값을 적지 않았을 때 쓰는 manager 기본값입니다.",
    annotations: [{ lines: [45, 49], color: "sky", note: "TimeoutStopSec 90초, RestartSec 100ms, 시작 한도 10초에 5번입니다." }],
    code: systemConf,
    lang: "c",
  },
};
