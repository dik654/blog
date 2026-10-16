import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import WritePathViz from "./linux-vfs-mount-page-cache-fsync/viz/WritePathViz";
import DirtyThresholdViz from "./linux-vfs-mount-page-cache-fsync/viz/DirtyThresholdViz";
import { codeRefs } from "./linux-vfs-mount-page-cache-fsync/codeRefs";
import { linuxVfsWriteTrees } from "./linux-vfs-mount-page-cache-fsync/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxVfsMountPageCacheFsyncArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. write()가 성공을 돌려줬는데 정전 뒤 파일은 왜 비어 있었나요?</h2>
          <div className={prose}>
            <p>
              (가정) 16 GiB 서버의 앱이 100 MiB 로그를 write()로 쓴 뒤 "저장 완료"를 찍었습니다. 20초 뒤 정전이 났으며, 재부팅 뒤 그 파일은 비어 있었습니다. 같은 서버의 다른 앱은
              컨테이너 이미지 안의 파일에 한 줄을 덧붙이는 데 1초가 걸렸습니다. 세 번째 앱은 디스크 공간이 충분한데도 쓰기마다 수십 ms씩 멈췄습니다. 세 사건은 한 질문으로 모입니다.
              프로그램이 쓴 바이트는 어떤 길을 지나 디스크에 닿고, 그 길의 어디에서 멈추나요?
            </p>
            <p>
              답을 먼저 적겠습니다. write()는 디스크가 아니라 page cache에 적은 뒤 돌아옵니다. 디스크로 가는 때는 flusher가 30초 넘은 dirty page를 쓰거나, dirty 합계가 가용 메모리의
              10%를 넘거나, 앱이 fsync()를 부를 때뿐입니다.
            </p>
            <p>
              fsync()는 데이터 writeback과 저널 commit과 장치 캐시 flush를 모두 기다린 뒤 돌아옵니다. 그 앞에는 경로 이름을 inode로
              바꾸는 VFS와, 어느 파일시스템이 그 경로를 맡는지 정하는 mount 표가 있으며, 컨테이너 이미지는 overlayfs가 lower layer의 파일을 처음 쓸 때 통째로 복사(copy_up)합니다.
            </p>
            <p>
              이 글은 <a href="/cs/cloud/linux-disk-full-inode-deleted-files#overview">디스크 가득 참·inode·지운 파일</a>이 "한 mount 안의 inode 회계"로 범위를 좁히며 당연하게 쓴
              바닥, 곧 VFS와 mount, page cache, fsync를 Linux v6.12 원문으로 쌓습니다. page cache가 메모리 장부에서 차지하는 자리는{" "}
              <a href="/cs/cloud/linux-memory-page-cache-oom#small-case">메모리 글</a>에서 다뤘습니다.
            </p>
            <p>
              여기서는 그 cache에 적힌 dirty page가 디스크로 내려가는 쪽을 봅니다. Kubernetes의 PVC
              mount와 emptyDir·이미지 layer가 이 위에 어떻게 놓이는지는 <a href="/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview">PVC·PV·StorageClass·CSI</a>에서 이어집니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 이름이 inode, mount, page cache, writeback을 지나 장치에 닿습니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 흐름은 여섯 칸입니다. 프로그램이 "/var/log/app.log"라는 이름으로 open()을 부르면 커널은 이름을 조각내 inode를 찾습니다. 그 경로가 어느 파일시스템에 속하는지는
              mount 표가 정합니다. write()는 그 inode의 page cache에 바이트를 적은 뒤 dirty 표시를 남깁니다. 나중에 커널 스레드가 dirty page를 블록 층으로 내려보내면 블록 층이 장치에 요청을 보내고 장치가 완료를 알립니다.
            </p>
            <p>
              첫 두 칸이 VFS(Virtual File System)입니다. ext4, xfs, tmpfs, overlay, nfs가 전부 다른 코드인데도 프로그램이 같은 open/read/write를 쓰는 이유가 이 층입니다. 셋째 칸이
              mount이며, 컨테이너 볼륨과 이미지 layer가 여기 걸립니다. 넷째·다섯째 칸이 page cache와 writeback이며 1절의 정전은 이 사이에서 났습니다. 여섯째 칸이 블록 층과
              장치로, iostat가 보는 곳입니다.
            </p>
            <p>이 글은 이름(3절) → mount(4절) → overlay(5절) → dirty page(6절) → fsync(7절) → 장치(9절) 순서로 내려갑니다. 각 칸에서 "멈추는 곳"이 어디인지 표시하면서 갑니다.</p>
          </div>
        </section>

        <section id="vfs-objects" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 경로 하나가 dentry 넷, inode 하나, file 하나가 됩니다</h2>
          <div className={prose}>
            <p>
              open("/var/log/app.log")이 들어오면 커널은 경로를 "/", "var", "log", "app.log" 네 조각으로 나눠 조각마다 dentry(directory entry)를 찾습니다. dentry는 이름 하나와 그
              이름이 가리키는 inode의 쌍으로, RAM에만 있습니다. 디스크에 저장되지 않으며 오직 다음 조회를 빠르게 하려고 존재합니다. 이 dentry들의 모음이 dcache입니다.
            </p>
            <p>
              조각마다 lookup_fast가 먼저 dcache를 봅니다. 네 조각이 모두 cache에 있으면 디스크를 한 번도 읽지 않은 채 inode까지 이어집니다. 없는 조각이 있으면 lookup_slow가 그
              파일시스템의 lookup()을 불러 디스크에서 디렉터리를 읽은 뒤 새 dentry를 cache에 넣습니다. 파일이 수백만 개인 디렉터리에서 ls가 느린 것은 이 느린 경로가 이름마다 불리기
              때문입니다.
            </p>
            <p>
              inode는 파일 자체입니다. 크기·권한·시각·데이터 블록 위치를 들고 있으며, 디스크에 있는 것을 메모리로 복사해 쓰다가 바뀔 때 되씁니다. 하드 링크처럼 여러 dentry가 한 inode를
              가리킬 수 있는 반면, 이름이 다 지워져도 누군가 열어 둔 동안에는 inode가 남습니다. 이 둘이 디스크 글의 "지운 파일이 공간을 안 돌려주는" 사건의 재료였습니다.
            </p>
            <p>
              open()은 마지막으로 file 구조를 하나 만듭니다. dentry를 가리키며, inode에서 가져온 file_operations(그 파일시스템의 read·write·fsync 함수 표)를 채운 뒤 프로세스의 fd 표에
              넣습니다. 그 뒤 write(fd, …)는 fd로 file을 찾아 그 표의 write를 부릅니다. 어느 파일시스템 코드가 실행될지는 이 순간 이미 정해져 있습니다. VFS가 "switch"라고 불리는
              이유입니다.
            </p>
          </div>
          {code("vfs-overview", "VFS 개요와 dcache")}
          {code("vfs-inode-file", "dentry → inode → file")}
          {code("dcache-lookup", "lookup_fast와 lookup_slow")}
        </section>

        <section id="mount" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. mount 표가 어느 dentry 위에 어느 파일시스템이 얹혔는지 정합니다</h2>
          <div className={prose}>
            <p>
              경로를 따라가다 어떤 dentry에 다른 파일시스템이 얹혀 있으면 커널은 그 지점에서 얹힌 파일시스템의 루트 dentry로 갈아탑니다. 어느 dentry 위에 무엇이 얹혔는지 적어 둔 것이
              mount 표이며, path-lookup 문서는 이 표가 dcache와 밀접하게 엮여 있다고 적습니다. /var/log가 별도 파티션이면 "log" 조각에서 ext4의 다른 superblock으로 넘어갑니다.
            </p>
            <p>
              bind mount는 새 파일시스템 없이 같은 dentry 트리를 다른 지점에서 한 번 더 보이게 하는 mount입니다. mount --bind /data/logs /srv/app/logs를 부를 때 커널의 do_loopback이
              원본 mount 구조를 clone_mnt로 복제해 새 지점에 접붙입니다.
            </p>
            <p>
              데이터는 한 벌이되 이름이 둘입니다. 컨테이너 런타임이 호스트 디렉터리를 컨테이너 안에 보이게 하는 "볼륨"이 정확히
              이것이라, 볼륨에 쓰는 속도는 호스트 파일시스템 속도 그대로입니다.
            </p>
            <p>
              기본으로는 그 디렉터리만 bind될 뿐 아래의 서브마운트는 따라오지 않습니다. MS_REC(mount --rbind)를 주면 재귀로 따라옵니다. 전파 유형은 그 뒤에 호스트에서 새로 마운트한 것이
              컨테이너 안에도 나타날지를 정합니다.
            </p>
            <p>
              shared면 양방향, private면 단절, slave면 호스트→컨테이너 한 방향입니다. 컨테이너 런타임의 기본은 private이며, Kubernetes volumeMount의
              mountPropagation: HostToContainer가 slave입니다.
            </p>
            <p>
              각 프로세스는 mount namespace 하나에 속해 그 namespace의 mount 표를 봅니다. 컨테이너가 자기만의 "/"를 갖는 것은 새 mount namespace에서 pivot_root로 루트를 바꿨기 때문입니다.
              namespace 전체 그림은 <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">컨테이너는 cgroup과 namespace다</a>에 있으므로, 여기서는 mount 표가 프로세스마다 다를 수
              있다는 사실만 씁니다.
            </p>
          </div>
          {code("mount-bind-man", "mount(2): bind mount")}
          {code("mount-propagation-man", "mount_namespaces(7): 전파 유형")}
          {code("do-loopback", "do_loopback: 복제해서 접붙이기")}
        </section>

        <section id="overlayfs" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 이미지 layer는 overlayfs의 lower이고, 첫 쓰기는 파일을 통째로 복사합니다</h2>
          <div className={prose}>
            <p>
              컨테이너 이미지는 layer 여러 장을 겹친 것입니다. 커널에서 이 겹침을 구현하는 파일시스템이 overlayfs입니다. mount -t overlay overlay -olowerdir=/l1:/l2:/l3,upperdir=/u,workdir=/w
              /merged처럼 읽기 전용 lower 여러 개와 쓰기 가능한 upper 하나를 합쳐 /merged 하나로 보여 줍니다.
            </p>
            <p>
              lowerdir은 오른쪽이 가장 아래 layer, 왼쪽이 가장 위입니다. 이미지의 base
              layer가 오른쪽 끝에, 마지막 RUN의 layer가 왼쪽 끝에 옵니다.
            </p>
            <p>
              같은 이름이 여러 layer에 있으면 위쪽이 보입니다. 디렉터리끼리는 합쳐지지만 파일은 위쪽이 아래쪽을 가립니다. 컨테이너가 실행 중에 만드는 모든 변경은 upper에만 적힙니다. 그래서
              컨테이너를 지울 때는 upper만 지우며, lower는 다른 컨테이너와 계속 공유합니다.
            </p>
            <p>
              1절의 두 번째 사건이 여기서 납니다. lower에 있는 100 MiB 파일에 한 줄을 덧붙이려고 쓰기 모드로 열면, overlayfs는 먼저 그 파일을 upper로 복사합니다.
            </p>
            <p>
              이것이 copy_up이며 순서는
              부모 디렉터리 만들기 → 같은 메타데이터로 빈 파일 만들기 → 데이터 100 MiB 복사 → 확장 속성 복사입니다. 복사가 끝나야 한 줄이 적힙니다. 그다음부터는 upper의 일반 파일이라
              빠릅니다. 한 줄 쓰는 데 1초가 걸린 것은 그 한 줄이 아니라 100 MiB 복사였습니다.
            </p>
            <p>
              그래서 자주 쓰는 데이터는 이미지 안이 아니라 볼륨(4절의 bind mount)에 둡니다. 로그·DB 파일·캐시가 이미지 layer 위에 있으면 첫 쓰기마다 copy_up이 나며 upper가 커집니다.
              이미지 빌드 시 큰 파일을 만든 뒤 삭제해도 아래 layer에는 남아 있다는 점도 같은 구조에서 나옵니다.
            </p>
          </div>
          {code("overlay-layers", "upper·lower·workdir")}
          {code("overlay-multi-lower", "lower 여러 장 쌓기")}
          {code("overlay-copy-up", "copy_up 순서")}
          <div id="paper-overlayfs" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux v6.12 · Documentation/filesystems/overlayfs.rst · Non-directories (2026-10-17 확인)" citeKey={1} href="https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/filesystems/overlayfs.rst">
              <q>the file is first copied from the lower filesystem to the upper filesystem (copy_up).</q> 같은 절은 쓰기 열기·메타데이터 변경·하드 링크 생성이 copy_up을 일으키고,
              읽기·쓰기로 열었어도 실제로 수정하지 않으면 복사가 불필요할 수 있으며, 복사가 끝난 뒤의 접근은 upper 파일로 바로 간다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="dirty-pages" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. dirty page는 30초 또는 가용 메모리 10%에서 내려가고, 20%에서 앱이 멈춥니다</h2>
          <div className={prose}>
            <p>
              write()가 하는 일은 사용자 버퍼를 page cache의 page로 복사한 뒤 그 page에 dirty 표시를 남기는 것까지입니다. 메모리 글에서 본 page cache의 page 가운데 디스크 원본과
              내용이 다른 page가 dirty page입니다. 복사가 끝나면 write()는 돌아옵니다. 1절의 앱이 "저장 완료"를 찍은 시점에 100 MiB는 전부 RAM에만 있었습니다.
            </p>
            <p>
              dirty page가 디스크로 내려가는 계기는 셋입니다. 첫째, 커널 flusher 스레드가 dirty_writeback_centisecs(기본 500 = 5초)마다 깨어나 dirty_expire_centisecs(기본 3,000 =
              30초)보다 오래된 page를 씁니다. 그래서 가만히 두면 30~35초 사이에 써집니다.
            </p>
            <p>
              둘째, dirty 합계가 dirty_background_ratio(기본 10%)를 넘는 순간 flusher가 즉시 쓰기 시작합니다.
              셋째, dirty 합계가 dirty_ratio(기본 20%)를 넘으면 쓰기를 하는 프로세스 자신이 balance_dirty_pages 안에서 멈춰 writeback을 기다립니다. 1절의 세 번째 사건, 공간이 남는데
              쓰기가 멈추는 현상이 이 셋째 계기입니다.
            </p>
            <p>
              두 비율의 분모는 RAM 전체가 아닙니다. 커널 문서는 "빈 page와 회수 가능한 page를 더한 가용 메모리"라고 적으며, 코드는 빈 page에서 커널 예약을 뺀 값에 file LRU를 더합니다.
              anonymous page는 들어가지 않습니다. 그래서 앱이 메모리를 많이 쓰는 서버일수록 분모가 작아져 같은 양의 dirty page로도 20%에 더 빨리 이릅니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="가용 12,288 MiB 서버의 두 한계선"
            question="dirty page가 얼마나 쌓이면 flusher가 깨어나고, 얼마에서 앱이 멈출까요?"
            scope="mm/page-writeback.c의 global_dirtyable_memory와 domain_dirty_limits를 MiB 단위로 따라갑니다. (가정) 빈 page − 예약 + file LRU = 12,288 MiB, page 4 KiB, dirty_background_ratio 10, dirty_ratio 20, bytes 설정 없음, 일반 작업."
            steps={[
              { label: "가용 page 수", expression: "12,288 MiB × 256 page/MiB", result: "3,145,728 page", reason: "분모입니다. RAM 16 GiB가 아니라 dirty가 될 수 있는 자리만 셉니다." },
              { label: "bg 비율의 정수화", expression: "⌊10 × 4,096 ÷ 100⌋", result: "409 / 4,096", reason: "비율을 PAGE_SIZE 기준 분수로 바꿉니다. 정수 나눗셈이라 409.6이 409가 됩니다." },
              { label: "bg_thresh", expression: "409 × 3,145,728 ÷ 4,096", result: "314,112 page ≈ 1,227 MiB", reason: "여기서 flusher가 배경 writeback을 시작합니다. 정수화 때문에 정확히 10%인 1,228.8 MiB보다 조금 낮습니다." },
              { label: "thresh", expression: "⌊20 × 4,096 ÷ 100⌋ × 3,145,728 ÷ 4,096", result: "628,992 page ≈ 2,457 MiB", reason: "819 × 768입니다. 여기서 쓰는 프로세스가 멈춥니다." },
              { label: "freerun 상한", expression: "(1,227 + 2,457) ÷ 2", result: "1,842 MiB", reason: "dirty_freerun_ceiling입니다. 이 선부터 쓰는 쪽이 장치 속도에 맞춰 짧게 멈추기 시작합니다." },
              { label: "100 MiB 로그", expression: "100 < 1,227", result: "아무 일도 안 일어남", reason: "두 선 아래라 30초 만료가 유일한 계기입니다. 그 사이 정전이 나면 전부 사라집니다." },
            ]}
            conclusion="100 MiB 한 번은 30~35초 뒤에, 2 GiB 연속 쓰기는 1,227 MiB에서 flusher가, 2,457 MiB에서 앱이 멈춥니다. 멈춤을 줄이려면 dirty_bytes를 장치가 1~2초에 쓸 수 있는 양으로 낮춰 자주 조금씩 내려보내게 합니다."
            caveats={["분모 12,288 MiB는 가정이며 실제로는 page cache가 커지고 줄어듦에 따라 초 단위로 움직입니다.", "cgroup v2에서는 memcg마다 같은 식을 그 cgroup의 가용 메모리에 적용한 한계선이 따로 있습니다(domain_dirty_limits의 memcg 분기).", "실시간(rt/dl) 작업은 두 선을 1/4 + 전역 한도/32만큼 더 높게 받습니다."]}
          />
          <DirtyThresholdViz />
          {code("dirty-sysctl", "dirty_* sysctl 정의")}
          {code("dirty-defaults", "기본값 10·20·500·3000")}
          {code("dirtyable-memory", "분모: global_dirtyable_memory")}
          {code("domain-dirty-limits", "domain_dirty_limits 계산")}
          {code("wb-periodic-flush", "flusher의 두 검사")}
        </section>

        <section id="fsync" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. fsync는 데이터 writeback, 저널 commit, 장치 flush 셋을 모두 기다립니다</h2>
          <div className={prose}>
            <p>
              30초를 기다릴 수 없는 프로그램은 fsync(fd)를 부릅니다. fsync(2) man page는 수정된 데이터를 장치로 옮긴 뒤 장치의 쓰기 캐시까지 비우며, 장치가 완료를 보고할 때까지
              막힌다고 정의합니다. 파일 데이터뿐 아니라 inode 메타데이터도 씁니다. 다만 그 파일이 들어 있는 디렉터리 항목까지 디스크에 닿았다고는 보장하지 않으므로 새로 만든 파일은
              디렉터리 fd에도 fsync가 필요합니다.
            </p>
            <p>
              ext4(기본 data=ordered)에서 fsync는 세 단계입니다. ① file_write_and_wait_range로 그 파일의 dirty page를 쓰기 시작해 완료를 기다립니다. 100 MiB가 dirty였으면 여기서
              100 MiB가 장치로 갑니다.
            </p>
            <p>
              ② ext4_fsync_journal로 이 inode가 속한 저널 트랜잭션의 commit을 기다립니다. 크기·블록 위치 같은 메타데이터는 저널에 적혀야 크래시 뒤 복구됩니다.
              ③ 장치가 휘발성 쓰기 캐시를 쓰고 있으면 blkdev_issue_flush로 캐시를 비웁니다. 셋이 끝나야 fsync가 돌아옵니다.
            </p>
            <p>
              fdatasync는 ②에서 "데이터를 다시 읽는 데 필요한 메타데이터"만 기다립니다. 크기 변경은 쓰되 mtime 갱신은 건너뜁니다. 로그처럼 덧붙이기만 하는 파일에서 fsync 대신
              fdatasync를 쓰면 저널 commit을 기다리는 일이 줄어듭니다.
            </p>
            <p>
              data=ordered가 "데이터를 저널링하지 않는데도" 크래시 뒤 쓰레기 데이터가 안 보이는 이유는 메타데이터 트랜잭션을 commit하기 전에 관련 데이터 블록을 먼저 쓰기 때문입니다.
              data=writeback은 이 순서를 지키지 않아 크기는 늘었는데 내용이 옛 블록인 파일이 생길 수 있으며, data=journal은 데이터까지 저널에 두 번 써서 가장 느립니다.
            </p>
            <p>
              commit=5(초)는
              트랜잭션이 저널에 닫히는 최대 간격이라 fsync 없이는 최대 5초치 메타데이터를 잃을 수 있는 한편, 데이터는 6절의 30초가 지나야 쓰기 시작하므로 그보다 오래된 것도 잃을 수 있다고
              ext4 문서가 적습니다. 1절의 정전이 그 경우였습니다.
            </p>
          </div>
          <AlgorithmBlock
            title="ext4 data=ordered에서 fsync(fd)가 돌아오기까지"
            input={["fd → file → inode (/var/log/app.log, ext4)", "dirty page 100 MiB, 블록 미할당(delalloc)", "저널 트랜잭션 T 열림, commit=5", "장치 쓰기 캐시 있음(barrier 기본 on), 500 MB/s"]}
            steps={[
              { code: "if !file.f_op.fsync: return -EINVAL", note: "VFS 입구 vfs_fsync_range입니다. ext4는 ext4_sync_file을 등록해 두었습니다." },
              { code: "if !datasync and inode.I_DIRTY_TIME: mark_inode_dirty_sync(inode)", note: "lazytime으로 미뤄 둔 시각 갱신을 fsync일 때만 함께 씁니다. fdatasync는 건너뜁니다." },
              { code: "file_write_and_wait_range(file, 0, LLONG_MAX)", note: "① 블록을 할당하고 100 MiB를 장치로 보낸 뒤 완료를 기다립니다. (가정) 500 MB/s면 약 0.2초. 이 시간 동안 프로세스는 D 상태입니다." },
              { code: "tid = datasync ? inode.i_datasync_tid : inode.i_sync_tid", note: "② 기다릴 트랜잭션을 고릅니다. fdatasync는 데이터 접근에 필요한 메타데이터가 바뀐 마지막 트랜잭션만 봅니다." },
              { code: "if JBD2_BARRIER and !trans_will_send_data_barrier(tid): needs_barrier = true", note: "그 트랜잭션의 commit이 자체 flush를 내보내지 않을 때만 ③을 따로 하겠다고 표시합니다. flush를 두 번 하지 않기 위해서입니다." },
              { code: "ext4_fc_commit(journal, tid)   # commit을 기다림", note: "저널에 메타데이터가 적히고 commit 블록이 쓰일 때까지 기다립니다. data=ordered라 ①의 데이터가 이미 장치에 간 뒤입니다." },
              { code: "if needs_barrier: blkdev_issue_flush(bdev)", note: "③ 장치 쓰기 캐시를 비웁니다. iostat의 f/s가 1 늘고 f_await에 그 시간이 잡힙니다. 블록 층은 flush를 한 번에 하나만 실행하므로 다른 fsync와 겹치면 두 배 걸릴 수 있습니다." },
              { code: "return file_check_and_advance_wb_err(file) or ret", note: "writeback 중 I/O 오류가 있었으면 여기서 처음 보고됩니다. fsync의 반환값을 꼭 확인해야 하는 이유입니다." },
            ]}
            output="fsync가 0을 돌려주면 100 MiB와 그 메타데이터는 장치의 비휘발 영역에 있습니다. 디렉터리 항목은 별도 fsync(dirfd) 전까지 보장되지 않습니다."
          />
          <WritePathViz />
          {code("fsync-man", "fsync(2) 정의와 한계")}
          {code("ext4-data-modes", "ext4 data 모드와 commit")}
          <div id="paper-fsync-man" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux man-pages 6.9.1 · fsync(2) (2026-10-17 확인)" citeKey={2} href="https://man7.org/linux/man-pages/man2/fsync.2.html">
              <q>Calling fsync() does not necessarily ensure that the entry in the directory containing the file has also reached disk.</q> 같은 page는 fsync가 장치의 디스크 캐시를
              비우는 것까지 포함하며 장치가 완료를 보고할 때까지 막힌다고 적고, fdatasync는 데이터를 다시 읽는 데 필요하지 않은 메타데이터(st_atime·st_mtime)는 쓰지 않는다고 적습니다.
            </CitationBlock>
          </div>
          <div id="paper-ext4-commit" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux v6.12 · Documentation/admin-guide/ext4.rst · commit=nrsec (2026-10-17 확인)" citeKey={3} href="https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/admin-guide/ext4.rst">
              <q>due to delayed allocation even older data can be lost on power failure since writeback of those data begins only after time set in /proc/sys/vm/dirty_expire_centisecs.</q>{" "}
              commit의 기본값 5초는 메타데이터 손실 상한일 뿐이고, 데이터는 6절의 dirty 만료 규칙을 따른다는 뜻입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 원문은 분모를 세고, 두 선을 긋고, 세 단계를 차례로 기다립니다</h2>
          <div className={prose}>
            <p>
              
              Linux v6.12 mm/page-writeback.c의 기본값은 74행 dirty_background_ratio = 10, 91행 vm_dirty_ratio = 20, 102행 dirty_writeback_interval = 500, 109행 dirty_expire_interval =
              3000입니다.
            </p>
            <p>
              분모를 세는 global_dirtyable_memory(347–371행)는 빈 page에서 totalreserve_pages를 뺀 뒤(351–356행) 비활성·활성 file LRU를 더합니다(358–359행).
            </p>
            <p>
              두 선을 긋는
              domain_dirty_limits(377–430행)는 비율을 PAGE_SIZE 기준 분수로 바꾼 뒤(383–385행) ratio × available ÷ PAGE_SIZE로 thresh와 bg_thresh를 구합니다(410–418행). 6절의 1,227과
              2,457이 이 두 줄에서 나옵니다.
            </p>
            <p>
              flusher가 깨어나 하는 두 검사는 fs/fs-writeback.c에 있습니다.
            </p>
            <p>
              wb_check_background_flush(2194–2209행)는 wb_over_bg_thresh면 for_background로 끝까지 쓰며,
              wb_check_old_data_flush(2212–2240행)는 마지막 주기 flush에서 dirty_writeback_interval × 10 ms가 지났으면 for_kupdate로 오래된 page를 씁니다. 두 함수를 wb_do_writeback이
              차례로 부릅니다.
            </p>
            <p>
              fsync의 VFS 입구는 fs/sync.c의 vfs_fsync_range(180–189행)입니다. 184행이 fsync 메서드가 없는 파일시스템을 EINVAL로 거르며, 186–187행이 I_DIRTY_TIME을 처리한 뒤, 188행이
              file_operations의 fsync를 부릅니다. fsync(218행)와 fdatasync(223행)는 datasync 인자 0과 1만 다릅니다.
            </p>
            <p>
              ext4의 구현 fs/ext4/fsync.c ext4_sync_file(129–180행)이 7절의 세
              단계입니다. 158행이 데이터 writeback 대기, 167행이 ext4_fsync_journal(97–115행)로 commit 대기, 170–174행이 blkdev_issue_flush입니다.
            </p>
            <p>
              bind mount는 fs/namespace.c의 do_loopback(2755–2800행)입니다. 2764행이 원본 경로를 찾으면, 2782행의 __do_loopback(2728–2750행)이 clone_mnt 또는 copy_tree로 mount 구조를
              복제하며, 2788행의 graft_tree가 새 지점에 접붙입니다. 새 superblock은 만들어지지 않습니다.
            </p>
          </div>
          {code("vfs-fsync", "vfs_fsync_range 입구")}
          {code("ext4-sync-file", "ext4_sync_file 세 단계")}
        </section>

        <section id="block-iostat" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. iostat의 await는 대기열을 포함하고, %util은 SSD에서 포화를 뜻하지 않습니다</h2>
          <div className={prose}>
            <p>
              writeback과 fsync가 내려보낸 요청은 블록 층의 큐에 들어가 합쳐진(merge) 뒤 장치로 나갑니다. 이 층을 보는 도구가 iostat -x이며 열의 정의는 sysstat의 man page에 있습니다.
            </p>
            <p>
              r/s·w/s는 초당 완료된 읽기·쓰기 요청 수, rkB/s·wkB/s는 그 양, rqm/s는 보내기 전에 합쳐진 요청 수입니다. 6절의 flusher가 연속된 dirty page를 모아 보내면 w/s는 낮은 대신
              wkB/s는 높으며 wareq-sz(평균 요청 크기)가 큽니다.
            </p>
            <p>
              await는 요청이 처리되기까지의 평균 ms로, 대기열에서 기다린 시간과 실제 처리 시간을 합친 값입니다. aqu-sz는 평균 대기열 길이입니다. w_await와 aqu-sz가 함께 오르면 장치가 못 따라가 큐가 쌓이는 것이며, 그 큐 뒤에 선 fsync는 그만큼 늦게 돌아옵니다.
            </p>
            <p>
              f/s와 f_await는 flush 요청의 수와 시간입니다. 7절의 ③이 여기 잡히고, 블록 층이 flush를
              한 번에 하나만 실행하므로 여러 프로세스가 동시에 fsync하면 f_await가 두 배로 보일 수 있다고 man page가 적습니다.
            </p>
            <p>
              %util은 I/O 요청이 장치에 나가 있던 시간의 비율입니다. 요청을 하나씩 처리하는 장치에서는 100% 근처가 포화이지만, 병렬로 처리하는 RAID·SSD에서는 성능 한계를 뜻하지
              않습니다. NVMe에서 %util 100%를 보고 디스크가 꽉 찼다고 판단하면 틀립니다. 포화는 await와 aqu-sz의 상승으로 보며, 공간이 남는데 쓰기가 멈추는 사건의 진단 순서는{" "}
              <a href="/cs/cloud/linux-disk-full-inode-deleted-files#read-only-latency">디스크 글 11절</a>에 있습니다.
            </p>
          </div>
          {code("iostat-columns", "iostat -x 열 정의")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 볼 숫자는 Dirty·Writeback과 await, 고칠 곳은 fsync 정책입니다</h2>
          <div className={prose}>
            <p>
              1절의 세 사건을 다시 읽으면 답이 하나씩 나옵니다. 정전 뒤 빈 파일은 write()가 page cache까지만 적고 30초 만료 전에 전원이 나간 것이라 fsync(또는 fdatasync)와 디렉터리 fsync가 답입니다.
              이미지 파일에 한 줄 쓰는 데 1초 걸린 것은 overlayfs의 copy_up이라 그 파일을 볼륨으로 옮기는 것이 답입니다.
            </p>
            <p>
              공간이 남는데 쓰기가 멈춘 것은 dirty 합계가 dirty_ratio에
              닿아 balance_dirty_pages에서 기다린 것이라 dirty_bytes를 장치가 1~2초에 쓸 수 있는 양으로 낮춰 자주 조금씩 내려보내게 하는 것이 답입니다.
            </p>
            <p>
              볼 숫자는 /proc/meminfo의 Dirty와 Writeback(지금 RAM에만 있는 양과 장치로 가는 중인 양), iostat -x의 w_await·aqu-sz·f_await, 그리고 /proc/pressure/io의 some입니다.
              Dirty가 6절의 bg_thresh 근처에 오래 머물면 장치가 쓰기 속도를 못 따라가는 것이며, PSI io가 오르면 누군가 D 상태로 writeback을 기다리고 있는 것입니다.
            </p>
            <p>
              fsync 정책은 데이터의 가치로 정합니다. DB의 커밋 로그는 트랜잭션마다 fdatasync, 접근 로그는 주기적 fsync 또는 아예 30초 만료에 맡기기, 임시 파일은 fsync 없음이 흔한 선택입니다.
              fsync 한 번은 장치 flush 한 번이라 초당 수천 번 부르면 f_await가 지배합니다.
            </p>
            <p>
              컨테이너에서는 상태를 가진 데이터를 overlay upper가 아니라 볼륨에 두고, Kubernetes라면 emptyDir와
              hostPath, PVC가 모두 4절의 bind mount로 컨테이너 안에 들어온다는 점을 기억하면 됩니다. 그 mount가 어디서 오는지는{" "}
              <a href="/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview">PVC·PV·StorageClass·CSI</a>에서 이어집니다.
            </p>
            <p>
              이 글의 수치는 가정한 가용 메모리와 장치 속도로 커널 식을 손 계산한 값이라 실제 커널을 돌려 잰 것이 아닙니다. 실제 서버의 분모는 /proc/meminfo의 MemFree·Active(file)·
              Inactive(file)로, 두 선은 /proc/sys/vm/dirty_*로, 장치 캐시 유무는 장치별 cache_type로 다시 확인해야 합니다.
            </p>
          </div>
          <ContentBoundary article="linux-vfs-mount-page-cache-fsync" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>같은 서버에서 앱이 anonymous 메모리를 6 GiB 더 써서 가용 메모리가 6,144 MiB가 되면 bg_thresh와 thresh는 각각 얼마가 될까요? 정수화를 포함해 계산하세요. (답: 6절)</p>
            <p>fdatasync로 로그를 덧붙이다가 ftruncate로 파일을 줄였습니다. 그다음 fdatasync는 메타데이터를 기다릴까요, 건너뛸까요? (답: 7절)</p>
            <p>이미지 layer에 있는 100 MiB 파일을 읽기 전용(O_RDONLY)으로 열어 읽기만 하면 copy_up이 일어날까요? 쓰기·읽기(O_RDWR)로 열고 아무것도 안 쓰면요? (답: 5절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxVfsWriteTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "man-pages": { id: "man-pages", label: "Linux man-pages 6.9.1", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
          sysstat: { id: "sysstat", label: "sysstat v12.7.6 iostat(1)", badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700" },
        }}
      />
    </>
  );
}
