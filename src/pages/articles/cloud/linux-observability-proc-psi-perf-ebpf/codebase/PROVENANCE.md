# Linux observability · /proc · PSI · perf · bpftrace · node_exporter source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING`, `linux/LICENSES/preferred/GPL-2.0`, `linux/LICENSES/exceptions/Linux-syscall-note`. Documentation and tools/perf files are part of the same tree.
- bpftrace v0.23.2 (tag commit 16815d52de7c4c6538819fa97737b88ae1a691d3). License: Apache-2.0 — see `bpftrace/LICENSE`.
- prometheus/node_exporter v1.9.1 (tag commit 4e93d3f034842e0cec231a2380c11f3d0dc9ee3d). License: Apache-2.0 — see `node_exporter/LICENSE`.

`linux/`, `bpftrace/`, `node_exporter/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The running example in the article (a 4-vCPU server at 40% CPU with PSI cpu some avg10 25%, the `perf top` and `bpftrace` outputs) is a hand-built illustration marked (가정); no server was measured.

- `bpftrace/LICENSE` — 11358 bytes; SHA256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; [pinned original](https://raw.githubusercontent.com/bpftrace/bpftrace/v0.23.2/LICENSE)
- `bpftrace/man/adoc/bpftrace.adoc` — 110814 bytes; SHA256 `9e54ebac128593afafb760314ea68b3ee866032610226903f690bdfd184d39e0`; [pinned original](https://raw.githubusercontent.com/bpftrace/bpftrace/v0.23.2/man/adoc/bpftrace.adoc)
- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/Documentation/accounting/psi.rst` — 6792 bytes; SHA256 `11c6b7129103b4547c31895cb1cfc0ff75b741c95a24bfcaeb01dece37b82692`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/accounting/psi.rst)
- `linux/Documentation/filesystems/proc.rst` — 100384 bytes; SHA256 `4577fa50db8fadbce338af1b64535608da42316208c962aeb08f4d91fe68636e`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/filesystems/proc.rst)
- `linux/Documentation/scheduler/sched-stats.rst` — 7921 bytes; SHA256 `31fb5ac86beaa39fdb36e411f2591ce8477506bddc6816ef960c6f9739ea5778`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/scheduler/sched-stats.rst)
- `linux/fs/proc/stat.c` — 5897 bytes; SHA256 `d4692d68f90f318cc6d09d182baffffb36f7d0a3367da2c77b1e654d08cd0382`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/fs/proc/stat.c)
- `linux/kernel/sched/psi.c` — 47321 bytes; SHA256 `53d3e49101c5d1f5bf967a03f34c66c8f18e00ba0d5269ebc219f2f4f0c1a7c5`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/kernel/sched/psi.c)
- `linux/LICENSES/exceptions/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/exceptions/Linux-syscall-note)
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
- `linux/tools/perf/Documentation/perf-record.txt` — 33039 bytes; SHA256 `71c917620f0178eb1ce4ded46b3f50fb3e508dba8ab9ff9943ce6a05b17508ce`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/tools/perf/Documentation/perf-record.txt)
- `linux/tools/perf/Documentation/perf-top.txt` — 14057 bytes; SHA256 `4135fcba8aab79ce322f5623597315c29b9eb55887ca0d401ff5422b44300267`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/tools/perf/Documentation/perf-top.txt)
- `node_exporter/collector/cpu_linux.go` — 16705 bytes; SHA256 `be276dedad7d1d23f813d1311e0537c8b761638647e240a3e7d4956dfc898041`; [pinned original](https://raw.githubusercontent.com/prometheus/node_exporter/v1.9.1/collector/cpu_linux.go)
- `node_exporter/collector/pressure_linux.go` — 5478 bytes; SHA256 `d20ff4f86bbd83fdff3d0190a8d604ca53c63eec45812bfdfa0625ece531572c`; [pinned original](https://raw.githubusercontent.com/prometheus/node_exporter/v1.9.1/collector/pressure_linux.go)
- `node_exporter/LICENSE` — 11357 bytes; SHA256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`; [pinned original](https://raw.githubusercontent.com/prometheus/node_exporter/v1.9.1/LICENSE)
- `node_exporter/README.md` — 19897 bytes; SHA256 `b29a6626b5b347c7a97be7202bf3fac20f4f04c21b4df3d9d5f303c85465452e`; [pinned original](https://raw.githubusercontent.com/prometheus/node_exporter/v1.9.1/README.md)
