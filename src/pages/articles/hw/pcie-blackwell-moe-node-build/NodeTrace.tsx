import ProgressiveDetail from "@/components/articles/progressive-detail";
import AlgorithmBlock from "@/components/ui/algorithm-block";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

type LedgerRow = { item: string; choice: string; why: string; grade: string };

const BOM: LedgerRow[] = [
  {
    item: "카드",
    choice: "RTX PRO 6000 Blackwell Server Edition 8장. 96GB GDDR7, 1,597GB/s, 최대 600W(450W 제한 SKU 있음)",
    why: "595.2GB가 768GB에 들어가는 가장 작은 장수입니다. 카드끼리 잇는 전용 다리는 없습니다.",
    grade: "공식 사양(Lenovo LP2263)",
  },
  {
    item: "섀시와 길",
    choice: "A안: PCIe 5.0 스위치 dual-root 섀시(예: Supermicro SYS-522GA-NRT). B안: ConnectX-8 스위치 보드형 RTX PRO Server",
    why: "A안은 스위치 아래 카드끼리 짧은 길을 줍니다. B안은 카드 둘마다 400G 포트가 붙어 나중의 RDMA를 미리 깝니다.",
    grade: "A안 공식 제품 페이지 · B안 NVIDIA 블로그와 검색 요약",
  },
  {
    item: "CPU와 메모리",
    choice: "2소켓, 소켓당 메모리 채널 12개를 모두 채움, DDR5-6400, 합계 1.5TB 이상",
    why: "소켓을 건너는 맞추기와 호스트 경유 복사가 이 길을 탑니다. 남는 용량은 기억 오프로드 저장소입니다.",
    grade: "NVIDIA RA(GPU당 128GB 이상) · 현장 경험",
  },
  {
    item: "로컬 저장",
    choice: "가중치 사본을 둘 Gen5 NVMe",
    why: "595GB를 매번 원격에서 받으면 재기동 시간이 길어집니다. 초안 매니페스트는 적재에 최대 60분을 잡았습니다.",
    grade: "설계 판단",
  },
  {
    item: "네트워크 카드",
    choice: "400G 포트 하나를 장착만 하고, 처음에는 기존 100GbE 서비스망으로 운영",
    why: "복제본으로 늘리면 노드 사이 카드 통신이 없습니다. 앞뒤 단계를 나눌 때만 RDMA가 일합니다(8절).",
    grade: "설계 판단",
  },
];

const SETTINGS: LedgerRow[] = [
  {
    item: "BIOS와 커널",
    choice: "IOMMU 끔(또는 pass-through), ACS 끔, Resizable BAR 켬",
    why: "P2P를 켠 상태에서 NCCL과 custom all-reduce가 멈추던 보고가 이 설정으로 풀렸습니다.",
    grade: "현장 경험(Level1Techs, discuss.vllm.ai, rtx6kpro)",
  },
  {
    item: "UVM 모듈",
    choice: "options nvidia_uvm uvm_disable_hmm=1",
    why: "이 값이 없으면 NCCL이 멈췄다는 보고가 있습니다.",
    grade: "현장 경험(rtx6kpro)",
  },
  {
    item: "단일 사용자 우선",
    choice: "NCCL_P2P_LEVEL=SYS와 NCCL_GRAPH_FILE(손으로 고친 토폴로지 XML), 또는 NCCL_PROTO=LL",
    why: "NCCL이 AMD 소켓 사이 링크(xGMI)를 16GB/s로 잘못 읽는 버그를 손으로 고친 XML로 우회합니다.",
    grade: "현장 경험(rtx6kpro)",
  },
  {
    item: "동시 처리량 우선",
    choice: "NCCL_P2P_DISABLE=1, NCCL_MIN_NCHANNELS=32, NCCL_MAX_NCHANNELS=64, NCCL_BUFFSIZE=67108864, CUDA_DEVICE_MAX_CONNECTIONS=64",
    why: "동시 100개에서 약 600이 약 900 tok/s가 됐다는 측정이 이 묶음과 함께 보고됐습니다.",
    grade: "현장 경험(rtx6kpro, 스크린샷)",
  },
  {
    item: "엔진",
    choice: "vLLM --tensor-parallel-size 8 --decode-context-parallel-size 8 --attention-backend TRITON_MLA --kv-cache-dtype fp8",
    why: "SM120에서 쓸 수 있는 MLA 경로는 TRITON_MLA뿐이고, 기억 용량은 DCP와 FP8로 확보합니다.",
    grade: "코드 확인(v0.32.0) · 현장 측정은 PR 두 개를 얹은 커스텀 이미지",
  },
];

