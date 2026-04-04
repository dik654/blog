import type { CodeRef } from '@/components/code/types';

export const discoveryRefs: Record<string, CodeRef> = {
  'address-lookup': {
    path: 'iroh/iroh/src/address_lookup.rs',
    lang: 'rust',
    highlight: [1, 10],
    desc: 'AddressLookup은 EndpointId → 연결 가능 주소를 해석하는 핵심 트레이트입니다.\npublish()로 자신의 주소를 게시하고, resolve()로 상대방 주소를 조회합니다.\nDNS, mDNS, Pkarr DHT 등 다양한 구현이 동시에 동작합니다.',
    code: `pub trait AddressLookup: Debug + Send + Sync + 'static {
    /// EndpointData(주소 정보)를 외부에 게시
    /// fire-and-forget — 비동기 게시는 자체 태스크 생성
    fn publish(&self, _data: &EndpointData) {}

    /// EndpointId로 연결 정보 조회
    /// BoxStream으로 비동기 결과 반환 — 여러 결과 순차 도착
    fn resolve(
        &self, _endpoint_id: EndpointId,
    ) -> Option<BoxStream<Result<Item, Error>>> {
        None
    }
}

// AddressLookupBuilder: Endpoint 생성 시 빌더 패턴
pub trait AddressLookupBuilder: Send + Sync + Debug + 'static {
    fn into_address_lookup(
        self, endpoint: &Endpoint,
    ) -> Result<impl AddressLookup, AddressLookupBuilderError>;
}

// 여러 AddressLookup을 동시 실행하는 래퍼
pub struct ConcurrentAddressLookup {
    lookups: Vec<Box<dyn AddressLookup>>,
}
// resolve() 호출 시 모든 lookup에 동시 요청 → 가장 빠른 결과 사용`,
    annotations: [
      { lines: [2, 4] as [number, number], color: 'sky' as const, note: 'publish: 노드 주소 정보 게시' },
      { lines: [6, 12] as [number, number], color: 'emerald' as const, note: 'resolve: EndpointId → 주소 스트림' },
      { lines: [16, 20] as [number, number], color: 'amber' as const, note: 'Builder 패턴: Endpoint 생성 시 초기화' },
      { lines: [23, 26] as [number, number], color: 'violet' as const, note: 'ConcurrentAddressLookup: 동시 조회' },
    ],
  },
  'remote-map': {
    path: 'iroh/iroh/src/socket/remote_map.rs',
    lang: 'rust',
    highlight: [1, 8],
    desc: 'RemoteMap은 원격 피어별 연결 상태를 관리합니다.\nMappedAddrs로 EndpointId, Relay, Custom 주소를 QUIC가 사용하는\nIPv6 가상 주소 공간으로 매핑합니다.',
    code: `/// 모든 원격 엔드포인트의 상태를 관리하는 맵
pub(crate) struct RemoteMap {
    /// 가상 주소 매핑 테이블
    pub(crate) mapped_addrs: MappedAddrs,
    /// 각 RemoteStateActor의 inbox sender
    senders: ConcurrentReadMap<EndpointId, mpsc::Sender<RemoteStateMessage>>,
    /// 액터 생성/정리 상태
    tasks: Tasks,
}

#[derive(Clone, Debug, Default)]
pub(crate) struct MappedAddrs {
    /// EndpointId ↔ 가상 IPv6 주소
    pub endpoint_addrs: AddrMap<EndpointId, EndpointIdMappedAddr>,
    /// (RelayUrl, EndpointId) ↔ 가상 주소
    pub relay_addrs: AddrMap<(RelayUrl, EndpointId), RelayMappedAddr>,
    /// CustomAddr ↔ 가상 주소
    pub custom_addrs: AddrMap<CustomAddr, CustomMappedAddr>,
}`,
    annotations: [
      { lines: [2, 9] as [number, number], color: 'sky' as const, note: 'RemoteMap: 피어별 상태 + 가상 주소' },
      { lines: [12, 19] as [number, number], color: 'emerald' as const, note: 'MappedAddrs: 3종 주소 → IPv6 가상 주소 매핑' },
    ],
  },
};
