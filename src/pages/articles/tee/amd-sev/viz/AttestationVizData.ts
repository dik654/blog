export type Step = 0 | 1 | 2 | 3 | 4 | 5;

export const steps = [
  {
    label: 'Nonce 생성',
    actor: 'Verifier',
    desc: 'Verifier가 64바이트 랜덤 nonce를 생성합니다. 재전송 공격(replay attack)을 방지하는 챌린지 역할을 합니다.',
    arrow: 'verifier→guest',
  },
  {
    label: 'Attestation Report 요청',
    actor: 'Guest VM',
    desc: 'Guest VM이 PSP에 nonce를 포함한 증명 보고서를 요청합니다 (VMGEXIT 명령).',
    arrow: 'guest→psp',
  },
  {
    label: 'Report 서명',
    actor: 'PSP',
    desc: 'PSP가 측정값(measurement), report_data(nonce), chip_id 등을 포함한 보고서를 VCEK 개인키로 ECDSA-P384 서명합니다.',
    arrow: 'psp→guest',
  },
  {
    label: 'Report 전달',
    actor: 'Guest VM',
    desc: 'Guest VM이 서명된 보고서와 VCEK 인증서를 Verifier에게 전달합니다.',
    arrow: 'guest→verifier',
  },
  {
    label: 'VCEK 체인 검증',
    actor: 'Verifier',
    desc: 'Verifier가 AMD KDS에서 VCEK 인증서를 받아 ARK→ASK→VCEK 체인을 검증합니다.',
    arrow: 'verifier→kds',
  },
  {
    label: '필드 검증',
    actor: 'Verifier',
    desc: 'measurement == expected_hash, report_data == nonce, debug_disabled == true 등 핵심 필드를 최종 확인합니다.',
    arrow: 'verifier',
  },
];

export const actorColor: Record<string, string> = {
  'Verifier': 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
  'Guest VM': 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  'PSP': 'bg-amber-500/20 border-amber-500/40 text-amber-400',
};

export const SVG_ACTORS = [
  { x: 60, label: 'Verifier', color: '#6366f1' },
  { x: 220, label: 'Guest VM', color: '#10b981' },
  { x: 380, label: 'PSP', color: '#f59e0b' },
  { x: 500, label: 'AMD KDS', color: '#8b5cf6' },
];

export const ARROW_MARKERS = [
  ['arr-i', '#6366f1'], ['arr-e', '#10b981'], ['arr-a', '#f59e0b'],
  ['arr-e2', '#10b981'], ['arr-p', '#8b5cf6'], ['arr-p2', '#8b5cf6'],
];
