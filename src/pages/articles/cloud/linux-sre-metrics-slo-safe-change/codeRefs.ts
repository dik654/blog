import type { CodeRef } from "@/components/code/types";
import aptUpgradeTimer from "./codebase/apt/debian/apt-daily-upgrade.timer?raw";
import aptDownloadTimer from "./codebase/apt/debian/apt-daily.timer?raw";
import aptUpgradeService from "./codebase/apt/debian/apt-daily-upgrade.service?raw";
import unattendedUbuntu from "./codebase/unattended-upgrades/data/50unattended-upgrades.Ubuntu?raw";
import unattendedReadme from "./codebase/unattended-upgrades/README.md?raw";
import dnfAutomaticConf from "./codebase/dnf/etc/dnf/automatic.conf?raw";
import dnfAutomaticRst from "./codebase/dnf/doc/automatic.rst?raw";
import dnfAutomaticTimer from "./codebase/dnf/etc/systemd/dnf-automatic.timer?raw";

export const codeRefs: Record<string, CodeRef> = {
  "apt-upgrade-timer": {
    path: "apt/debian/apt-daily-upgrade.timer",
    highlight: [1, 12],
    desc: "Ubuntu·Debian이 설치하는 apt-daily-upgrade.timer입니다. Datadog의 모든 노드가 06:00~07:00 UTC에 함께 업그레이드를 돌린 이유가 이 세 줄입니다.",
    annotations: [
      { lines: [6, 6], color: "sky", note: "매일 06:00. 시간대 설정이 UTC인 클라우드 이미지에서는 전 세계 모든 노드가 같은 시각을 가리킵니다." },
      { lines: [7, 7], color: "amber", note: "최대 60분의 무작위 지연. 한 서버 안에서는 분산이지만 fleet 전체로 보면 '06:00~07:00 사이 모두'라는 뜻입니다. 지역·클라우드 사이 상관관계를 끊어 주지 않습니다." },
      { lines: [8, 8], color: "violet", note: "Persistent=true: 꺼져 있어 놓친 실행은 부팅 뒤 바로 보충합니다. 변경 시각이 더 예측하기 어려워지는 쪽입니다." },
    ],
    code: aptUpgradeTimer,
    lang: "python",
  },
  "apt-download-timer": {
    path: "apt/debian/apt-daily.timer",
    highlight: [1, 10],
    desc: "패키지 목록·파일을 내려받는 쪽 timer입니다. 06:00과 18:00에 최대 12시간 지연이라 사실상 하루 종일 아무 때나 내려받습니다.",
    annotations: [
      { lines: [5, 6], color: "sky", note: "하루 두 번, 최대 12시간 지연. Datadog 글이 '18:50 UTC 전에 18:00 다운로드를 끝낸 노드는 새 systemd를 받지 못해 무사했다'고 적은 것이 이 지연 때문입니다." },
    ],
    code: aptDownloadTimer,
    lang: "python",
  },
  "apt-upgrade-service": {
    path: "apt/debian/apt-daily-upgrade.service",
    highlight: [1, 13],
    desc: "timer가 실제로 실행하는 service입니다. 의존 순서에 systemd-networkd.service가 적혀 있어, 업그레이드가 네트워크 데몬 뒤에 돈다는 점이 보입니다.",
    annotations: [
      { lines: [5, 5], color: "sky", note: "After=… systemd-networkd.service: 업그레이드는 networkd가 뜬 뒤에 돕니다. 그 업그레이드가 systemd 패키지면 networkd 자체를 재시작하게 되는데, 그 재시작이 Datadog 사건의 방아쇠였습니다." },
      { lines: [10, 10], color: "amber", note: "apt.systemd.daily install이 unattended-upgrade를 호출합니다. 어떤 패키지를 올릴지는 다음 파일(50unattended-upgrades)이 정합니다." },
      { lines: [12, 12], color: "violet", note: "TimeoutStartSec=12hours. 한 번의 업그레이드가 길게 이어질 수 있다는 가정이 들어 있습니다." },
    ],
    code: aptUpgradeService,
    lang: "python",
  },
  "unattended-origins": {
    path: "unattended-upgrades/data/50unattended-upgrades.Ubuntu",
    highlight: [1, 20],
    desc: "Ubuntu 기본 Allowed-Origins입니다. Datadog 글이 인용한 바로 그 파일로, 보안 업데이트 채널만 자동 적용하도록 되어 있습니다.",
    annotations: [
      { lines: [6, 8], color: "sky", note: "release 포켓과 -security 포켓을 허용합니다. 3월 7일의 systemd CVE 패치(249.11-0ubuntu3.7)는 -security라 자동 적용 대상이었습니다." },
      { lines: [17, 19], color: "amber", note: "-updates·-proposed·-backports는 주석 처리되어 기본으로 꺼져 있습니다. '보안만'이라는 범위 제한이 변경 횟수를 줄여 주지만, 보안 패치 자체가 데몬 재시작을 동반하는 경우는 막지 못합니다." },
    ],
    code: unattendedUbuntu,
    lang: "python",
  },
  "unattended-readme": {
    path: "unattended-upgrades/README.md",
    highlight: [15, 35],
    desc: "unattended-upgrades의 기본 동작 설명입니다. 하루 한 번, origin·archive로 범위를 정합니다.",
    annotations: [
      { lines: [17, 17], color: "sky", note: "'By default unattended-upgrades runs an update every day.' 설치만 해도 두 번째 변경 경로가 생깁니다." },
      { lines: [28, 30], color: "amber", note: "기본은 main과 security archive, 곧 안정·보안 업데이트만 적용합니다." },
    ],
    code: unattendedReadme,
    lang: "python",
  },
  "dnf-automatic-conf": {
    path: "dnf/etc/dnf/automatic.conf",
    highlight: [1, 30],
    desc: "RHEL·Fedora 계열의 dnf-automatic 기본 설정입니다. 내려받기는 켜져 있고 적용은 꺼져 있다는 점이 Ubuntu 기본과 다릅니다.",
    annotations: [
      { lines: [5, 5], color: "sky", note: "upgrade_type = default: 보안만이 아니라 모든 업데이트가 대상입니다. security로 바꾸면 Ubuntu 기본과 비슷해집니다." },
      { lines: [17, 22], color: "amber", note: "download_updates = yes, apply_updates = no. 기본 timer로는 내려받기만 하고 설치하지 않습니다. 설치까지 하려면 apply_updates를 켜거나 dnf-automatic-install.timer를 씁니다." },
      { lines: [28, 28], color: "violet", note: "reboot = never. 커널·systemd 업데이트 뒤에도 자동 재부팅하지 않습니다. when-needed로 바꾸면 재부팅까지 자동입니다." },
    ],
    code: dnfAutomaticConf,
    lang: "python",
  },
  "dnf-automatic-doc": {
    path: "dnf/doc/automatic.rst",
    highlight: [60, 85],
    desc: "dnf-automatic 매뉴얼의 [commands] 절입니다. apply_updates 기본값이 False임을 문서가 확인합니다.",
    annotations: [
      { lines: [66, 69], color: "sky", note: "apply_updates 기본 False. download_updates를 함의합니다." },
      { lines: [81, 84], color: "amber", note: "random_sleep 기본 0이지만 systemd timer가 따로 최대 1시간 무작위 지연을 겁니다. apt와 같은 모양입니다." },
    ],
    code: dnfAutomaticRst,
    lang: "python",
  },
  "dnf-automatic-timer": {
    path: "dnf/etc/systemd/dnf-automatic.timer",
    highlight: [7, 10],
    desc: "dnf-automatic.timer도 06:00에 최대 60분 지연입니다. 배포판이 달라도 '새벽 6시 한 시간 창'이라는 기본은 같습니다.",
    annotations: [
      { lines: [8, 9], color: "sky", note: "OnCalendar 06:00, RandomizedDelaySec 60m. Ubuntu의 apt-daily-upgrade.timer와 같은 창입니다." },
    ],
    code: dnfAutomaticTimer,
    lang: "python",
  },
};
