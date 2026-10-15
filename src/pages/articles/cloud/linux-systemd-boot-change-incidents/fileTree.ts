import type { FileNode } from "@/components/code/types";

export const systemdIncidentTrees: Record<string, FileNode> = {
  systemd: {
    name: "systemd",
    type: "dir",
    children: [
      { name: "src/network/networkd.c", path: "systemd/src/network/networkd.c", type: "file", codeKey: "networkd-main-order" },
      { name: "src/network/networkd-manager.c", path: "systemd/src/network/networkd-manager.c", type: "file", codeKey: "enumerate-rules" },
      { name: "src/network/networkd-routing-policy-rule.c", path: "systemd/src/network/networkd-routing-policy-rule.c", type: "file", codeKey: "drop-foreign-rules" },
      { name: "src/network/networkd-routing-policy-rule.h", path: "systemd/src/network/networkd-routing-policy-rule.h", type: "file", codeKey: "drop-foreign-wrapper" },
      { name: "src/network/networkd-link.c", path: "systemd/src/network/networkd-link.c", type: "file", codeKey: "link-drop-foreign" },
      { name: "src/network/networkd.conf", path: "systemd/src/network/networkd.conf", type: "file", codeKey: "networkd-conf" },
      { name: "src/core/service.c", path: "systemd/src/core/service.c", type: "file", codeKey: "start-limit-check" },
      { name: "src/core/unit.c", path: "systemd/src/core/unit.c", type: "file", codeKey: "unit-start-limit" },
      { name: "src/basic/ratelimit.c", path: "systemd/src/basic/ratelimit.c", type: "file", codeKey: "ratelimit" },
      { name: "src/core/system.conf.in", path: "systemd/src/core/system.conf.in", type: "file", codeKey: "manager-defaults" },
    ],
  },
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "init/main.c", path: "linux/init/main.c", type: "file", codeKey: "kernel-init-order" },
      { name: "net/core/fib_rules.c", path: "linux/net/core/fib_rules.c", type: "file", codeKey: "fib-rules-protocol" },
    ],
  },
};
