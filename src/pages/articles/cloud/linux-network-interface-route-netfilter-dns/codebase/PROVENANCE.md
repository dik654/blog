# Linux network path · veth · routing · netfilter · conntrack · DNS source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING`, `linux/LICENSES/preferred/GPL-2.0`, `linux/LICENSES/exceptions/Linux-syscall-note`. Documentation files are part of the same tree.
- Kubernetes v1.37.1 (tag d2b770f4c94636a992534a8d3156b6b2d8e82ac3). License: Apache-2.0 — see `kubernetes/LICENSE`.
- Linux man-pages project, git master commit c6cefe27dd02beaf518bb654493e5f09e62b3225 (2026-10-17). License: Linux-man-pages-copyleft (resolv.conf(5) additionally BSD-4-Clause-UC) — see `man-pages/LICENSES/`.
- glibc 2.40 (tag glibc-2.40). License: LGPL-2.1-or-later — see `glibc/COPYING.LIB`.
- containernetworking/plugins v1.6.2 (tag 7f756b411efc3d3730c707e2cc1f2baf1a66e28c). License: Apache-2.0 — see `cni-plugins/LICENSE`.

Each top-level directory is a project root; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. All worked numbers in the article (quota periods, cgroup weights, DNS query counts, conntrack sizes) were computed by hand from these formulas with stated assumptions; no kernel or cluster was run.

- `cni-plugins/LICENSE` — 11357 bytes; SHA256 `b40930bbcf80744c86c46a12bc9da056641d722716c378f5659b9e555ef833e1`; [pinned original](https://raw.githubusercontent.com/containernetworking/plugins/v1.6.2/LICENSE)
- `cni-plugins/plugins/main/bridge/bridge.go` — 30222 bytes; SHA256 `aab29bdf4002e286a8eb122b62eae363f89a878c2312b76b156906a8376eba27`; [pinned original](https://raw.githubusercontent.com/containernetworking/plugins/v1.6.2/plugins/main/bridge/bridge.go)
- `glibc/COPYING.LIB` — 26530 bytes; SHA256 `dc626520dcd53a22f727af3ee42c770e56c97a64fe3adb063799d8ab032fe551`; [pinned original](https://sourceware.org/git/?p=glibc.git;a=blob_plain;f=COPYING.LIB;hb=glibc-2.40)
- `glibc/resolv/res_query.c` — 21923 bytes; SHA256 `2430b2f856f325218ced98c2659de1f82223b39ac27ba4cd37823a7b1c57b335`; [pinned original](https://sourceware.org/git/?p=glibc.git;a=blob_plain;f=resolv/res_query.c;hb=glibc-2.40)
- `kubernetes/LICENSE` — 11358 bytes; SHA256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/LICENSE)
- `kubernetes/pkg/kubelet/network/dns/dns.go` — 16893 bytes; SHA256 `c10223dc5b5e1d6b96378f0060da6c120f1b6daf71b61437a04ff7f5c3001990`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/network/dns/dns.go)
- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/Documentation/networking/nf_conntrack-sysctl.rst` — 6595 bytes; SHA256 `1cc4d71c82092e5898b949a42b7c15cc73d1f4005be5a21311205a2342c184b9`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/networking/nf_conntrack-sysctl.rst)
- `linux/drivers/net/veth.c` — 47015 bytes; SHA256 `d15a77baeaf2b326a748e7835f508454df1717e1d96ee037756d7811dc7ff0a4`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/drivers/net/veth.c)
- `linux/include/uapi/linux/netfilter.h` — 1861 bytes; SHA256 `8ea412bca540baad9acd5f5ef831cebd57394be513bb7e9dcb4a9e11dbd6a4fc`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/uapi/linux/netfilter.h)
- `linux/LICENSES/exceptions/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/exceptions/Linux-syscall-note)
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
- `linux/net/bridge/br_input.c` — 12212 bytes; SHA256 `8c1bab8d5dbe76c1f40025e1e64c36a43cf1c7efca975a245a03f7b7279d315e`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/bridge/br_input.c)
- `linux/net/ipv4/fib_rules.c` — 11401 bytes; SHA256 `86e0992de433e6a99930a717c16f3b1227e314b2c7ff39d5f762d222ddca6c76`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/fib_rules.c)
- `linux/net/ipv4/fib_trie.c` — 75161 bytes; SHA256 `f01f0416d3efd884a804a37024ac3a5265a31676ffe4484dec0517be02413aa3`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/fib_trie.c)
- `linux/net/ipv4/ip_input.c` — 19558 bytes; SHA256 `9edfc278895d99c33718d6cac567077edde033f1c77ec7fc879d10a0b48b5da6`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/ip_input.c)
- `linux/net/ipv4/ip_output.c` — 43475 bytes; SHA256 `39af3b45940a3926ab7c82545049af631eec59308fa1bfd2f9a2c0009eda0b1c`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/ip_output.c)
- `linux/net/netfilter/nf_conntrack_core.c` — 74503 bytes; SHA256 `0d6a0d5cad5edae096e59387997463f9e877894d0410d71f145e8b036190048c`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/netfilter/nf_conntrack_core.c)
- `man-pages/LICENSES/BSD-4-Clause-UC.txt` — 1771 bytes; SHA256 `c82a5eb55679a3fd483d992c2428e66ee4b9b05b5b78b4ac916692368955b526`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/LICENSES/BSD-4-Clause-UC.txt)
- `man-pages/LICENSES/Linux-man-pages-copyleft.txt` — 1019 bytes; SHA256 `e7241c6405f8ad70943bcdb0fd83cb79fb25eec601ecf311acc9c72f19794d5a`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/LICENSES/Linux-man-pages-copyleft.txt)
- `man-pages/man/man5/resolv.conf.5` — 12960 bytes; SHA256 `e0fd7d76decf2a0d59e07a3ff56767e2251a53336ae7c733e96e0d1908efdbab`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/man/man5/resolv.conf.5)
