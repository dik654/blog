// bin/reth/src/main.rs — Reth 노드 진입점

#[global_allocator]
static ALLOC: reth_cli_util::allocator::Allocator =
    reth_cli_util::allocator::new_allocator(); // jemalloc 기본

fn main() {
    reth_cli_util::sigsegv_handler::install(); // SIGSEGV 핸들러

    if let Err(err) = Cli::<EthereumChainSpecParser>::parse()
        .run(async move |builder, _| {
            // builder: WithLaunchContext<NodeBuilder<DB, ChainSpec>>
            let handle = builder
                .node(EthereumNode::default()) // types + components 한 번에
                .launch_with_debug_capabilities()
                .await?;

            handle.wait_for_node_exit().await // tokio 런타임 블록
        })
    {
        eprintln!("Error: {err:?}");
        std::process::exit(1);
    }
}
