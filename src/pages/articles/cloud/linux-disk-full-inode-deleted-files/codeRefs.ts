import type { CodeRef } from "@/components/code/types";
import dfC from "./codebase/coreutils/src/df.c?raw";
import namei from "./codebase/linux/fs/namei.c?raw";
import ext4Namei from "./codebase/linux/fs/ext4/namei.c?raw";
import dcache from "./codebase/linux/fs/dcache.c?raw";
import fsnotifyH from "./codebase/linux/include/linux/fsnotify.h?raw";
import fileTable from "./codebase/linux/fs/file_table.c?raw";
import inodeC from "./codebase/linux/fs/inode.c?raw";
import fsH from "./codebase/linux/include/linux/fs.h?raw";
import ext4Super from "./codebase/linux/fs/ext4/super.c?raw";
import ext4Balloc from "./codebase/linux/fs/ext4/balloc.c?raw";
import ext4Ialloc from "./codebase/linux/fs/ext4/ialloc.c?raw";

export const codeRefs: Record<string, CodeRef> = {
  "df-fields": {
    path: "coreutils/src/df.c",
    highlight: [940, 975],
    desc: "df가 statfs 결과에서 Used와 Avail을 만드는 곳입니다. Used는 전체에서 root 기준 빈칸을 뺀 값이고 Avail은 일반 사용자 기준 빈칸입니다.",
    annotations: [
      { lines: [946, 957], color: "violet", note: "inode도 같은 방식으로 셉니다. df -i의 IUsed는 전체 inode에서 빈 inode를 뺀 값입니다." },
      { lines: [961, 964], color: "sky", note: "Avail에는 f_bavail, root 기준 빈칸에는 f_bfree를 씁니다. 두 값의 차이가 예약 블록입니다." },
      { lines: [970, 974], color: "amber", note: "Used = 전체 − f_bfree입니다. 열린 채 지워진 30GiB도 아직 빈칸이 아니므로 Used에 들어갑니다." },
    ],
    code: dfC,
    lang: "c",
  },
  "df-pcent": {
    path: "coreutils/src/df.c",
    highlight: [1178, 1193],
    desc: "Use%의 분모는 전체 크기가 아니라 Used + Avail입니다. 그래서 예약 블록이 남아 있어도 100%가 찍힐 수 있습니다.",
    annotations: [
      { lines: [1190, 1192], color: "amber", note: "Used 95GiB, Avail 0이면 95 × 100 ÷ (95 + 0) = 100%입니다. 나머지가 있으면 올림합니다." },
    ],
    code: dfC,
    lang: "c",
  },
  "unlinkat": {
    path: "linux/fs/namei.c",
    highlight: [4497, 4545],
    desc: "rm이 부르는 unlinkat 시스템 콜의 본체입니다. 이름을 지운 뒤 자기가 잡았던 inode 참조 하나만 놓습니다.",
    annotations: [
      { lines: [4529, 4529], color: "sky", note: "작업 중 inode가 사라지지 않도록 참조를 하나 더 잡습니다." },
      { lines: [4533, 4534], color: "emerald", note: "이름을 지우는 일은 vfs_unlink에 맡깁니다." },
      { lines: [4539, 4540], color: "amber", note: "주석대로 실제 잘라 내기는 여기서 일어날 수 있습니다. 하지만 다른 프로세스가 파일을 열어 두었으면 이 iput은 마지막 참조가 아니라 아무것도 풀리지 않습니다." },
    ],
    code: namei,
    lang: "c",
  },
  "vfs-unlink": {
    path: "linux/fs/namei.c",
    highlight: [4446, 4489],
    desc: "파일시스템별 unlink를 부르고, 성공하면 dentry를 지우는 알림 경로로 넘깁니다.",
    annotations: [
      { lines: [4469, 4469], color: "emerald", note: "ext4라면 여기서 __ext4_unlink로 들어가 디렉터리 항목을 지우고 링크 수를 하나 내립니다." },
      { lines: [4482, 4485], color: "sky", note: "d_delete_notify가 d_delete를 부릅니다. dentry를 다른 곳에서 쓰고 있으면 inode를 떼지 않고 해시에서만 뺍니다." },
    ],
    code: namei,
    lang: "c",
  },
  "ext4-unlink": {
    path: "linux/fs/ext4/namei.c",
    highlight: [3270, 3292],
    desc: "ext4가 디렉터리 항목을 지우고 inode의 링크 수를 내리는 부분입니다.",
    annotations: [
      { lines: [3271, 3273], color: "sky", note: "디렉터리에서 이름 한 줄을 지웁니다. du는 이 이름을 따라 크기를 세므로 여기서부터 du에 안 잡힙니다." },
      { lines: [3283, 3287], color: "emerald", note: "drop_nlink로 링크 수를 1 내립니다. hard link가 하나 더 있으면 1이 남고 블록도 그대로입니다." },
      { lines: [3288, 3289], color: "amber", note: "링크 수가 0이 되면 orphan 목록에 올립니다. 열린 채 지워진 inode를 잃지 않게 기록해 두는 목록입니다." },
    ],
    code: ext4Namei,
    lang: "c",
  },
  "d-delete-notify": {
    path: "linux/include/linux/fsnotify.h",
    highlight: [325, 333],
    desc: "vfs_unlink가 성공한 뒤 부르는 함수입니다. 참조를 잠깐 잡고 d_delete를 부른 뒤 놓습니다.",
    annotations: [
      { lines: [329, 332], color: "sky", note: "ihold와 iput이 짝을 이룹니다. 이 함수 하나로는 참조 수가 줄지 않습니다." },
    ],
    code: fsnotifyH,
    lang: "c",
  },
  "d-delete": {
    path: "linux/fs/dcache.c",
    highlight: [2386, 2412],
    desc: "dentry를 쓰는 곳이 자기 하나뿐일 때만 inode를 바로 떼어 냅니다. 열린 파일이 dentry를 잡고 있으면 해시에서만 빼고 나중으로 미룹니다.",
    annotations: [
      { lines: [2403, 2405], color: "emerald", note: "다른 사용자가 없으면 dentry_unlink_inode로 바로 inode 참조를 놓습니다." },
      { lines: [2406, 2410], color: "amber", note: "로그를 쓰던 프로세스가 파일을 열어 두었다면 이 갈래입니다. 이름은 더 이상 찾을 수 없지만 inode는 붙어 있습니다." },
    ],
    code: dcache,
    lang: "c",
  },
  "dentry-unlink-inode": {
    path: "linux/fs/dcache.c",
    highlight: [395, 413],
    desc: "dentry에서 inode를 떼고 그 참조를 iput으로 놓는 공통 함수입니다. 열린 파일을 닫을 때도 결국 여기를 지납니다.",
    annotations: [
      { lines: [409, 412], color: "sky", note: "파일시스템이 따로 정하지 않았으면 iput을 부릅니다. 이 iput이 마지막 참조라면 블록이 풀립니다." },
    ],
    code: dcache,
    lang: "c",
  },
  "fput": {
    path: "linux/fs/file_table.c",
    highlight: [405, 445],
    desc: "열린 파일의 마지막 fd가 닫히면 실행되는 정리 함수입니다. 마지막에 dentry 참조를 놓습니다.",
    annotations: [
      { lines: [430, 431], color: "emerald", note: "파일시스템의 release를 부릅니다." },
      { lines: [439, 439], color: "amber", note: "dput으로 dentry를 놓습니다. 해시에서 빠진 dentry라면 여기서 사라지고 inode 참조도 놓입니다." },
    ],
    code: fileTable,
    lang: "c",
  },
  "nlink-field": {
    path: "linux/include/linux/fs.h",
    highlight: [653, 663],
    desc: "struct inode의 링크 수 필드입니다. 파일시스템은 읽기만 하고 바꿀 때는 정해진 함수를 씁니다.",
    annotations: [
      { lines: [655, 660], color: "sky", note: "drop_nlink·inc_nlink 같은 함수로만 바꾸라는 규칙입니다. ext4 unlink가 drop_nlink를 쓰는 이유입니다." },
    ],
    code: fsH,
    lang: "c",
  },
  "drop-inode": {
    path: "linux/include/linux/fs.h",
    highlight: [3097, 3100],
    desc: "마지막 참조가 사라질 때 inode를 버릴지 정하는 기본 규칙입니다.",
    annotations: [
      { lines: [3097, 3100], color: "amber", note: "링크 수가 0이면 버립니다. 이름이 하나라도 남아 있으면 메모리 cache에만 남기고 디스크 블록은 그대로 둡니다." },
    ],
    code: fsH,
    lang: "c",
  },
  "iput": {
    path: "linux/fs/inode.c",
    highlight: [1880, 1905],
    desc: "inode 참조 수를 1 내리고, 0이 된 순간에만 iput_final로 갑니다.",
    annotations: [
      { lines: [1895, 1895], color: "sky", note: "i_count를 내리면서 0이 되었는지 봅니다. 열린 fd가 남아 있으면 0이 아니라 아무 일도 없습니다." },
      { lines: [1903, 1903], color: "amber", note: "마지막 참조였다면 iput_final입니다." },
    ],
    code: inodeC,
    lang: "c",
  },
  "iput-final": {
    path: "linux/fs/inode.c",
    highlight: [1826, 1878],
    desc: "마지막 참조가 사라진 inode를 cache에 남길지, 지울지 결정합니다.",
    annotations: [
      { lines: [1846, 1849], color: "sky", note: "파일시스템의 drop_inode가 없으면 generic_drop_inode를 씁니다. 링크 수가 0이면 drop이 참입니다." },
      { lines: [1851, 1857], color: "emerald", note: "drop이 거짓이면 LRU cache에 남기고 끝납니다. 이름이 남은 파일을 닫을 때의 경로입니다." },
      { lines: [1877, 1877], color: "amber", note: "drop이 참이면 evict로 갑니다. 파일시스템의 evict_inode가 블록을 돌려줍니다." },
    ],
    code: inodeC,
    lang: "c",
  },
  "evict": {
    path: "linux/fs/inode.c",
    highlight: [700, 735],
    desc: "inode를 메모리에서 지우며 파일시스템의 evict_inode를 부릅니다.",
    annotations: [
      { lines: [724, 729], color: "amber", note: "ext4라면 evict_inode가 링크 수 0인 inode의 블록과 inode 번호를 돌려줍니다. 이때 df의 Used가 줄어듭니다." },
    ],
    code: inodeC,
    lang: "c",
  },
  "drop-nlink": {
    path: "linux/fs/inode.c",
    highlight: [324, 341],
    desc: "링크 수를 1 내리는 함수입니다. 0이 되면 슈퍼블록의 '지울 inode' 수를 늘립니다.",
    annotations: [
      { lines: [336, 339], color: "sky", note: "이미 0인데 또 내리면 경고합니다. 0이 된 순간 s_remove_count가 1 늘어납니다." },
    ],
    code: inodeC,
    lang: "c",
  },
  "ext4-statfs": {
    path: "linux/fs/ext4/super.c",
    highlight: [6796, 6830],
    desc: "df가 부르는 statfs에 ext4가 답하는 함수입니다. 일반 사용자에게 보이는 빈칸에서 예약 블록을 뺍니다.",
    annotations: [
      { lines: [6811, 6814], color: "sky", note: "f_bfree는 빈 클러스터에서 아직 디스크에 안 쓴 예약분을 뺀 값입니다." },
      { lines: [6815, 6818], color: "amber", note: "f_bavail = f_bfree − (예약 블록 + 내부 예약)이고 음수면 0입니다. 빈칸 5GiB가 전부 예약이면 일반 사용자 몫은 0입니다." },
      { lines: [6819, 6820], color: "violet", note: "f_files와 f_ffree는 전체 inode와 빈 inode입니다. df -i가 이 두 값을 씁니다." },
    ],
    code: ext4Super,
    lang: "c",
  },
  "root-reserve": {
    path: "linux/fs/ext4/balloc.c",
    highlight: [620, 676],
    desc: "블록을 새로 잡을 때 예약 블록을 쓸 수 있는 쪽인지 검사합니다. 실패하면 ENOSPC입니다.",
    annotations: [
      { lines: [635, 636], color: "sky", note: "rsv는 tune2fs -m으로 정한 예약 블록에 내부 예약을 더한 값입니다." },
      { lines: [646, 647], color: "emerald", note: "예약분을 빼고도 남으면 누구나 씁니다." },
      { lines: [650, 657], color: "amber", note: "resuid·resgid이거나 CAP_SYS_RESOURCE가 있으면 예약분까지 씁니다. root 로그 데몬이 계속 쓰는 이유입니다." },
      { lines: [671, 675], color: "rose", note: "둘 다 아니면 -ENOSPC입니다. 응용에는 'No space left on device'로 보입니다." },
    ],
    code: ext4Balloc,
    lang: "c",
  },
  "inode-enospc": {
    path: "linux/fs/ext4/ialloc.c",
    highlight: [1005, 1120],
    desc: "새 파일에 inode 번호를 주는 곳입니다. 모든 그룹을 돌아도 빈 inode가 없으면 블록이 남아도 ENOSPC입니다.",
    annotations: [
      { lines: [1019, 1023], color: "sky", note: "빈 inode가 있는 그룹을 고르지 못하면 바로 -ENOSPC입니다." },
      { lines: [1117, 1118], color: "amber", note: "그룹을 한 바퀴 다 돌아도 못 잡으면 -ENOSPC입니다. 블록 사용률 40%와 상관없습니다." },
    ],
    code: ext4Ialloc,
    lang: "c",
  },
  "remount-ro": {
    path: "linux/fs/ext4/super.c",
    highlight: [692, 743],
    desc: "ext4가 메타데이터 오류를 발견했을 때 mount 옵션 errors=에 따라 계속, 읽기 전용, panic 중 하나로 갑니다.",
    annotations: [
      { lines: [697, 708], color: "sky", note: "errors=continue가 아니면 shutdown 플래그를 세우고 journal을 중단합니다. 이후 수정이 모두 막힙니다." },
      { lines: [728, 731], color: "rose", note: "errors=panic이면 기계를 멈춥니다." },
      { lines: [736, 742], color: "amber", note: "dmesg에 'Remounting filesystem read-only'가 남습니다. 주석대로 6.12는 SB_RDONLY 대신 shutdown 플래그로 쓰기를 막습니다." },
    ],
    code: ext4Super,
    lang: "c",
  },
};
