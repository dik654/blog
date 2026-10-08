import type { HardwareTeachCase } from "./HardwareTeachOpening";

export const hardwareTeachCases = {
  gpuComparison: {
    incidentTitle: "연산 수치는 더 높았지만 모델은 시작도 하지 못했습니다",
    incident: [
      "(가정) 후보 A는 표의 연산 수치가 더 높고 가격도 낮았습니다. 그러나 22GB weight를 24GB 장치에 올린 뒤 요청 여덟 개의 상태와 실행 중 임시 공간이 더해지자 첫 부하 시험에서 메모리가 부족해졌습니다.",
      "이 사건의 질문은 ‘어느 GPU가 가장 빠른가’가 아닙니다. 같은 workload가 메모리에 들어가고, 목표 지연과 처리량을 내며, 필요한 시간 동안 전력·냉각·지원 경계 안에서 계속 돌 수 있는 후보가 무엇인지 묻습니다.",
    ],
    pathTitle: "작업은 담기고, 계산하고, 옮기고, 식혀져야 끝납니다",
    path: [
      "먼저 고정 data와 요청마다 늘어나는 상태가 한 장치에 들어가는지 봅니다. 들어간 뒤에는 계산하는 시간과 memory에서 옮기는 시간을 나누고, 여러 장치를 쓰면 장치 사이 이동을 더합니다.",
      "마지막에는 wall power와 온도, 오류·교체·지원 조건을 붙입니다. 앞 단계 하나라도 실패하면 peak 연산 수치의 순위는 실제 선택을 설명하지 못합니다.",
    ],
    numberTitle: "24GB에서 22GB를 빼도 2GB가 온전히 남지는 않습니다",
    numbers: [
      "(가정) Weight 22GB, 요청당 상태 0.4GB, 동시 요청 8개라면 상태만 3.2GB입니다. Weight와 상태 합계가 이미 25.2GB이고 실행 임시 공간과 allocator 여유는 아직 넣지 않았습니다.",
      "따라서 이 후보는 속도 측정 전에 탈락합니다. 다음 본문에서는 이 실패 원인에 메모리 용량, 대역폭, 정밀도, 폼팩터와 연결 방식이라는 표준 이름을 붙입니다.",
    ],
    steps: [
      { role: "작업이 장치 안에 들어갑니다", result: "고정 data, 요청별 상태와 임시 공간을 합쳐도 여유가 남습니다." },
      { role: "계산과 data 이동이 끝납니다", result: "목표 입력에서 처리량과 tail latency를 함께 만족합니다." },
      { role: "오래 돌고 고장에서 돌아옵니다", result: "전력·온도·오류·교체와 지원 조건을 운영 시간 동안 통과합니다." },
    ],
    whyParts: [
      "첫 관문은 실행 가능성을 가릅니다. Weight만 들어가고 요청 상태가 들어가지 않으면 빠르기를 재기도 전에 실패합니다.",
      "두 번째와 세 번째 관문은 같은 장치라도 workload와 설치 형태에 따라 달라집니다. 그래서 사양표는 후보를 줄이고 실제 부하와 장애 시험이 최종 선택을 맡습니다.",
    ],
    terms: [
      { role: "장치 안의 빠른 작업 공간", name: "VRAM·HBM capacity", boundary: "표기 용량과 runtime이 실제로 쓸 수 있는 용량은 다릅니다." },
      { role: "초당 계산과 byte 이동의 상한", name: "Compute throughput·memory bandwidth", boundary: "Peak 값은 target kernel의 achieved 값이 아닙니다." },
      { role: "서버에 넣고 계속 운영하는 조건", name: "Form factor·TDP·enterprise support", boundary: "Board 가격만으로 cooling·교체·downtime 비용을 대신하지 않습니다." },
    ],
    next: "용량을 통과한 후보만 같은 입력·정밀도·software에서 처리량, 지연, 전력과 장애 복구를 비교합니다.",
  },
  acceleratorVendor: {
    incidentTitle: "한 장치에서 통과한 모델이 다른 장치에서는 연산 하나 때문에 멈췄습니다",
    incident: [
      "(가정) 같은 모델과 입력을 두 가속기에서 비교했습니다. 메모리와 peak 수치는 모두 충분했지만 후보 B의 compiler가 특정 연산을 지원하지 않아 host로 되돌아갔고, 전체 지연은 표의 예상보다 길어졌습니다.",
      "가속기 비교는 칩 한 개의 숫자만 나란히 놓는 일이 아닙니다. 모델의 연산이 software에서 실제 kernel로 내려가고, memory와 장치 사이 통로를 거쳐, 서버에 장착·냉각·교체될 때까지 이어져야 합니다.",
    ],
    pathTitle: "같은 모델을 네 관문에 차례로 통과시킵니다",
    path: [
      "첫 관문은 필요한 data와 중간 상태를 담는 공간입니다. 다음은 실제 연산 지원과 compiler 경로, 그다음은 장치 안팎의 이동, 마지막은 보드·서버·전력·지원 생태계입니다.",
      "어느 관문에서든 fallback이나 수동 변환이 생기면 그 비용을 최종 처리량과 운영 시간에 넣습니다. 지원된다는 표시와 목표 workload가 끝까지 돈다는 사실을 구분합니다.",
    ],
    numberTitle: "100개 연산 중 하나의 fallback이 전체 1% 비용이라는 뜻은 아닙니다",
    numbers: [
      "(가정) 반복 구간의 100개 연산 가운데 하나가 host로 돌아가며 매 반복마다 8ms를 더 쓴다고 하겠습니다. 나머지 가속기 연산이 12ms면 총 20ms가 되어, 연산 개수 1%가 지연의 40%를 차지합니다.",
      "그래서 지원 연산 목록과 compiler log를 실제 model trace에 대조해야 합니다. 다음 본문은 이 경로에 memory, link, form factor와 software ecosystem이라는 이름을 붙입니다.",
    ],
    steps: [
      { role: "모델의 연산을 받아들입니다", result: "모든 연산이 지원되거나 허용된 변환 경로를 가집니다." },
      { role: "Data를 장치 안팎으로 옮깁니다", result: "Memory와 장치 사이 통로가 반복 구간을 막지 않습니다." },
      { role: "서버와 운영 환경에 들어갑니다", result: "전력·냉각·배포 도구·교체와 지원 범위가 맞습니다." },
    ],
    whyParts: [
      "연산 지원이 비면 host fallback이나 graph 분할이 생겨 memory와 link가 빨라도 전체 경로가 끊깁니다.",
      "반대로 compiler가 모든 연산을 지원해도 장치 사이 이동과 server integration 비용이 크면 규모를 늘렸을 때 목표를 놓칩니다.",
    ],
    terms: [
      { role: "모델을 장치 실행물로 바꾸는 층", name: "Compiler·runtime ecosystem", boundary: "지원 목록과 실제 graph의 compile·fallback log를 구분합니다." },
      { role: "장치 안팎의 data 통로", name: "Memory hierarchy·scale-up/scale-out link", boundary: "명목 bandwidth가 end-to-end latency를 보장하지 않습니다." },
      { role: "실제 서버에 통합되는 모양", name: "Form factor·platform qualification", boundary: "카드 사양과 OEM 시스템 지원 조합은 같은 범위가 아닙니다." },
    ],
    next: "Peak 표는 후보를 만드는 자료이고, 동일 모델의 compile log·정확도·end-to-end 지연이 채택 자료입니다.",
  },
  serverVsDesktop: {
    incidentTitle: "GPU 네 장은 꽂혔지만 두 장이 예상보다 좁은 길을 썼습니다",
    incident: [
      "(가정) 데스크톱 보드에 GPU 네 장을 장착했습니다. 모두 OS에 보였지만 두 슬롯은 다른 장치와 길을 나눠 실제 전송 폭이 줄었고, 장시간 부하 중 한 장을 원격으로 격리하거나 전원을 다시 넣을 방법도 없었습니다.",
      "서버와 데스크톱의 차이를 CPU 이름이나 외형으로만 보면 이 사건을 설명하지 못합니다. 작업에 필요한 장치 수와 memory 통로, 장애 때 접근하는 길, 부품 하나를 교체한 뒤 되돌리는 절차를 함께 봐야 합니다.",
    ],
    pathTitle: "요청은 계산 장치, memory, 확장 통로와 운영 통로를 지납니다",
    path: [
      "계산 장치는 processor의 통로를 거쳐 memory와 주변 장치에 닿습니다. 여러 장치가 같은 통로를 나누면 개별 사양이 높아도 동시에 움직일 때 막힐 수 있습니다.",
      "운영 중에는 전면 콘솔 없이 상태를 읽고 전원을 제어하며, 오류가 난 memory와 drive를 찾고 교체해야 합니다. 이 경로가 빠지면 한 번의 benchmark는 통과해도 서비스 플랫폼은 완성되지 않습니다.",
    ],
    numberTitle: "장치 네 개가 각각 16개 길을 요구하면 64개가 필요합니다",
    numbers: [
      "(가정) GPU 네 개가 각각 16 lane을 요구하면 GPU만 64 lane입니다. 여기에 고속 NIC와 NVMe가 각각 길을 요구하므로 CPU의 총 lane 수뿐 아니라 어느 root와 slot에 연결되는지까지 맞아야 합니다.",
      "Lane 합계가 맞아도 모든 장치가 같은 CPU socket 뒤에 몰리면 memory와 network locality가 나빠질 수 있습니다. 다음 본문에서 이 이름과 실제 관측 명령을 엽니다.",
    ],
    steps: [
      { role: "장치를 물리적으로 연결합니다", result: "필요한 수의 slot과 전기적 폭, 전원·냉각을 확보합니다." },
      { role: "장치가 memory와 서로 통신합니다", result: "가까운 processor와 memory를 쓰며 공유 통로를 과도하게 다투지 않습니다." },
      { role: "사람이 없는 곳에서 고칩니다", result: "원격 상태 확인·전원 제어·오류 격리와 부품 교체가 가능합니다." },
    ],
    whyParts: [
      "부품이 OS에 보이는 것만으로 첫 관문이 끝나지 않습니다. Slot의 실제 폭과 전력·airflow가 설계 조건을 만족해야 합니다.",
      "운영 관문은 benchmark에 잘 나타나지 않지만 장애 시간이 시작되는 순간 전체 비용을 정합니다. 그래서 서버 플랫폼은 성능과 serviceability를 함께 삽니다.",
    ],
    terms: [
      { role: "주변 장치가 쓰는 확장 통로", name: "PCIe lane·slot topology", boundary: "총 lane 수와 slot별 실제 연결은 다릅니다." },
      { role: "Processor와 memory의 가까움", name: "NUMA locality", boundary: "장치가 보인다는 사실이 local memory path를 뜻하지 않습니다." },
      { role: "OS 밖에서 관리하는 통로", name: "BMC·out-of-band management", boundary: "원격 접속이 application health와 자동 복구를 대신하지 않습니다." },
    ],
    next: "플랫폼 선택은 부품 합계가 아니라 slot별 실제 폭, NUMA 경로와 원격 운영·교체 시험으로 닫습니다.",
  },
  serverCpu: {
    incidentTitle: "코어가 많은 CPU를 골랐는데 GPU와 NIC를 모두 연결할 길이 없었습니다",
    incident: [
      "(가정) 8-GPU 서버에 코어 수가 많은 CPU를 먼저 골랐습니다. 보드 설계를 펼쳐 보니 GPU와 NIC, NVMe가 요구하는 확장 통로가 부족했고, 일부 장치는 다른 socket의 memory까지 돌아가야 했습니다.",
      "GPU 서버의 CPU는 연산 순위만으로 고를 수 없습니다. Host가 준비할 data, 장치마다 필요한 통로, memory 채널과 NUMA 배치, firmware·보드 지원을 같은 구성에서 맞춰야 합니다.",
    ],
    pathTitle: "Data는 memory에서 CPU 가까운 길을 거쳐 장치로 갑니다",
    path: [
      "CPU는 data loader와 통신 준비를 수행하고, memory 채널에서 읽은 data를 장치가 접근할 수 있는 통로에 놓습니다. 장치가 많으면 통로 수와 어느 socket에 붙었는지가 먼저 제약이 됩니다.",
      "코어를 더 늘려도 memory나 I/O가 막히면 GPU 대기는 줄지 않습니다. 반대로 host 작업이 무거우면 lane만 충분한 낮은 core 구성도 병목이 됩니다.",
    ],
    numberTitle: "8 GPU와 8 NIC가 각각 16 lane이면 계산 전부터 256 lane입니다",
    numbers: [
      "(가정) GPU 8개와 NIC 8개가 각각 16 lane을 직접 요구하면 256 lane입니다. 실제 시스템은 switch와 bifurcation을 쓸 수 있으므로 단순 합계가 제품 요구량은 아니지만 설계가 숨겨서는 안 될 출발점입니다.",
      "여기에 boot·data NVMe와 관리 장치가 더해집니다. 다음 본문에서는 lane budget, memory channel, core 성격과 제품 계층을 차례로 붙입니다.",
    ],
    steps: [
      { role: "Host 작업을 계산합니다", result: "Data 준비와 통신 제어가 GPU를 기다리게 하지 않습니다." },
      { role: "Memory에서 충분히 공급합니다", result: "채널 수와 배치가 필요한 host bandwidth를 냅니다." },
      { role: "GPU·NIC·drive에 길을 냅니다", result: "모든 장치가 필요한 폭과 가까운 root를 얻습니다." },
    ],
    whyParts: [
      "코어만 늘리면 host 계산에는 도움이 되지만 memory channel이나 I/O 통로가 막힌 상태는 풀리지 않습니다.",
      "반대로 lane만 충분하고 data loader·compression·network control이 CPU를 포화시키면 GPU가 기다립니다. 세 자원을 같은 workload로 맞춥니다.",
    ],
    terms: [
      { role: "동시에 실행할 host 계산 자원", name: "Core·thread", boundary: "Core 수가 application scaling을 그대로 보장하지 않습니다." },
      { role: "DRAM을 병렬로 읽는 통로", name: "Memory channel", boundary: "지원 채널 수와 실제 population·achieved bandwidth를 구분합니다." },
      { role: "주변 장치를 연결하는 예산", name: "PCIe lane budget", boundary: "CPU 표의 lane 합계만으로 OEM topology를 확정하지 않습니다." },
    ],
    next: "최종 선택은 CPU SKU가 아니라 OEM 보드의 block diagram과 실제 topology·memory bandwidth·host workload 결과로 검증합니다.",
  },
  nvme: {
    incidentTitle: "처음 10초는 빨랐지만 8TB 저장이 끝날 때까지 속도가 유지되지 않았습니다",
    incident: [
      "(가정) 한 drive가 짧은 읽기 시험에서 7GB/s를 냈습니다. 하지만 8TB checkpoint를 계속 쓰자 내부 정리와 온도 제한이 시작돼 속도가 떨어지고 꼬리 지연이 길어졌습니다.",
      "NVMe를 깊게 본다는 것은 광고 처리량을 기억하는 일이 아닙니다. 요청이 queue에 들어가 flash에 기록되고, 내부 주소 변환과 garbage collection을 거쳐 전원 장애 뒤에도 남는 완료가 되는 시점을 추적하는 일입니다.",
    ],
    pathTitle: "요청은 줄에 서고, 주소가 바뀌고, 작은 쓰기가 큰 지우기를 만듭니다",
    path: [
      "Host가 낸 요청은 제출 줄에 들어가 controller가 처리한 뒤 완료 줄로 돌아옵니다. Flash는 덮어쓰지 못하므로 새 위치에 쓰고, 나중에 살아 있는 data를 옮긴 뒤 큰 block을 지웁니다.",
      "따라서 짧은 burst와 지속 쓰기, 평균과 p99, 사용자 byte와 실제 media write를 나눠야 합니다. 전원 차단과 firmware·온도 상태도 같은 workload에서 확인합니다.",
    ],
    numberTitle: "7GB/s가 유지돼도 8TB에는 약 19분이 걸립니다",
    numbers: [
      "(가정) 8,000GB를 7GB/s로 나누면 약 1,143초, 곧 19분입니다. 지속 속도가 3GB/s로 내려가면 약 44분이 되어 checkpoint 목표가 완전히 달라집니다.",
      "이 계산에는 filesystem metadata와 동시 read, 보호 복사 비용이 아직 없습니다. 다음 본문에서 queue, NAND page·block, FTL, endurance와 power-loss protection을 엽니다.",
    ],
    steps: [
      { role: "Host 요청을 줄에 넣습니다", result: "요청 크기와 동시성이 controller가 처리할 수 있는 범위에 듭니다." },
      { role: "새 위치에 기록하고 낡은 공간을 정리합니다", result: "지속 부하에서도 내부 정리 비용과 온도가 안정됩니다." },
      { role: "완료와 장애 뒤 보존을 알립니다", result: "Flush·전원 보호와 firmware 오류가 application 약속과 맞습니다." },
    ],
    whyParts: [
      "Flash는 제자리 덮어쓰기가 안 되므로 host가 쓴 byte보다 media가 더 많이 움직일 수 있습니다. 짧은 시험은 빈 공간과 cache가 이 비용을 가립니다.",
      "완료 queue에 응답이 왔어도 application이 요구한 durability가 무엇인지 따로 확인해야 합니다. 전원 차단 뒤 data와 mapping이 함께 남는지 시험합니다.",
    ],
    terms: [
      { role: "여러 요청과 완료를 병렬로 다루는 줄", name: "NVMe submission·completion queue", boundary: "설정 depth와 실제 유지된 depth는 다릅니다." },
      { role: "논리 주소를 flash 위치로 바꾸는 층", name: "FTL·garbage collection", boundary: "사용자 write와 media write의 양이 같지 않습니다." },
      { role: "전원 상실 중 진행 중 data를 지키는 장치", name: "Power-loss protection", boundary: "존재 여부와 filesystem·application durability 약속을 구분합니다." },
    ],
    next: "구매 판단은 burst 최대값이 아니라 precondition 뒤 sustained curve, p99, 온도·media error와 장애 복구 결과로 내립니다.",
  },
  storageComparison: {
    incidentTitle: "가장 빠른 공간에 둔 마지막 저장점이 node와 함께 사라졌습니다",
    incident: [
      "(가정) 학습 속도를 높이려고 dataset과 checkpoint를 계산 node의 빠른 저장 공간에 함께 뒀습니다. 반복 read는 빨라졌지만 node가 고장 나자 마지막 checkpoint도 사라져 전날 상태로 돌아갔습니다.",
      "저장 방식을 비교할 때 속도 하나만 보면 이 선택이 맞아 보입니다. 그러나 data를 어떤 단위로 읽고, 여러 client가 함께 보는지, 어느 장애 뒤까지 남아야 하며, 실제로 restore할 수 있는지를 먼저 정해야 합니다.",
    ],
    pathTitle: "Data마다 가까움, 공유, 오래 남음의 우선순위가 다릅니다",
    path: [
      "다시 만들 수 있는 읽기 복사본은 계산 가까이에 둘 수 있습니다. 여러 worker가 같은 이름과 완료 상태를 봐야 하는 data는 공동 공간이 필요하고, 장기 원본은 version과 lifecycle을 중심으로 보존합니다.",
      "한 저장 방식이 세 역할을 모두 맡을 수도 있지만 각 약속과 비용을 따로 검증해야 합니다. 이름이 아니라 실패했을 때 무엇이 남고 누가 다시 만드는지로 경계를 긋습니다.",
    ],
    numberTitle: "8TB를 120초 안에 저장하려면 payload만 66.7GB/s입니다",
    numbers: [
      "(가정) 8,000GB를 120초로 나누면 약 66.7GB/s입니다. 이 값은 보호 복사, metadata와 다른 작업의 read를 넣기 전 application payload 기준선입니다.",
      "Local 한 대가 이 수치를 내더라도 node loss 뒤 restore가 안 되면 checkpoint 계층으로는 실패입니다. 다음 본문에서 block·file·object와 local·shared 역할에 표준 이름을 붙입니다.",
    ],
    steps: [
      { role: "반복해서 빠르게 읽습니다", result: "사라져도 원본에서 다시 만들 수 있는 복사본을 가까이 둡니다." },
      { role: "여러 작업자가 같은 상태를 봅니다", result: "공동 이름과 완료 시점을 일관되게 공개합니다." },
      { role: "장애 뒤에도 원본을 남깁니다", result: "Version·보호·복구 절차로 약속한 기간 동안 보존합니다." },
    ],
    whyParts: [
      "가까운 복사본은 read 시간을 줄이지만 그 node와 failure domain을 공유합니다. 그래서 잃어도 되는 data만 맡깁니다.",
      "공유와 장기 보존은 namespace·commit·복구 약속이 다릅니다. 한 제품이 둘 다 제공해도 성공 응답과 장애 뒤 보존을 따로 검증합니다.",
    ],
    terms: [
      { role: "다시 만들 수 있는 가까운 복사본", name: "Local cache·staging", boundary: "유일한 원본이나 마지막 checkpoint로 쓰지 않습니다." },
      { role: "여러 client가 보는 공동 파일 공간", name: "Shared·parallel filesystem", boundary: "공유 namespace가 모든 workload의 성능과 durability를 보장하지 않습니다." },
      { role: "Key와 version으로 오래 남기는 원본", name: "Object storage", boundary: "File rename·POSIX locking과 같은 interface가 아닙니다." },
    ],
    next: "같은 workload를 정상·degraded·rebuild 상태에서 실행하고 마지막 complete 세대를 읽어야 비교가 끝납니다.",
  },
  memory: {
    incidentTitle: "용량은 충분했지만 한 채널의 반복 오류가 서버를 멈췄습니다",
    incident: [
      "(가정) 필요한 2TB를 맞추기 위해 서로 다른 구성의 module을 섞었습니다. 부팅은 됐지만 한 채널에서 수정 가능한 오류가 계속 늘었고, 교체 시점을 놓친 뒤 수정할 수 없는 오류로 작업이 중단됐습니다.",
      "Memory를 용량과 속도 숫자로만 보면 이 사건의 절반만 보입니다. CPU가 실제로 여는 채널 수, module 종류와 속도 하향, 오류를 검출·수정하는 범위, firmware가 기록한 위치를 함께 봐야 합니다.",
    ],
    pathTitle: "주소 하나는 controller, channel, module과 오류 검사를 지납니다",
    path: [
      "Processor의 memory controller는 요청 주소를 여러 channel과 module에 나눠 보냅니다. 채널 population이 비대칭이면 일부 통로만 붐비고 지원 속도가 내려갈 수 있습니다.",
      "읽은 bit에는 오류 검사 정보가 붙습니다. 고칠 수 있는 오류도 증가 추세와 물리 위치를 남겨야 하며, 고칠 수 없는 오류가 난 뒤에는 해당 page·module·node를 격리하고 교체해야 합니다.",
    ],
    numberTitle: "8채널에 16개 module이면 채널당 두 개입니다",
    numbers: [
      "(가정) 8채널에 16개 module을 균등하게 놓으면 채널당 두 개입니다. 한 채널만 비우고 다른 채널에 세 개를 넣으면 총용량은 같아도 bandwidth와 지원 속도 조건이 달라집니다.",
      "다음 본문은 이 물리 배치에 DDR, ECC, RDIMM과 rank라는 이름을 붙이고 inventory·EDAC·BMC 오류를 연결합니다.",
    ],
    steps: [
      { role: "주소를 여러 통로에 나눕니다", result: "Processor가 channel과 module 배치에 맞춰 요청을 보냅니다." },
      { role: "Bit를 읽고 오류를 검사합니다", result: "고칠 수 있는 오류는 수정하고 위치와 증가 추세를 기록합니다." },
      { role: "고장 범위를 격리하고 교체합니다", result: "Page·module·node를 분리한 뒤 같은 부하로 재검증합니다." },
    ],
    whyParts: [
      "총용량이 같아도 channel population이 다르면 bandwidth와 지원 속도가 달라집니다. Module을 아무 slot에나 더하는 방식은 성능과 지원 조합을 함께 바꿉니다.",
      "오류 수정 기능은 고장을 없애지 않습니다. 반복되는 수정 오류는 더 큰 실패의 전조일 수 있으므로 물리 위치와 시간 추세가 교체 판단을 만듭니다.",
    ],
    terms: [
      { role: "DRAM 접근을 병렬로 나누는 길", name: "Memory channel", boundary: "CPU 지원 수와 실제 균등 population을 구분합니다." },
      { role: "서버용 buffer를 가진 module", name: "RDIMM", boundary: "UDIMM과 임의로 혼용하거나 세대·rank 조건을 무시하지 않습니다." },
      { role: "일부 bit 오류를 검출·수정하는 방식", name: "ECC", boundary: "모든 multi-bit·chip·bus 오류를 복구한다는 뜻은 아닙니다." },
    ],
    next: "승인은 용량 합계가 아니라 vendor population rule, 실제 속도·NUMA bandwidth와 오류 주입·교체 절차로 닫습니다.",
  },
  powerCooling: {
    incidentTitle: "정상 때는 버텼지만 feed 하나를 끊자 rack이 함께 꺼졌습니다",
    incident: [
      "(가정) Rack의 평균 부하는 10.5kW였고 A/B 두 경로 합계는 넉넉했습니다. 그러나 한 feed를 끊자 남은 경로의 허용치 12kW에 순간 부하가 몰려 보호 장치가 동작했습니다.",
      "전력 이중화는 케이블 두 개를 꽂는 일이 아닙니다. 한 경로가 사라진 뒤 남은 breaker·PDU·UPS와 냉각 경로가 같은 workload의 피크를 계속 받을 수 있어야 합니다.",
    ],
    pathTitle: "전기는 서버로 들어가고 같은 속도의 열로 빠져나갑니다",
    path: [
      "전원은 시설 경로를 지나 rack과 서버에 들어옵니다. 계산과 fan에 쓴 에너지는 거의 모두 열이 되어 공기나 물로 옮겨지고 최종 방출 설비까지 나갑니다.",
      "한쪽 전기 경로나 fan·pump가 사라질 때 두 흐름을 함께 다시 계산합니다. 정상 합계가 아니라 가장 약한 남은 경로가 운영 상한입니다.",
    ],
    numberTitle: "12kW에서 10.5kW를 빼면 N−1 여유는 1.5kW입니다",
    numbers: [
      "(가정) 남은 허용 capacity 12kW와 rack p95 10.5kW의 차이는 1.5kW입니다. 양수여도 failover 순간의 inrush와 phase 불균형이 있으면 trip할 수 있습니다.",
      "지속 10.5kW는 대략 같은 10.5kW의 열 제거를 요구합니다. 다음 본문에서 A/B feed, PDU·UPS, 공랭·액랭과 열수송 식에 이름을 붙입니다.",
    ],
    steps: [
      { role: "시설에서 rack으로 전력을 보냅니다", result: "정상과 한 경로 고장 상태의 허용 부하를 지킵니다." },
      { role: "서버가 전력을 계산과 fan에 씁니다", result: "Peak와 transient에서도 보호 장치와 PSU 경계를 넘지 않습니다." },
      { role: "생긴 열을 실외로 버립니다", result: "Air·water 경로가 inlet과 component 온도를 허용 범위에 둡니다." },
    ],
    whyParts: [
      "A/B cable이 있어도 upstream이 같으면 독립된 경로가 아닙니다. 한쪽 상실 뒤 남은 최소 허용치로 rack 상한을 다시 계산해야 합니다.",
      "냉각도 정상 용량만 보면 부족합니다. Fan·pump·door·CDU 가운데 하나가 빠진 뒤 잔열이 어느 경로로 가는지를 전력 부하와 같은 시간창에서 봅니다.",
    ],
    terms: [
      { role: "Rack에 전력을 나누고 재는 장치", name: "PDU·busway", boundary: "Outlet 합계와 upstream breaker·phase 허용치는 다릅니다." },
      { role: "전원 중단 사이를 버티는 경로", name: "UPS·A/B feed", boundary: "두 plug가 독립 failure domain을 자동 보장하지 않습니다." },
      { role: "Air 또는 water로 열을 옮기는 설비", name: "CRAH·RDHx·DLC·CDU", boundary: "열을 물로 옮긴다는 이유로 RDHx와 cold-plate DLC를 같은 구성으로 보지 않습니다." },
    ],
    next: "전력·온도·throttle·유효 작업량을 같은 시각에 재고 feed·fan·pump 고장을 주입해 승인합니다.",
  },
  siteReadiness: {
    incidentTitle: "서버는 도착했지만 엘리베이터와 바닥에서 반입이 멈췄습니다",
    incident: [
      "(가정) Rack과 서버 발주는 끝났지만 포장 상태의 하중과 크기가 반입용 엘리베이터 한계를 넘었습니다. 설치실 바닥의 국부 하중 승인과 냉각수 연결 도면도 서로 다른 revision이라 장비는 창고에서 기다렸습니다.",
      "Site readiness는 장비가 도착한 뒤 확인하는 체크리스트가 아닙니다. 반입 경로, 정적·이동 하중, 전기 회로, 열 제거와 배관·통신 경로를 같은 배치안과 도면 revision으로 발주 전에 닫는 일입니다.",
    ],
    pathTitle: "장비는 하역장부터 최종 rack까지 물리 경로를 지나갑니다",
    path: [
      "포장된 장비가 문·회전 반경·엘리베이터를 지나 rack에 고정됩니다. 그 자리에 전원과 network, air 또는 water가 닿고 유지보수 공간이 남아야 가동할 수 있습니다.",
      "각 구간의 숫자를 가진 담당자가 다르므로 한 revision의 도면과 hold point로 연결해야 합니다. 미승인 항목은 현장 재량이 아니라 반입·통전 중지 조건이 됩니다.",
    ],
    numberTitle: "Rack 네 개가 맞아도 한 경로의 허용 하중이 작으면 설치할 수 없습니다",
    numbers: [
      "(가정) Rack 하나의 설치 중량이 1,800kg이고 엘리베이터 허용 하중이 1,600kg이면 최종 바닥이 충분해도 그 경로로는 반입할 수 없습니다.",
      "분해 반입이나 다른 경로를 쓰면 포장·조립·보증과 일정이 달라집니다. 다음 본문에서 냉각 방식, 전력, 바닥 하중과 고정 조건을 실제 문서로 연결합니다.",
    ],
    steps: [
      { role: "장비를 건물 안으로 옮깁니다", result: "포장 크기·중량이 문, 회전 반경과 승강 경로를 통과합니다." },
      { role: "정해진 자리에 고정하고 연결합니다", result: "바닥·rack 고정과 전원·network·냉각 접점이 같은 도면에 맞습니다." },
      { role: "부하를 올려 현장 조건을 검수합니다", result: "전기·열·누수·경보와 유지보수 공간을 실제 부하에서 확인합니다." },
    ],
    whyParts: [
      "최종 설치 위치의 하중만 보면 반입 경로의 rolling load와 순간 집중 하중을 놓칩니다. 장비가 그 자리까지 갈 수 있어야 합니다.",
      "전기와 냉각 문서는 서로 다른 revision이면 같은 rack population을 계산한 것인지 알 수 없습니다. 변경 한 건이 모든 현장 산출물의 재승인 조건이 됩니다.",
    ],
    terms: [
      { role: "반입·설치 전에 멈춰 확인하는 지점", name: "Site survey·hold point", boundary: "체크 표시가 담당자·revision·측정 증거를 대신하지 않습니다." },
      { role: "전력 경로를 한 선으로 보이는 도면", name: "Single-line diagram(SLD)", boundary: "Rack outlet 표만으로 upstream 보호·이중화를 설명하지 않습니다." },
      { role: "배관·계측·제어를 연결한 도면", name: "P&ID", boundary: "배관 위치도만으로 유량·밸브·sensor와 failover를 닫지 않습니다." },
    ],
    next: "최종 gate는 구두 확인이 아니라 SLD·rack elevation·P&ID·반입 동선의 같은 revision과 담당 서명입니다.",
  },
  network: {
    incidentTitle: "링크는 UP이었지만 실제 전송은 기대치의 4분의 1이었습니다",
    incident: [
      "(가정) 양쪽 포트 화면에는 연결됨이 표시됐지만 400Gb/s로 설계한 경로가 100Gb/s로 협상됐습니다. 동시에 CRC 오류와 재전송이 늘어 애플리케이션의 p99가 길어졌습니다.",
      "서버 네트워크는 케이블 속도 하나로 설명되지 않습니다. 한 workload의 message가 host 통로, NIC, 여러 switch와 queue를 지나 상대 process에 완료될 때까지 어디서 기다리고 다시 보내졌는지 봐야 합니다.",
    ],
    pathTitle: "Message는 포장되고, 길을 고르고, 줄을 기다린 뒤 상대에게 확인됩니다",
    path: [
      "보낼 data는 작은 단위로 나뉘어 interface와 다음 길을 고릅니다. 여러 flow가 같은 출구에 몰리면 queue가 생기고, 오류나 혼잡이 있으면 재전송 또는 속도 조절이 일어납니다.",
      "따라서 link rate와 유효 payload, 평균과 tail, 정상과 incast·link failure를 분리합니다. Application 완료 시각과 port counter를 같은 구간에 놓습니다.",
    ],
    numberTitle: "400Gb/s는 초당 50GB의 선로 표기값입니다",
    numbers: [
      "400Gb/s를 8로 나누면 50GB/s지만 framing·protocol·흐름 제어와 동시 traffic을 빼기 전 값입니다. 100Gb/s로 협상되면 출발점부터 12.5GB/s로 줄어듭니다.",
      "다음 본문은 이 경로에 Ethernet, route, queue, oversubscription과 goodput이라는 이름을 붙이고 실제 counter로 좁힙니다.",
    ],
    steps: [
      { role: "이름과 주소로 상대를 정합니다", result: "요청이 기대한 destination과 return path를 고릅니다." },
      { role: "Link와 여러 갈래 길을 통과합니다", result: "속도·MTU·queue·혼잡과 failure path가 workload를 받습니다." },
      { role: "상대 process가 payload를 완료합니다", result: "유효 byte·tail latency와 retry를 application 시각으로 확인합니다." },
    ],
    whyParts: [
      "Link가 UP이라는 표시는 두 끝이 물리적으로 신호를 주고받는다는 뜻에 가깝습니다. 올바른 속도·경로·MTU와 application 성공은 뒤 관문입니다.",
      "Aggregate 처리량은 한 flow의 tail과 incast를 숨길 수 있습니다. Traffic matrix와 slowest flow를 함께 보지 않으면 distributed workload 대기를 설명할 수 없습니다.",
    ],
    terms: [
      { role: "Frame을 가까운 상대에게 옮기는 규칙", name: "Ethernet link", boundary: "Link rate와 application goodput은 같지 않습니다." },
      { role: "목적지에 맞는 다음 길을 고르는 표", name: "Routing table", boundary: "가는 길과 돌아오는 길이 대칭이라는 보장은 없습니다." },
      { role: "여러 flow가 기다리는 완충 공간", name: "Queue·congestion control", boundary: "Drop이 없다고 tail latency와 head-of-line blocking이 없지는 않습니다." },
    ],
    next: "속도 판정은 같은 traffic matrix에서 payload 완료율, p99와 CRC·FEC·drop·retransmit을 함께 봅니다.",
  },
  interconnect: {
    incidentTitle: "GPU 여덟 개 중 한 쌍만 다섯 배 느렸습니다",
    incident: [
      "(가정) 8-GPU 노드에서 대부분의 peer copy는 정상인데 GPU 4와 5 사이만 지연이 다섯 배였습니다. 두 장치가 직접 연결됐다고 생각했지만 실제 data는 host의 더 먼 경계를 돌아가고 있었습니다.",
      "장치 이름에 빠른 link가 적혀 있다는 사실과 특정 pair가 그 길을 쓴다는 사실은 다릅니다. 한 buffer가 출발 장치에서 peer GPU 또는 network adapter에 도착할 때 지나가는 실제 topology를 봐야 합니다.",
    ],
    pathTitle: "Buffer 하나가 장치 안, 보드 안, host 밖의 경계를 지납니다",
    path: [
      "같은 가속기 묶음 안의 이동과 host 확장 통로를 지나는 이동은 길이 다릅니다. 상대가 다른 node에 있으면 network adapter와 fabric 경로가 추가됩니다.",
      "Scheduler의 rank 배치가 이 물리 경로와 어긋나면 가장 먼 pair가 collective 전체를 기다리게 합니다. 연결 가능성과 실제 선택 경로, 측정 bandwidth를 분리합니다.",
    ],
    numberTitle: "일곱 쌍이 20µs여도 한 쌍이 100µs면 barrier는 그 쌍을 기다립니다",
    numbers: [
      "(가정) 동시에 끝나야 하는 여덟 전송 가운데 일곱 개가 20µs, 하나가 100µs라면 해당 단계는 약 100µs보다 빨리 끝날 수 없습니다.",
      "평균 pair latency 30µs는 이 병목을 숨깁니다. 다음 본문은 경로에 PCIe, NVLink·NVSwitch, NUMA와 GPU–NIC locality라는 이름을 붙입니다.",
    ],
    steps: [
      { role: "출발 장치에서 buffer를 읽습니다", result: "Peer 접근 가능 여부와 장치 안 연결을 확인합니다." },
      { role: "보드와 host 경계를 건넙니다", result: "Switch·root·socket과 가까운 network adapter를 지납니다." },
      { role: "상대 장치에서 완료를 알립니다", result: "Pair별 bandwidth·latency와 실제 rank 배치를 대조합니다." },
    ],
    whyParts: [
      "같은 node라는 사실만으로 모든 GPU pair의 길이가 같지는 않습니다. Baseboard와 PCIe root, socket 경계를 몇 번 지나는지가 달라집니다.",
      "집단 작업은 가장 먼 pair와 느린 rank를 기다릴 수 있습니다. 그래서 평균이나 한 pair의 최고값 대신 topology 전체의 matrix를 봅니다.",
    ],
    terms: [
      { role: "Host 주변 장치를 잇는 계층형 통로", name: "PCIe topology", boundary: "세대별 peak와 특정 slot pair의 achieved path는 다릅니다." },
      { role: "GPU끼리 직접 잇는 고속 경로", name: "NVLink·NVSwitch", boundary: "장착 여부와 해당 process가 실제로 쓴 경로를 구분합니다." },
      { role: "GPU와 network adapter의 물리적 가까움", name: "GPU–NIC locality·GPUDirect path", boundary: "가까운 배치가 RDMA 설정과 collective 성공을 자동 보장하지 않습니다." },
    ],
    next: "Topology matrix와 pairwise transfer를 대조한 뒤 rank 배치와 node 밖 collective 결과까지 연결합니다.",
  },
  rdma: {
    incidentTitle: "포트는 ACTIVE였지만 두 node의 memory transfer는 시작하지 못했습니다",
    incident: [
      "(가정) 두 network adapter의 link 상태는 모두 ACTIVE였습니다. 그러나 한쪽이 고른 주소 종류와 다른 쪽의 설정이 달라 연결이 만들어지지 않았고, 상위 library는 느린 socket 경로로 물러났습니다.",
      "Remote memory access는 ‘CPU를 쓰지 않는 빠른 network’ 한 문장으로 끝나지 않습니다. CPU가 memory 범위와 권한, queue를 준비하고 adapter가 그 계약 안에서 data를 옮긴 뒤 완료를 알리는 경로입니다.",
    ],
    pathTitle: "먼저 memory를 등록하고 열쇠와 주소, 줄과 완료 위치를 맞춥니다",
    path: [
      "보내고 받을 memory의 범위를 고정하고 접근 권한을 나타내는 값을 만듭니다. 두 endpoint가 주소와 route를 합의한 뒤 작업을 queue에 넣고 adapter의 완료 기록을 읽습니다.",
      "Loss와 congestion 정책은 host 바깥 fabric까지 맞아야 합니다. Port가 켜진 것, verbs transfer가 성공한 것, GPU collective가 그 경로를 고른 것을 세 단계로 나눕니다.",
    ],
    numberTitle: "Link 400Gb/s와 payload 0Gb/s가 동시에 관측될 수 있습니다",
    numbers: [
      "(가정) 물리 link는 400Gb/s로 올라왔지만 주소 불일치로 첫 요청이 연결 전에 실패하면 application payload는 0입니다. 그래서 nominal rate를 정상 증거로 쓰지 않습니다.",
      "다음 본문에서 등록된 memory, key, queue pair, completion, GID와 RoCEv2에 이름을 붙이고 명령 출력에서 실패 경계를 찾습니다.",
    ],
    steps: [
      { role: "Memory 범위와 접근 권한을 등록합니다", result: "Adapter가 접근해도 되는 주소와 수명을 고정합니다." },
      { role: "두 끝의 주소와 작업 줄을 연결합니다", result: "같은 network mode·route에서 send/read/write를 제출합니다." },
      { role: "Adapter 완료와 오류를 읽습니다", result: "Payload 결과와 retry·congestion·fallback을 확인합니다." },
    ],
    whyParts: [
      "Data movement에서 CPU copy를 줄여도 CPU의 control 책임은 사라지지 않습니다. 등록·key·queue 수명과 오류 복구를 host software가 관리합니다.",
      "Host 두 대의 설정이 맞아도 fabric의 loss·congestion 정책이 다르면 tail과 pause가 커질 수 있습니다. Endpoint와 switch evidence를 함께 봅니다.",
    ],
    terms: [
      { role: "NIC가 직접 접근하도록 고정한 memory", name: "Memory registration·MR key", boundary: "Key의 권한·수명 오류는 link 상태와 무관하게 실패합니다." },
      { role: "작업을 제출하고 완료를 받는 쌍", name: "Queue Pair·Completion Queue", boundary: "Queue가 만들어졌다는 사실이 peer 연결과 payload 성공을 뜻하지 않습니다." },
      { role: "Ethernet 위에서 동작하는 RDMA 방식", name: "RoCEv2·GID", boundary: "Port ACTIVE와 올바른 GID·route·loss policy를 구분합니다." },
    ],
    next: "2-node verbs가 같은 device·port·주소로 통과한 뒤에만 NCCL transport와 application 성능으로 올라갑니다.",
  },
  collective: {
    incidentTitle: "열다섯 rank는 도착했지만 하나가 달라 모두가 기다렸습니다",
    incident: [
      "(가정) 16개 process가 같은 합계 연산에 들어갔습니다. Rank 하나만 buffer 크기나 호출 순서가 달라 나머지 열다섯 개가 완료를 기다리다 timeout이 났습니다.",
      "여러 GPU의 공동 연산은 큰 파일 전송이 아닙니다. 모든 참여자가 같은 연산·개수·자료형·순서에 합의하고, node 안과 밖의 실제 경로를 지나 결과를 함께 받아야 끝납니다.",
    ],
    pathTitle: "각 참여자의 조각이 이동하고 합쳐진 뒤 다시 모두에게 돌아갑니다",
    path: [
      "한 process의 buffer는 이웃으로 이동하고 부분 결과와 합쳐집니다. 이 과정이 정해진 순서로 반복돼 모든 참여자가 최종 결과를 얻습니다.",
      "Algorithm은 message 크기와 topology에 따라 길을 바꿀 수 있습니다. 가장 느린 rank, socket fallback과 한 rail의 오류가 전체 완료 시간을 정할 수 있습니다.",
    ],
    numberTitle: "16개 중 한 개가 2초 늦으면 완료도 최소 2초 늦습니다",
    numbers: [
      "(가정) 15개 rank가 0.2초에 단계 준비를 마치고 rank 13만 2.2초가 걸리면 공동 단계는 2.2초 전에 끝날 수 없습니다. 평균 0.325초는 사용자가 겪는 대기를 숨깁니다.",
      "다음 본문은 이 계약에 collective, rank, all-reduce, algorithm bandwidth와 bus bandwidth라는 이름을 붙입니다.",
    ],
    steps: [
      { role: "모든 참여자가 같은 계약으로 들어옵니다", result: "연산·개수·자료형·호출 순서가 일치합니다." },
      { role: "조각을 이웃과 교환하고 합칩니다", result: "Topology와 message 크기에 맞는 경로로 부분 결과를 만듭니다." },
      { role: "최종 결과를 모두에게 돌려줍니다", result: "Correctness와 가장 느린 rank의 완료 시간을 확인합니다." },
    ],
    whyParts: [
      "참여자 계약이 하나만 달라도 network 성능과 무관하게 전체가 멈출 수 있습니다. 그래서 correctness와 communicator 초기화를 bandwidth보다 먼저 봅니다.",
      "Algorithm이 바뀌면 payload가 link를 지나는 횟수도 달라집니다. Application bandwidth와 물리 link 사용량을 같은 숫자로 읽지 않습니다.",
    ],
    terms: [
      { role: "공동 연산에 참여하는 process 번호", name: "Rank·communicator", boundary: "GPU 수와 rank 배치가 항상 일대일이라는 보장은 없습니다." },
      { role: "모든 입력을 합쳐 모두에게 돌려주는 연산", name: "All-reduce", boundary: "단순 point-to-point 전송의 bandwidth 공식과 같지 않습니다." },
      { role: "GPU topology에 맞춰 collective를 실행하는 library", name: "NCCL", boundary: "Process launcher·scheduler나 fabric 설정 전체를 대신하지 않습니다." },
    ],
    next: "1→2→4→전체 node로 확대하며 correctness, 실제 transport, rank별 시간과 wire counter를 함께 승인합니다.",
  },
  modded4090: {
    incidentTitle: "96GB에는 모델이 들어갔지만 토큰이 장치 사이에서 기다렸습니다",
    incident: [
      "(가정) 48GB로 개조한 카드 두 장에 90GB model을 나눠 올렸습니다. Weight는 들어갔지만 매 layer에서 선택된 조각으로 token을 흩었다 모으는 traffic이 좁은 host 통로에 몰려 처리량이 기대보다 낮았습니다.",
      "Memory 용량을 늘린 변화와 장치 사이 통로·오류 검출·냉각·지원 경계는 별개입니다. 한 번 model을 load한 성공을 장시간 서비스 승인으로 바꾸려면 계산과 이동, 온도와 오류를 함께 봐야 합니다.",
    ],
    pathTitle: "Token은 선택되고, 다른 장치로 흩어지고, 계산 뒤 다시 모입니다",
    path: [
      "각 token은 사용할 일부 계산 조각을 고릅니다. 선택된 조각이 다른 장치에 있으면 token data가 host 통로를 건너고, 결과도 다시 돌아와야 다음 layer로 갑니다.",
      "용량 개조는 이 이동 경로를 넓히지 않습니다. 장시간 부하에서는 memory 안정성, 전력과 온도 제한, 교체·rollback도 새 비용으로 남습니다.",
    ],
    numberTitle: "장치당 48GB 두 장은 96GB지만 한 덩어리 96GB는 아닙니다",
    numbers: [
      "(가정) 90GB weight를 45GB씩 나누면 각 장치에 3GB만 남습니다. Runtime state와 통신 buffer가 3GB를 넘으면 총량 96GB가 있어도 실행은 실패합니다.",
      "다음 본문은 이 사례에 MoE routing, all-to-all, PCIe·NVLink와 장시간 안정성 gate를 붙입니다.",
    ],
    steps: [
      { role: "Weight와 실행 상태를 두 장치에 나눕니다", result: "각 장치의 실제 여유 안에 allocation이 들어갑니다." },
      { role: "Token을 선택된 계산 조각으로 보냅니다", result: "장치 사이 통로가 매 layer의 교환량을 감당합니다." },
      { role: "장시간 오류와 온도를 감시합니다", result: "정확도·tail·Xid·throttle과 교체 가능성을 통과합니다." },
    ],
    whyParts: [
      "총 VRAM은 두 장치에 나뉘어 있으므로 한 allocation과 장치별 workspace가 각각 들어가야 합니다. 합계만으로 fit을 판정할 수 없습니다.",
      "MoE는 선택된 expert가 다른 장치에 있을 때 반복 통신을 만듭니다. 용량을 늘려도 PCIe path와 board 안정성은 바뀌지 않습니다.",
    ],
    terms: [
      { role: "Token이 일부 계산 조각만 고르는 구조", name: "Mixture of Experts·top-k routing", boundary: "Parameter 총량 감소가 아니라 token당 활성 조각을 줄이는 방식입니다." },
      { role: "선택된 token을 여러 장치에 흩고 모으는 통신", name: "All-to-all", boundary: "Weight가 fit해도 통신 tail이 throughput을 제한할 수 있습니다." },
      { role: "장치 오류와 clock 저하의 운영 신호", name: "Xid·thermal throttling", boundary: "한 시간 무오류가 장기 안정성과 보증을 증명하지 않습니다." },
    ],
    next: "용량·정확도·tokens/s·p99뿐 아니라 Xid, 온도·throttle과 spare·보증 경계를 같은 run에 기록합니다.",
  },
  b300Switchless: {
    incidentTitle: "노드 7의 세 번째 케이블 하나가 다른 peer에 꽂혀 전체 작업이 멈췄습니다",
    incident: [
      "(가정) 16노드를 직접 케이블로 이은 뒤 모든 port가 UP으로 보였습니다. 하지만 node 7의 세 번째 port가 예정과 다른 peer에 연결돼 rank 56이 통신을 시작하지 못했습니다.",
      "중앙 switch가 없으면 없어지는 것은 장비 한 종류입니다. 누가 누구와 연결되는지, 어느 길로 보낼지, 끊긴 link를 어떻게 찾고 우회·격리할지는 host 설정과 운영자가 직접 맡습니다.",
    ],
    pathTitle: "각 port는 고정된 peer와 주소, 작업의 rank에 연결됩니다",
    path: [
      "Host의 각 port는 물리 cable의 반대쪽, 같은 논리 rail의 주소와 route를 가져야 합니다. 작업 실행기는 rank를 GPU와 해당 통로에 배치합니다.",
      "한 link가 잘못되면 자동 fabric이 숨겨 주지 않을 수 있습니다. Port map, 주소표, rank mapping과 통신 log가 같은 node ID로 이어져야 원인을 찾습니다.",
    ],
    numberTitle: "16노드에 node당 8개 port면 endpoint 기록만 128개입니다",
    numbers: [
      "(가정) 16×8=128개 port 각각에 host, BDF, interface, peer와 rail을 기록합니다. Cable은 양 끝을 가지므로 한쪽 inventory만 맞아서는 연결을 승인할 수 없습니다.",
      "다음 본문에서 이 직접 연결에 RoCEv2, GID, rail, NCCL interface 선택이라는 이름을 붙이고 2→4→16노드로 검증합니다.",
    ],
    steps: [
      { role: "각 port의 물리 peer를 고정합니다", result: "Cable 양 끝과 node·slot·interface가 원장과 일치합니다." },
      { role: "Rail별 주소와 route를 맞춥니다", result: "통신 library가 의도한 interface와 peer를 선택합니다." },
      { role: "작은 범위에서 전체 작업으로 확대합니다", result: "2→4→16노드와 link fault에서 영향을 기록합니다." },
    ],
    whyParts: [
      "중앙 switch가 path를 학습하거나 우회하지 않으므로 peer 하나의 오배선이 topology 자체를 바꿉니다. Port map이 설계 문서이자 장애 지도입니다.",
      "주소와 route가 맞아도 상위 library가 다른 interface를 고르면 설계한 rail을 쓰지 않습니다. Physical·L3/RDMA·rank evidence를 한 ID로 잇습니다.",
    ],
    terms: [
      { role: "Switch 없이 port 두 개를 직접 잇는 방식", name: "Direct attach·switchless topology", boundary: "Switch 비용이 줄어도 path·우회·telemetry 책임은 사라지지 않습니다." },
      { role: "같은 방향의 병렬 network 경로", name: "Rail", boundary: "Rail 이름과 실제 cable·address·rank mapping이 일치해야 합니다." },
      { role: "NCCL이 쓸 adapter와 주소를 고르는 설정", name: "HCA·GID selection", boundary: "Link UP만으로 intended transport 선택을 증명하지 않습니다." },
    ],
    next: "Switch 비용과 바꾼 운영 비용을 함께 계산하고 link·node fault 뒤 영향 범위가 허용될 때만 채택합니다.",
  },
} satisfies Record<string, HardwareTeachCase>;
