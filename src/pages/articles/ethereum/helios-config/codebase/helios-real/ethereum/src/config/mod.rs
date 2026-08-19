// a16z/helios 저장소 · ethereum/src/config/mod.rs (main branch, commit
// 43a8c9f, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 146줄 중 Config
// struct와 from_file()만 발췌했습니다. to_base_config() 변환과 나머지
// field 목록은 생략했습니다.
// 본문 대응: overview section의 "Pinned source의 BaseConfig → TOML → CLI
// merge 순서" — network default 8,545, TOML 9,545, CLI 10,545 중 최종값이
// CLI로 정해지는 실제 우선순위.

#[derive(Deserialize, Debug)]
pub struct Config {
    pub consensus_rpc: Url,
    pub execution_rpc: Option<Url>,
    pub verifiable_api: Option<Url>,
    pub rpc_bind_ip: Option<IpAddr>,
    pub rpc_port: Option<u16>,
    pub default_checkpoint: B256,
    pub checkpoint: Option<B256>,
    pub data_dir: Option<PathBuf>,
    pub chain: ChainConfig,
    pub forks: Forks,
    pub execution_forks: ForkSchedule,
    pub max_checkpoint_age: u64,
    pub fallback: Option<Url>,
    pub load_external_fallback: bool,
    pub strict_checkpoint_age: bool,
    pub database_type: Option<String>,
}

impl Config {
    pub fn from_file(config_path: &PathBuf, network: &str, cli_config: &CliConfig) -> Self {
        // article의 BaseConfig — network preset(mainnet/sepolia/...)의
        // default 값에서 시작
        let base_config = Network::from_str(network)
            .map(|n| n.to_base_config())
            .unwrap_or(BaseConfig::default());

        let base_provider = Serialized::from(base_config, network);
        // article의 TOML — helios.toml 파일 provider
        let toml_provider = Toml::file(config_path).nested();
        // article의 CLI — command line argument provider
        let cli_provider = cli_config.as_provider(network);

        // article의 "BaseConfig → TOML → CLI merge 순서" — Figment가 이
        // 순서대로 merge하며, 뒤에 merge된 provider가 앞선 값을 덮어쓴다.
        // rpc_port 예시라면 base의 8,545를 toml의 9,545가 덮고, 마지막
        // cli_provider의 10,545가 최종값이 된다.
        let config_res = Figment::new()
            .merge(base_provider)
            .merge(toml_provider)
            .merge(cli_provider)
            .select(network)
            .extract();

        match config_res {
            Ok(config) => config,
            Err(err) => {
                match err.kind {
                    figment::error::Kind::MissingField(field) => {
                        let field = field.replace('_', "-");
                        println!("\x1b[91merror\x1b[0m: missing configuration field: {field}");
                        println!("\n\ttry supplying the proper command line argument: --{field}");
                        println!("\talternatively, you can add the field to your helios.toml file");
                        println!("\nfor more information, check the github README");
                    }
                    _ => println!("cannot parse configuration: {err}"),
                }
                exit(1);
            }
        }
    }
}
