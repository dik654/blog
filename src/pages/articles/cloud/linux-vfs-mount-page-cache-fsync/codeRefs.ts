import type { CodeRef } from "@/components/code/types";
import vfsRst from "./codebase/linux/Documentation/filesystems/vfs.rst?raw";
import pathLookupRst from "./codebase/linux/Documentation/filesystems/path-lookup.rst?raw";
import overlayfsRst from "./codebase/linux/Documentation/filesystems/overlayfs.rst?raw";
import vmRst from "./codebase/linux/Documentation/admin-guide/sysctl/vm.rst?raw";
import ext4Rst from "./codebase/linux/Documentation/admin-guide/ext4.rst?raw";
import syncC from "./codebase/linux/fs/sync.c?raw";
import ext4FsyncC from "./codebase/linux/fs/ext4/fsync.c?raw";
import pageWritebackC from "./codebase/linux/mm/page-writeback.c?raw";
import fsWritebackC from "./codebase/linux/fs/fs-writeback.c?raw";
import namespaceC from "./codebase/linux/fs/namespace.c?raw";
import fsync2 from "./codebase/man-pages/man2/fsync.2?raw";
import mount2 from "./codebase/man-pages/man2/mount.2?raw";
import mountNamespaces7 from "./codebase/man-pages/man7/mount_namespaces.7?raw";
import iostatMan from "./codebase/sysstat/man/iostat.in?raw";

