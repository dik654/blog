import type { CodeRef } from '@/components/code/types';

export const codeRefsConsensus: Record<string, CodeRef> = {
  'sui-narwhal-header': {
    path: 'narwhal/primary/src/primary.rs',
    code: `/// Narwhal Primary: DAG Header 생성
pub fn create_header(
    &self, round: Round,
    parents: Vec<CertificateDigest>,
    worker_batches: Vec<BatchDigest>,
) -> Header {
    Header {
        author: self.authority_id,
        round,
        parents,   // 이전 라운드 2f+1 Cert
        payload: worker_batches,
        ..Default::default()
    }
}`,
    lang: 'rust',
    highlight: [1, 14],
    desc: 'Narwhal: 라운드별 Header → DAG 구축.',
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'parents + batches' },
      { lines: [10, 11], color: 'emerald', note: '부모=2f+1 Certs' },
    ],
  },
  'sui-bullshark-commit': {
    path: 'narwhal/consensus/src/bullshark.rs',
    code: `/// Bullshark: 앵커 기반 순서 결정
pub fn try_commit(
    &mut self, leader_round: Round,
) -> Vec<CommittedSubDag> {
    let anchor = self.elect_leader(leader_round);
    if self.dag.has_enough_support(anchor, self.quorum) {
        let sub_dag = self.dag.order_sub_dag(anchor);
        self.committed.push(sub_dag);
    }
    self.committed.drain(..).collect()
}`,
    lang: 'rust',
    highlight: [1, 11],
    desc: 'Bullshark: 앵커 2f+1 참조 → BFS 순서 결정.',
    annotations: [
      { lines: [5, 5], color: 'sky', note: '앵커 선출' },
      { lines: [6, 8], color: 'emerald', note: '2f+1 → BFS 순서' },
    ],
  },
};
