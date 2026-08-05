import { useState } from 'react';

type ScenarioId = 'tty-empty' | 'pipe' | 'prompt-flag' | 'slash' | 'ctrl-c' | 'init-fresh' | 'init-again';

const scenarios = [
  { id: 'tty-empty', label: 'TTY · no args' },
  { id: 'pipe', label: 'pipe prompt' },
  { id: 'prompt-flag', label: '-p prompt' },
  { id: 'slash', label: '/model opus' },
  { id: 'ctrl-c', label: 'Ctrl-C' },
  { id: 'init-fresh', label: 'fresh init' },
  { id: 'init-again', label: 'init 재실행' },
] as const;

const results: Record<ScenarioId, {
  boundary: string;
  parser: string;
  result: string;
  next: string;
  note: string;
}> = {
  'tty-empty': {
    boundary: 'process launch',
    parser: 'parse_args([])',
    result: 'CliAction::Repl',
    next: 'LineEditor::read_line()',
    note: 'stdin이 terminal이고 positional input이 없을 때 interactive loop를 연다.',
  },
  pipe: {
    boundary: 'process launch',
    parser: 'parse_args([]) + stdin read_to_string',
    result: 'CliAction::Prompt',
    next: 'one-shot prompt dispatch',
    note: 'non-TTY stdin의 non-empty 전체 text를 prompt로 사용한다.',
  },
  'prompt-flag': {
    boundary: 'process launch',
    parser: 'parse_args(["-p", ...])',
    result: 'CliAction::Prompt',
    next: '뒤 token 전체를 join',
    note: '-p 뒤가 비면 즉시 error, 있으면 나머지를 prompt로 합쳐 조기 반환한다.',
  },
  slash: {
    boundary: 'REPL submitted line',
    parser: 'SlashCommand::parse("/model opus")',
    result: 'SlashCommand::Model { model: Some("opus") }',
    next: 'handle_repl_command() match',
    note: 'launch parser가 아니라 commands crate의 enum parser를 통과한다.',
  },
  'ctrl-c': {
    boundary: 'interactive line edit',
    parser: 'rustyline ReadlineError::Interrupted',
    result: 'buffer 있음 → Cancel · 비어 있음 → Exit',
    next: '현재 line reset',
    note: '같은 key도 입력 중인 text 유무에 따라 REPL을 유지하거나 종료한다.',
  },
  'init-fresh': {
    boundary: 'repository state',
    parser: 'initialize_repo(cwd)',
    result: '.claw.json → defaultMode=dontAsk',
    next: 'config projection → DangerFullAccess',
    note: 'starter 생성 성공과 최소 권한 보장은 다른 계약이다. 생성 직후 permission 검토가 필요하다.',
  },
  'init-again': {
    boundary: 'repository state',
    parser: 'initialize_repo(cwd)',
    result: 'dir/file → Skipped · missing ignore line → Updated',
    next: 'InitReport artifact status',
    note: '성공한 재실행은 수렴하지만 첫 실행 중간 실패를 rollback하는 transaction은 아니다.',
  },
};

export default function CliContractViz() {
  const [scenario, setScenario] = useState<ScenarioId>('tty-empty');
  const result = results[scenario];

  return (
    <div data-cli-contract-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">CLI BOUNDARY LAB</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="CLI 입력 시나리오">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenario === item.id}
              onClick={() => setScenario(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                scenario === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div data-cli-result={scenario} className="grid gap-px bg-border sm:grid-cols-2">
        {[
          ['boundary', result.boundary],
          ['parser', result.parser],
          ['result', result.result],
          ['next', result.next],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 bg-background p-4">
            <p className="font-mono text-[9px] font-bold uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 break-words text-xs font-bold leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">{result.note}</p>
    </div>
  );
}
