// validator/client/runner.go (Prysm v5)

// RunClient — 검증자 클라이언트의 진입점.
// 비콘 노드 연결 → 키 로드 → 활성화 대기 → 메인 루프 시작.
func RunClient(ctx context.Context, cancel context.CancelFunc,
	opts *RunClientOptions,
) {
	// 1. gRPC로 비콘 노드에 연결
	conn, err := grpc.DialContext(ctx, opts.BeaconEndpoint,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.WithError(err).Fatal("Could not connect to beacon node")
	}

	// 2. 키매니저 초기화 (로컬 키 or 원격 서명자)
	km, err := opts.Wallet.KeyManager(ctx)
	if err != nil {
		log.WithError(err).Fatal("Could not init key manager")
	}

	// 3. 검증자 활성화 대기
	if err := v.WaitForActivation(ctx, km.FetchAllValidatingPublicKeys); err != nil {
		log.WithError(err).Fatal("Could not wait for activation")
	}

	// 4. 슬래싱 방지 DB 열기
	db := opts.SlashingProtectionDB

	// 5. 메인 루프 시작
	v.Run(ctx)
}
