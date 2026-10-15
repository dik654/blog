import type { CodeRef } from "@/components/code/types";
import tcpH from "./codebase/linux/include/net/tcp.h?raw";
import socketH from "./codebase/linux/include/linux/socket.h?raw";
import sockH from "./codebase/linux/include/net/sock.h?raw";
import icskH from "./codebase/linux/include/net/inet_connection_sock.h?raw";
import tcpC from "./codebase/linux/net/ipv4/tcp.c?raw";
import tcpMinisocks from "./codebase/linux/net/ipv4/tcp_minisocks.c?raw";
import inetHashtables from "./codebase/linux/net/ipv4/inet_hashtables.c?raw";
import tcpIpv4 from "./codebase/linux/net/ipv4/tcp_ipv4.c?raw";
import tcpInput from "./codebase/linux/net/ipv4/tcp_input.c?raw";
import afInet from "./codebase/linux/net/ipv4/af_inet.c?raw";
import socketC from "./codebase/linux/net/socket.c?raw";
import netNamespace from "./codebase/linux/net/core/net_namespace.c?raw";
import tcpDiag from "./codebase/linux/net/ipv4/tcp_diag.c?raw";
import procC from "./codebase/linux/net/ipv4/proc.c?raw";
import conntrackCore from "./codebase/linux/net/netfilter/nf_conntrack_core.c?raw";
import ipSysctl from "./codebase/linux/Documentation/networking/ip-sysctl.rst?raw";
import conntrackSysctl from "./codebase/linux/Documentation/networking/nf_conntrack-sysctl.rst?raw";

