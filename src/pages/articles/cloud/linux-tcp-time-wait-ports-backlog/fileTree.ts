import type { FileNode } from "@/components/code/types";

export const tcpTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "include/net/tcp.h", path: "linux/include/net/tcp.h", type: "file", codeKey: "timewait-len" },
      { name: "include/linux/socket.h", path: "linux/include/linux/socket.h", type: "file", codeKey: "somaxconn-default" },
      { name: "include/net/sock.h", path: "linux/include/net/sock.h", type: "file", codeKey: "acceptq-full" },
      { name: "include/net/inet_connection_sock.h", path: "linux/include/net/inet_connection_sock.h", type: "file", codeKey: "reqsk-full" },
      { name: "net/ipv4/tcp.c", path: "linux/net/ipv4/tcp.c", type: "file", codeKey: "close-fin-wait2" },
      { name: "net/ipv4/tcp_minisocks.c", path: "linux/net/ipv4/tcp_minisocks.c", type: "file", codeKey: "time-wait-timer" },
      { name: "net/ipv4/inet_hashtables.c", path: "linux/net/ipv4/inet_hashtables.c", type: "file", codeKey: "hash-connect" },
      { name: "net/ipv4/tcp_ipv4.c", path: "linux/net/ipv4/tcp_ipv4.c", type: "file", codeKey: "tw-unique" },
      { name: "net/ipv4/tcp_input.c", path: "linux/net/ipv4/tcp_input.c", type: "file", codeKey: "conn-request" },
      { name: "net/ipv4/af_inet.c", path: "linux/net/ipv4/af_inet.c", type: "file", codeKey: "port-range-default" },
      { name: "net/ipv4/tcp_diag.c", path: "linux/net/ipv4/tcp_diag.c", type: "file", codeKey: "listen-diag" },
      { name: "net/ipv4/proc.c", path: "linux/net/ipv4/proc.c", type: "file", codeKey: "snmp-names" },
      { name: "net/socket.c", path: "linux/net/socket.c", type: "file", codeKey: "listen-clamp" },
      { name: "net/core/net_namespace.c", path: "linux/net/core/net_namespace.c", type: "file", codeKey: "somaxconn-init" },
      { name: "net/netfilter/nf_conntrack_core.c", path: "linux/net/netfilter/nf_conntrack_core.c", type: "file", codeKey: "conntrack-full" },
      { name: "Documentation/networking/ip-sysctl.rst", path: "linux/Documentation/networking/ip-sysctl.rst", type: "file", codeKey: "sysctl-doc" },
      { name: "Documentation/networking/nf_conntrack-sysctl.rst", path: "linux/Documentation/networking/nf_conntrack-sysctl.rst", type: "file", codeKey: "conntrack-doc" },
    ],
  },
};
