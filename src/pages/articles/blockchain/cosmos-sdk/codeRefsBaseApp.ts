import type { CodeRef } from './codeRefsTypes';

export const baseAppCodeRefs: Record<string, CodeRef> = {
  'baseapp-struct': {
    path: 'baseapp/baseapp.go',
    lang: 'go',
    highlight: [1, 26],
    desc: `BaseApp은 Cosmos SDK의 핵심 구조체로, CometBFT ABCI를 구현합니다.
트랜잭션 디코딩, 메시지 라우팅, 상태 관리, AnteHandler 등을 통합합니다.`,
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'logger + name + db — 기본 인프라' },
      { lines: [5, 5], color: 'emerald', note: 'CommitMultiStore — IAVL 기반 모듈별 상태 트리' },
      { lines: [8, 9], color: 'amber', note: 'MsgServiceRouter — Msg → 모듈 핸들러 라우팅' },
      { lines: [13, 15], color: 'violet', note: 'mempool + AnteHandler — TX 검증 파이프라인' },
      { lines: [22, 22], color: 'rose', note: 'stateManager — Check/Finalize 모드별 상태 분리' },
    ],
    code: `type BaseApp struct {
	logger            log.Logger
	name              string
	db                dbm.DB
	cms               storetypes.CommitMultiStore
	qms               storetypes.MultiStore
	storeLoader       StoreLoader
	grpcQueryRouter   *GRPCQueryRouter
	msgServiceRouter  *MsgServiceRouter
	interfaceRegistry codectypes.InterfaceRegistry
	txDecoder         sdk.TxDecoder
	txEncoder         sdk.TxEncoder
	mempool           mempool.Mempool
	anteHandler       sdk.AnteHandler
	postHandler       sdk.PostHandler
	abciHandlers      sdk.ABCIHandlers
	snapshotManager   *snapshots.Manager
	interBlockCache   storetypes.MultiStorePersistentCache
	paramStore        ParamStore
	gasConfig         config.GasConfig
	chainID           string
	stateManager      *state.Manager
	optimisticExec    *oe.OptimisticExecution
	txRunner          sdk.TxRunner
}`,
  },

  'baseapp-new': {
    path: 'baseapp/baseapp.go',
    lang: 'go',
    highlight: [1, 18],
    desc: `NewBaseApp은 BaseApp을 생성합니다. 옵션 패턴으로 설정을 주입합니다.`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: '시그니처 — name, logger, DB, txDecoder + 가변 옵션' },
      { lines: [5, 12], color: 'emerald', note: '기본 설정 — CommitMultiStore, 라우터 초기화' },
      { lines: [14, 18], color: 'amber', note: '옵션 적용 + 기본 mempool 설정' },
    ],
    code: `func NewBaseApp(
	name string, logger log.Logger, db dbm.DB,
	txDecoder sdk.TxDecoder, options ...func(*BaseApp),
) *BaseApp {
	app := &BaseApp{
		logger:          logger.With(log.ModuleKey, "baseapp"),
		name:            name,
		db:              db,
		cms:             store.NewCommitMultiStore(db, logger),
		grpcQueryRouter: NewGRPCQueryRouter(),
		msgServiceRouter: NewMsgServiceRouter(),
		txDecoder:       txDecoder,
	}
	for _, option := range options {
		option(app)
	}
	if app.mempool == nil {
		app.SetMempool(mempool.NoOpMempool{})
	}
	// ...
}`,
  },
};
