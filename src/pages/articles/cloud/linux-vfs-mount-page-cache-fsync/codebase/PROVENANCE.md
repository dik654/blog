# Linux VFS · mount · page cache · fsync source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Linux v6.12 (tag object 06090c9b622a7e1f797e775db4c035e0d779b76e, commit adc218676eef25575469234709c2d87185ca223a). License: GPL-2.0 WITH Linux-syscall-note — see `linux/COPYING`, `linux/LICENSES/preferred/GPL-2.0`, `linux/LICENSES/exceptions/Linux-syscall-note`. Documentation files are part of the same tree. Pinned originals: `https://raw.githubusercontent.com/torvalds/linux/v6.12/<path>`.
- Linux man-pages 6.9.1 (`git.kernel.org/pub/scm/docs/man-pages/man-pages.git`, tag man-pages-6.9.1). License: Linux-man-pages-copyleft — see `man-pages/LICENSES/Linux-man-pages-copyleft.txt`. Pinned originals: `https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git/plain/man/<section>/<page>?h=man-pages-6.9.1`.
- sysstat v12.7.6 (tag object f261a56c88ad5106b9c1e71fd26e90ec3af80aa7). License: GPL-2.0-or-later — see `sysstat/COPYING`. Pinned original: `https://raw.githubusercontent.com/sysstat/sysstat/v12.7.6/man/iostat.in`.

`linux/`, `man-pages/`, `sysstat/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The dirty-threshold numbers in the article (dirtyable 12,288 MiB → bg_thresh 1,227 MiB, thresh 2,457 MiB, freerun 1,842 MiB) were computed by hand from `global_dirtyable_memory()` and `domain_dirty_limits()` with an assumed memory ledger; the 500 MB/s device and 0.2 s fsync wait are assumptions. No kernel was run.

- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`
- `linux/Documentation/admin-guide/ext4.rst` — 27734 bytes; SHA256 `d1cd6780396ec64ef7de8eaddde60f99102e770a1fe3ae342426a88274046137`
- `linux/Documentation/admin-guide/sysctl/vm.rst` — 40023 bytes; SHA256 `18b4ccce22edfa3aab9f3adb985dd2e041c45b28de44e7a2dd9b7642b0fdd2a8`
- `linux/Documentation/filesystems/overlayfs.rst` — 35631 bytes; SHA256 `2d8cbe434a8d5d9ceccfdc55d33e31e5016d18e06bc11e39170e6dc88e78c70b`
- `linux/Documentation/filesystems/path-lookup.rst` — 71264 bytes; SHA256 `89a301e4456d7c2cc340531b7d4e1612d8983c7303f5ec22f6b8f026dc60435d`
- `linux/Documentation/filesystems/vfs.rst` — 61717 bytes; SHA256 `1a4858ddafcd4db968f2653dbeaf4ad8994c0305f94175269ba25aa905c8cebe`
- `linux/fs/ext4/fsync.c` — 4954 bytes; SHA256 `c5f0a5e1a076540d80595248eac0d8ced9226abc70eb25eff54b38876240568f`
- `linux/fs/fs-writeback.c` — 84047 bytes; SHA256 `e360233d1cf0222eaf175dfa0e9dc7377bba365a6730bf97200f2d678d95786a`
- `linux/fs/namespace.c` — 146716 bytes; SHA256 `4e6809884d475aeb6b65a35897d55ffe7c11dd6f06d74b5784b84f3d0dc978e6`
- `linux/fs/sync.c` — 10664 bytes; SHA256 `fe2f3d3a9bd857544f5350ecedb494ace03deddeeb0d263592bedc64aff9a3c6`
- `linux/include/linux/fs.h` — 125513 bytes; SHA256 `ae3453df09a8817660470524eaf868c5ed4ba67efbac84bd37755674e6c7e3bf`
- `linux/LICENSES/exceptions/Linux-syscall-note` — 1258 bytes; SHA256 `8e378ab93586eb55135d3bc119cce787f7324f48394777d00c34fa3d0be3303f`
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`
- `linux/mm/page-writeback.c` — 98776 bytes; SHA256 `4a831a83cfa5f9ab04f20ebc9ecc4a044c07124a2e706876f608d1e1e2eefb6d`
- `man-pages/LICENSES/Linux-man-pages-copyleft.txt` — 1019 bytes; SHA256 `e7241c6405f8ad70943bcdb0fd83cb79fb25eec601ecf311acc9c72f19794d5a`
- `man-pages/man2/fsync.2` — 5488 bytes; SHA256 `412c30a1f41cfeca98974037f2dcccb2a7bdb77bf9d403da0b2c67dfaafff0e7`
- `man-pages/man2/mount.2` — 25946 bytes; SHA256 `3a2b469ca04fbc61958edea7740ea516bf6baac9e5fb0f1448eabe6deb6878b7`
- `man-pages/man7/mount_namespaces.7` — 36712 bytes; SHA256 `5e0199126599cbd9d2b7d8d087fdc4743fb30d8c5ddb79b2c10ed04859e48053`
- `sysstat/COPYING` — 18046 bytes; SHA256 `db296f2f7f35bca3a174efb0eb392b3b17bd94b341851429a3dff411b1c2fc73`
- `sysstat/man/iostat.in` — 17752 bytes; SHA256 `8033533b401b456f7d2db17023bf032de8d899e65a3498fc2ee04465206ad3ec`
