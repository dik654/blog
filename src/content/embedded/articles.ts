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
  {
    "id": "overview",
    "title": "1. 시간표대로 남긴 값이 원래 움직임을 모두 알려 주지는 않습니다"
  },
  {
    "id": "outside",
    "title": "2. 계속 바뀌는 전압이 시각과 숫자의 목록으로 바뀝니다"
  },
  {
    "id": "case",
    "title": "3. 10 ms 간격에서 두 신호는 2.65·1.341·0.841 V를 함께 남깁니다"
  },
  {
    "id": "picture",
    "title": "4. 목표 시각·실제 읽기·저장된 값을 나눠 봅니다"
  },
  {
    "id": "why",
    "title": "5. 다음 약속을 늦은 처리 시각에 붙이면 시간표가 밀립니다"
  },
  {
    "id": "names",
    "title": "6. 시간표·한 번 읽기·겹침에 이름을 붙입니다"
  },
  {
    "id": "timer",
    "title": "7. RP2040 타이머의 1 µs 눈금에서 10 ms는 10000칸입니다"
  },
  {
    "id": "adc",
    "title": "8. 알람이 울린 뒤에도 ADC가 값을 잡는 시간이 필요합니다"
  },
  {
    "id": "rate",
    "title": "9. 10 ms 간격은 초당 100개, 절반 경계는 50 Hz입니다"
  },
  {
    "id": "alias",
    "title": "10. 70 Hz 코사인은 100 Hz 눈금에서 30 Hz와 같은 값을 남깁니다"
  },
  {
    "id": "source-clock",
    "title": "11. 실제 반복 함수는 지연의 부호로 다음 목표의 기준을 고릅니다"
  },
  {
    "id": "source-sample",
    "title": "12. 같은 입력을 읽는 adc_read는 시작 비트를 쓰고 완료를 기다립니다"
  },
  {
    "id": "source-model",
    "title": "13. 원문의 복원 조건에 같은 100·30·70 Hz를 넣습니다"
  },
  {
    "id": "limits",
    "title": "14. 주기, 변환 시각, 입력 대역을 함께 확인합니다"
  }
],
    component: () => import("@/pages/articles/embedded/timers-and-sampling"),
  },
  {
    slug: "serial-buses-and-tradeoffs",
    title: "센서 네 바이트를 읽는 세 버스의 실제 비용",
    subcategory: "embedded-hardware",
    sections: [
  {
    "id": "overview",
    "title": "1. 네 바이트를 얻으려면 그 앞뒤의 거래도 끝나야 합니다"
  },
  {
    "id": "outside",
    "title": "2. 센서와 위치를 고르면 결과 네 바이트나 실패가 돌아옵니다"
  },
  {
    "id": "case",
    "title": "3. 네 결과 앞에 세 묶음을 보내 총 63칸을 씁니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 장치를 고른 채 방향만 바꿔 읽습니다"
  },
  {
    "id": "why",
    "title": "5. 장치 선택과 수신 확인을 빼면 같은 거래가 되지 않습니다"
  },
  {
    "id": "names",
    "title": "6. 공유 선·방향 변경·응답에 이름을 붙입니다"
  },
  {
    "id": "i2c",
    "title": "7. I²C는 두 선을 공유하고 주소·응답을 매 거래에 넣습니다"
  },
  {
    "id": "count",
    "title": "8. I²C 400 kHz에서 일곱 묶음은 최소 157.5 µs입니다"
  },
  {
    "id": "source-spec",
    "title": "9. 규격의 방향 비트와 응답 역할에 같은 일곱 묶음을 넣습니다"
  },
  {
    "id": "source-write",
    "title": "10. 실제 SDK에 위치 한 바이트를 보내고 거래를 이어 두라고 지정합니다"
  },
  {
    "id": "source-read",
    "title": "11. 같은 주소에서 네 번 읽기를 요청하고 마지막에 끝냅니다"
  },
  {
    "id": "spi",
    "title": "12. SPI는 선택 선과 클록 모드를 맞추고 더 적은 클록을 씁니다"
  },
  {
    "id": "uart",
    "title": "13. UART 8N1은 네 바이트를 보내도 40비트가 흐릅니다"
  },
  {
    "id": "choice",
    "title": "14. 가장 짧은 클록 시간만으로 버스를 고르지 않습니다"
  }
],
    component: () => import("@/pages/articles/embedded/serial-buses-and-tradeoffs"),
  },
  {
    slug: "scheduling-and-real-time",
    title: "CPU가 한가해도 작업 마감을 놓치는 이유",
    subcategory: "embedded-software",
    sections: [
  {
    "id": "overview",
    "title": "1. CPU가 한가한 시간에도 센서 결과는 늦게 나올 수 있습니다"
  },
  {
    "id": "outside",
    "title": "2. 준비된 일과 끝낼 시각을 넣으면 실행 순서가 나옵니다"
  },
  {
    "id": "case",
    "title": "3. 제어 1 ms 뒤 센서 2 ms를 실행하면 3 ms에 끝납니다"
  },
  {
    "id": "picture",
    "title": "4. 준비된 작업 중 앞선 일을 고르고 잠든 일은 기다립니다"
  },
  {
    "id": "why",
    "title": "5. 전체 일의 양과 특정 결과가 필요한 시각을 따로 셉니다"
  },
  {
    "id": "names",
    "title": "6. 반복 간격·실행량·마감과 준비 상태에 이름을 붙입니다"
  },
  {
    "id": "tasks",
    "title": "7. 세 작업의 주기와 마감은 서로 다릅니다"
  },
  {
    "id": "timeline",
    "title": "8. 모두 0 ms에 준비되면 센서는 3 ms에 끝납니다"
  },
  {
    "id": "utilization",
    "title": "9. 46%는 평균 CPU 몫이지 마감 보증이 아닙니다"
  },
  {
    "id": "blocking",
    "title": "10. 로그가 자원을 2 ms 더 잡고 있으면 센서는 5 ms에 끝납니다"
  },
  {
    "id": "source-selection",
    "title": "11. 실제 커널은 비어 있지 않은 가장 높은 우선순위 목록을 고릅니다"
  },
  {
    "id": "source-wake",
    "title": "12. 다음 목표는 현재 완료 시각에 10을 더하지 않습니다"
  },
  {
    "id": "source-inherit",
    "title": "13. 로그의 우선순위를 1에서 2로 올려도 남은 2 ms는 필요합니다"
  },
  {
    "id": "limits",
    "title": "14. 실제 보장은 실행 시간과 대기 시간을 구별해 확인합니다"
  }
],
    component: () => import("@/pages/articles/embedded/scheduling-and-real-time"),
  },
  {
    slug: "firmware-update-and-recovery",
    title: "새 펌웨어가 실패해도 이전 버전으로 돌아오는 방법",
    subcategory: "embedded-software",
    sections: [
  {
    "id": "overview",
    "title": "1. 새 프로그램이 고장 나도 이전 프로그램으로 돌아오려면"
  },
  {
    "id": "outside",
    "title": "2. 새 파일과 현재 상태를 보고 다음에 실행할 버전을 고릅니다"
  },
  {
    "id": "case",
    "title": "3. v2가 센서를 못 읽으면 확정하지 않고 v1로 돌아갑니다"
  },
  {
    "id": "picture",
    "title": "4. 옛 파일을 지키는 자리와 새 파일을 시험하는 순서를 나눕니다"
  },
  {
    "id": "why",
    "title": "5. 두 자리가 있어도 검사와 진행 기록이 없으면 복구할 수 없습니다"
  },
  {
    "id": "names",
    "title": "6. 보관 자리·시험·확정·되돌리기에 이름을 붙입니다"
  },
  {
    "id": "layout",
    "title": "7. 4 MiB 안에 두 이미지와 복구 공간을 함께 잡습니다"
  },
  {
    "id": "verify",
    "title": "8. v2를 다 받은 뒤 무결성과 출처를 확인합니다"
  },
  {
    "id": "trial",
    "title": "9. v2는 한 번 시험하고 실제 기능을 본 뒤 확정합니다"
  },
  {
    "id": "power",
    "title": "10. 전원이 끊기는 위치마다 돌아오는 경로가 다릅니다"
  },
  {
    "id": "source-state",
    "title": "11. 실제 상태 표에 v2 시험과 미확정 재시작을 넣습니다"
  },
  {
    "id": "source-api",
    "title": "12. 이미지 묶음 0을 시험 표시한 뒤 정상 앱에서 확정합니다"
  },
  {
    "id": "source-copy",
    "title": "13. 한 조각도 새 내용 보관·옛 내용 이동·새 내용 배치 순으로 바꿉니다"
  },
  {
    "id": "security-policy",
    "title": "14. 정상 복귀와 오래된 취약 버전 차단을 함께 정합니다"
  },
  {
    "id": "limits",
    "title": "15. 이 설계는 제품의 플래시·부팅·보안 조건에 맞춰야 합니다"
  }
],
    component: () => import("@/pages/articles/embedded/firmware-update-and-recovery"),
  },
];
