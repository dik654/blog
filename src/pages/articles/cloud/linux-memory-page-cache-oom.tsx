import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import MemoryLedgerViz from "./linux-memory-page-cache-oom/viz/MemoryLedgerViz";
import OomScoreViz from "./linux-memory-page-cache-oom/viz/OomScoreViz";
import { codeRefs } from "./linux-memory-page-cache-oom/codeRefs";
import { linuxMemoryTrees } from "./linux-memory-page-cache-oom/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxMemoryPageCacheOomArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 메모리 90% 경보는 틀렸는데 컨테이너는 왜 137로 죽었나요?</h2>
          <div className={prose}>
            <p>
            16 GiB 서버에서 "메모리 사용률 90%" 경보가 울렸습니다. 들어가 보니 앱은 멀쩡했고 한 주 뒤 같은 서버의 2 GiB 컨테이너가 아무 로그 없이 exit code
            137로 재시작됐습니다. 두 사건은 같은 질문 하나에서 갈립니다. 리눅스에서 "쓰고 있다"는 메모리 가운데 얼마가 정말 돌려받을 수 없는 몫일까요?
          </p>
            <p>
            답을 먼저 적겠습니다. 리눅스는 남는 RAM을 파일을 담아 두는 page cache로 채우므로 used가 아니라 available과 회수 압력을 봐야 합니다. 회수할 것이
            바닥나면 OOM killer가 전역 또는 cgroup 단위로 점수가 가장 높은 프로세스 하나에 SIGKILL을 보냅니다. 점수는 쓰는 page 수에 oom_score_adj를
            상한의 1/1000 단위로 더한 값이고 SIGKILL로 끝난 프로세스는 128 + 9 = 137을 남깁니다.
          </p>
            <p>국내 리눅스 엔지니어 면접 질문지의 장애 대응 문항에는 "OOM Killer 동작 과정과 희생 프로세스 선정 기준"이 있고, 해외 SRE·Production Engineer 면접 정리와 지원자 후기에도 메모리 관리와 vmstat 해석이 나옵니다(출처는 <a href="/cs/cloud/linux-server-interview-incident-map#black-box">면접 자료 다섯 곳</a>에 정리했습니다). 이 글은 그 질문들을 한 서버의 장부와 Linux v6.12 원문으로 끝까지 따라갑니다. 시리즈 전체 지도는 <a href="/cs/cloud/linux-server-interview-incident-map#overview">리눅스 서버 면접·장애 지도</a>에 있습니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 프로그램은 주소를 받고, 물리 page는 처음 쓸 때 붙습니다</h2>
          <div className={prose}>
            <p>
            바깥에서 보면 흐름은 다섯 칸입니다. 프로그램이 메모리를 요청하면 커널은 먼저 주소 범위만 내줍니다. 그 주소에 처음 값을 쓰는 순간 물리 page 하나가 붙습니다. 아무도
            쓰지 않는 RAM은 놀리지 않고 최근 읽은 파일 내용을 담아 둡니다. RAM이 모자라면 그 파일 page부터 비우고 비울 것이 없으면 프로세스 하나를 죽입니다.
          </p>
            <p>
            면접에서 "가상 메모리를 설명하라"는 질문이 묻는 것이 첫 두 칸입니다. 프로세스마다 자기만의 주소 공간을 갖고 커널이 그 주소를 실제 RAM page에 대응시킵니다. 그래서
            프로세스가 잡은 주소 공간의 크기(VSZ)와 실제로 RAM에 올라와 있는 크기(RSS)는 다릅니다. 이 차이가 6절의 overcommit을 만듭니다.
          </p>
            <p>이 글이 다루는 것은 나머지 세 칸, 곧 파일 page 보관과 회수와 OOM입니다. 컨테이너의 메모리 한도가 cgroup이라는 커널 기능으로 구현된다는 점은 <a href="/cs/ai/agent-sandbox-security#cgroup">cgroup 자원 예산</a>에서 다뤘고, DIMM·ECC 같은 물리 메모리 자체는 <a href="/cs/gpu/hw-memory#overview">서버 메모리</a>에 있습니다.</p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 빈 page 1.5 GiB인 서버는 새 프로그램에 10.7 GiB를 줄 수 있습니다</h2>
          <div className={prose}>
            <p>(가정) swap이 없는 16,384 MiB 서버의 장부입니다. 앱이 직접 쓰는 메모리가 4,608 MiB, 커널 내부 몫이 512 MiB, 회수할 수 있는 커널 캐시(slab)가 512 MiB, 파일 내용을 담은 page cache가 9,216 MiB이고, 아무도 쓰지 않는 빈 page가 1,536 MiB입니다.</p>
            <p>
            경보는 (16,384 − 1,536) ÷ 16,384 = 90.6%를 "사용률"로 계산했습니다. 그러나 page cache는 디스크에 원본이 있는 파일 사본이라 앱이 메모리를
            더 원하면 커널이 비워서 넘겨줄 수 있습니다. 새 프로그램이 swap 없이 받을 수 있는 양을 추정한 값이 available이고 이 서버에서는 10,976 MiB입니다.
          </p>
            <p>free 명령의 used 열은 버전마다 계산이 다릅니다. procps-ng 3.3.17의 man page는 used를 total − free − buffers − cache로 정의해 5,120 MiB를 보입니다. 4.0.1부터는 total − available로 바뀌어 5,408 MiB입니다. 어느 판이든 used는 90%가 아닙니다. 경보가 볼 숫자는 available입니다.</p>
          </div>
          <CalculationWalkthrough
            title="available 10,976 MiB가 나오는 과정"
            question="빈 page가 1,536 MiB뿐인 16 GiB 서버에서 새 프로그램은 얼마를 swap 없이 받을 수 있을까요?"
            scope="mm/show_mem.c의 si_mem_available 식을 MiB 단위로 따라갑니다. 커널 예약(totalreserve_pages) 160 MiB와 zone low watermark 합 64 MiB는 가정입니다. page cache 9,216 MiB가 모두 file LRU에 있고 tmpfs는 없다고 봅니다."
            steps={[
              { label: "빈 page", expression: "1,536 − 160", result: "1,376 MiB", reason: "MemFree에서 커널이 비상용으로 남겨 두는 예약분을 뺍니다." },
              { label: "page cache", expression: "9,216 − min(9,216 ÷ 2, 64)", result: "9,152 MiB", reason: "cache를 전부 비우면 시스템이 버벅이므로 절반과 low watermark 중 작은 쪽만 남긴다고 봅니다." },
              { label: "회수 가능 slab", expression: "512 − min(512 ÷ 2, 64)", result: "448 MiB", reason: "dentry·inode 캐시 같은 slab도 같은 규칙으로 일부만 셉니다." },
              { label: "available", expression: "1,376 + 9,152 + 448", result: "10,976 MiB", reason: "세 몫을 더한 값이 /proc/meminfo의 MemAvailable이고 free의 available 열입니다." },
              { label: "used 두 정의", expression: "16,384 − 1,536 − 9,728 · 16,384 − 10,976", result: "5,120 · 5,408 MiB", reason: "procps-ng 3.3.17은 free와 buff/cache(Cached + SReclaimable)를 빼고, 4.0.1부터는 available을 뺍니다." },
            ]}
            conclusion="같은 서버를 (total − free)로 보면 90.6%가 차 있고 available로 보면 67%가 비어 있습니다. 경보는 available과 다음 절의 회수 압력으로 걸어야 합니다."
            caveats={["available은 추정치입니다. 커널 문서도 page cache와 slab이 실제로 얼마나 회수될지는 시스템마다 다르다고 적습니다.", "tmpfs와 공유 메모리는 Cached에 들어가 buff/cache 열을 키우지만 swap이 없으면 비울 수 없습니다. available은 file LRU만 더하므로 이 몫을 빼고 셉니다."]}
          />
          <div className={prose}>
            <p>available을 계산하는 실제 코드와, 이 값이 추정치임을 밝히는 커널 문서는 아래에서 볼 수 있습니다.</p>
          </div>
          {code("mem-available", "si_mem_available 원문")}
          {code("mem-available-doc", "MemAvailable 정의")}
          {code("cached-doc", "Cached에 tmpfs가 들어가는 이유")}
          {code("file-lru", "tmpfs page가 file LRU에서 빠지는 판정")}
          <div id="paper-procps-free" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="procps-ng free(1) man page · v3.3.17 · master (2026-10-15 확인)" citeKey={1} href="https://gitlab.com/procps-ng/procps/-/raw/master/man/free.1">
              <q>Used or unavailable memory (calculated as total - available)</q> 현재 man page의 정의입니다. v3.3.17 판은 같은 열을 total − free − buffers − cache로 정의했고, procps-ng NEWS는 4.0.1 항목에 "Used memory is Total - Available"를 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="pressure" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 앱이 커지면 cache가 줄고, 필요한 파일까지 비우면 느려집니다</h2>
          <div className={prose}>
            <p>
            같은 서버에서 앱이 메모리를 6 GiB 더 쓴다고 합시다. 빈 page가 zone watermark에 닿을 때마다 커널의 백그라운드 회수 스레드가 page cache를 비워
            자리를 만들고 장부의 빈 page는 256 MiB 안팎에 머뭅니다. 앱 메모리가 10,752 MiB가 되면 cache는 4,352 MiB, available은 4,832 MiB입니다. 앱이 가져간 6,144 MiB만큼
            available이 줄었을 뿐 아직 아무 문제도 없습니다.
          </p>
            <p>
            앱 메모리가 14,336 MiB까지 늘면 cache는 768 MiB만 남습니다. (가정) 그런데 이 앱이 자주 읽는 실행 파일·라이브러리·데이터 파일이 1,024 MiB라면
            커널은 방금 비운 page를 곧 디스크에서 다시 읽어야 합니다. 디스크를 기다려야 하는 이 page 접근을 major fault라고 하고 이 단계부터 지연이 눈에 띄게
            늘어납니다.
          </p>
            <p>
            이 느려짐은 used로도 available로도 드러나지 않습니다. 두 숫자는 남은 양을 셀 뿐이고 남은 양을 맞추느라 작업이 얼마나 멈췄는지는 세지 않기 때문입니다. 그 시간을
            세는 지표가 PSI이고 5절에서 이름을 붙입니다.
          </p>
            <p>
            이 시점의 available은 1,248 MiB입니다. 앱이 1,536 MiB를 더 원하면 남은 cache 768 MiB, 회수 가능 slab 448 MiB, 예약선 위 빈 page 96 MiB를 모두 넘겨도 1,312 MiB라 224 MiB가 모자라고, 회수가 진전 없이 끝나 OOM killer가 불립니다.
          </p>
            <p>실제 서버에서는 이 마지막 장면이 이렇게 빨리 오지 않는 경우가 많습니다. 자주 읽는 파일 page를 비웠다가 곧 다시 읽어 들이는 동안에도 커널은 회수가 진전된 것으로 보고 재시도를 이어 가기 때문입니다. 그 사이 서버는 OOM 없이 오래 버벅이고 PSI memory의 full이 높게 유지됩니다. systemd-oomd처럼 PSI를 보고 커널 OOM 전에 cgroup을 정리하는 사용자 공간 도구가 있는 이유입니다.</p>
          </div>
          <MemoryLedgerViz />
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 비우는 일은 회수, 그 대기 시간은 PSI, 마지막 수단은 OOM killer입니다</h2>
          <div className={prose}>
            <p>
            앞 절의 과정에 표준 이름을 붙입니다. 파일 내용을 RAM에 담아 둔 page는 page cache라고 부릅니다. 원본이 디스크에 있어 비울 수 있습니다. 앱이 malloc
            등으로 직접 쓰는 page는 파일 원본이 없어 anonymous memory라고 부르며 swap이 없으면 내보낼 곳이 없습니다.
          </p>
            <p>page를 비워 빈 page를 만드는 일은 회수(reclaim)입니다. 빈 page가 low watermark 아래로 내려가면 커널 스레드 kswapd가 백그라운드에서 회수합니다. 그래도 부족하면 메모리를 요청한 프로세스가 직접 회수(direct reclaim)를 하며 기다립니다. 이 기다림이 4절의 지연입니다.</p>
            <p>작업이 메모리 때문에 멈춘 시간의 비율은 PSI(Pressure Stall Information)라는 지표로 /proc/pressure/memory에 나옵니다. some 줄은 적어도 한 작업이 멈춰 있던 시간의 비율이고, full 줄은 일하던 작업 전부가 동시에 멈춘 시간의 비율입니다. full이 오래 높으면 커널 문서는 thrashing으로 봅니다.</p>
            <p>회수로도 요청을 채우지 못할 때 프로세스 하나를 골라 죽이는 커널 루틴이 OOM(out of memory) killer입니다. 서버 전체 RAM이 모자라면 전역 OOM, cgroup의 memory.max에 닿으면 그 cgroup 안의 OOM입니다. 4절의 서버가 마지막 장면에서 부른 것은 전역 OOM이고, 1절의 137은 cgroup OOM이었습니다.</p>
          </div>
          {code("psi-doc", "PSI some·full 정의")}
          {code("alloc-slowpath", "kswapd → 직접 회수 → OOM 순서")}
          <div id="paper-gregg-60s" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Brendan Gregg · Netflix Performance Engineering · Linux Performance Analysis in 60,000 Milliseconds (2015-11-30)" citeKey={2} href="https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf">
              <q>If these are non-zero, you're out of memory.</q> vmstat의 si·so(swap-in·swap-out) 열에 대한 설명입니다. 같은 글은 free -m의 cached가 0에 가까우면 디스크 I/O가 늘 수 있으니 iostat로 확인하라고 적고, 첫 60초 점검의 두 번째 명령 dmesg | tail 예시에 "perl invoked oom-killer" 줄을 보여 줍니다.
            </CitationBlock>
          </div>
        </section>

        <section id="virtual-overcommit" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 커널은 약속을 넉넉히 해 주고, 그 대가를 OOM으로 치릅니다</h2>
          <div className={prose}>
            <p>
            2절에서 물리 page는 처음 쓸 때 붙는다고 했습니다. 그래서 16 GiB 서버에서 프로세스가 8 GiB를 malloc해도 바로 실패하지 않습니다. 주소 범위만 약속했고 그중
            실제로 쓴 page만 RSS로 올라옵니다. 쓰지도 않을 메모리를 넉넉히 잡는 프로그램이 많아 이 방식이 RAM을 아낍니다.
          </p>
            <p>
            약속한 총량이 RAM을 넘는 상태를 overcommit이라고 합니다. vm.overcommit_memory가 기본값 0이면 커널은 RAM과 swap을 합한 것보다 명백히 큰
            요청만 거절합니다. 1이면 무조건 약속합니다. 두 모드에서는 약속한 프로세스들이 실제로 page를 쓰기 시작해 RAM이 모자랄 때 비로소 문제가 드러나고 그때 해결책이 OOM
            killer입니다.
          </p>
            <p>2는 약속 자체를 제한합니다. 약속 총량의 상한 CommitLimit은 (RAM − huge page 예약) × overcommit_ratio ÷ 100 + swap이고, 기본 비율 50이면 swap과 huge page가 없는 16 GiB 서버에서 8,192 MiB입니다. 그 뒤의 malloc은 NULL을 돌려받습니다.</p>
            <p>root가 아닌 프로세스는 여기서 관리자 몫(admin_reserve_kbytes, 기본 8 MiB)을 더 뺀 만큼만 받습니다(mm/util.c 1051–1056행). 프로세스가 나중에 SIGKILL로 죽는 대신 할당 순간에 오류를 받는 것이 장점이고, RAM 절반만 약속할 수 있다는 것이 비용입니다.</p>
            <p>
            swap이 있으면 사정이 또 다릅니다. anonymous page도 swap 장치로 내보낼 수 있어 OOM이 늦게 오고 그 사이 느린 디스크 I/O가 끼어듭니다.
            vm.swappiness(기본 60)는 swap과 파일 page 회수의 상대 I/O 비용을 0~200으로 적는 값입니다. 0이어도 swap을 끄지는 않으며 빈 page와 파일
            page가 high watermark 아래로 내려가면 swap을 시작합니다.
          </p>
          </div>
          {code("overcommit-modes", "overcommit 세 모드")}
          {code("commit-limit-doc", "CommitLimit 계산식")}
          {code("swappiness-doc", "swappiness 정의")}
        </section>

        <section id="oom-score" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. OOM killer는 page를 가장 많이 쓰는 프로세스를 고르고 adj로 보정합니다</h2>
          <div className={prose}>
            <p>
            1절의 컨테이너로 돌아갑니다. (가정) memory.max가 2 GiB인 cgroup에 두 프로세스가 있습니다. A는 RSS 1,536 MiB인 앱이고 B는 RSS 512
            MiB인 로그 수집기입니다. A가 1.6 GiB까지 자라려는 순간 cgroup이 2 GiB에 닿았고 회수할 cache가 없어 cgroup OOM이 났습니다.
          </p>
            <p>OOM killer는 후보마다 점수를 매겨 가장 높은 하나를 죽입니다. 점수의 기본은 그 프로세스가 붙잡고 있는 page 수입니다. RAM에 있는 page(RSS), swap으로 나간 page, 주소 대응표(page table)가 차지한 page를 더합니다. 죽였을 때 가장 많은 메모리가 돌아오는 프로세스가 기본 희생자라는 뜻입니다.</p>
            <p>운영자는 프로세스마다 oom_score_adj를 −1000부터 1000까지 줄 수 있습니다. 커널은 이 값을 totalpages ÷ 1000 page로 바꿔 점수에 더합니다. 그래서 adj 1은 OOM이 난 범위 상한의 0.1%를 뜻합니다. 2 GiB cgroup에서는 524 page, 약 2 MiB입니다.</p>
          </div>
          <ExplainedFormula
            question="cgroup OOM에서 프로세스 하나는 몇 점을 받습니까?"
            idea="붙잡은 page 수가 기본 점수이고, oom_score_adj는 상한의 1/1000을 한 칸으로 삼아 점수를 옮깁니다."
            formula={"\\text{points}=\\text{rss}+\\text{swapents}+\\frac{\\text{pgtables\\_bytes}}{\\text{PAGE\\_SIZE}}+\\text{adj}\\cdot\\left\\lfloor\\frac{\\text{totalpages}}{1000}\\right\\rfloor"}
            annotatedFormula={"\\text{points}=\\underbrace{\\text{rss}+\\text{swapents}+\\frac{\\text{pgtables\\_bytes}}{\\text{PAGE\\_SIZE}}}_{\\text{죽이면 돌아올 page 수}}+\\underbrace{\\text{adj}}_{-1000\\sim1000}\\cdot\\underbrace{\\left\\lfloor\\frac{\\text{totalpages}}{1000}\\right\\rfloor}_{\\text{상한의 0.1\\%}}"}
            operations={[
              { expression: "\\text{rss}+\\text{swapents}+\\text{pgtables\\_bytes}/\\text{PAGE\\_SIZE}", annotation: ["A: 393,216 + 0 + 768 = 393,984입니다.", "B: 131,072 + 0 + 256 = 131,328입니다."] },
              { expression: "\\lfloor\\text{totalpages}/1000\\rfloor", annotation: ["memory.max 2 GiB = 524,288 page입니다.", "1000으로 나눈 정수 몫은 524입니다."] },
              { expression: "\\text{adj}\\cdot\\lfloor\\text{totalpages}/1000\\rfloor", annotation: ["A에 −500을 주면 −262,000이 더해져 131,984가 됩니다."] },
            ]}
            terms={[
              { symbol: "\\text{rss}", name: "RAM에 올라온 page", description: "anonymous·파일 매핑·공유 메모리 page를 모두 셉니다(get_mm_rss)." },
              { symbol: "\\text{swapents}", name: "swap으로 나간 page", description: "swap이 없는 노드에서는 0입니다." },
              { symbol: "\\text{pgtables\\_bytes}", name: "page table 크기", description: "주소를 RAM page에 대응시키는 표가 차지한 byte입니다. page 크기 4 KiB로 나눠 page 수로 바꿉니다." },
              { symbol: "\\text{adj}", name: "oom_score_adj", description: "/proc/<pid>/oom_score_adj에 쓰는 −1000~1000 값입니다. −1000이면 식을 계산하지 않고 후보에서 뺍니다. init·커널 스레드, 이미 정리된(MMF_OOM_SKIP) 프로세스, vfork 중인 프로세스도 같은 식으로 빠집니다." },
              { symbol: "\\text{totalpages}", name: "OOM 범위의 상한", description: "cgroup OOM이면 memory.max(+쓸 수 있는 swap), 전역 OOM이면 RAM + swap 전체 page 수입니다." },
            ]}
            assumptions={["page 크기는 4 KiB입니다.", "page table 4 MiB도 cgroup에 청구됩니다. (가정) A와 B는 공유 라이브러리 page 4 MiB를 함께 매핑해 두 RSS에 모두 잡히지만 cgroup에는 한 번만 청구됩니다. 그래서 RSS 합 2,048 MiB에 page table을 더해도 청구 총액은 memory.max 2,048 MiB입니다.", "매핑되지 않은 page cache와 회수할 수 있는 커널 메모리는 OOM 직전 회수로 0이 됐다고 봅니다."]}
            interpretation="같은 adj라도 범위가 바뀌면 옮기는 양이 달라집니다. 2 GiB cgroup의 adj −500은 −262,000 page이지만 16 GiB 노드 전역 OOM에서는 −2,097,000 page입니다. adj를 정할 때는 어느 범위의 OOM에서 효과를 낼지 먼저 정해야 합니다."
          />
          <CalculationWalkthrough
            title="2 GiB cgroup 안의 두 점수"
            question="A에 oom_score_adj를 얼마나 낮춰야 B가 대신 죽을까요?"
            scope="memory.max 2 GiB, swap 없음, page 4 KiB로 계산합니다. B의 adj는 0입니다."
            steps={[
              { label: "totalpages", expression: "2,048 MiB × 256 page/MiB", result: "524,288 page", reason: "memcg OOM은 mem_cgroup_get_max의 값을 씁니다. swap이 없으니 memory.max 그대로입니다." },
              { label: "adj 한 칸", expression: "⌊524,288 ÷ 1000⌋", result: "524 page ≈ 2 MiB", reason: "oom_badness가 adj에 곱하는 값입니다. 정수 나눗셈이라 소수는 버립니다." },
              { label: "A 기본 점수", expression: "1,536 × 256 + 3 × 256", result: "393,984", reason: "RSS 1,536 MiB와 page table 3 MiB를 page로 바꿔 더합니다." },
              { label: "B 기본 점수", expression: "512 × 256 + 1 × 256", result: "131,328", reason: "RSS 512 MiB와 page table 1 MiB입니다." },
              { label: "A adj −500", expression: "393,984 − 500 × 524", result: "131,984", reason: "B보다 656 높아 A가 여전히 희생자입니다." },
              { label: "A adj −502", expression: "393,984 − 502 × 524", result: "130,936", reason: "B보다 392 낮아 처음으로 B가 희생자가 됩니다." },
            ]}
            conclusion="A를 지키려면 adj를 −502 이하로 내리거나 −1000으로 후보에서 빼야 합니다. 차이 262,656 page를 adj 한 칸 524 page로 나눈 값이 501.3이기 때문입니다."
            caveats={["실제 RSS와 page table은 시점마다 달라 경계 adj도 움직입니다.", "B까지 −1000이면 이 cgroup에는 죽일 대상이 없습니다. 커널은 'Out of memory and no killable processes'를 남기고, 전역 OOM과 달리 panic하지 않습니다."]}
          />
          <OomScoreViz />
        </section>

        <section id="reclaim-path" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. cgroup은 자기 page만 회수해 보고, 16번 실패하면 자기 안에서만 죽입니다</h2>
          <div className={prose}>
            <p>cgroup 안에서 page를 새로 쓸 때마다 커널은 그 page를 cgroup에 청구(charge)합니다. 청구 뒤에도 memory.max 아래면 그대로 통과합니다. 넘으면 노드 전체가 아니라 그 cgroup의 page만 회수합니다. 노드에 빈 RAM이 10 GiB 있어도 이 cgroup의 OOM은 막지 못합니다.</p>
            <p>
            (가정) 장애 직전 A가 1,236 MiB, B가 512 MiB, cgroup의 로그 파일 cache가 300 MiB로 정확히 2,048 MiB였다고 합시다(page table과 공유 page는 7절 가정대로 서로 상쇄됩니다). A가 300
            MiB를 더 쓰는 동안은 cache 300 MiB가 회수되어 자리를 내줍니다. cache가 0이 된 뒤의 청구는 회수할 것이 없어 실패하고 16번 다시 시도한 뒤 cgroup
            OOM으로 갑니다.
          </p>
            <p>아래 의사코드는 이 청구 경로를 한 줄씩 펼친 것입니다. 각 줄의 설명에 A가 1,536 MiB에서 한 번 더 청구할 때의 값을 적었습니다.</p>
          </div>
          <AlgorithmBlock
            title="cgroup에 page를 청구하다 OOM까지 가는 순서"
            input={[
              "need: 이번에 청구할 page 수 (A의 다음 할당)",
              "usage = 2,048 MiB, max = 2,048 MiB (memory.max)",
              "cache = 0 MiB (로그 파일 cache는 이미 회수됨), swap 없음",
              "tasks = [A: 393,984점 재료, B: 131,328점 재료]",
            ]}
            steps={[
              { code: "if usage + need <= max: return OK", note: "2,048 + need > 2,048이라 통과하지 못합니다. 대부분의 할당은 이 줄에서 끝납니다." },
              { code: "events.max += 1", note: "memory.events의 max 카운터가 오릅니다. 한도에 닿을 뻔한 횟수입니다." },
              { code: "psi_stall { freed = reclaim(this_cgroup, need) }", note: "이 cgroup의 cache와 swap 가능한 page만 찾습니다. 회수할 것이 없어 freed = 0이고, 기다린 시간은 PSI memory에 쌓입니다." },
              { code: "if margin(max - usage) >= need: goto 1", note: "여유가 생기지 않았습니다. cache 300 MiB가 남아 있던 앞선 청구들은 여기서 1번 줄로 돌아가 성공했습니다." },
              { code: "if retries-- > 0: goto 1   # MAX_RECLAIM_RETRIES = 16", note: "16번까지 1~4번 줄을 반복합니다. 그동안 다른 프로세스가 메모리를 놓으면 성공할 수 있습니다." },
              { code: "events.oom += 1; for t in tasks: points[t] = oom_badness(t, max)", note: "A 393,984, B 131,328입니다. totalpages는 노드 RAM이 아니라 524,288입니다." },
              { code: "victim = argmax(points); send SIGKILL to victim; events.oom_kill += 1", note: "A가 SIGKILL(9)을 받습니다. A가 컨테이너의 주 프로세스라면 런타임은 128 + 9 = 137을 종료 코드로, OOMKilled를 이유로 기록합니다. 자식 프로세스만 죽었다면 컨테이너는 계속 돕니다." },
            ]}
            repeatUntil="희생자가 죽어 page가 돌아오면 재시도 횟수를 16으로 되돌리고 1번 줄부터 다시 청구합니다."
            output="oom.group이 0이면 A만 종료되고 B는 계속 돕니다(Kubernetes cgroup v2 기본값에서는 아래처럼 둘 다 죽습니다). memory.events에 max·oom·oom_kill이 하나씩 늘어 있고, dmesg에는 'Memory cgroup out of memory: Killed process … (A)' 줄이 남습니다."
          />
          <div className={prose}>
            <p>Kubernetes에서는 결과가 하나 달라집니다. v1.35.0의 kubelet은 cgroup v2 노드에서 설정 singleProcessOOMKill이 비어 있으면 false로 둡니다(pkg/kubelet/kubelet.go 738–749행). 그러면 컨테이너마다 memory.oom.group에 1을 씁니다(kuberuntime/kuberuntime_container_linux.go 314–320행).</p>
            <p>커널은 여전히 점수로 A를 고르지만 고른 희생자가 속한 cgroup의 프로세스를 모두 죽이므로 B도 함께 끝납니다. A만 죽고 B가 남는 위 순서는 oom.group을 쓰지 않는 Docker 기본 설정, cgroup v1 노드, singleProcessOOMKill: true를 준 kubelet에서 그대로입니다.</p>
          </div>
          {code("memcg-charge", "try_charge_memcg 원문")}
          {code("reclaim-retries", "MAX_RECLAIM_RETRIES = 16")}
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 원문은 점수를 세고, 범위를 정하고, 최댓값에 SIGKILL을 보냅니다</h2>
          <div className={prose}>
            <p>Linux v6.12 mm/oom_kill.c의 oom_badness(193–239행)가 7절의 식입니다. 207–212행은 init과 커널 스레드처럼 죽일 수 없거나 주소 공간이 없는 작업을, 219–225행은 adj가 −1000이거나 이미 정리된(MMF_OOM_SKIP) 또는 vfork 중인 작업을 LONG_MIN으로 돌려 계산을 건너뜁니다.</p>
            <p>231–232행이 RSS, swap 항목, page table을 page 단위로 더하고 235–237행이 adj에 totalpages ÷ 1000을 곱해 더합니다. A의 393,984점이 이 세 줄에서 나옵니다.</p>
            <p>totalpages를 정하는 곳은 constrained_alloc입니다. 260–263행은 cgroup OOM이면 mem_cgroup_get_max의 값, 곧 memory.max에 쓸 수 있는 swap을 더한 값을 씁니다. 265–266행은 전역 OOM이면 RAM 전체와 swap의 합을 씁니다. 같은 프로세스가 어느 OOM이냐에 따라 다른 점수를 받는 이유가 여기 있습니다.</p>
            <p>oom_evaluate_task(309–358행)는 후보를 하나씩 평가합니다. 이미 SIGKILL을 받고 죽어 가는 희생자가 있으면 새로 고르지 않고 멈춥니다. 343행은 지금까지의 최대보다 작은 점수를 건너뛰므로 남는 것은 최댓값입니다. select_bad_process(361–380행)는 cgroup OOM이면 그 cgroup의 작업만, 전역 OOM이면 모든 프로세스를 훑습니다.</p>
            <p>__oom_kill_process의 947행이 희생자에게 SIGKILL을 보내고 949–955행이 dmesg에 "Killed process" 줄을 남깁니다. 전역 할당은 page_alloc.c의 느린 경로가 kswapd를 깨우고(4280행), 직접 회수하고(4380행), 진전이 있는 동안 재시도한 뒤(4403행) 4429행에서 OOM으로 넘어옵니다.</p>
          </div>
          {code("oom-badness", "oom_badness 점수 계산")}
          {code("oom-constraint", "OOM 범위별 totalpages")}
          {code("memcg-get-max", "memcg OOM의 totalpages")}
          {code("oom-select", "희생자 선택 반복문")}
          {code("oom-kill-sigkill", "SIGKILL 전송과 dmesg 줄")}
          {code("out-of-memory", "out_of_memory 입구")}
        </section>

        <section id="exit-137" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 137은 SIGKILL이라는 뜻일 뿐이라 OOM 증거를 따로 봐야 합니다</h2>
          <div className={prose}>
            <p>bash 매뉴얼은 신호 N으로 끝난 명령의 종료 상태를 128 + N으로 적습니다. SIGKILL은 9번이므로 137입니다. Kubernetes 문서의 메모리 한도 예제도 한도를 넘은 컨테이너의 lastState에 exitCode 137과 reason OOMKilled를 보여 줍니다.</p>
            <p>
            그러나 137은 누가 SIGKILL을 보냈는지 말하지 않습니다. 운영자가 kill -9를 했거나 종료 유예 시간이 지나 런타임이 강제로 끝냈어도 137입니다.
          </p>
            <p>
            OOM이었다는
            증거는 세 곳에서 확인합니다. cgroup의 memory.events에서 oom_kill이 늘었는지(이 카운터는 전역 OOM으로 죽은 경우도 셉니다), dmesg 또는 journalctl -k에 "Memory cgroup
            out of memory: Killed process" 줄이 있는지, 컨테이너 상태의 reason이 OOMKilled인지 봅니다.
          </p>
            <p>/proc/&lt;pid&gt;/oom_score로 다음 희생자를 예측하는 습관에는 함정이 있습니다. fs/proc/base.c의 proc_oom_score(586–605행)는 totalpages를 항상 노드의 RAM + swap으로 둡니다. 16 GiB 노드에서 adj −500인 A는 396, B는 687로 보이지만, 2 GiB cgroup의 OOM에서는 7절처럼 A가 죽습니다. 컨테이너 안의 순서는 memory.max로 다시 계산해야 합니다.</p>
          </div>
          {code("proc-oom-score", "oom_score 파일의 환산식")}
          {code("cgroup-oom-group", "memory.events와 oom.group")}
          <div id="paper-k8s-memory" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Assign Memory Resources to Containers and Pods (2026-10-15 확인)" citeKey={3} href="https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/">
              <q>If a Container allocates more memory than its limit, the Container becomes a candidate for termination.</q> 같은 문서의 예제 출력은 lastState.terminated에 exitCode: 137, reason: OOMKilled를 보이고, 재시작할 수 있는 컨테이너는 kubelet이 다시 띄운다고 적습니다. 종료 상태 128 + N 규칙은 GNU bash 매뉴얼의 Exit Status 절에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kubernetes-qos" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 노드 전체 OOM에서는 kubelet이 정한 adj가 크기보다 먼저 순서를 정합니다</h2>
          <div className={prose}>
            <p>cgroup 하나의 OOM에서는 같은 컨테이너 안 프로세스들이 같은 adj를 받아 크기가 순서를 정했습니다. 노드 전체가 모자란 전역 OOM에서는 이야기가 달라집니다. kubelet은 컨테이너 프로세스마다 QoS class에 따라 oom_score_adj를 다르게 씁니다. requests와 limits로 QoS class가 정해지는 과정은 <a href="/cs/cloud/kubernetes-request-path-and-cka#overview">Kubernetes 요청 경로</a>에서 봅니다.</p>
            <p>Kubernetes v1.35.0의 pkg/kubelet/qos/policy.go는 Guaranteed에 −997, BestEffort에 1000을 줍니다. Burstable은 1000 − 1000 × memory request ÷ 노드 메모리이고, 결과를 3~999로 묶습니다. 16 GiB 노드에서 request 1 GiB인 Burstable 컨테이너는 1000 − 62 = 938입니다.</p>
            <p>전역 OOM의 adj 한 칸은 4,194,304 ÷ 1000 = 4,194 page입니다. 이 단위가 크기 차이를 압도합니다. 아래 계산에서 3 GiB를 쓰는 Burstable X가 6 GiB를 쓰는 Guaranteed Y보다, 그리고 0.5 GiB를 쓰는 BestEffort Z보다 먼저 죽습니다. request를 실제 사용량보다 훨씬 낮게 적은 컨테이너가 가장 먼저 희생된다는 뜻입니다.</p>
          </div>
          <CalculationWalkthrough
            title="16 GiB 노드 전역 OOM의 세 후보"
            question="Burstable X(3 GiB 사용), Guaranteed Y(6 GiB 사용), BestEffort Z(0.5 GiB 사용) 가운데 누가 먼저 죽을까요?"
            scope="swap 없는 16 GiB 노드, page table은 무시합니다. X의 memory request는 1 GiB입니다. kubelet이 eviction으로 먼저 메모리를 되찾지 못해 노드 OOM이 난 경우만 셉니다."
            steps={[
              { label: "adj 한 칸", expression: "⌊4,194,304 ÷ 1000⌋", result: "4,194 page", reason: "전역 OOM의 totalpages는 RAM 16 GiB 전체입니다." },
              { label: "X의 adj", expression: "1000 − ⌊1000 × 1 GiB ÷ 16 GiB⌋", result: "938", reason: "Burstable 식입니다. 62.5의 소수는 정수 나눗셈으로 버려집니다." },
              { label: "X 점수", expression: "786,432 + 938 × 4,194", result: "4,720,404", reason: "3 GiB는 786,432 page입니다." },
              { label: "Y 점수", expression: "1,572,864 − 997 × 4,194", result: "−2,608,554", reason: "Guaranteed는 −997입니다. 6 GiB를 써도 음수입니다." },
              { label: "Z 점수", expression: "131,072 + 1000 × 4,194", result: "4,325,072", reason: "BestEffort는 1000입니다. X보다 395,332 낮습니다." },
            ]}
            conclusion="X가 4,720,404점으로 가장 높아 먼저 죽습니다. Burstable이라도 request보다 많이 쓰면 BestEffort보다 앞설 수 있습니다."
            caveats={["kubelet의 node-pressure eviction이 제때 메모리를 되찾으면 이 OOM은 일어나지 않습니다. Kubernetes 문서는 그 전에 노드 OOM이 나면 커널 OOM killer에 맡긴다고 적습니다.", "kubelet 자신과 kube-proxy는 −999라 사실상 마지막까지 남습니다."]}
          />
          {code("kubelet-oom-adj", "kubelet의 oom_score_adj 규칙")}
          <div id="paper-k8s-node-oom" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Node-pressure Eviction · Node out of memory behavior (2026-10-15 확인)" citeKey={4} href="https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/">
              <q>containers in low QoS pods that consume a large amount of memory relative to their scheduling requests are killed first</q> 같은 절의 표는 Burstable의 하한을 2로 적지만, v1.35.0 policy.go는 1000 + (−997) = 3 미만을 3으로 올립니다. 이 글은 코드 쪽 값을 씁니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 볼 숫자는 available·PSI·memory.events이고, 고칠 곳은 한도와 adj입니다</h2>
          <div className={prose}>
            <p>
            경보부터 바꿉니다. (total − free) 비율 대신 available 비율과 PSI memory의 some·full을 봅니다. available이 넉넉해도 PSI가 오르면
            4절처럼 자주 읽는 파일까지 비우고 있다는 뜻이고 vmstat의 si·so가 0이 아니면 swap을 오가고 있다는 뜻입니다. 컨테이너는 memory.events의
            max·oom·oom_kill 증가를 경보로 둡니다.
          </p>
            <p>한도를 고칠 때는 두 단계를 구분합니다. memory.high를 넘으면 강한 회수와 감속을 받지만 OOM killer는 불리지 않습니다. memory.max를 넘고 회수가 실패하면 그 cgroup 안에서 OOM이 납니다. memory.high를 max보다 조금 낮게 두면 죽기 전에 느려지는 구간이 생겨 경보를 받을 시간이 납니다.</p>
            <p>여러 프로세스가 함께 있어야 의미가 있는 컨테이너라면 memory.oom.group을 1로 둘 수 있습니다. 그러면 7절에서 A만 죽고 B가 남는 대신 둘이 함께 죽고 함께 재시작합니다. Kubernetes v1.35는 cgroup v2 노드에서 이 값을 이미 기본으로 1로 씁니다(8절). vm.panic_on_oom은 기본 0이고, 2로 두면 cgroup OOM이어도 노드 전체가 panic합니다. 클러스터 failover를 전제로 한 선택입니다.</p>
            <p>이 글의 수치는 가정한 장부와 커널 식으로 손으로 계산한 값이며 실제 커널을 돌려 잰 것이 아닙니다. 실제 서버의 watermark·예약분·RSS는 /proc/zoneinfo, /proc/meminfo, /proc/&lt;pid&gt;/status에서 다시 읽어야 합니다. 프로세스가 SIGKILL과 SIGTERM을 어떻게 다르게 받는지는 <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·신호·PID 1</a>에서 이어집니다.</p>
          </div>
          {code("cgroup-memory-max", "memory.high와 memory.max")}
          {code("oom-group", "oom.group으로 함께 죽이기")}
          {code("panic-on-oom-doc", "panic_on_oom 설정")}
          <ContentBoundary article="linux-memory-page-cache-oom" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>3절의 서버에서 page cache 9,216 MiB 가운데 4,096 MiB가 /dev/shm의 공유 메모리였다면 free의 buff/cache 열과 available은 각각 어떻게 바뀔까요? (답: 3절)</p>
            <p>memory.max를 4 GiB로 올리면 A를 지키는 데 필요한 adj 경계가 어떻게 바뀔까요? A와 B의 RSS는 그대로라고 봅니다. (답: 7절)</p>
            <p>같은 Burstable 컨테이너가 memory request를 3 GiB로 올리면 11절의 전역 OOM에서 X와 Z 중 누가 먼저 죽을까요? (답: 11절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxMemoryTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.35.0 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
