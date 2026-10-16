# Linux containers · cgroup v2 · namespaces · capabilities source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING`, `linux/LICENSES/preferred/GPL-2.0`, `linux/LICENSES/exceptions/Linux-syscall-note`. Documentation files are part of the same tree.
- Kubernetes v1.37.1 (tag d2b770f4c94636a992534a8d3156b6b2d8e82ac3). License: Apache-2.0 — see `kubernetes/LICENSE`.
- Linux man-pages project, git master commit c6cefe27dd02beaf518bb654493e5f09e62b3225 (2026-10-17). License: Linux-man-pages-copyleft (resolv.conf(5) additionally BSD-4-Clause-UC) — see `man-pages/LICENSES/`.

Each top-level directory is a project root; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. All worked numbers in the article (quota periods, cgroup weights, DNS query counts, conntrack sizes) were computed by hand from these formulas with stated assumptions; no kernel or cluster was run.

- `kubernetes/LICENSE` — 11358 bytes; SHA256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/LICENSE)
- `kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go` — 16360 bytes; SHA256 `9519fd52b52eca59bb4bbb59c41df3e6199846dbfc1637ffa11780e8a84f2a87`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/cm/cgroup_manager_linux.go)
- `kubernetes/pkg/kubelet/cm/helpers_linux.go` — 15613 bytes; SHA256 `36f852204d2f4fc9f9378f93c1b1820172bd155e99e3e94e477cdfd1c55e1af4`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/cm/helpers_linux.go)
- `kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go` — 28327 bytes; SHA256 `c5eda5a1c54abfd65d25f4143aa5bae4c2af22cd580d1fafe09ec3ab58863df9`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go)
- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/Documentation/accounting/psi.rst` — 6792 bytes; SHA256 `11c6b7129103b4547c31895cb1cfc0ff75b741c95a24bfcaeb01dece37b82692`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/accounting/psi.rst)
- `linux/Documentation/admin-guide/cgroup-v2.rst` — 122258 bytes; SHA256 `ad3bd37498a57cc249326fd5c2d609669b32611fe69d126df3c3abec1539f572`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/admin-guide/cgroup-v2.rst)
- `linux/include/linux/nsproxy.h` — 3755 bytes; SHA256 `2b76160db39bb21e8c05478f236f19f66c1da9a393ee3081c8a1c24290eceeb9`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/nsproxy.h)
- `linux/include/uapi/linux/capability.h` — 13578 bytes; SHA256 `ee832adca0d6db0866ddbf1dd3426c5a0df63901bf255bde77e4d8305cf5b5e0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/uapi/linux/capability.h)
- `linux/include/uapi/linux/sched.h` — 6302 bytes; SHA256 `2081b07cee6adab443e4ba320d0ccb13db4c97bed64f3eefafbfde2f25c833a4`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/uapi/linux/sched.h)
- `linux/kernel/sched/core.c` — 278224 bytes; SHA256 `4b9bdb7831e1d2b747a9bcbf3e1c7bef187dd1c0555e6cc959fd2118046345bd`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/core.c)
- `linux/kernel/sched/fair.c` — 373040 bytes; SHA256 `48c485811e4d20cca0204ea75a24da71777e42a66b6ce158f8ece09132635d7d`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/fair.c)
- `linux/kernel/sched/sched.h` — 104497 bytes; SHA256 `a34153b995cc32242235e5ed42fca15f2fe0ac6b03fbdc060120c5f87e615e68`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/sched.h)
- `linux/LICENSES/exceptions/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/exceptions/Linux-syscall-note)
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
- `linux/net/ipv4/af_inet.c` — 51923 bytes; SHA256 `4a055450bbb5d8e578ca2f44e4be31e262d1ced7b2fee9b129027b499ec98eac`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/af_inet.c)
- `man-pages/LICENSES/Linux-man-pages-copyleft.txt` — 1019 bytes; SHA256 `e7241c6405f8ad70943bcdb0fd83cb79fb25eec601ecf311acc9c72f19794d5a`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/LICENSES/Linux-man-pages-copyleft.txt)
- `man-pages/man/man7/capabilities.7` — 53444 bytes; SHA256 `bda64920bbbb6d3ba281621322c4f18898b946ab9f64b49fcb27aa1f6bd151b4`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/man/man7/capabilities.7)
- `man-pages/man/man7/namespaces.7` — 13105 bytes; SHA256 `91a93cbeae1f11564203da065f96888513661cf6ec4451d6cadae98da205a089`; [pinned original](https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/man/man7/namespaces.7)
