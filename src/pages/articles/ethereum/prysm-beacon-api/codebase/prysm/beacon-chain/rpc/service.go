// Prysm v7.3.1 commit 96d418cd의 구조를 보존한 학습용 핵심 발췌입니다.
// REST endpoint 목록을 Go ServeMux에 직접 등록합니다.
endpoints := s.endpoints(
	s.cfg.EnableDebugRPCEndpoints,
	blocker,
	stater,
	rewardFetcher,
	validatorServer,
	coreService,
	ch,
)
for _, e := range endpoints {
	for i := range e.methods {
		s.cfg.Router.HandleFunc(
			fmt.Sprintf("%s %s", e.methods[i], e.template),
			e.handlerWithMiddleware(),
		)
	}
}

// gRPC service는 같은 process 안에 있지만 별도로 등록합니다.
ethpbv1alpha1.RegisterNodeServer(s.grpcServer, nodeServer)
ethpbv1alpha1.RegisterHealthServer(s.grpcServer, nodeServer)
ethpbv1alpha1.RegisterBeaconChainServer(s.grpcServer, beaconChainServer)
ethpbv1alpha1.RegisterBeaconNodeValidatorServer(s.grpcServer, validatorServer)
reflection.Register(s.grpcServer)
