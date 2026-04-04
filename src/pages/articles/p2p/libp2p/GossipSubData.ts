export const meshParams = [
  { param: 'D (mesh_n)', value: '6', desc: '각 토픽의 메시 피어 목표 수', color: '#6366f1' },
  { param: 'D_low (mesh_n_low)', value: '5', desc: '메시 피어 하한. 미달 시 GRAFT', color: '#10b981' },
  { param: 'D_high (mesh_n_high)', value: '12', desc: '메시 피어 상한. 초과 시 PRUNE', color: '#f59e0b' },
  { param: 'D_lazy (gossip_lazy)', value: '6', desc: 'IHAVE 메시지 전송 대상 수', color: '#ec4899' },
  { param: 'heartbeat_interval', value: '1s', desc: '메시 유지보수 주기', color: '#8b5cf6' },
  { param: 'mcache_len', value: '5', desc: '메시지 캐시 유지 하트비트 수', color: '#06b6d4' },
];

export const propagationCode = `// GossipSub 메시지 전파 흐름
//
// 1. 메시지 발행
//    gossipsub.publish(topic, data)?;
//
// 2. 메시 피어에게 FULL MESSAGE 전송
//    mesh_peers[topic] → 각 피어에게 직접 전송
//    O(D) 피어에게 전체 메시지 복사
//
// 3. 비-메시 피어에게 IHAVE (메타데이터만)
//    gossip_peers → MessageId만 전송
//    "이 메시지 있어요" 알림
//
// 4. IHAVE 수신 피어 → IWANT 응답
//    수신 피어: 메시지 캐시에 없으면 IWANT 전송
//    → 원래 피어가 FULL MESSAGE 전송
//
// 전파 속도: O(log N) 홉 (메시 오버레이)
// 중복 전송: SEEN 캐시로 방지`;

export const propagationAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '발행 시작' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '메시 피어 → 전체 메시지' },
  { lines: [10, 16] as [number, number], color: 'amber' as const, note: 'IHAVE/IWANT gossip 전파' },
];

export const scoringCode = `// GossipSub v1.1 Peer Scoring
//
// 피어 점수 = P1 + P2 + P3a + P3b + P4 + P5 + P6 + P7
//
// P1: 토픽별 메시 시간 (오래 참여할수록 +)
// P2: 첫 메시지 전달 (새 메시지 처음 전달하면 +)
// P3a: 메시 메시지 전달 실패 (빠뜨리면 -)
// P3b: 무효 메시지 전달 (검증 실패 메시지 전달 시 -)
// P4: 토픽별 무효 메시지 (심각한 프로토콜 위반 -)
// P5: 애플리케이션 정의 점수 (커스텀)
// P6: IP 동일 위치 과잉 (동일 IP 과다 시 -)
// P7: Behaviour 패널티 (GRAFT 과잉 등 -)
//
// graylist_threshold 미만 → 메시 제외 + 메시지 차단
// 예: Ethereum 2.0은 P3b에 -3000 적용 (무효 블록 전파)`;

export const scoringAnnotations = [
  { lines: [3, 3] as [number, number], color: 'sky' as const, note: '점수 공식 (8개 파라미터)' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: '긍정/부정 점수 항목' },
  { lines: [14, 15] as [number, number], color: 'amber' as const, note: 'graylist + 실전 적용' },
];