export const codeRefs: Record<string, CodeRef> = {
  "timewait-len": {
    path: "linux/include/net/tcp.h",
    highlight: [126, 134],
    desc: "TIME_WAIT 길이와 FIN_WAIT_2 기본 시간을 정하는 상수입니다. 둘 다 60초에서 출발하지만 쓰이는 자리가 다릅니다.",
    annotations: [
      { lines: [126, 127], color: "sky", note: "TCP_TIMEWAIT_LEN = 60*HZ입니다. sysctl로 바꿀 수 있는 값이 아니라 컴파일된 상수라서 TIME_WAIT 소켓은 60초를 채웁니다." },
      { lines: [128, 133], color: "amber", note: "TCP_FIN_TIMEOUT은 FIN_WAIT_2를 끊는 기본값입니다. 주석이 'FIN_WAIT2 deadlock breaker'라고 적습니다. tcp_fin_timeout sysctl의 기본값이 이 상수입니다." },
    ],
    code: tcpH,
    lang: "c",
  },
  "fin-time": {
    path: "linux/include/net/tcp.h",
    highlight: [1674, 1684],
    desc: "FIN_WAIT_2에서 기다릴 시간을 고르는 함수입니다. 소켓별 TCP_LINGER2가 있으면 그것을, 없으면 tcp_fin_timeout sysctl을 씁니다.",
    annotations: [
      { lines: [1676, 1677], color: "sky", note: "타이머 계산에서 tcp_fin_timeout을 읽는 곳은 이 함수 하나입니다(getsockopt TCP_LINGER2가 기본값을 보고할 때도 읽습니다). 이 함수의 결과는 FIN_WAIT_2 타이머에만 들어갑니다." },
      { lines: [1680, 1681], color: "amber", note: "RTO의 3.5배보다 짧게 잡으면 그 값으로 올립니다. 너무 짧은 값으로 정상 종료를 끊지 않게 하는 하한입니다." },
    ],
    code: tcpH,
    lang: "c",
  },
  "rto-init": {
    path: "linux/include/net/tcp.h",
    highlight: [146, 153],
    desc: "처음 재전송까지 기다리는 시간입니다. 버려진 SYN을 클라이언트가 다시 보내기까지 1초가 걸리는 근거입니다.",
    annotations: [
      { lines: [152, 152], color: "sky", note: "TCP_TIMEOUT_INIT = 1*HZ, RFC 6298의 초기 RTO 1초입니다. accept 대기열이 넘쳐 SYN이 버려지면 응답 시간이 최소 1초 늘어납니다." },
    ],
    code: tcpH,
    lang: "c",
  },
  "close-fin-wait2": {
    path: "linux/net/ipv4/tcp.c",
    highlight: [3150, 3183],
    desc: "애플리케이션이 close()한 뒤 FIN_WAIT_2에 남은 고아 소켓을 처리합니다.",
    annotations: [
      { lines: [3150, 3162], color: "sky", note: "주석이 RFC를 일부러 어긴다고 밝힙니다. 상대가 FIN을 끝내 보내지 않으면 이쪽 소켓이 영원히 남기 때문에 1분 뒤 끊습니다." },
      { lines: [3173, 3180], color: "amber", note: "tcp_fin_time()의 값이 60초 이하이면 tcp_time_wait(sk, TCP_FIN_WAIT2, tmo)로 넘깁니다. 상태 인자가 TIME_WAIT가 아니라 FIN_WAIT2라는 점을 보세요." },
    ],
    code: tcpC,
    lang: "c",
  },
  "linger-zero": {
    path: "linux/net/ipv4/tcp.c",
    highlight: [3087, 3103],
    desc: "close() 때 FIN 대신 RST로 끝내는 분기입니다. 읽지 않은 데이터가 남았거나 SO_LINGER 시간이 0이면 이쪽으로 갑니다.",
    annotations: [
      { lines: [3095, 3098], color: "sky", note: "SO_LINGER를 켜고 시간을 0으로 두면 disconnect로 연결을 즉시 지웁니다. TIME_WAIT는 생기지 않지만 상대는 정상 종료 대신 reset을 받습니다." },
      { lines: [3099, 3103], color: "amber", note: "보통의 close()는 여기서 FIN을 보내는 정상 종료로 갑니다." },
    ],
    code: tcpC,
    lang: "c",
  },
  "time-wait-timer": {
    path: "linux/net/ipv4/tcp_minisocks.c",
    highlight: [300, 365],
    desc: "소켓을 TIME_WAIT 또는 FIN_WAIT_2 미니 소켓으로 바꾸고 타이머를 겁니다.",
    annotations: [
      { lines: [309, 312], color: "sky", note: "전체 소켓 대신 상태 몇 개만 담은 timewait 소켓을 새로 할당합니다. 연결 하나가 남기는 흔적이 작아지는 이유입니다." },
      { lines: [344, 349], color: "amber", note: "state가 TCP_TIME_WAIT이면 넘겨받은 timeo를 버리고 TCP_TIMEWAIT_LEN을 씁니다. tcp_fin_timeout을 10초로 낮춰도 TIME_WAIT는 60초인 이유가 이 두 줄입니다." },
      { lines: [355, 361], color: "violet", note: "할당에 실패하면 TIME_WAIT 없이 닫고 TCPTimeWaitOverflow를 셉니다." },
    ],
    code: tcpMinisocks,
    lang: "c",
  },
  "fin-wait2-to-time-wait": {
    path: "linux/net/ipv4/tcp_minisocks.c",
    highlight: [122, 166],
    desc: "FIN_WAIT_2 미니 소켓에 상대의 FIN이 도착하면 진짜 TIME_WAIT로 바뀝니다.",
    annotations: [
      { lines: [122, 132], color: "sky", note: "FIN_WAIT_2 단계에서는 tcp_rcv_state_process의 검사를 반복합니다." },
      { lines: [154, 166], color: "amber", note: "FIN이 오면 substate를 TCP_TIME_WAIT로 바꾸고 TCP_TIMEWAIT_LEN으로 타이머를 다시 겁니다. FIN_WAIT_2를 짧게 해도 그 뒤 60초는 그대로입니다." },
    ],
    code: tcpMinisocks,
    lang: "c",
  },
  "time-wait-reack": {
    path: "linux/net/ipv4/tcp_minisocks.c",
    highlight: [186, 258],
    desc: "TIME_WAIT 소켓이 다시 온 FIN과 새 SYN을 처리하는 부분입니다. TIME_WAIT가 존재하는 두 이유가 코드로 나타납니다.",
    annotations: [
      { lines: [187, 204], color: "sky", note: "창 안에 정확히 맞는 빈 ACK나 RST만 여기로 옵니다. 빈 ACK면 타이머를 60초로 다시 걸고, RST면 tcp_rfc1337이 꺼져 있을 때 TIME_WAIT를 지웁니다. ACK를 다시 보내지는 않습니다." },
      { lines: [234, 243], color: "amber", note: "이전 연결보다 큰 순서 번호나 새 timestamp를 가진 SYN은 받아서 새 연결로 넘깁니다. 서버 쪽 TIME_WAIT가 같은 클라이언트의 재접속을 대개 막지 않는 이유입니다." },
      { lines: [247, 258], color: "rose", note: "마지막 ACK를 잃은 상대가 FIN을 재전송하면 그 FIN은 창 밖(seq = rcv_nxt − 1)이라 여기로 옵니다. 타이머를 60초로 다시 걸고 tcp_timewait_check_oow_rate_limit가 ACK를 다시 돌려줍니다." },
    ],
    code: tcpMinisocks,
    lang: "c",
  },
  "port-range-default": {
    path: "linux/net/ipv4/af_inet.c",
    highlight: [1800, 1805],
    desc: "자동으로 고르는 출발 포트 범위의 기본값입니다.",
    annotations: [
      { lines: [1805, 1805], color: "sky", note: "상위 16비트 60999, 하위 16비트 32768. 32768부터 60999까지 28,232개입니다." },
    ],
    code: afInet,
    lang: "c",
  },
  "hash-connect": {
    path: "linux/net/ipv4/inet_hashtables.c",
    highlight: [994, 1112],
    desc: "connect()가 출발 포트를 정하지 않았을 때 쓸 수 있는 포트를 찾는 함수입니다.",
    annotations: [
      { lines: [1022, 1028], color: "sky", note: "high++로 [32768, 60999]를 [32768, 61000)으로 바꿉니다. remaining = 28,232입니다. 소켓별 범위가 없으면 step이 2라 짝수 포트를 먼저 훑습니다." },
      { lines: [1032, 1043], color: "amber", note: "시작 위치는 목적지 hash로 고른 table_perturb 칸의 값에 hash를 더해 정합니다. 그 칸은 연결이 성공할 때마다 앞으로 밀리므로(1112행) 같은 목적지라도 매번 다른 자리에서 훑기 시작합니다. 소켓별 범위가 없으면 시작 위치를 짝수로 내립니다." },
      { lines: [1053, 1066], color: "violet", note: "포트에 bind()·listen()한 소켓이 있으면(fastreuse ≥ 0) 건너뜁니다. 아니면 4-tuple이 이미 쓰이는지 check_established에 묻습니다." },
      { lines: [1084, 1089], color: "rose", note: "짝수와 홀수를 다 훑고도 없으면 -EADDRNOTAVAIL. 애플리케이션이 보는 'Cannot assign requested address'입니다." },
      { lines: [1106, 1112], color: "emerald", note: "포트를 찾으면 table_perturb 칸을 훑은 거리(또는 작은 난수)만큼 앞으로 밉니다. 다음 연결은 그 뒤부터 찾기 시작합니다." },
    ],
    code: inetHashtables,
    lang: "c",
  },
  "check-established": {
    path: "linux/net/ipv4/inet_hashtables.c",
    highlight: [538, 602],
    desc: "후보 포트로 만든 4-tuple이 이미 연결 table에 있는지 확인합니다.",
    annotations: [
      { lines: [561, 572], color: "sky", note: "같은 4-tuple이 있으면 실패입니다. 단, 그 소켓이 TIME_WAIT이고 tcp_twsk_unique가 허락하면 그 자리를 넘겨받습니다." },
      { lines: [576, 587], color: "amber", note: "성공하면 TIME_WAIT 소켓을 table에서 빼고 TWRecycled를 셉니다. nstat의 TcpExtTWRecycled가 tw_reuse가 실제로 일한 횟수입니다." },
    ],
    code: inetHashtables,
    lang: "c",
  },
  "tw-unique": {
    path: "linux/net/ipv4/tcp_ipv4.c",
    highlight: [116, 168],
    desc: "TIME_WAIT 소켓의 4-tuple을 새 연결이 넘겨받아도 되는지 판정합니다. tcp_tw_reuse가 읽히는 곳입니다.",
    annotations: [
      { lines: [124, 125], color: "sky", note: "FIN_WAIT_2에서 넘어온 미니 소켓은 재사용하지 않습니다." },
      { lines: [127, 152], color: "amber", note: "기본값 2는 loopback 주소일 때만 허용합니다. 다른 호스트로 가는 연결은 reuse가 0이 됩니다." },
      { lines: [164, 167], color: "violet", note: "그 연결에서 timestamp를 받은 적이 있고 마지막 timestamp를 받은 초가 지나야 넘겨받습니다. timestamp가 없으면 reuse=1이어도 기다립니다." },
    ],
    code: tcpIpv4,
    lang: "c",
  },
  "tcp-defaults": {
    path: "linux/net/ipv4/tcp_ipv4.c",
    highlight: [3428, 3464],
    desc: "network namespace마다 TCP sysctl 기본값을 넣는 부분입니다.",
    annotations: [
      { lines: [3428, 3429], color: "sky", note: "TIME_WAIT 상한은 established hash 크기의 절반, SYN 대기열 상한은 최소 128입니다. 메모리에 비례합니다." },
      { lines: [3449, 3449], color: "amber", note: "syncookies = 1. SYN 대기열이 넘칠 때만 cookie로 응답합니다." },
      { lines: [3454, 3456], color: "violet", note: "tcp_fin_timeout = TCP_FIN_TIMEOUT(60초), tcp_tw_reuse = 2(loopback만)." },
    ],
    code: tcpIpv4,
    lang: "c",
  },
  "listen-clamp": {
    path: "linux/net/socket.c",
    highlight: [1883, 1894],
    desc: "listen(fd, backlog)의 backlog를 somaxconn으로 자르는 곳입니다.",
    annotations: [
      { lines: [1887, 1889], color: "sky", note: "애플리케이션이 65535를 넘겨도 somaxconn이 4096이면 4096이 됩니다. 반대로 511을 넘기면 511 그대로입니다. 둘 중 작은 값이 대기열 길이입니다." },
    ],
    code: socketC,
    lang: "c",
  },
  "somaxconn-default": {
    path: "linux/include/linux/socket.h",
    highlight: [298, 298],
    desc: "somaxconn의 기본값 SOMAXCONN입니다.",
    annotations: [{ lines: [298, 298], color: "sky", note: "4096. ip-sysctl 문서는 linux-5.4 전에는 128이었다고 적습니다." }],
    code: socketH,
    lang: "c",
  },
  "somaxconn-init": {
    path: "linux/net/core/net_namespace.c",
    highlight: [312, 318],
    desc: "network namespace를 만들 때 somaxconn을 SOMAXCONN으로 초기화합니다.",
    annotations: [{ lines: [314, 314], color: "sky", note: "컨테이너마다 namespace가 따로라 somaxconn도 namespace별 값입니다." }],
    code: netNamespace,
    lang: "c",
  },
  "listen-backlog-store": {
    path: "linux/net/ipv4/af_inet.c",
    highlight: [191, 202],
    desc: "잘린 backlog를 listener의 sk_max_ack_backlog에 저장합니다.",
    annotations: [{ lines: [199, 199], color: "sky", note: "accept 대기열과 SYN 대기열 판정이 모두 이 값을 읽습니다." }],
    code: afInet,
    lang: "c",
  },
  "acceptq-full": {
    path: "linux/include/net/sock.h",
    highlight: [1027, 1030],
    desc: "accept 대기열이 찼는지 판정합니다.",
    annotations: [{ lines: [1029, 1029], color: "sky", note: ">= 가 아니라 > 입니다. backlog 511이면 512개까지 들어가고 513번째부터 막힙니다." }],
    code: sockH,
    lang: "c",
  },
  "reqsk-full": {
    path: "linux/include/net/inet_connection_sock.h",
    highlight: [282, 285],
    desc: "SYN 대기열(handshake가 끝나지 않은 요청)이 찼는지 판정합니다.",
    annotations: [{ lines: [284, 284], color: "sky", note: "v6.12에서는 SYN 대기열 길이도 같은 sk_max_ack_backlog와 비교합니다. tcp_max_syn_backlog는 cookie가 꺼졌을 때 마지막 4분의 1을 아끼는 데 쓰입니다." }],
    code: icskH,
    lang: "c",
  },
  "conn-request": {
    path: "linux/net/ipv4/tcp_input.c",
    highlight: [7177, 7221],
    desc: "listener가 SYN을 받았을 때 대기열을 확인하는 앞부분입니다.",
    annotations: [
      { lines: [7204, 7213], color: "sky", note: "SYN 대기열이 차면 tcp_syn_flood_action이 cookie를 쓸지 정합니다. cookie를 못 쓰면 drop입니다." },
      { lines: [7215, 7218], color: "amber", note: "accept 대기열이 차 있으면 cookie와 상관없이 SYN을 버리고 ListenOverflows를 셉니다. 클라이언트는 1초 뒤 SYN을 다시 보냅니다." },
    ],
    code: tcpInput,
    lang: "c",
  },
  "syn-flood-action": {
    path: "linux/net/ipv4/tcp_input.c",
    highlight: [7081, 7114],
    desc: "SYN 대기열이 넘칠 때 cookie로 응답할지, 버릴지 정하고 경고를 남깁니다.",
    annotations: [
      { lines: [7091, 7098], color: "sky", note: "syncookies가 켜져 있으면 TCPReqQFullDoCookies, 꺼져 있으면 TCPReqQFullDrop을 셉니다." },
      { lines: [7100, 7111], color: "amber", note: "dmesg의 'Possible SYN flooding on port ...' 문장이 여기서 나옵니다. 공격이 아니어도 정상 요청이 몰리면 찍힙니다." },
    ],
    code: tcpInput,
    lang: "c",
  },
  "syn-backlog-quarter": {
    path: "linux/net/ipv4/tcp_input.c",
    highlight: [7258, 7275],
    desc: "cookie가 꺼져 있을 때 SYN 대기열의 마지막 4분의 1을 이미 아는 상대에게 남겨 둡니다.",
    annotations: [{ lines: [7260, 7266], color: "sky", note: "tcp_max_syn_backlog가 실제로 쓰이는 곳입니다. syncookies=1(기본)이면 이 분기는 건너뜁니다." }],
    code: tcpInput,
    lang: "c",
  },
  "syn-recv-overflow": {
    path: "linux/net/ipv4/tcp_ipv4.c",
    highlight: [1739, 1760],
    desc: "handshake의 마지막 ACK가 왔을 때 새 소켓을 만들기 전에 accept 대기열을 한 번 더 봅니다.",
    annotations: [{ lines: [1757, 1758], color: "sky", note: "여기서 넘치면 ACK를 버립니다. 클라이언트는 연결이 됐다고 믿고 데이터를 보내지만 서버에는 아직 소켓이 없습니다. tcp_abort_on_overflow=0(기본)이면 SYN-ACK 재전송으로 회복을 기다립니다." }],
    code: tcpIpv4,
    lang: "c",
  },
  "listen-diag": {
    path: "linux/net/ipv4/tcp_diag.c",
    highlight: [19, 33],
    desc: "ss가 보여 주는 Recv-Q·Send-Q의 출처입니다.",
    annotations: [{ lines: [23, 25], color: "sky", note: "LISTEN 소켓의 Recv-Q는 지금 accept를 기다리는 연결 수, Send-Q는 대기열 상한입니다. 연결된 소켓에서는 뜻이 다릅니다." }],
    code: tcpDiag,
    lang: "c",
  },
  "snmp-names": {
    path: "linux/net/ipv4/proc.c",
    highlight: [186, 252],
    desc: "nstat과 /proc/net/netstat에 찍히는 counter 이름입니다.",
    annotations: [
      { lines: [195, 196], color: "sky", note: "ListenOverflows는 대기열이 차서 버린 수, ListenDrops는 listener에서 버린 전체 수입니다." },
      { lines: [250, 252], color: "amber", note: "TCPTimeWaitOverflow, TCPReqQFullDoCookies, TCPReqQFullDrop." },
    ],
    code: procC,
    lang: "c",
  },
  "conntrack-full": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [1655, 1671],
    desc: "conntrack 항목을 새로 만들 때 table 상한을 넘으면 packet을 버립니다.",
    annotations: [{ lines: [1663, 1669], color: "sky", note: "오래된 항목을 하나 지우는 early_drop도 실패하면 'nf_conntrack: table full, dropping packet'을 찍고 새 연결의 packet을 버립니다." }],
    code: conntrackCore,
    lang: "c",
  },
  "conntrack-size": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [2632, 2657],
    desc: "conntrack hash 크기와 nf_conntrack_max 기본값을 메모리로 정합니다.",
    annotations: [{ lines: [2635, 2650], color: "sky", note: "64비트에서 메모리가 4GiB를 넘으면 262,144 bucket이고 max_factor 1이라 nf_conntrack_max도 262,144입니다." }],
    code: conntrackCore,
    lang: "c",
  },
  "sysctl-doc": {
    path: "linux/Documentation/networking/ip-sysctl.rst",
    highlight: [455, 465],
    desc: "커널 문서가 정의한 tcp_fin_timeout입니다.",
    annotations: [
      { lines: [455, 465], color: "sky", note: "'orphaned connection'이 FIN_WAIT_2에 머무는 시간이라고 적습니다. TIME_WAIT라는 말은 없습니다." },
    ],
    code: ipSysctl,
    lang: "c",
  },
  "sysctl-doc-ports": {
    path: "linux/Documentation/networking/ip-sysctl.rst",
    highlight: [1341, 1390],
    desc: "출발 포트 범위, 예약 포트, 특권 포트 경계를 설명하는 문서입니다.",
    annotations: [
      { lines: [1341, 1348], color: "sky", note: "기본 32768–60999. 문서는 두 끝의 짝·홀을 다르게 두라고만 권합니다. 이유는 inet_hashtables.c 1037–1038행 주석에 있습니다. connect는 low와 같은 짝·홀을 먼저, bind(inet_csk_get_port)는 반대쪽을 먼저 씁니다." },
      { lines: [1350, 1356], color: "amber", note: "ip_local_reserved_ports에 넣은 포트는 자동 배정에서 빠집니다. 범위를 넓힐 때 서비스 포트를 지키는 수단입니다." },
    ],
    code: ipSysctl,
    lang: "c",
  },
  "sysctl-doc-listen": {
    path: "linux/Documentation/networking/ip-sysctl.rst",
    highlight: [324, 335],
    desc: "somaxconn과 tcp_abort_on_overflow 문서입니다.",
    annotations: [{ lines: [324, 327], color: "sky", note: "기본 4096, linux-5.4 전에는 128이었다고 적습니다." }],
    code: ipSysctl,
    lang: "c",
  },
  "sysctl-doc-reuse": {
    path: "linux/Documentation/networking/ip-sysctl.rst",
    highlight: [990, 1001],
    desc: "tcp_tw_reuse 문서입니다.",
    annotations: [{ lines: [990, 1001], color: "sky", note: "0, 1, 2(loopback만, 기본). 전문가의 조언 없이 바꾸지 말라고 적습니다." }],
    code: ipSysctl,
    lang: "c",
  },
  "sysctl-doc-syncookies": {
    path: "linux/Documentation/networking/ip-sysctl.rst",
    highlight: [791, 812],
    desc: "tcp_syncookies 문서입니다.",
    annotations: [{ lines: [797, 802], color: "sky", note: "cookie는 대비책이지 정상 요청이 많은 서버를 버티게 하는 수단이 아니라고 적습니다. 경고가 보이면 다른 값을 고치라고 합니다." }],
    code: ipSysctl,
    lang: "c",
  },
  "conntrack-doc": {
    path: "linux/Documentation/networking/nf_conntrack-sysctl.rst",
    highlight: [95, 101],
    desc: "nf_conntrack_max 문서입니다.",
    annotations: [{ lines: [95, 101], color: "sky", note: "기본값은 nf_conntrack_buckets와 같습니다. 같은 문서에서 TCP TIME_WAIT 항목의 기본 수명은 120초입니다." }],
    code: conntrackSysctl,
    lang: "c",
  },
};
