# Linux kernel · process · syscall · scheduler source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e, commit adc218676eef25575469234709c2d87185ca223a). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING`, `linux/LICENSES/preferred/GPL-2.0`, `linux/LICENSES/exceptions/Linux-syscall-note`. Documentation files are part of the same tree. Pinned originals: `https://raw.githubusercontent.com/torvalds/linux/v6.12/<path>`.
- Linux man-pages 6.9.1 (`git.kernel.org/pub/scm/docs/man-pages/man-pages.git`, tag man-pages-6.9.1). License: Linux-man-pages-copyleft — see `man-pages/LICENSES/Linux-man-pages-copyleft.txt`. Pinned originals: `https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/man/<section>/<page>?h=man-pages-6.9.1`.
- strace v6.12 (tag object 76aef7bed5ee6228556a724a953c6328670f29d9). License: LGPL-2.1-or-later — see `strace/COPYING`. Pinned original: `https://raw.githubusercontent.com/strace/strace/v6.12/doc/strace.1.in`.

`linux/`, `man-pages/`, `strace/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The CPU-share and virtual-deadline numbers in the article (1024 vs 335, 75.4 % vs 24.6 %, 0.75 ms vs 2.29 ms) were computed by hand from `sched_prio_to_weight[]`, `calc_delta_fair()` and `sysctl_sched_base_slice`; no kernel was run and no scheduler trace was recorded.

- `linux/arch/x86/entry/entry_64.S` — 44051 bytes; SHA256 `53dcd69ceeb16b2a1b9f588dbc3ceb3f5ac30ddfe4d91fee63adfe152d8b0698`
- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`
- `linux/Documentation/arch/x86/entry_64.rst` — 4321 bytes; SHA256 `80ff576372699c24fe38a2ed50654549e2f55c4cf3ba24e86da8ad38620ca0c5`
- `linux/Documentation/filesystems/proc.rst` — 100384 bytes; SHA256 `4577fa50db8fadbce338af1b64535608da42316208c962aeb08f4d91fe68636e`
- `linux/Documentation/scheduler/sched-design-CFS.rst` — 10167 bytes; SHA256 `85115c5dfe37c0fa0f583ca6f8cd72c42827a8cc48dff8e623fe07943be33bd5`
- `linux/Documentation/scheduler/sched-eevdf.rst` — 2144 bytes; SHA256 `75b99048d738b7683d06c5844e150253e91d75ec46e774f7a96cf0e9d39056a0`
- `linux/Documentation/scheduler/sched-nice-design.rst` — 5264 bytes; SHA256 `90ef322d9bec7aae41fa4f8cf999a4607649d1fd5bebbe55d1de544c974cd7bf`
- `linux/fs/proc/array.c` — 23234 bytes; SHA256 `23fa35a9e22158c2bee2bf183c748b82438e4919571eac9c04a4028d24764549`
- `linux/include/linux/sched.h` — 64069 bytes; SHA256 `a0b8b99bb7608ab3d0b4f86b2ac416ce233b7f03821d26d4cd2f191bd29e489c`
- `linux/include/uapi/linux/sched.h` — 6302 bytes; SHA256 `2081b07cee6adab443e4ba320d0ccb13db4c97bed64f3eefafbfde2f25c833a4`
- `linux/kernel/fork.c` — 85947 bytes; SHA256 `90342b5b1d7708052564b95a8855a19b3925fe0d1c3f018b472dc66045328433`
- `linux/kernel/sched/core.c` — 278224 bytes; SHA256 `4b9bdb7831e1d2b747a9bcbf3e1c7bef187dd1c0555e6cc959fd2118046345bd`
- `linux/kernel/sched/fair.c` — 373040 bytes; SHA256 `48c485811e4d20cca0204ea75a24da71777e42a66b6ce158f8ece09132635d7d`
- `linux/LICENSES/exceptions/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`
- `man-pages/LICENSES/Linux-man-pages-copyleft.txt` — 1019 bytes; SHA256 `e7241c6405f8ad70943bcdb0fd83cb79fb25eec601ecf311acc9c72f19794d5a`
- `man-pages/man2/clone.2` — 52559 bytes; SHA256 `8a7f65c315a52e98cc920e629f3233f230f92d18e608dbf5e4a0673e5b60aef5`
- `man-pages/man2/syscalls.2` — 32272 bytes; SHA256 `40f82845bad4d9ca65ac10854119b4da7bcc602e6c8c66d5dc529f5df9265281`
- `man-pages/man7/sched.7` — 34191 bytes; SHA256 `a637eb1108d6f8bbc00a505792953d96c030d4524a0aefbbd2139a7bb9f13639`
- `strace/COPYING` — 1405 bytes; SHA256 `1988d0e1aa101d68855e8c4f940aacf2531051b82f6b608eb026c5fad1f33df1`
- `strace/doc/strace.1.in` — 57549 bytes; SHA256 `421c67ba9efe3661347dcff0d5ef39d76959279a2e16962525bf4fc7b0a807c3`
