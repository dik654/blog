// beacon-chain/rpc/service.go — Start + registerServices (prysm v5.x)

// Start initializes the gRPC server and REST gateway.
// gRPC 서버를 시작하고 Beacon API 서비스들을 등록한다.
func (s *Service) Start() {
	address := fmt.Sprintf("%s:%d", s.cfg.Host, s.cfg.Port)
	lis, err := net.Listen("tcp", address)
	if err != nil {
		log.WithError(err).Fatal("Could not listen")
	}
	// gRPC 서버 옵션: 인터셉터, 최대 메시지 크기
	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(s.unaryInterceptor),
		grpc.StreamInterceptor(s.streamInterceptor),
		grpc.MaxRecvMsgSize(s.cfg.MaxMsgSize),
	}
	s.grpcServer = grpc.NewServer(opts...)
	// 각 도메인별 gRPC 서비스 등록
	s.registerServices()
	// gRPC-gateway: HTTP REST → gRPC 자동 변환
	if s.cfg.EnableHTTPApi {
		go s.startHTTPServer(address)
	}
	// gRPC 서버 시작
	go func() {
		if err := s.grpcServer.Serve(lis); err != nil {
			log.WithError(err).Error("gRPC server failed")
		}
	}()
}

// registerServices registers all gRPC service implementations.
// 비콘 체인, 검증자, 노드, 디버그 등 도메인별 핸들러 등록
func (s *Service) registerServices() {
	ethpb.RegisterBeaconChainServer(s.grpcServer, s.beaconChainServer)
	ethpb.RegisterNodeServer(s.grpcServer, s.nodeServer)
	ethpb.RegisterValidatorServer(s.grpcServer, s.validatorServer)
	ethpb.RegisterBeaconDebugServer(s.grpcServer, s.debugServer)
	// 헬스체크 서비스
	grpc_health.RegisterHealthServer(s.grpcServer, s.healthServer)
}
