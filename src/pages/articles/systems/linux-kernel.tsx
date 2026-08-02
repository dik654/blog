type KernelLayer = {
  name: string;
  body: string;
  handles: string;
};

type TextbookView = {
  title: string;
  from: string;
  body: string;
};

const layers: KernelLayer[] = [
  {
    name: 'Process',
    body: '실행 중인 계산 단위를 task로 표현하고 CPU 시간을 배분한다. fork, exec, clone, context switch, signal, wait가 이 축에 있다.',
    handles: 'task_struct, scheduler class, runqueue, signal_struct',
  },
  {
    name: 'Memory',
    body: '가상 주소를 물리 페이지와 연결하고 page fault, mmap, anonymous/file-backed page, reclaim, swap, allocator를 처리한다.',
    handles: 'mm_struct, VMA, page table, folio, slab',
  },
  {
    name: 'VFS / Storage',
    body: '파일이라는 공통 추상화로 ext4, xfs, tmpfs, procfs, socket, device를 연결한다. page cache와 writeback이 성능 중심이다.',
    handles: 'inode, dentry, file, super_block, address_space',
  },
  {
    name: 'I/O / Network',
    body: '느린 장치와 packet을 event, queue, interrupt, polling으로 다룬다. blocking을 어디서 흡수하는지가 API와 성능을 가른다.',
    handles: 'bio, request_queue, sk_buff, net_device, io_uring',
  },
  {
    name: 'Sync / Security',
    body: '멀티코어 shared state와 권한 경계를 지킨다. sleep 가능 여부, interrupt context, object lifetime을 같이 봐야 한다.',
    handles: 'spinlock, mutex, rwsem, RCU, capability, LSM',
  },
];

const textbookViews: TextbookView[] = [
  {
    title: '운영체제 교재의 큰 줄기',
    from: 'OSTEP, Modern Operating Systems',
    body: '가상화, 동시성, 영속성으로 나눠 CPU scheduling, virtual memory, threads/locks, file system, I/O를 배운다. 커널을 “자원 관리 정책과 mechanism의 묶음”으로 보는 관점이다.',
  },
  {
    title: '리눅스 시스템 프로그래밍의 큰 줄기',
    from: 'The Linux Programming Interface',
    body: 'userspace API에서 출발해 file descriptor, process, signal, timer, mmap, IPC, socket을 본다. syscall 경계에서 커널 내부를 추적하기 좋다.',
  },
  {
    title: '리눅스 커널 내부서의 큰 줄기',
    from: 'Linux Kernel Development, Linux Device Drivers',
    body: 'task, scheduler, memory management, VFS, block I/O, interrupt, driver model, synchronization을 자료구조와 실행 경로 중심으로 본다.',
  },
];

const syscallPath = [
  ['userspace API', 'glibc wrapper 또는 직접 syscall instruction으로 kernel mode 진입을 준비한다. file descriptor, pointer, length 같은 인자는 모두 userspace 관점의 핸들이다.'],
  ['entry / copy', 'CPU privilege level이 바뀌고 kernel stack에서 syscall number와 argument를 해석한다. userspace pointer는 copy_from_user 계열로 조심스럽게 읽는다.'],
  ['subsystem', 'VFS, scheduler, memory manager, network stack 같은 하위 시스템으로 dispatch된다. 여기서 permission, namespace, cgroup, LSM hook이 함께 작동할 수 있다.'],
  ['wait / device', '필요하면 lock을 잡고, page fault를 처리하고, block device나 NIC queue에 작업을 넣고, task를 sleep 상태로 바꾼다.'],
  ['return', '결과값 또는 errno를 정리하고 userspace로 돌아간다. 성공처럼 보여도 writeback이나 network send는 뒤에서 계속 진행될 수 있다.'],
];

const practice = [
  ['open()', 'pathname lookup -> dentry cache -> inode -> file descriptor table을 따라가면 VFS의 역할이 보인다. mount namespace와 permission check도 같이 확인한다.'],
  ['mmap()', 'VMA 생성과 page fault 처리 경로를 나눠 본다. 호출 시점에는 주소 구간만 잡고, 실제 page는 접근할 때 채워지는 lazy path를 확인한다.'],
  ['read()', 'page cache hit이면 disk를 건드리지 않는다. miss이면 filesystem과 block layer, scheduler, device driver까지 내려간다.'],
  ['sendmsg()', 'socket buffer, TCP/IP stack, qdisc, NIC driver queue로 이어지는 packet transmit path를 본다. blocking/non-blocking 차이도 같이 드러난다.'],
];

