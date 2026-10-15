# Linux process·signal·fd source snapshot

Retrieved 2026-10-15. Full unmodified files; upstream comments and line numbers retained.

- Linux kernel tag `v6.12` (torvalds/linux). License: GPL-2.0 WITH Linux-syscall-note for uapi headers; `COPYING`, `LICENSES/preferred/GPL-2.0`, `LICENSES/exceptions/Linux-syscall-note` are kept beside the files. The files are shown as read-only source panels; the website executes none of them.
- krallin/tini commit `369448a167e8b3da4ca5bca0b3307500c3371828` (master HEAD on 2026-10-15), `src/tini.c` (MIT, upstream `LICENSE` kept).
- opencontainers/runc tag `v1.2.0`, `libcontainer/utils/utils.go` (Apache-2.0, upstream `LICENSE` kept).

Numeric examples in the article (fd count 24 + 1,000 vs soft limit 1,024, zombie accumulation per hour, pid_max for 16 CPUs, exit status 128 + 9) were computed by hand from the constants and code paths in these files and from the cited man pages and Docker docs. No container or kernel was run for this article.

| file | bytes | SHA256 | pinned URL |
|---|---|---|---|
| `linux/kernel/signal.c` | 129959 | `e93c014e2354c8806dfe3504c4f274cab250df0251745e1fd9af9c60616e9326` | https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/signal.c |
| `linux/kernel/exit.c` | 49803 | `7c28bfc644117470b9cbe6d46c84580de98225755bbb227e61d638ea7104025d` | https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/exit.c |
| `linux/kernel/fork.c` | 85947 | `90342b5b1d7708052564b95a8855a19b3925fe0d1c3f018b472dc66045328433` | https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/fork.c |
| `linux/kernel/pid.c` | 19199 | `3a9065c03bf74805a58ce3a372a69f911b3382db769237414aa2034fe218e60c` | https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/pid.c |
| `linux/fs/file.c` | 36411 | `b7941baea1a17ce6bedc84fdf7096ecf4963ff0ee65929ed620a6b56401be99b` | https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/file.c |
| `linux/fs/file_table.c` | 14092 | `3e71b50d0c53d169162ac85f3166d813b03a8ab04ebb4c6dd05e88d9778d1629` | https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/file_table.c |
| `linux/include/linux/signal.h` | 14116 | `f6b75a1b35c5fb2b0e5994964ce75ef30bcdd0a4d412f8755c0c791d56a7eab4` | https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/signal.h |
| `linux/include/linux/threads.h` | 1338 | `ac7161de729d183418eee161e1d0bbc2253839139d20e1d8a278510b6108d130` | https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/threads.h |
| `linux/include/uapi/linux/fs.h` | 21862 | `1323921d98f3085cb09951ad63229538203a690f2515bf99a833da6291a9ea85` | https://raw.githubusercontent.com/torvalds/linux/v6.12/include/uapi/linux/fs.h |
| `linux/COPYING` | 496 | `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0` | https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING |
| `linux/LICENSES/preferred/GPL-2.0` | 18729 | `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79` | https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0 |
| `linux/LICENSES/exceptions/Linux-syscall-note` | 1258 | `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f` | https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/exceptions/Linux-syscall-note |
| `runc/libcontainer/utils/utils.go` | 3527 | `3ff584d2e69ce54b1be767dfa0cc213afa93e0f1572e8795e672b497fec7d637` | https://raw.githubusercontent.com/opencontainers/runc/v1.2.0/libcontainer/utils/utils.go |
| `tini/src/tini.c` | 19273 | `edc7bcc873afc9a6770601e3b84d1b74528461d33a5f913ce1e8b5798f1cec75` | https://raw.githubusercontent.com/krallin/tini/369448a167e8b3da4ca5bca0b3307500c3371828/src/tini.c |
| `tini/LICENSE` | 1099 | `e5f46bca81266bdd511cf08018d66866870531794569c04f9b45f50dd23c28b0` | https://raw.githubusercontent.com/krallin/tini/369448a167e8b3da4ca5bca0b3307500c3371828/LICENSE |
| `runc/LICENSE` | 10758 | `552a739c3b25792263f731542238b92f6f8d07e9a488eae27e6c4690038a8243` | https://raw.githubusercontent.com/opencontainers/runc/v1.2.0/LICENSE |

Non-code sources opened for the article (2026-10-15): Docker docs `docker container stop` and Dockerfile reference (ENTRYPOINT shell form, exec form); krallin/tini README; man7 pid_namespaces(7), signal(7), wait(2), getrlimit(2), proc_sys_fs(5), strace(1); systemd v257 `man/systemd.exec.xml` and `man/systemd-system.conf.xml`; GNU bash manual (exit status 128+N); Python `signal` module docs (default handlers).
