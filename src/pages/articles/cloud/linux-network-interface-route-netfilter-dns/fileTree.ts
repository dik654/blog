import type { FileNode } from "@/components/code/types";

export const linuxNetworkTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "drivers/net/veth.c", path: "linux/drivers/net/veth.c", type: "file", codeKey: "veth-xmit" },
      { name: "net/bridge/br_input.c", path: "linux/net/bridge/br_input.c", type: "file", codeKey: "bridge-forward" },
      { name: "net/ipv4/fib_rules.c", path: "linux/net/ipv4/fib_rules.c", type: "file", codeKey: "fib-rules-default" },
      { name: "net/ipv4/fib_trie.c", path: "linux/net/ipv4/fib_trie.c", type: "file", codeKey: "fib-trie-lookup" },
      { name: "include/uapi/linux/netfilter.h", path: "linux/include/uapi/linux/netfilter.h", type: "file", codeKey: "nf-hooks-enum" },
      { name: "net/ipv4/ip_input.c", path: "linux/net/ipv4/ip_input.c", type: "file", codeKey: "ip-rcv" },
      { name: "net/ipv4/ip_output.c", path: "linux/net/ipv4/ip_output.c", type: "file", codeKey: "ip-local-out" },
      { name: "net/netfilter/nf_conntrack_core.c", path: "linux/net/netfilter/nf_conntrack_core.c", type: "file", codeKey: "conntrack-in" },
      { name: "Documentation/networking/nf_conntrack-sysctl.rst", path: "linux/Documentation/networking/nf_conntrack-sysctl.rst", type: "file", codeKey: "conntrack-sysctl" },
    ],
  },
  glibc: {
    name: "glibc",
    type: "dir",
    children: [{ name: "resolv/res_query.c", path: "glibc/resolv/res_query.c", type: "file", codeKey: "res-search" }],
  },
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [{ name: "pkg/kubelet/network/dns/dns.go", path: "kubernetes/pkg/kubelet/network/dns/dns.go", type: "file", codeKey: "kubelet-dns" }],
  },
  "cni-plugins": {
    name: "cni-plugins",
    type: "dir",
    children: [{ name: "plugins/main/bridge/bridge.go", path: "cni-plugins/plugins/main/bridge/bridge.go", type: "file", codeKey: "cni-bridge-veth" }],
  },
  "man-pages": {
    name: "man-pages",
    type: "dir",
    children: [{ name: "man/man5/resolv.conf.5", path: "man-pages/man/man5/resolv.conf.5", type: "file", codeKey: "resolv-conf-ndots" }],
  },
};
