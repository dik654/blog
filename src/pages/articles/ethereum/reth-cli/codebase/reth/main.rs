// Reth v2.8.1 축약 발췌
// bin/reth/src/main.rs + crates/cli/commands/src/node.rs

fn main() {
    reth_cli_util::sigsegv_handler::install();

    // 1. 사용자가 입력한 CLI를 해석합니다.
    if let Err(err) = Cli::<EthereumChainSpecParser>::parse().run(
        async move |builder, _| {
            // 2. Ethereum 기본 부품을 형식이 있는 빌더에 연결합니다.
            let backfill = EthereumBackfill::new(builder.config());
            let handle = builder
                .node(EthereumNode::default())
                .launch_with_debug_capabilities_and_backfill(backfill)
                .await?;

            // 3. 노드가 끝날 때까지 실행 상태를 기다립니다.
            handle.wait_for_node_exit().await
        },
    ) {
        eprintln!("Error: {err:?}");
        std::process::exit(1);
    }
}

// NodeCommand::execute의 핵심 전달 경로입니다.
async fn execute(self, ctx: CliContext, launcher: impl Launcher) -> Result<()> {
    // 4. 입력을 NodeConfig로 정리하고 데이터베이스를 엽니다.
    let node_config = NodeConfig::new(self.chain).with_datadir(self.datadir);
    let database = init_db(db_path, self.db.database_args())?;

    // 5. 설정·저장소·실행 문맥을 조립한 뒤 실제 launcher에 넘깁니다.
    let builder = NodeBuilder::new(node_config)
        .with_database(database)
        .with_launch_context(ctx.task_executor);

    launcher.entrypoint(builder, self.ext).await
}
