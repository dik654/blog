# Linux memory · page cache · OOM source snapshots

Retrieved 2026-10-15. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e, commit adc218676eef25575469234709c2d87185ca223a). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING` and `linux/LICENSES/preferred/GPL-2.0`. Documentation files are part of the same tree.
- Kubernetes v1.35.0 (tag object 2049416c7235eeec9a413c38472708e49af3ed88, commit 66452049f3d692768c39c797b21b793dce80314e). License: Apache-2.0 — see `kubernetes/LICENSE`.

`linux/` and `kubernetes/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The oom_badness, /proc/<pid>/oom_score, si_mem_available and kubelet oom_score_adj numbers in the article were computed by hand from these formulas with assumed RSS and watermark values; no kernel was run.

- `kubernetes/LICENSE` — 11358 bytes; SHA256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.35.0/LICENSE)
- `kubernetes/pkg/kubelet/qos/policy.go` — 6242 bytes; SHA256 `1d98d91353f7a160ff4a4b36d75ad626a73b9c47512c8fe8f0fc4d57d8c934b9`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.35.0/pkg/kubelet/qos/policy.go)
- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/Documentation/accounting/psi.rst` — 6792 bytes; SHA256 `11c6b7129103b4547c31895cb1cfc0ff75b741c95a24bfcaeb01dece37b82692`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/accounting/psi.rst)
- `linux/Documentation/admin-guide/cgroup-v2.rst` — 122258 bytes; SHA256 `ad3bd37498a57cc249326fd5c2d609669b32611fe69d126df3c3abec1539f572`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/admin-guide/cgroup-v2.rst)
- `linux/Documentation/admin-guide/sysctl/vm.rst` — 40023 bytes; SHA256 `18b4ccce22edfa3aab9f3adb985dd2e041c45b28de44e7a2dd9b7642b0fdd2a8`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/admin-guide/sysctl/vm.rst)
- `linux/Documentation/filesystems/proc.rst` — 100384 bytes; SHA256 `4577fa50db8fadbce338af1b64535608da42316208c962aeb08f4d91fe68636e`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/filesystems/proc.rst)
- `linux/Documentation/mm/overcommit-accounting.rst` — 2647 bytes; SHA256 `767ab88153c4494e54fcf2db4e5bd01921d6bd8350f1596ada508cb5e4b4927f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/mm/overcommit-accounting.rst)
- `linux/fs/proc/base.c` — 98525 bytes; SHA256 `3cd005fa6ce3bd17f10acf67d6e4344013da11b4814a269d239d9c1182ad0c68`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/proc/base.c)
- `linux/include/linux/mm_inline.h` — 17096 bytes; SHA256 `81f82c862c44c4609678a888d94fd3301cdb7c91bc0acc3bcc282ca876a5beee`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/mm_inline.h)
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
- `linux/mm/internal.h` — 46613 bytes; SHA256 `4233abc02e8c8fa51a7f36b656a6083cdad5bc5f1b5bbfd31bbe94550eb31f8d`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/mm/internal.h)
- `linux/mm/memcontrol.c` — 145033 bytes; SHA256 `282f229d5419a855062a3332eba535e5ac25b2708cca99ac732dab45b5d990f2`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/mm/memcontrol.c)
- `linux/mm/oom_kill.c` — 34248 bytes; SHA256 `e429ade2a39de985e8d05fb204132a4d39f82ddf8d0aa2cf6ff1d5d844776e44`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/mm/oom_kill.c)
- `linux/mm/page_alloc.c` — 202777 bytes; SHA256 `55a8c09ee0fb9f64bef126ce9645bac9b77e440476d50cf80b43df3c3ae503eb`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/mm/page_alloc.c)
- `linux/mm/show_mem.c` — 12940 bytes; SHA256 `b619215741a2859e5e5b742713af41b130079e26dff51f68b2357188c3161291`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/mm/show_mem.c)
