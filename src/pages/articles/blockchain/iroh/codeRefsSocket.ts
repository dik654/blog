import type { CodeRef } from '@/components/code/types';

export const socketRefs: Record<string, CodeRef> = {
  'transports-struct': {
    path: 'iroh/iroh/src/socket/transports.rs',
    lang: 'rust',
    highlight: [1, 7],
    desc: 'Transports는 IP(UDP), Relay(WebSocket), Custom 전송을 통합 관리합니다.\npoll_recv_counter로 라운드로빈 폴링하여 공정한 수신을 보장합니다.',
    code: `/// 다양한 전송 계층을 통합 관리하는 구조체
pub(crate) struct Transports {
    #[cfg(not(wasm_browser))]
    ip: IpTransports,              // IPv4 + IPv6 UDP 소켓
    relay: Vec<RelayTransport>,    // Relay WebSocket 연결들
    custom: Vec<Box<dyn CustomEndpoint>>,
    poll_recv_counter: usize,      // 라운드로빈 공정 폴링
    source_addrs: [Addr; BATCH_SIZE],
}

/// 전송 주소 타입 — IP, Relay, Custom 세 가지
pub enum Addr {
    Ip(SocketAddr),                    // 직접 UDP
    Relay(RelayUrl, EndpointId),       // Relay 경유
    Custom(CustomAddr),                // 사용자 정의 전송
}`,
    annotations: [
      { lines: [2, 9] as [number, number], color: 'sky' as const, note: 'Transports: IP + Relay + Custom 통합' },
      { lines: [12, 17] as [number, number], color: 'emerald' as const, note: 'Addr enum: 세 가지 전송 경로 타입' },
    ],
  },
  'poll-recv-fairness': {
    path: 'iroh/iroh/src/socket/transports.rs',
    lang: 'rust',
    highlight: [3, 10],
    desc: '수신 폴링에서 공정성(fairness)을 보장하기 위해\n짝수/홀수 호출마다 전송 계층 폴링 순서를 뒤집습니다.\n특정 전송이 항상 먼저 처리되는 starvation을 방지합니다.',
    code: `fn inner_poll_recv(&mut self, cx: &mut Context,
    bufs: &mut [IoSliceMut], metas: &mut [RecvMeta],
) -> Poll<io::Result<usize>> {
    // 공정성을 위해 매 호출마다 폴링 순서를 반전
    let counter = self.poll_recv_counter.wrapping_add(1);

    if counter.is_multiple_of(2) {
        poll_transport!(&mut self.ip);      // IP 먼저
        for t in self.relay.iter_mut() { poll_transport!(t); }
        for t in self.custom.iter_mut() { poll_transport!(t); }
    } else {
        for t in self.custom.iter_mut().rev() { poll_transport!(t); }
        for t in self.relay.iter_mut().rev() { poll_transport!(t); }
        poll_transport!(&mut self.ip);      // IP 나중
    }
    Poll::Pending
}`,
    annotations: [
      { lines: [4, 5] as [number, number], color: 'sky' as const, note: '라운드로빈 카운터' },
      { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '짝수: IP → Relay → Custom 순서' },
      { lines: [11, 15] as [number, number], color: 'amber' as const, note: '홀수: Custom → Relay → IP (역순)' },
    ],
  },
  'path-selection': {
    path: 'iroh/iroh/src/socket/transports.rs',
    lang: 'rust',
    highlight: [1, 8],
    desc: '경로 선택 데이터입니다. Primary 전송(IP)이 Backup(Relay)보다 우선하며,\n같은 타입 내에서는 biased_rtt(가중 RTT)가 낮은 경로를 선택합니다.\nIPv6에 유리한 바이어스를 줄 수 있어 점진적 IPv6 전환을 지원합니다.',
    code: `pub struct PathSelectionData {
    pub transport_type: TransportType, // Primary | Backup
    pub rtt: Duration,                 // 측정된 실제 RTT
    pub biased_rtt: i128,              // 바이어스 적용된 RTT
}

impl PathSelectionData {
    /// 정렬 키: (transport_type, biased_rtt) — 낮을수록 좋음
    pub fn sort_key(&self) -> (u8, i128) {
        (self.transport_type as u8, self.biased_rtt)
    }
}

// TransportType: Primary(IP) vs Backup(Relay)
enum TransportType {
    Primary, // IP 기반 — 직접 연결 후보
    Backup,  // Relay — 최후 수단
}`,
    annotations: [
      { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'PathSelectionData: 경로 품질 데이터' },
      { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'sort_key: (타입, RTT) 기준 정렬' },
      { lines: [15, 18] as [number, number], color: 'amber' as const, note: 'Primary(IP)가 Backup(Relay)보다 항상 우선' },
    ],
  },
};
