import type { Annotation } from '@/components/ui/code-panel';

export const networkCode = `#[derive(Clone, Serialize)]
pub enum Network {
    Mainnet,
    Sepolia,
    Holesky,
}`;

export const networkAnnotations: Annotation[] = [
  { lines: [1, 1], color: 'sky', note: 'Clone + Serde' },
  { lines: [3, 5], color: 'emerald', note: '3개 네트워크' },
];

export const builderCode = `pub struct ClientBuilder {
    network: Network,
    consensus_rpc: Option<String>,
    execution_rpc: Option<String>,
    checkpoint: Option<B256>,
    data_dir: Option<PathBuf>,
    fallback_rpcs: Vec<String>,
}

impl ClientBuilder {
    pub fn new() -> Self { .. }
    pub fn network(
        mut self, n: Network,
    ) -> Self { self.network = n; self }
    pub fn build(self)
        -> Result<Client> { .. }
}`;

export const builderAnnotations: Annotation[] = [
  { lines: [1, 8], color: 'sky', note: 'Builder 필드' },
  { lines: [10, 11], color: 'emerald', note: '생성자' },
  { lines: [12, 14], color: 'amber', note: '체이닝 메서드' },
  { lines: [15, 16], color: 'violet', note: '최종 빌드' },
];
