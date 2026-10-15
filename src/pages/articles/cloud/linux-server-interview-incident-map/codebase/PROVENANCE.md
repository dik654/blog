# Linux load average source snapshots

Retrieved 2026-10-15. Full unmodified files (byte-for-byte) from torvalds/linux tag `v6.12` (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e, commit adc218676eef25575469234709c2d87185ca223a).

License: the Linux kernel is provided under GPL-2.0-only with the Linux-syscall-note exception (see `linux/COPYING` and `linux/Linux-syscall-note`); each file carries its own SPDX header. `?raw` imports are read-only source panels; the website does not execute these files. The fixed-point load sequence in the article (164, 315, …, 1299) was computed with a Python re-implementation of `calc_load()` from `include/linux/sched/loadavg.h`; no kernel was booted or measured.

- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/fs/proc/loadavg.c` — 963 bytes; SHA256 `553df5eaa1689474f30aad51de04744ae89b8eb29d4a65e6035b9af12d4c1f9f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/proc/loadavg.c)
- `linux/fs/proc/stat.c` — 5897 bytes; SHA256 `d4692d68f90f318cc6d09d182baffffb36f7d0a3367da2c77b1e654d08cd0382`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/proc/stat.c)
- `linux/include/linux/sched.h` — 64069 bytes; SHA256 `a0b8b99bb7608ab3d0b4f86b2ac416ce233b7f03821d26d4cd2f191bd29e489c`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/sched.h)
- `linux/include/linux/sched/loadavg.h` — 1588 bytes; SHA256 `70bb912e5fca1e250c7f7ad7961be8f4bec28e338cfa7bed3140e03e8d0a97de`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/sched/loadavg.h)
- `linux/kernel/sched/core.c` — 278224 bytes; SHA256 `4b9bdb7831e1d2b747a9bcbf3e1c7bef187dd1c0555e6cc959fd2118046345bd`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/core.c)
- `linux/kernel/sched/loadavg.c` — 11503 bytes; SHA256 `d4fd5137134eff9ad46f292b94d855747027f5a1456da375443ee2e688d11724`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/loadavg.c)
- `linux/kernel/sched/sched.h` — 104497 bytes; SHA256 `a34153b995cc32242235e5ed42fca15f2fe0ac6b03fbdc060120c5f87e615e68`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/sched.h)
- `linux/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/exceptions/Linux-syscall-note)
- `linux/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