export const codeRefs: Record<string, CodeRef> = {
  "vfs-overview": {
    path: "linux/Documentation/filesystems/vfs.rst",
    highlight: [13, 41],
    desc: "VFS가 무엇이고 경로 이름이 어떻게 dentry로 바뀌는지 적은 커널 문서의 도입부입니다.",
    annotations: [
      { lines: [16, 19], color: "sky", note: "VFS는 사용자 프로그램에 파일시스템 인터페이스를 주는 층이면서, 커널 안에서 여러 파일시스템 구현이 공존하게 하는 추상화입니다. ext4·xfs·tmpfs·overlay가 같은 open/read/write를 받는 이유입니다." },
      { lines: [29, 35], color: "amber", note: "경로 이름은 dentry cache(dcache)에서 찾습니다. dentry는 RAM에만 있고 디스크에 저장되지 않으며 오직 성능을 위해 존재합니다." },
      { lines: [37, 41], color: "violet", note: "cache에 없는 조각은 그때 dentry를 만들고 inode를 읽어 채웁니다. /var/log/app.log는 /, var, log, app.log 네 dentry를 지납니다." },
    ],
    code: vfsRst,
    lang: "python",
  },
  "vfs-inode-file": {
    path: "linux/Documentation/filesystems/vfs.rst",
    highlight: [43, 80],
    desc: "dentry → inode → file 구조로 이어지는 세 객체의 관계입니다.",
    annotations: [
      { lines: [46, 52], color: "sky", note: "dentry는 inode를 가리킵니다. inode는 디스크에 있는 것을 메모리로 복사해 쓰고 바뀌면 디스크로 되씁니다. 하드 링크처럼 여러 dentry가 한 inode를 가리킬 수 있습니다." },
      { lines: [66, 72], color: "amber", note: "open()은 file 구조를 할당해 dentry와 그 inode에서 가져온 file_operations를 채웁니다. 이 file 구조가 fd 표에 들어가는 것이고, 어느 파일시스템의 read를 부를지는 여기서 정해집니다." },
      { lines: [74, 80], color: "violet", note: "read·write·close는 fd로 file 구조를 찾아 그 메서드를 부릅니다. 열려 있는 동안 dentry와 inode는 쓰이는 중이라 비워지지 않습니다. 지운 파일이 공간을 안 돌려주는 이유가 여기 있습니다." },
    ],
    code: vfsRst,
    lang: "python",
  },
  "dcache-lookup": {
    path: "linux/Documentation/filesystems/path-lookup.rst",
    highlight: [118, 135],
    desc: "dcache가 조회 가속 외에 어떤 역할을 하는지와, 경로 탐색이 조각(component)마다 dcache를 먼저 보는 구조를 적은 문서입니다.",
    annotations: [
      { lines: [118, 125], color: "sky", note: "dcache는 이름을 inode로 바꾸는 가속기이면서 mount point·부모 관계 같은 트리 구조 자체를 들고 있습니다." },
      { lines: [266, 272], color: "amber", note: "조각마다 lookup_fast()가 먼저 cache를 보고, 없을 때만 파일시스템의 lookup()을 부르는 느린 경로로 갑니다. 디렉터리에 파일이 수백만 개면 이 느린 경로가 자주 불립니다." },
    ],
    code: pathLookupRst,
    lang: "python",
  },
  "mount-bind-man": {
    path: "man-pages/man2/mount.2",
    highlight: [437, 480],
    desc: "mount(2)의 bind mount 절입니다. 같은 디렉터리 트리를 다른 위치에서 한 번 더 보이게 합니다.",
    annotations: [
      { lines: [444, 449], color: "sky", note: "bind mount는 파일이나 디렉터리 서브트리를 같은 계층의 다른 지점에서 보이게 합니다. 파일시스템 경계를 넘을 수 있고 chroot 안으로도 들어갑니다. 컨테이너 볼륨이 이것입니다." },
      { lines: [466, 480], color: "amber", note: "기본으로는 그 디렉터리만 bind되고 아래의 서브마운트는 따라오지 않습니다. MS_REC를 주면 서브마운트까지 재귀로 bind합니다(mount --rbind)." },
    ],
    code: mount2,
    lang: "python",
  },
  "mount-propagation-man": {
    path: "man-pages/man7/mount_namespaces.7",
    highlight: [78, 135],
    desc: "mount namespace 사이에서 mount·umount 사건이 전파되는 네 가지 유형입니다.",
    annotations: [
      { lines: [84, 103], color: "sky", note: "MS_SHARED: 같은 peer group의 mount끼리 mount·umount가 서로 전파됩니다. 호스트에서 새 디스크를 마운트하면 shared로 bind된 컨테이너 안에도 나타납니다." },
      { lines: [105, 110], color: "amber", note: "MS_PRIVATE: peer group이 없어 어느 쪽으로도 전파되지 않습니다. 컨테이너 런타임이 기본으로 쓰는 값입니다." },
      { lines: [112, 121], color: "violet", note: "MS_SLAVE: 주인 쪽 사건은 받되 자기 쪽 사건은 내보내지 않습니다. Kubernetes volumeMount의 mountPropagation: HostToContainer가 이것입니다." },
    ],
    code: mountNamespaces7,
    lang: "python",
  },
  "do-loopback": {
    path: "linux/fs/namespace.c",
    highlight: [2755, 2800],
    desc: "mount --bind가 커널에서 하는 일입니다. 새 파일시스템을 만드는 게 아니라 기존 mount 구조를 복제해 다른 지점에 붙입니다.",
    annotations: [
      { lines: [2763, 2765], color: "sky", note: "원본 경로(old_name)를 찾습니다. /data/logs입니다." },
      { lines: [2781, 2785], color: "amber", note: "__do_loopback이 원본 mount를 clone_mnt(비재귀) 또는 copy_tree(MS_REC)로 복제합니다. 같은 superblock·같은 dentry를 가리키는 새 mount 구조 하나가 생깁니다(2728–2750행)." },
      { lines: [2787, 2792], color: "violet", note: "graft_tree가 복제본을 새 mount point(/srv/app/logs)에 접붙입니다. 실패하면 umount_tree로 되돌립니다. 데이터는 한 벌이고 이름만 둘입니다." },
    ],
    code: namespaceC,
    lang: "c",
  },
  "overlay-layers": {
    path: "linux/Documentation/filesystems/overlayfs.rst",
    highlight: [83, 130],
    desc: "overlayfs의 upper·lower·workdir과 merged 디렉터리입니다. 컨테이너 이미지 layer가 이 구조로 겹쳐집니다.",
    annotations: [
      { lines: [86, 90], color: "sky", note: "같은 이름이 upper와 lower에 모두 있으면 upper가 보이고 lower는 가려지거나(파일) 합쳐집니다(디렉터리)." },
      { lines: [118, 124], color: "amber", note: "mount -t overlay -olowerdir=/lower,upperdir=/upper,workdir=/work /merged. workdir은 upperdir과 같은 파일시스템의 빈 디렉터리여야 합니다." },
    ],
    code: overlayfsRst,
    lang: "python",
  },
  "overlay-copy-up": {
    path: "linux/Documentation/filesystems/overlayfs.rst",
    highlight: [263, 291],
    desc: "lower에 있는 파일에 쓰려는 순간 일어나는 copy_up입니다. 파일 전체가 upper로 복사된 뒤에야 쓰기가 진행됩니다.",
    annotations: [
      { lines: [266, 273], color: "sky", note: "쓰기 접근이 필요한 순간(쓰기 열기, 메타데이터 변경, 하드 링크 생성) 파일이 lower에서 upper로 먼저 복사됩니다. 이미지 안의 100 MiB 로그 파일에 한 줄 덧붙이면 100 MiB를 복사합니다." },
      { lines: [278, 283], color: "amber", note: "순서는 부모 디렉터리 생성 → 같은 메타데이터로 객체 생성 → 데이터 복사 → 확장 속성 복사입니다." },
      { lines: [285, 290], color: "violet", note: "copy_up이 끝나면 그 뒤의 접근은 upper의 파일로 바로 갑니다. 첫 쓰기만 느리고 그다음부터는 일반 파일입니다." },
    ],
    code: overlayfsRst,
    lang: "python",
  },
  "overlay-multi-lower": {
    path: "linux/Documentation/filesystems/overlayfs.rst",
    highlight: [336, 350],
    desc: "lower layer를 여러 개 쌓는 문법입니다. 이미지의 layer 수만큼 콜론으로 잇습니다.",
    annotations: [
      { lines: [339, 342], color: "sky", note: "lowerdir=/lower1:/lower2:/lower3처럼 콜론으로 잇습니다. upperdir·workdir을 빼면 읽기 전용 overlay입니다." },
      { lines: [347, 350], color: "amber", note: "오른쪽이 가장 아래, 왼쪽이 가장 위입니다. 이미지의 base layer가 오른쪽 끝, 마지막 RUN의 layer가 왼쪽 끝에 옵니다." },
    ],
    code: overlayfsRst,
    lang: "python",
  },
  "dirty-sysctl": {
    path: "linux/Documentation/admin-guide/sysctl/vm.rst",
    highlight: [162, 227],
    desc: "dirty page가 언제 디스크로 가기 시작하는지 정하는 네 손잡이입니다.",
    annotations: [
      { lines: [162, 169], color: "sky", note: "dirty_background_ratio: 빈 page와 회수 가능한 page를 더한 '가용 메모리'의 몇 %가 dirty가 되면 백그라운드 flusher가 쓰기 시작하는지입니다. 전체 RAM 기준이 아닙니다." },
      { lines: [188, 195], color: "amber", note: "dirty_expire_centisecs: 이 시간(기본 3,000 = 30초)보다 오래 dirty였던 데이터는 flusher가 다음에 깨어날 때 씁니다." },
      { lines: [197, 204], color: "violet", note: "dirty_ratio: 이 비율을 넘으면 쓰기를 하는 프로세스 자신이 writeback을 하며 멈춥니다. 앱이 '디스크 때문에 멈추는' 지점입니다." },
      { lines: [219, 227], color: "rose", note: "dirty_writeback_centisecs: flusher가 깨어나는 주기(기본 500 = 5초)입니다. 그래서 30초 만료는 30~35초 사이에 실제로 써집니다." },
    ],
    code: vmRst,
    lang: "python",
  },
  "dirty-defaults": {
    path: "linux/mm/page-writeback.c",
    highlight: [70, 110],
    desc: "네 손잡이의 기본값이 코드에 적힌 곳입니다.",
    annotations: [
      { lines: [74, 74], color: "sky", note: "dirty_background_ratio = 10. 가용 메모리의 10%입니다." },
      { lines: [91, 91], color: "amber", note: "vm_dirty_ratio = 20. 가용 메모리의 20%에서 쓰는 쪽이 직접 멈춥니다." },
      { lines: [102, 109], color: "violet", note: "dirty_writeback_interval 500(5초 주기), dirty_expire_interval 3000(30초 만료). 단위는 centisecond입니다." },
    ],
    code: pageWritebackC,
    lang: "c",
  },
  "dirtyable-memory": {
    path: "linux/mm/page-writeback.c",
    highlight: [347, 371],
    desc: "비율의 분모인 '가용 메모리'를 계산하는 함수입니다. RAM 전체가 아니라 빈 page와 file LRU의 합입니다.",
    annotations: [
      { lines: [351, 356], color: "sky", note: "빈 page에서 커널 예약분을 뺍니다. 회수가 zone 균형을 맞추려 dirty page를 씻어야 하는 상황을 막기 위해서입니다." },
      { lines: [358, 359], color: "amber", note: "비활성·활성 file LRU를 더합니다. 이미 page cache로 쓰이는 page도 dirty가 될 수 있는 자리이기 때문입니다. anonymous page는 들어가지 않습니다." },
    ],
    code: pageWritebackC,
    lang: "c",
  },
  "domain-dirty-limits": {
    path: "linux/mm/page-writeback.c",
    highlight: [377, 430],
    desc: "가용 메모리와 두 비율로 bg_thresh(배경 시작선)와 thresh(쓰는 쪽 멈춤선)를 page 단위로 구하는 함수입니다.",
    annotations: [
      { lines: [383, 385], color: "sky", note: "비율을 PAGE_SIZE 기준 분수로 바꿉니다. 10% → 409.6/4096, 20% → 819.2/4096. 정밀도를 위해서입니다." },
      { lines: [410, 418], color: "amber", note: "bytes 설정이 있으면 그것을, 없으면 ratio × available_memory ÷ PAGE_SIZE를 씁니다. 가용 12,288 MiB면 bg_thresh ≈ 1,227 MiB, thresh ≈ 2,457 MiB입니다." },
      { lines: [420, 424], color: "violet", note: "실시간(rt/dl) 작업은 두 선을 1/4 + 전역 한도/32만큼 올려 받습니다. 지연 민감 작업을 덜 멈추게 하기 위해서입니다." },
    ],
    code: pageWritebackC,
    lang: "c",
  },
  "wb-periodic-flush": {
    path: "linux/fs/fs-writeback.c",
    highlight: [2194, 2240],
    desc: "flusher 작업 스레드가 깨어났을 때 하는 두 검사입니다. 배경 한도를 넘었는가, 그리고 주기가 돌아왔는가.",
    annotations: [
      { lines: [2194, 2209], color: "sky", note: "wb_over_bg_thresh면 nr_pages = LONG_MAX, for_background = 1로 쓰기를 시작합니다. 한도 아래로 내려올 때까지 씁니다." },
      { lines: [2212, 2225], color: "amber", note: "마지막 주기 flush에서 dirty_writeback_interval × 10 ms(5초)가 지났으면 for_kupdate = 1로 '오래된' dirty page를 씁니다. 오래됐다는 기준이 dirty_expire_interval(30초)입니다." },
    ],
    code: fsWritebackC,
    lang: "c",
  },
  "vfs-fsync": {
    path: "linux/fs/sync.c",
    highlight: [180, 226],
    desc: "fsync(2)와 fdatasync(2)가 들어오는 VFS 입구입니다. 파일시스템별 fsync 메서드를 부릅니다.",
    annotations: [
      { lines: [180, 189], color: "sky", note: "vfs_fsync_range: start..end 범위의 데이터와 메타데이터를 디스크로 씁니다. datasync면 데이터를 다시 읽는 데 필요한 메타데이터만 씁니다." },
      { lines: [186, 187], color: "amber", note: "I_DIRTY_TIME(lazytime으로 미뤄 둔 시각 갱신)은 fsync일 때만 dirty로 올려 함께 씁니다. fdatasync는 건너뜁니다." },
      { lines: [218, 226], color: "violet", note: "fsync는 datasync = 0, fdatasync는 1로 같은 do_fsync를 부릅니다. 차이는 그 플래그 하나입니다." },
    ],
    code: syncC,
    lang: "c",
  },
  "ext4-sync-file": {
    path: "linux/fs/ext4/fsync.c",
    highlight: [129, 180],
    desc: "ext4의 fsync 구현입니다. 데이터 writeback 대기 → 저널 commit 대기 → 장치 캐시 flush 세 단계입니다.",
    annotations: [
      { lines: [157, 160], color: "sky", note: "file_write_and_wait_range: 범위의 dirty page를 쓰기 시작하고 완료를 기다립니다. 100 MiB가 dirty였으면 여기서 100 MiB가 장치로 갑니다." },
      { lines: [163, 167], color: "amber", note: "ext4_fsync_journal: 이 inode가 속한 트랜잭션(datasync면 i_datasync_tid, 아니면 i_sync_tid)의 jbd2 commit을 기다립니다. 메타데이터는 저널에 적혀야 안전합니다(97–115행)." },
      { lines: [169, 174], color: "violet", note: "needs_barrier면 blkdev_issue_flush로 장치의 휘발성 쓰기 캐시를 비웁니다. 이것까지 끝나야 fsync가 돌아옵니다. 그래서 fsync 한 번에 장치 flush 한 번이 iostat의 f/s에 보입니다." },
    ],
    code: ext4FsyncC,
    lang: "c",
  },
  "ext4-data-modes": {
    path: "linux/Documentation/admin-guide/ext4.rst",
    highlight: [395, 425],
    desc: "ext4의 세 data 모드입니다. 저널에 무엇을 적느냐가 다릅니다.",
    annotations: [
      { lines: [399, 405], color: "sky", note: "writeback: 메타데이터만 저널링. 크래시 뒤 최근에 쓴 파일에 잘못된 데이터가 보일 수 있습니다. 가장 빠릅니다." },
      { lines: [407, 414], color: "amber", note: "ordered(기본): 공식적으로는 메타데이터만 저널링하지만, 메타데이터를 쓰기 전에 관련 데이터 블록을 먼저 씁니다. 그래서 크기는 늘었는데 내용이 쓰레기인 파일이 생기지 않습니다." },
      { lines: [416, 425], color: "violet", note: "journal: 데이터도 저널에 먼저 씁니다. 두 번 쓰므로 가장 느리고 delayed allocation과 O_DIRECT가 꺼집니다." },
      { lines: [185, 196], color: "rose", note: "commit=nrsec(기본 5초): 트랜잭션이 저널에 commit되는 최대 간격입니다. 정전 시 최대 5초치 메타데이터 변경을 잃을 수 있고, 데이터는 dirty_expire_centisecs가 지나야 쓰기 시작하므로 더 오래된 것도 잃을 수 있습니다." },
    ],
    code: ext4Rst,
    lang: "python",
  },
  "fsync-man": {
    path: "man-pages/man2/fsync.2",
    highlight: [51, 100],
    desc: "fsync(2) man page의 정의입니다. 무엇을 보장하고 무엇을 보장하지 않는지 적습니다.",
    annotations: [
      { lines: [52, 61], color: "sky", note: "fsync는 수정된 데이터를 장치로 옮기고, 장치의 디스크 캐시까지 비우며, 장치가 완료를 보고할 때까지 막힙니다." },
      { lines: [68, 75], color: "amber", note: "파일을 fsync해도 그 파일이 들어 있는 디렉터리 항목이 디스크에 닿았다고는 보장하지 않습니다. 새 파일을 만들었으면 디렉터리 fd에도 fsync가 필요합니다." },
      { lines: [76, 100], color: "violet", note: "fdatasync는 데이터를 다시 읽는 데 필요한 메타데이터만 씁니다. mtime·atime은 건너뛰고 파일 크기 변경은 씁니다." },
    ],
    code: fsync2,
    lang: "python",
  },
  "iostat-columns": {
    path: "sysstat/man/iostat.in",
    highlight: [187, 219],
    desc: "iostat -x 열의 정의입니다. await는 대기열 시간을 포함하고 %util은 직렬 장치에서만 포화를 뜻합니다.",
    annotations: [
      { lines: [187, 190], color: "sky", note: "await: 요청이 처리되기까지 평균 ms. 대기열에서 기다린 시간과 실제 처리 시간을 합친 값입니다." },
      { lines: [203, 208], color: "amber", note: "f_await: flush 요청의 평균 시간. 블록 층은 flush를 합쳐 한 번에 하나만 실행하므로 현재 flush를 기다렸다가 자기 것을 실행하느라 두 배가 될 수 있습니다. fsync가 느린 이유 중 하나입니다." },
      { lines: [212, 219], color: "violet", note: "%util: I/O 요청이 장치에 나가 있던 시간 비율. 요청을 하나씩 처리하는 장치에서는 100% 근처가 포화이지만, 병렬 처리하는 RAID·SSD에서는 성능 한계를 뜻하지 않습니다." },
    ],
    code: iostatMan,
    lang: "python",
  },
};