function LayerGrid() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-5">
      {layers.map((layer) => (
        <div key={layer.name} className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="text-sm font-bold">{layer.name}</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{layer.body}</p>
          <div className="mt-3 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium text-foreground/80">{layer.handles}</div>
        </div>
      ))}
    </div>
  );
}

function TextbookGrid() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-3">
      {textbookViews.map((view) => (
        <div key={view.title} className="rounded-lg border border-border bg-background p-4">
          <div className="text-sm font-bold">{view.title}</div>
          <div className="mt-1 text-xs font-medium text-primary">{view.from}</div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{view.body}</p>
        </div>
      ))}
    </div>
  );
}

function SyscallViz() {
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border bg-muted/10 p-4">
      <div className="grid min-w-[980px] grid-cols-5 gap-2">
        {syscallPath.map(([label, body], index) => (
          <div key={label} className="relative rounded-md border border-border bg-background p-3">
            <div className="text-xs font-semibold text-muted-foreground">0{index + 1}</div>
            <div className="mt-1 text-sm font-bold">{label}</div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            {index < syscallPath.length - 1 && <div className="absolute -right-2 top-1/2 z-10 h-px w-4 bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeGrid() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2">
      {practice.map(([name, body]) => (
        <div key={name} className="rounded-lg border border-border bg-muted/15 p-4">
          <div className="text-sm font-bold">{name}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}

export default function LinuxKernelArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">리눅스 커널은 자원 관리자이자 실행 경계다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>리눅스 커널은 userspace 프로그램이 직접 처리할 수 없는 일을 맡는 privileged runtime이다. CPU 시간, 가상 메모리, 파일시스템, 네트워크, 디바이스, 동기화, 권한 경계를 관리한다. 애플리케이션 입장에서는 `open`, `read`, `mmap`, `fork`, `sendmsg` 같은 syscall로 보이지만, 내부에서는 여러 subsystem이 연결된다.</p>
          <p>커널을 공부할 때 가장 흔한 실패는 파일 이름과 함수 이름을 외우는 것이다. 먼저 “어떤 자원을 관리하는가”로 나누고, 그 다음 “userspace에서 kernelspace로 들어오는 경로가 무엇인가”를 따라가야 한다. CPU는 scheduler, memory는 MM, file은 VFS, packet은 network stack, hardware는 driver와 interrupt path가 관리한다.</p>
        </div>
        <LayerGrid />
      </section>

      <section id="textbook-map" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">교재 목차에서 뽑은 학습 지도</h2>
        <TextbookGrid />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>운영체제 교재는 보통 abstraction과 policy를 먼저 세운다. process는 CPU 가상화, virtual memory는 memory 가상화, file system은 storage 가상화다. 시스템 프로그래밍 책은 그 abstraction을 userspace API로 만지는 법을 보여준다. 커널 내부서는 그 API가 실제로 어떤 자료구조와 lock, queue, interrupt로 처리되는지 보여준다.</p>
          <p>리눅스 커널 학습은 이 세 관점을 왕복해야 한다. `read()`를 예로 들면, OS 교재 관점에서는 I/O와 cache 문제이고, TLPI식 관점에서는 file descriptor API이며, 커널 내부 관점에서는 VFS, page cache, filesystem, block layer, device driver path다.</p>
        </div>
      </section>

      <section id="taxonomy" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">분류 기준: 자원, 경계, 경로</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>커널 분류는 세 축으로 잡으면 안정적이다. 첫째, 자원 축이다. CPU, memory, file, device, packet, time은 서로 다른 자료구조와 정책을 가진다. 둘째, 경계 축이다. userspace/kernelspace, process/thread, virtual/physical, file/device, blocking/non-blocking, privileged/unprivileged 같은 경계가 버그와 성능 문제를 만든다. 셋째, 경로 축이다. syscall path, page fault path, interrupt path, packet receive path처럼 실제 실행 경로를 따라가야 구조가 보인다.</p>
          <p>이 기준을 잡으면 “커널은 너무 크다”는 느낌이 줄어든다. 같은 코드도 어떤 질문으로 보느냐에 따라 위치가 달라진다. `mmap`은 userspace API이면서 VMA 관리이고, page fault path이고, file-backed page cache path일 수 있다.</p>
        </div>
      </section>

      <section id="syscall" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">시스템 콜 경계: userspace 요청이 커널 작업이 되는 길</h2>
        <SyscallViz />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>시스템 콜은 함수 호출처럼 보이지만 실제로는 권한 경계를 넘는 protocol이다. CPU mode가 바뀌고, kernel stack으로 들어가며, userspace pointer는 신뢰할 수 없기 때문에 복사와 검증이 필요하다. 커널은 호출자의 credential, namespace, capability, seccomp, LSM 정책을 함께 확인할 수 있다.</p>
          <p>중요한 것은 syscall이 항상 즉시 일을 끝내지 않는다는 점이다. `write()`가 성공해도 데이터는 page cache에만 있고 disk writeback은 나중일 수 있다. `send()`가 성공해도 packet은 NIC queue에 있을 수 있다. “syscall return”과 “물리 장치 완료”는 다른 사건이다.</p>
        </div>
      </section>

      <section id="process" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">프로세스와 스케줄러: CPU 시간을 나누는 방식</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>커널 안에서 process와 thread는 모두 task로 다뤄진다. 차이는 무엇을 공유하느냐다. 주소 공간, file table, signal handler를 공유하면 thread처럼 보이고, 독립적으로 가지면 process처럼 보인다. `clone` 계열 API가 이 공유 범위를 세밀하게 조정한다.</p>
          <p>scheduler는 runnable task 중 다음 CPU를 받을 task를 고른다. 공평함, latency, throughput, CPU affinity, NUMA locality, real-time priority는 서로 충돌한다. context switch는 register 저장과 복원만이 아니라 cache locality, TLB, branch predictor 상태까지 영향을 준다.</p>
          <p>프로세스를 이해하려면 상태 전이를 봐야 한다. running, runnable, sleeping, stopped, zombie는 단순 label이 아니라 runqueue, wait queue, signal, parent-child 관계와 연결된다. `fork`는 task와 address space를 복제하고, `exec`는 같은 task가 새 program image를 얹는 과정이며, `wait`는 child의 종료 상태를 회수한다.</p>
        </div>
      </section>

      <section id="memory" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">메모리 관리: 가상 주소는 약속이고 page fault는 대화다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>프로세스가 보는 주소는 물리 메모리가 아니라 가상 주소다. 커널은 VMA로 주소 구간의 의미를 관리하고, page table로 가상 페이지를 물리 페이지에 연결한다. 접근한 페이지가 아직 매핑되지 않았거나 권한이 맞지 않으면 page fault가 발생한다.</p>
          <p>page fault는 단순 오류가 아니다. lazy allocation, copy-on-write, file-backed mmap, demand paging은 모두 page fault를 정상 실행 경로로 사용한다. 반대로 OOM, major fault 폭증, swap thrashing은 같은 메커니즘이 병목으로 보이는 경우다.</p>
          <p>커널 내부 할당은 userspace `malloc`과 다르다. 작은 object는 slab 계열 allocator가 관리하고, page 단위 할당은 buddy allocator가 관리한다. driver와 filesystem은 GFP flag를 통해 “잠들 수 있는가”, “I/O를 발생시켜도 되는가” 같은 context 제약을 표현한다.</p>
        </div>
      </section>

      <section id="vfs" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">파일시스템과 VFS: 파일이라는 공통 인터페이스</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>VFS는 여러 파일시스템을 하나의 API로 보이게 하는 layer다. userspace가 file descriptor를 들고 있어도, 커널 안에서는 `file`, `dentry`, `inode`, `super_block` 같은 구조가 역할을 나눠 가진다. pathname lookup은 문자열 처리처럼 보이지만 dentry cache, mount namespace, permission, symbolic link, automount까지 포함한다.</p>
          <p>성능 관점의 핵심은 page cache다. 많은 `read`는 곧바로 disk를 읽지 않고 page cache에서 끝난다. `write`도 page cache를 dirty로 표시한 뒤 나중에 writeback될 수 있다. 그래서 “파일 I/O가 느리다”는 말은 disk, page cache miss, filesystem journaling, block scheduler, device queue 중 어디가 느린지 나눠야 한다.</p>
          <p>VFS는 “모든 것이 파일”이라는 구호보다 더 구체적이다. regular file, directory, block device, character device, pipe, socket, procfs entry는 같은 file descriptor API로 접근될 수 있지만 내부 operation table은 다르다. 공통 인터페이스가 subsystem을 연결한다.</p>
        </div>
      </section>

      <section id="io-network" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">I/O와 네트워크: blocking을 어디서 흡수할 것인가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>I/O는 CPU보다 느린 장치를 기다리는 문제다. 전통적인 blocking I/O는 이해하기 쉽지만 task를 sleep시킨다. non-blocking I/O, readiness notification, async I/O, io_uring은 기다림을 다루는 방법이 다르다. 차이는 API 모양보다 kernel이 작업 제출과 완료를 어디서 어떻게 관리하느냐다.</p>
          <p>block I/O는 page cache, filesystem, block layer, request queue, driver, device로 내려간다. elevator/scheduler, merge, flush, FUA, writeback policy 같은 요소가 latency와 durability를 바꾼다. SSD와 HDD의 성질이 다르기 때문에 같은 block layer라도 병목이 다르게 보인다.</p>
          <p>네트워크는 packet path로 읽어야 한다. NIC driver가 packet을 받고, interrupt 또는 polling 경로를 지나 `sk_buff`가 만들어지고, protocol stack이 header를 해석한 뒤 socket receive queue로 들어간다. 송신은 반대 방향으로 socket buffer, TCP congestion control, qdisc, driver queue, NIC를 지난다.</p>
        </div>
      </section>

      <section id="sync" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">동기화: 커널 자료구조는 항상 동시에 접근된다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>커널 코드는 preemption, interrupt, multi-core 때문에 shared state 경쟁을 항상 고려한다. spinlock은 짧게 잡고 잠들면 안 되는 구간에 맞다. mutex는 잠들 수 있지만 interrupt context에서는 사용할 수 없다. rwsem은 read-mostly 구조에 맞고, RCU는 reader를 거의 막지 않는 대신 update와 reclamation 규칙이 까다롭다.</p>
          <p>lock을 공부할 때는 API 이름보다 context를 먼저 봐야 한다. 이 코드가 process context인지 interrupt context인지, sleep 가능 여부는 어떤지, lock ordering은 정해져 있는지, object lifetime은 누가 보장하는지가 핵심이다. 커널 버그의 상당수는 “누가 언제 이 object를 아직 볼 수 있는가”를 틀리게 생각해서 생긴다.</p>
          <p>보안도 같은 경계 문제다. capability는 root 권한을 더 작은 권한 묶음으로 나누고, namespace는 process가 보는 전역 자원 이름공간을 분리하고, cgroup은 자원 사용량을 제한하며, LSM은 operation 지점에 정책 hook을 건다.</p>
        </div>
      </section>

      <section id="observability" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">관찰과 디버깅: 커널은 증상으로만 말한다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>커널 문제는 애플리케이션 로그만으로 잘 보이지 않는다. `strace`는 syscall 경계를 보여주고, `perf`는 CPU와 call stack을 보여주고, ftrace와 tracepoint는 kernel path를 보여준다. eBPF는 runtime에 안전한 probe를 붙여 syscall, network, scheduler, block I/O를 관찰하게 해준다.</p>
          <p>좋은 디버깅 질문은 “어느 subsystem의 어느 경로가 느린가”다. CPU가 바쁜지, runqueue가 밀렸는지, page fault가 많은지, page cache miss인지, lock contention인지, device queue가 찼는지 분리해야 한다. 평균 latency보다 tail latency, 단순 CPU 사용률보다 off-CPU time이 더 중요할 때도 많다.</p>
        </div>
      </section>

      <section id="practice" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">학습용 실습: syscall 하나씩 kernel path 따라가기</h2>
        <PracticeGrid />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>커널을 학습할 때는 “전체 구조를 외운 뒤 코드로 간다”보다 “작은 syscall 하나를 잡고 경로를 따라간다”가 낫다. 각 경로에서 어떤 lock을 잡는지, sleep할 수 있는지, userspace pointer를 언제 읽는지, cache를 언제 쓰는지 기록하면 subsystem이 자연스럽게 연결된다.</p>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">다음 글 지도</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>이 분류는 process, memory, VFS, block I/O, network, synchronization, observability로 나눠 쌓으면 좋다. 각 글은 syscall 하나를 잡고 kernel path를 따라가는 방식이 가장 읽기 쉽다. `open()`은 pathname lookup과 VFS, `mmap()`은 VMA와 page fault, `read()`는 page cache와 block layer, `sendmsg()`는 socket과 network stack으로 이어진다.</p>
        </div>
      </section>
    </div>
  );
}
