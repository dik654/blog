export const GATEWAY_STEPS = [
  { label: 'Gateway 개요' }, { label: '경로 해석' },
  { label: '블록 검색' }, { label: '응답 생성' },
];

export const GATEWAY_TYPES = [
  { name: 'Path-based', url: 'gateway.example.com/ipfs/Qm...', desc: '전통적 방식, CORS 제한 존재' },
  { name: 'Subdomain', url: 'Qm....ipfs.gateway.example.com', desc: '오리진 격리, 보안 향상' },
  { name: 'Trustless', url: 'CAR 파일 형식 응답', desc: '클라이언트 측 검증, 게이트웨이 신뢰 불필요' },
];

export const GATEWAY_CODE = `// Gateway 핸들러 등록
func GatewayOption(paths ...string) ServeOption {
  return func(n *core.IpfsNode, _ net.Listener,
    mux *http.ServeMux) (*http.ServeMux, error) {
    config, headers, _ := getGatewayConfig(n)
    backend, _ := newGatewayBackend(n)
    handler := gateway.NewHandler(config, backend)
    handler = gateway.NewHeaders(headers).
      ApplyCors().Wrap(handler)
    handler = otelhttp.NewHandler(handler, "Gateway")
    for _, p := range paths {
      mux.Handle(p+"/", handler) // /ipfs/, /ipns/
    }
    return mux, nil
  }
}`;

export const GATEWAY_ANNOTATIONS = [
  { lines: [5, 6] as [number, number], color: 'sky' as const, note: '설정 & 백엔드 생성' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'CORS & 헤더 래핑' },
  { lines: [10, 10] as [number, number], color: 'amber' as const, note: 'OpenTelemetry 추적' },
];
