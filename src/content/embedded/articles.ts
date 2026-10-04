import type { Article } from "../types";

export const embeddedArticles: Article[] = [
  {
    slug: "mcu-memory-map-and-registers",
    title: "주소 한 칸이 GPIO 출력을 바꾸는 방법",
    subcategory: "embedded-hardware",
    sections: [
  {
    "id": "overview",
    "title": "1. 프로그램의 한 번 쓰기가 칩 바깥의 신호를 바꿉니다"
  },
  {
    "id": "outside",
    "title": "2. 주소와 값을 보내고 선택한 핀의 상태를 확인합니다"
  },
  {
    "id": "case",
    "title": "3. 5번을 고르는 0x20을 정해진 주소에 씁니다"
  },
  {
    "id": "picture",
    "title": "4. 저장할 값·핀 기능·출력 허용을 따로 준비합니다"
  },
  {
    "id": "why",
    "title": "5. 어느 동작인지와 어느 핀인지 나누면 다른 출력을 유지할 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 주소로 찾는 장부와 출력 경로에 이름을 붙입니다"
  },
  {
    "id": "map",
    "title": "7. 기준 주소와 오프셋을 더해 동작 주소를 찾습니다"
  },
  {
    "id": "mask",
    "title": "8. GPIO5의 같은 마스크를 SET·CLR에 적용합니다"
  },
  {
    "id": "mux",
    "title": "9. 핀의 기능 선택과 출력 허용은 별도로 맞춥니다"
  },
  {
    "id": "source-init",
    "title": "10. 실제 gpio_init(5)는 출력부터 끈 뒤 낮은 값을 준비합니다"
  },
  {
    "id": "source-direction",
    "title": "11. 출력 허용 함수도 같은 0x20을 계산합니다"
  },
  {
    "id": "source-output",
    "title": "12. gpio_put(5,true)의 끝에서 주소에 0x20이 쓰입니다"
  },
  {
    "id": "race",
    "title": "13. 한 비트 쓰기는 충돌을 줄이지만 핀의 소유권까지 정하지 않습니다"
  },
  {
    "id": "readback",
    "title": "14. 출력 래치를 읽는 것과 핀 입력을 읽는 것은 다릅니다"
  }
],
    component: () => import("@/pages/articles/embedded/mcu-memory-map-and-registers"),
  },
  {
    slug: "interrupts-and-latency-budget",
    title: "인터럽트가 와도 마감 시각을 놓치는 이유",
    subcategory: "embedded-hardware",
    sections: [
  {
    "id": "overview",
    "title": "1. 센서가 알린 때부터 값을 쓸 수 있는 때까지 셉니다"
  },
  {
    "id": "outside",
    "title": "2. 입력 변화가 읽을 작업으로 이어지고 마감 전에 끝나야 합니다"
  },
  {
    "id": "case",
    "title": "3. 일곱 구간을 더하면 493 µs입니다"
  },
  {
    "id": "picture",
    "title": "4. 사건 기록과 처리 대기 기록은 서로 다른 곳에 있습니다"
  },
  {
    "id": "why",
    "title": "5. 짧게 접수하는 일과 오래 읽는 일을 나눕니다"
  },
  {
    "id": "names",
    "title": "6. 기록·대기·접수의 역할에 이름을 붙입니다"
  },
  {
    "id": "route",
    "title": "7. GPIO2의 에지 기록이 코어의 대기 요청으로 이어집니다"
  },
  {
    "id": "handler",
    "title": "8. 20 µs 안에 접수하고 300 µs 읽기를 일반 작업에 넘깁니다"
  },
  {
    "id": "source-enable",
    "title": "9. 원문은 콜백을 먼저 등록한 뒤 사건 전달을 켭니다"
  },
  {
    "id": "source-dispatch",
    "title": "10. 같은 사건은 소거된 뒤 사용자 콜백으로 전달됩니다"
  },
  {
    "id": "budget",
    "title": "11. 같은 사건의 완료 시각과 남은 507 µs를 계산합니다"
  },
  {
    "id": "stress",
    "title": "12. 대기가 길어지면 처리 코드는 같아도 마감을 놓칩니다"
  },
  {
    "id": "limits",
    "title": "13. 에지 비트 하나는 사건 횟수나 최악 시간의 증명서가 아닙니다"
  }
],
    component: () => import("@/pages/articles/embedded/interrupts-and-latency-budget"),
  },
  {
    slug: "timers-and-sampling",
    title: "10 ms마다 읽은 값이 원래 신호와 다를 수 있는 이유",
    subcategory: "embedded-hardware",
    sections: [
      { id: "overview", title: "10 ms마다 읽으면 빠른 변화가 느리게 보일 수 있습니다" },
      { id: "timer", title: "RP2040 타이머의 1 µs 눈금에서 10 ms는 10000칸입니다" },
      { id: "adc", title: "알람이 울린 뒤에도 ADC가 값을 잡는 시간이 필요합니다" },
      { id: "rate", title: "10 ms 간격은 초당 100개, 절반 경계는 50 Hz입니다" },
      { id: "alias", title: "70 Hz 코사인은 100 Hz 눈금에서 30 Hz와 같은 값을 남깁니다" },
      { id: "limits", title: "주기, 변환 시각, 입력 대역을 함께 확인합니다" },
    ],
    component: () => import("@/pages/articles/embedded/timers-and-sampling"),
  },
  {
    slug: "serial-buses-and-tradeoffs",
    title: "센서 네 바이트를 읽는 세 버스의 실제 비용",
    subcategory: "embedded-hardware",
    sections: [
      { id: "overview", title: "같은 네 바이트라도 선 위에 놓이는 비트 수가 다릅니다" },
      { id: "i2c", title: "I²C는 두 선을 공유하고 주소·응답을 매 거래에 넣습니다" },
      { id: "count", title: "I²C 400 kHz에서 일곱 묶음은 최소 157.5 µs입니다" },
      { id: "spi", title: "SPI는 선택 선과 클록 모드를 맞추고 더 적은 클록을 씁니다" },
      { id: "uart", title: "UART 8N1은 네 바이트를 보내도 40비트가 흐릅니다" },
      { id: "choice", title: "가장 짧은 클록 시간만으로 버스를 고르지 않습니다" },
    ],
    component: () => import("@/pages/articles/embedded/serial-buses-and-tradeoffs"),
  },
  {
    slug: "scheduling-and-real-time",
    title: "CPU가 한가해도 작업 마감을 놓치는 이유",
    subcategory: "embedded-software",
    sections: [
      { id: "overview", title: "CPU가 절반 이상 비어도 센서의 마감은 깨질 수 있습니다" },
      { id: "tasks", title: "세 작업의 주기와 마감은 서로 다릅니다" },
      { id: "timeline", title: "모두 0 ms에 준비되면 센서는 3 ms에 끝납니다" },
      { id: "utilization", title: "46%는 평균 CPU 몫이지 마감 보증이 아닙니다" },
      { id: "blocking", title: "낮은 우선순위 작업이 자원을 쥐면 센서가 기다립니다" },
      { id: "limits", title: "실제 보장은 최악 실행·대기와 시각 기록으로 확인합니다" },
    ],
    component: () => import("@/pages/articles/embedded/scheduling-and-real-time"),
  },
  {
    slug: "firmware-update-and-recovery",
    title: "새 펌웨어가 실패해도 이전 버전으로 돌아오는 방법",
    subcategory: "embedded-software",
    sections: [
      { id: "overview", title: "새 펌웨어가 시작되지 않아도 옛 버전으로 돌아오려면" },
      { id: "layout", title: "4 MiB 안에 두 이미지와 복구 공간을 함께 잡습니다" },
      { id: "verify", title: "v2를 다 받은 뒤 무결성과 출처를 확인합니다" },
      { id: "trial", title: "v2는 한 번 시험하고 실제 기능을 본 뒤 확정합니다" },
      { id: "power", title: "전원이 끊기는 위치마다 돌아오는 경로가 다릅니다" },
      { id: "limits", title: "이 설계는 제품의 플래시·부팅·보안 조건에 맞춰야 합니다" },
    ],
    component: () => import("@/pages/articles/embedded/firmware-update-and-recovery"),
  },
];
