export const streamMuxerCode = `pub trait StreamMuxer {
    type Substream: AsyncRead + AsyncWrite + Send + Unpin;
    type Error: std::error::Error + Send + Sync;

    // 새 아웃바운드 서브스트림 열기
    fn poll_outbound(
        &self,
        cx: &mut Context<'_>,
    ) -> Poll<Result<Self::Substream, Self::Error>>;

    // 인바운드 서브스트림 수신
    fn poll_inbound(
        &self,
        cx: &mut Context<'_>,
    ) -> Poll<Result<Self::Substream, Self::Error>>;

    // 이벤트 폴링 (에러, 주소 변경 등)
    fn poll(
        &self,
        cx: &mut Context<'_>,
    ) -> Poll<Result<StreamMuxerEvent, Self::Error>>;

    // 우아하게 닫기
    fn poll_close(
        &self,
        cx: &mut Context<'_>,
    ) -> Poll<Result<(), Self::Error>>;
}`;

export const streamMuxerAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'Substream = AsyncRead + AsyncWrite' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: 'poll_outbound — 새 스트림 요청' },
  { lines: [11, 15] as [number, number], color: 'amber' as const, note: 'poll_inbound — 원격 스트림 수신' },
];

export const yamuxFrameCode = `// Yamux 프레임 구조 (12 바이트 헤더)
//
// ┌─────────┬──────┬────────┬───────────┬────────┐
// │ Version │ Type │ Flags  │ Stream ID │ Length │
// │  1 byte │ 1 b  │ 2 byte │  4 byte   │ 4 byte │
// └─────────┴──────┴────────┴───────────┴────────┘
//
// Type: 0=Data, 1=WindowUpdate, 2=Ping, 3=GoAway
// Flags: SYN(1) | ACK(2) | FIN(4) | RST(8)
//
// 흐름 제어: WindowUpdate 프레임으로 수신 윈도우 조절
//   - 초기 윈도우: 256 KB
//   - WindowUpdate 수신 시 윈도우 증가
//   - 윈도우 0이면 송신 측 대기 (백프레셔)`;

export const yamuxFrameAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '12바이트 프레임 헤더 레이아웃' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: 'Type + Flags 필드' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: '흐름 제어 (백프레셔)' },
];

export const comparisonData = [
  { name: 'Yamux', status: '권장', maxStreams: '8192', flowControl: 'WindowUpdate', overhead: '12B/프레임', color: '#f59e0b' },
  { name: 'Mplex', status: '폐기됨', maxStreams: '1000', flowControl: '없음', overhead: '가변', color: '#6b7280' },
  { name: 'QUIC 스트림', status: '내장', maxStreams: '제한없음', flowControl: 'QUIC FC', overhead: '0 (프로토콜 내장)', color: '#06b6d4' },
];