function Ledger({ rows, label }: { rows: LedgerRow[]; label: string }) {
  return (
    <div className="not-prose my-8 min-w-0 border-y border-border" role="table" aria-label={label}>
      {rows.map((row) => (
        <div key={row.item} role="row" className="grid min-w-0 gap-1 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <p role="rowheader" className="text-sm font-bold text-foreground">{row.item}</p>
          <div role="cell" className="min-w-0 space-y-1 text-sm leading-6">
            <p className="break-words font-medium text-foreground">{row.choice}</p>
            <p className="text-muted-foreground">{row.why}</p>
            <p className="text-xs font-semibold text-primary">{row.grade}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 층위 4: 3절의 같은 노드(Kimi K2.5 INT4 595.2GB, 8장, 0.92)를 부품표 → 설정 → 수락 → 고장 격리로 끝까지 따라간다.
 * 설정 값은 rtx6kpro 위키 원문(커밋 1b6de11b, 2026-11-02 클론)에서 옮긴 현장 경험이며 직접 실행하지 않았다.
 */
export default function NodeTrace() {
  return (
    <section id="node-trace" data-teach-level="4" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7. 같은 노드를 부품표·설정·수락 순서로 따라갑니다</h2>
      <div className={prose}>
        <p>
          3절의 노드를 다시 씁니다. Kimi K2.5 INT4 595.2GB를 카드 여덟 장에 TP8로 올리고, 사용률 0.92에서 장마다 13.9GB를 기억 칸으로 남긴 그 노드입니다. 먼저 부품표를 근거 등급과 함께 적습니다.
        </p>
      </div>
      <Ledger rows={BOM} label="노드 부품표" />
      <div className={prose}>
        <p>
          A안과 B안은 무엇을 먼저 사느냐의 차이입니다. 한 노드에 한 벌을 올리는 동안 노드 밖 RDMA는 쓰지 않으므로, A안에 400G 카드 하나만 꽂아 두어도 충분합니다. 앞뒤 단계를 나눌 계획이 이미 있다면 B안이 나중의 배선을 줄입니다.
        </p>
        <p>
          B안을 고를 때는 견적서의 스위치 보드 품목을 따로 봐야 합니다. 일부 벤더는 ConnectX-8이 아닌 다른 회사의 PCIe 스위치 보드로 RTX PRO 서버를 출하했다는 보도가 있습니다. 카드 자체가 Gen5라서 Gen6 스위치를 써도 카드 쪽 링크는 Gen5 속도로 맞춰질 것입니다(추론).
        </p>
        <p>
          다음은 설정입니다. 아래 값은 이 카드 여덟 장으로 Kimi를 돌린 사람들이 위키에 남긴 것이라 현장 경험 등급입니다. 반복 횟수, 오차, 정확한 드라이버 조합이 다 적혀 있지는 않으므로 그대로 복사하지 말고 수락 측정의 후보로 씁니다.
        </p>
      </div>
      <Ledger rows={SETTINGS} label="BIOS·커널·NCCL·엔진 설정" />
      <div className={prose}>
        <p>
          표의 셋째와 넷째 줄은 서로 반대입니다. 단일 사용자 속도를 올리는 설정은 P2P를 소켓 너머까지 쓰게 하고, 동시 처리량을 올리는 설정은 P2P를 끕니다. 한 노드가 두 목표를 동시에 최적으로 맞출 수는 없으니, 지켜야 할 서비스 목표에 맞춰 노드마다 한쪽을 고르고 그 선택을 노드 목록에 적어 둡니다.
        </p>
        <p>
          엔진 줄에도 단서가 있습니다. 현장 측정은 vLLM PR #34597과 #34795를 얹은 커스텀 이미지에서 나왔습니다. 공개 v0.32.0 이미지로 이 노드에서 Kimi K2.5가 돌았다는 보고는 찾지 못했습니다. 그래서 산 노드는 아래 순서로 받아들입니다.
        </p>
      </div>
      <AlgorithmBlock
        title="노드 수락 순서"
        input={["조립된 8장 노드", "BIOS·커널 설정 후보", "우리 에이전트 트레이스", "지킬 서비스 목표(요청별 P25 속도, P95 TTFT)"]}
        steps={[
          { code: "nvidia-smi topo -m", note: "카드 쌍마다 PIX·PXB(같은 스위치)인지 NODE·SYS(소켓 경유)인지, NIC가 어느 카드와 같은 스위치인지 적습니다. 공개된 한 8장 노드 기록은 0↔1, 2↔3처럼 두 장씩만 PIX였고 소켓을 건너면 SYS였습니다." },
          { code: "nvbandwidth (P2P와 호스트 경유를 모두)", note: "카드 쌍별 대역폭 표에서 유독 낮은 쌍을 찾습니다. 같은 모델의 다른 노드와 비교할 기준 숫자를 남깁니다." },
          { code: "all_reduce_perf -b 8 -e 128M -f 2 -g 8 (P2P 켬·끔)", note: "작은 크기 구간의 지연이 5절의 맞추기 한 번입니다. 끝까지 멈추지 않고 도는지도 여기서 봅니다." },
          { code: "ib_write_bw --use_cuda=<카드 번호> (앞뒤 단계 분리 계획이 있을 때만)", note: "네트워크 카드가 카드 메모리를 직접 읽는지 노드마다 증명합니다. NVIDIA 문서가 이 카드를 명시하지 않기 때문입니다." },
          { code: "단일 사용자 0K·100K·200K, 동시성 sweep", note: "현장 숫자(65·36·27 tok/s)와 비교하고, 트레이스 재생으로 서비스 목표를 지키는 최대 동시 에이전트 수를 잽니다." },
          { code: "합격 프로파일을 노드 라벨로 기록", note: "단일 사용자형인지 동시 처리량형인지를 스케줄러가 볼 수 있게 남깁니다." },
        ]}
        output="합격·불합격과 노드별 NCCL 프로파일, 서비스 목표 아래 최대 동시 에이전트 수"
      />
      <ProgressiveDetail
        title="고장 추적: P2P를 켜자 엔진이 첫 요청 전에 멈춘 경우"
        preview="(가정) 공개 보고된 멈춤을 이 노드에 옮긴 사례입니다. 증상에서 원인, 격리, 복구, 재발 방지까지 한 줄로 따라갑니다."
      >
        <div className={prose}>
          <p>
            (가정) 엔진 로그가 카드 초기화 뒤 custom all-reduce 준비 단계에서 더 나아가지 않습니다. 먼저 엔진을 빼고 all_reduce_perf만 돌려 같은 멈춤이 나는지 봅니다. 엔진 없이도 멈추면 문제는 길과 펌웨어 쪽입니다.
          </p>
          <p>
            다음으로 /proc/cmdline과 dmesg에서 IOMMU 상태를 보고 BIOS의 ACS 항목을 확인합니다. 공개 보고에서는 IOMMU를 끄거나 pass-through로 두고 ACS를 끄자 풀렸습니다. 고친 뒤 3단계를 다시 돌려 기준 숫자를 새로 남깁니다.
          </p>
          <p>
            당장 서비스를 살려야 하면 NCCL_P2P_DISABLE=1이나 엔진의 --disable-custom-all-reduce로 되돌립니다. 대가는 단일 사용자 속도입니다. 같은 위키의 K2.6 기록에는 P2P 강제 모듈 없이 custom all-reduce를 켜자 동시 16개 처리량이 716.8에서 140.7 tok/s로 무너진 줄도 있습니다. 재발 방지는 이 설정 묶음을 노드 이미지에 고정하고 수락 1~3단계를 펌웨어 갱신마다 다시 도는 것입니다.
          </p>
        </div>
      </ProgressiveDetail>
    </section>
  );
}
