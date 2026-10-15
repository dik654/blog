# Linux v6.12 TCP source snapshots

Retrieved 2026-10-15 from tag `v6.12` of torvalds/linux (raw.githubusercontent.com/torvalds/linux/v6.12/...). Full unmodified files (byte-for-byte). `linux/` is the project root; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not compile or execute these files.

License: the Linux kernel is distributed under GPL-2.0 WITH Linux-syscall-note (see `linux/COPYING` and `linux/LICENSES/preferred/GPL-2.0`). Each file carries its own SPDX header. These copies are quoted unmodified for commentary.

Numbers in the article (600 conn/s, 28,232 ports, backlog 511, 1-second accept stall) are illustrative assumptions computed by hand from the constants in these files; no kernel was run or measured.

- `linux/COPYING` — 496 bytes; SHA256 `fb5a425bd3b3cd6071a3a9aff9909a859e7c1158d54d32e07658398cd67eb6a0`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/COPYING)
- `linux/Documentation/networking/ip-sysctl.rst` — 115159 bytes; SHA256 `7417433f163b87d406378a4e8fb3e9b7c385162a2381e3f03dbcdfed5fca2c3d`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/networking/ip-sysctl.rst)
- `linux/Documentation/networking/nf_conntrack-sysctl.rst` — 6595 bytes; SHA256 `1cc4d71c82092e5898b949a42b7c15cc73d1f4005be5a21311205a2342c184b9`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/networking/nf_conntrack-sysctl.rst)
- `linux/include/linux/socket.h` — 15794 bytes; SHA256 `b92108200a837f42823a0207efdcc2a73039d2abdd7fe5fe0a05d9a0d5e2ec58`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/linux/socket.h)
- `linux/include/net/inet_connection_sock.h` — 11950 bytes; SHA256 `d0ccb87d7280db7b1de69026718da291a49b4265c24f5d313e160e489fe072cb`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/net/inet_connection_sock.h)
- `linux/include/net/sock.h` — 83890 bytes; SHA256 `5b0422aad3a0c982cbff123f3c942110b79e5a4a4408144b6ae0ba6ccfbcf4d2`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/net/sock.h)
- `linux/include/net/tcp.h` — 85652 bytes; SHA256 `cdf696125e9484f7a5579eb0fa0841acb92f39ba6cd2dab219670e837fcf1b8c`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/include/net/tcp.h)
- `linux/LICENSES/preferred/GPL-2.0` — 18729 bytes; SHA256 `f6b78c087c3ebdf0f3c13415070dd480a3f35d8fc76f3d02180a407c1c812f79`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/LICENSES/preferred/GPL-2.0)
- `linux/net/core/net_namespace.c` — 36669 bytes; SHA256 `0744f0092803f336e9d4b9edb6505a5847dd1d5edbeddb4c2e07e551df78a705`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/core/net_namespace.c)
- `linux/net/ipv4/af_inet.c` — 51923 bytes; SHA256 `4a055450bbb5d8e578ca2f44e4be31e262d1ced7b2fee9b129027b499ec98eac`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/af_inet.c)
- `linux/net/ipv4/inet_hashtables.c` — 35083 bytes; SHA256 `3f6571db113760b4d56ec49c64d1264eed332eaf8cca4ff57df6407a17de9f30`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/inet_hashtables.c)
- `linux/net/ipv4/proc.c` — 22110 bytes; SHA256 `c52ee74dc2964442381e0e5b9ec63486b70dfe352baec8a7c177b3fa18fc769e`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/proc.c)
- `linux/net/ipv4/tcp_diag.c` — 5908 bytes; SHA256 `040ab7db43330943c7d8c081c39931bca6ffff8a390fc43b8eb1c1344a47c76d`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/tcp_diag.c)
- `linux/net/ipv4/tcp_input.c` — 216789 bytes; SHA256 `8007c66e4cf200085935805d33863a75a03089487a53a8b42a596025d859749d`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/tcp_input.c)
- `linux/net/ipv4/tcp_ipv4.c` — 99184 bytes; SHA256 `116196ff5c093ed5c239fae1e5ca314b65fc8d3e3073f12f0706822725b52b27`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/tcp_ipv4.c)
- `linux/net/ipv4/tcp_minisocks.c` — 29638 bytes; SHA256 `1a5b679362538c9e2cf69b9737205796b4806e83e126c9702156de417e6a959f`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/tcp_minisocks.c)
- `linux/net/ipv4/tcp.c` — 142868 bytes; SHA256 `a323a8aa41a10e1e30f5dead2a6be0fed4c7912e27c624ac273e7d5198d7adef`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/ipv4/tcp.c)
- `linux/net/netfilter/nf_conntrack_core.c` — 74503 bytes; SHA256 `0d6a0d5cad5edae096e59387997463f9e877894d0410d71f145e8b036190048c`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/netfilter/nf_conntrack_core.c)
- `linux/net/socket.c` — 93292 bytes; SHA256 `26573c98db58359bd892a3db6664efd27674d765db2c6377b2c126e03e54c5e2`; [pinned original](https://raw.githubusercontent.com/torvalds/linux/v6.12/net/socket.c)
