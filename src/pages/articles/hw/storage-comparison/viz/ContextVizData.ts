export const C = {
  sata: "#71717a",
  nvme: "#6366f1",
  sas: "#f59e0b",
  err: "#ef4444",
  ok: "#10b981",
  info: "#06b6d4",
};

export const STEPS = [
  {
    label: "프로토콜보다 먼저 서비스 요구를 적는다",
    body: "지연시간·처리량·용량·정비와 장애 허용 범위를 분리하면 필요한 저장 경로가 보입니다.",
  },
  {
    label: "명령·전송·폼팩터·매체를 같은 층으로 비교하지 않는다",
    body: "AHCI·SCSI·NVMe 명령 경로와 SATA·SAS·PCIe 전송, 드라이브 패키지와 NAND/HDD는 서로 다른 선택입니다.",
  },
  {
    label: "SATA는 단순한 포인트 투 포인트 경로에 강하다",
    body: "성숙한 생태계와 SATA 6Gb/s 연결을 제공하며 NCQ는 최대 32개 outstanding command를 다룹니다.",
  },
  {
    label: "SAS는 확장기와 다중 경로로 운영성을 만든다",
    body: "SCSI 명령, expander와 dual-port 장치를 조합해 많은 베이와 장애 시 대체 경로를 구성합니다.",
  },
  {
    label: "NVMe는 메모리 기반 큐 쌍으로 병렬 I/O를 줄 세운다",
    body: "Submission·Completion Queue를 여러 CPU 문맥에 배치할 수 있지만 실제 개수와 깊이는 장치·OS가 결정합니다.",
  },
];
