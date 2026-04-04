export const ROUTING_STEPS = [
  { label: 'Content Routing 개요' }, { label: 'DHT 라우팅' },
  { label: 'HTTP 라우팅' }, { label: '병렬 라우터' },
];

export const ROUTER_TABLE = [
  { type: 'Pubsub Router', priority: 100, desc: 'IPNS 레코드 실시간 전파' },
  { type: 'DHT Router', priority: 1000, desc: '기본 분산 라우팅' },
  { type: 'HTTP Router', priority: '다양', desc: '빠른 중앙화 검색 (IPNI)' },
  { type: 'Offline Router', priority: 10000, desc: '오프라인 모드용 로컬 캐시' },
];

export const ROUTING_CODE = `// 병렬 라우터 구조 - 우선순위별 정렬
func Routing(in p2pOnlineRoutingIn) irouting.ProvideManyRouter {
  routers := in.Routers
  sort.SliceStable(routers, func(i, j int) bool {
    return routers[i].Priority < routers[j].Priority
  })
  var cRouters []*routinghelpers.ParallelRouter
  for _, v := range routers {
    cRouters = append(cRouters, &routinghelpers.ParallelRouter{
      IgnoreError: true,
      Router:      v.Routing,
    })
  }
  return routinghelpers.NewComposableParallel(cRouters)
}`;

export const ROUTING_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '우선순위 기반 정렬' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: '병렬 라우터 래핑' },
  { lines: [13, 13] as [number, number], color: 'amber' as const, note: '합성 병렬 라우터 생성' },
];
