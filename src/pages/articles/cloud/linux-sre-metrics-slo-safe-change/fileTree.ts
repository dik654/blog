import type { FileNode } from "@/components/code/types";

export const linuxSreTrees: Record<string, FileNode> = {
  apt: {
    name: "apt",
    type: "dir",
    children: [
      { name: "debian/apt-daily-upgrade.timer", path: "apt/debian/apt-daily-upgrade.timer", type: "file", codeKey: "apt-upgrade-timer" },
      { name: "debian/apt-daily.timer", path: "apt/debian/apt-daily.timer", type: "file", codeKey: "apt-download-timer" },
      { name: "debian/apt-daily-upgrade.service", path: "apt/debian/apt-daily-upgrade.service", type: "file", codeKey: "apt-upgrade-service" },
    ],
  },
  "unattended-upgrades": {
    name: "unattended-upgrades",
    type: "dir",
    children: [
      { name: "data/50unattended-upgrades.Ubuntu", path: "unattended-upgrades/data/50unattended-upgrades.Ubuntu", type: "file", codeKey: "unattended-origins" },
      { name: "README.md", path: "unattended-upgrades/README.md", type: "file", codeKey: "unattended-readme" },
    ],
  },
  dnf: {
    name: "dnf",
    type: "dir",
    children: [
      { name: "etc/dnf/automatic.conf", path: "dnf/etc/dnf/automatic.conf", type: "file", codeKey: "dnf-automatic-conf" },
      { name: "etc/systemd/dnf-automatic.timer", path: "dnf/etc/systemd/dnf-automatic.timer", type: "file", codeKey: "dnf-automatic-timer" },
      { name: "doc/automatic.rst", path: "dnf/doc/automatic.rst", type: "file", codeKey: "dnf-automatic-doc" },
    ],
  },
};
