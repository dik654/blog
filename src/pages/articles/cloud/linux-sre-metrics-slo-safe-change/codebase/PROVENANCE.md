# Automatic OS update channels · source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- apt (Debian `apt-team/apt`, branch `main`, commit 745fc126218c7cb3df48b22bbc7c7098fa2f7966, 2026-10-12). License: GPL-2.0 — see `apt/COPYING`. The timer and service units are the ones Debian/Ubuntu install as `/lib/systemd/system/apt-daily*.{timer,service}`.
- unattended-upgrades (`mvo5/unattended-upgrades`, branch `master`, commit 5877bee20c58fda9111f8ef09eaefa0c4c2bbf92, 2026-09-29). License: GPL-2.0 — see `unattended-upgrades/COPYING`. `data/50unattended-upgrades.Ubuntu` is the template that becomes `/etc/apt/apt.conf.d/50unattended-upgrades` on Ubuntu.
- dnf 4.23.0 (`rpm-software-management/dnf`, tag commit 8fa4bb94a99eadaed91ad2ee51f27a4baafcebed). License: GPL-2.0 — see `dnf/COPYING`.

`apt/`, `unattended-upgrades/`, `dnf/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The staged-rollout numbers in the article (fleet of 1,000 nodes, canary 1% → 10% → 50% → 100%, bake times) are an illustration marked (가정). The Datadog 2023-03-08 figures are quoted from Datadog's own postmortem pages, listed in the article's evidence.

- `apt/COPYING` — 7987 bytes; SHA256 `5c7835bd455fdea5183f41980f75269c802ce161b4a136a079f4666603bccc2c`; [pinned original](https://salsa.debian.org/apt-team/apt/-/raw/745fc126218c7cb3df48b22bbc7c7098fa2f7966/COPYING)
- `apt/debian/apt-daily-upgrade.service` — 413 bytes; SHA256 `57d41ca430b8c4bdc1d7cb2c66011da48d7782bf3cbce005899b321e3adae166`; [pinned original](https://salsa.debian.org/apt-team/apt/-/raw/745fc126218c7cb3df48b22bbc7c7098fa2f7966/debian/apt-daily-upgrade.service)
- `apt/debian/apt-daily-upgrade.timer` — 184 bytes; SHA256 `b804d7bab8eb41202384f9270e25d5383346ace8b3d7c4f5029c150638d77bcd`; [pinned original](https://salsa.debian.org/apt-team/apt/-/raw/745fc126218c7cb3df48b22bbc7c7098fa2f7966/debian/apt-daily-upgrade.timer)
- `apt/debian/apt-daily.timer` — 156 bytes; SHA256 `0075e974af4e3a94757e219ba50ccb8348d4d1a8834d938f6cc9b1f4fd1db4e5`; [pinned original](https://salsa.debian.org/apt-team/apt/-/raw/745fc126218c7cb3df48b22bbc7c7098fa2f7966/debian/apt-daily.timer)
- `dnf/COPYING` — 18092 bytes; SHA256 `8177f97513213526df2cf6184d8ff986c675afb514d4e68a404010521b880643`; [pinned original](https://raw.githubusercontent.com/rpm-software-management/dnf/4.23.0/COPYING)
- `dnf/doc/automatic.rst` — 7568 bytes; SHA256 `a8f9b460e7df5eab7e3399419fb8e3f6a26d04e0f31c41db46a11b09ed6fec9f`; [pinned original](https://raw.githubusercontent.com/rpm-software-management/dnf/4.23.0/doc/automatic.rst)
- `dnf/etc/dnf/automatic.conf` — 3356 bytes; SHA256 `d97f1a17d7744a844e90f6896ecbb556bacbe653f271870fb2c901ab7fc723ff`; [pinned original](https://raw.githubusercontent.com/rpm-software-management/dnf/4.23.0/etc/dnf/automatic.conf)
- `dnf/etc/systemd/dnf-automatic-install.timer` — 258 bytes; SHA256 `166e9afd3ab2f42cf5fe2a713b5bbc39f647da83216863367b5102e3e467d897`; [pinned original](https://raw.githubusercontent.com/rpm-software-management/dnf/4.23.0/etc/systemd/dnf-automatic-install.timer)
- `dnf/etc/systemd/dnf-automatic.timer` — 250 bytes; SHA256 `1d2ffed0eda4ba6ac549514235d83dab28cc877946a4a39c35b479b058a41255`; [pinned original](https://raw.githubusercontent.com/rpm-software-management/dnf/4.23.0/etc/systemd/dnf-automatic.timer)
- `unattended-upgrades/COPYING` — 17987 bytes; SHA256 `ab15fd526bd8dd18a9e77ebc139656bf4d33e97fc7238cd11bf60e2b9b8666c6`; [pinned original](https://raw.githubusercontent.com/mvo5/unattended-upgrades/5877bee20c58fda9111f8ef09eaefa0c4c2bbf92/COPYING)
- `unattended-upgrades/data/50unattended-upgrades.Ubuntu` — 6891 bytes; SHA256 `7710878d16459f6e4e04435cc3b1ac5ed1bc02e8e5516de4ba410ef8f7139e31`; [pinned original](https://raw.githubusercontent.com/mvo5/unattended-upgrades/5877bee20c58fda9111f8ef09eaefa0c4c2bbf92/data/50unattended-upgrades.Ubuntu)
- `unattended-upgrades/README.md` — 11568 bytes; SHA256 `3e064f56aecbe89c239fd4f5f1a1f1a536f4e8c552149c3682e37013335521c4`; [pinned original](https://raw.githubusercontent.com/mvo5/unattended-upgrades/5877bee20c58fda9111f8ef09eaefa0c4c2bbf92/README.md)
