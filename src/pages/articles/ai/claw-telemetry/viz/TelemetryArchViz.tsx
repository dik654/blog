import { useMemo, useState } from 'react';
import {
  CircleAlert,
  Database,
  FileText,
  ListOrdered,
  RotateCcw,
  Send,
} from 'lucide-react';

type EventKey = 'trace' | 'http' | 'analytics' | 'duplicate-tool';
type SinkKey = 'memory' | 'jsonl';
type JsonlOutcome = 'success' | 'write-fail' | 'flush-fail';

type SinkRecord = {
  label: string;
  sequence?: number;
};

const eventCases = {
  trace: {
    label: 'Direct trace',
    traceName: 'turn_started',
    typedEnvelope: null,
    pairingWarning: null,
  },
  http: {
    label: 'HTTP started',
    traceName: 'http_request_started',
    typedEnvelope: 'HttpRequestStarted',
    pairingWarning: null,
  },
  analytics: {
    label: 'Analytics',
    traceName: 'analytics',
    typedEnvelope: 'Analytics',
    pairingWarning: null,
  },
  'duplicate-tool': {
    label: '동일 도구 호출',
    traceName: 'tool_call_started(iteration=3, name=read_file)',
    typedEnvelope: null,
    pairingWarning: '같은 iteration에서 read_file을 두 번 호출하면 이름과 iteration만으로 각 started·finished를 짝지을 수 없다. production에는 호출마다 고유 operation id가 필요하다.',
  },
} as const;

const fieldClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground';

export default function TelemetryArchViz() {
  const [instrumented, setInstrumented] = useState(true);
  const [eventKey, setEventKey] = useState<EventKey>('http');
  const [sinkKey, setSinkKey] = useState<SinkKey>('jsonl');
  const [jsonlOutcome, setJsonlOutcome] = useState<JsonlOutcome>('success');
  const [records, setRecords] = useState<SinkRecord[]>([]);
  const [nextSequence, setNextSequence] = useState(0);
  const [lastAction, setLastAction] = useState('아직 record하지 않음');
  const selected = eventCases[eventKey];

  const durableLabel = useMemo(() => {
    if (sinkKey === 'memory') return `${records.length}개 Vec entry`;
    if (records.length === 0) return '0개 JSONL line';
    if (jsonlOutcome === 'success') return `${records.length}개 append + flush 완료`;
    if (jsonlOutcome === 'write-fail') return '0개로 간주 · 오류는 호출자에게 반환되지 않음';
    return '확인 불가 · buffer write 뒤 flush 실패를 호출자가 모름';
  }, [jsonlOutcome, records.length, sinkKey]);
  const confirmedStoredLabel = useMemo(() => {
    if (sinkKey === 'memory') return `${records.length}개 memory entry 확인`;
    if (jsonlOutcome === 'success') return `${records.length}개 JSONL line 확인`;
    if (jsonlOutcome === 'write-fail') return '0개 확인';
    return 'UNKNOWN · flush receipt 없음';
  }, [jsonlOutcome, records.length, sinkKey]);

  const record = () => {
    if (!instrumented) {
      setLastAction('session_tracer가 None이므로 runtime record helper가 즉시 return');
      return;
    }

    const emitted: SinkRecord[] = [];
    if (selected.typedEnvelope) {
      emitted.push({ label: selected.typedEnvelope });
    }
    emitted.push({
      label: `SessionTrace(${selected.traceName})`,
      sequence: nextSequence,
    });

    setRecords((current) => [...current, ...emitted]);
    setNextSequence((current) => current + 1);

    if (sinkKey === 'memory') {
      setLastAction(`${emitted.length}회 동기 record · Mutex<Vec<_>>에 push · producer 정상 반환`);
      return;
    }
    if (jsonlOutcome === 'success') {
      setLastAction(`${emitted.length}회 동기 record · 각 event를 writeln + flush · producer 정상 반환`);
      return;
    }
    if (jsonlOutcome === 'write-fail') {
      setLastAction(`${emitted.length}회 record 시도 · writeln 오류 무시 · producer는 실패를 모른 채 정상 반환`);
      return;
    }
    setLastAction(`${emitted.length}회 record 시도 · flush 오류 무시 · 내구성은 알 수 없지만 producer 정상 반환`);
  };

  const reset = () => {
    setRecords([]);
    setNextSequence(0);
    setLastAction('아직 record하지 않음');
  };

  return (
    <div
      data-telemetry-pipeline-lab
      data-viz-canvas
      className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border bg-muted/25 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <ListOrdered className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold">helper 한 번이 만든 sink record와 sequence를 추적한다</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              sequence는 모든 event의 번호가 아니라 <code>SessionTraceRecord</code>에만 붙는다.
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="telemetry-input-heading">
          <div className="flex items-center justify-between gap-3">
            <h4 id="telemetry-input-heading" className="text-xs font-bold uppercase text-muted-foreground">
              1. producer 설정
            </h4>
            <button
              type="button"
              onClick={reset}
              aria-label="telemetry 실험 초기화"
              title="초기화"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 text-sm">
            <input
              type="checkbox"
              checked={instrumented}
              onChange={(event) => {
                setInstrumented(event.target.checked);
                reset();
              }}
            />
            <span>
              <strong className="block text-xs">with_session_tracer</strong>
              <span className="text-xs text-muted-foreground">{instrumented ? 'opt-in 활성' : 'tracer None'}</span>
            </span>
          </label>

          <div role="group" aria-label="telemetry event 종류" className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {(Object.entries(eventCases) as Array<[EventKey, typeof eventCases[EventKey]]>).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setEventKey(key);
                  setLastAction('아직 record하지 않음');
                }}
                aria-pressed={eventKey === key}
                className={`min-h-11 min-w-0 bg-background px-2 py-3 text-xs font-bold ${
                  eventKey === key ? 'bg-foreground text-background' : 'hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {selected.pairingWarning && (
            <div className="mt-4 border border-amber-600/30 bg-amber-500/[0.05] p-3 text-xs leading-5">
              <strong className="block">현재 schema의 pairing 한계</strong>
              <p className="mt-1 text-muted-foreground">{selected.pairingWarning}</p>
            </div>
          )}

          <div role="group" aria-label="telemetry sink" className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            <button
              type="button"
              onClick={() => {
                setSinkKey('memory');
                reset();
              }}
              aria-pressed={sinkKey === 'memory'}
              className={`flex min-h-11 items-center justify-center gap-2 bg-background px-3 text-xs font-bold ${
                sinkKey === 'memory' ? 'bg-foreground text-background' : 'hover:bg-muted'
              }`}
            >
              <Database className="h-4 w-4" aria-hidden="true" />
              Memory
            </button>
            <button
              type="button"
              onClick={() => {
                setSinkKey('jsonl');
                reset();
              }}
              aria-pressed={sinkKey === 'jsonl'}
              className={`flex min-h-11 items-center justify-center gap-2 bg-background px-3 text-xs font-bold ${
                sinkKey === 'jsonl' ? 'bg-foreground text-background' : 'hover:bg-muted'
              }`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              JSONL
            </button>
          </div>

          <label className={`mt-4 grid gap-1.5 text-xs font-medium ${sinkKey === 'memory' ? 'opacity-40' : ''}`}>
            JSONL I/O outcome
            <select
              aria-label="JSONL I/O outcome"
              className={fieldClass}
              value={jsonlOutcome}
              disabled={sinkKey === 'memory'}
              onChange={(event) => {
                setJsonlOutcome(event.target.value as JsonlOutcome);
                reset();
              }}
            >
              <option value="success">writeln + flush 성공</option>
              <option value="write-fail">writeln 실패</option>
              <option value="flush-fail">flush 실패</option>
            </select>
          </label>

          <button
            type="button"
            onClick={record}
            className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-background"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            record
          </button>
        </section>

        <section className="min-w-0 bg-background p-4 sm:p-5" aria-labelledby="telemetry-result-heading">
          <h4 id="telemetry-result-heading" className="text-xs font-bold uppercase text-muted-foreground">
            2. sink call order
          </h4>
          <ol data-telemetry-records className="mt-4 min-h-44 space-y-2">
            {records.length > 0 ? records.map((recordItem, index) => (
              <li
                key={`${recordItem.label}-${index}`}
                className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-2.5"
              >
                <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                <code className="min-w-0 break-words text-xs [overflow-wrap:anywhere]">{recordItem.label}</code>
                <span className="text-xs font-bold text-muted-foreground">
                  {recordItem.sequence === undefined ? 'sequence 없음' : `seq ${recordItem.sequence}`}
                </span>
              </li>
            )) : (
              <li className="border-y border-border py-6 text-center text-sm text-muted-foreground">
                record를 실행하면 호출 순서가 나타난다.
              </li>
            )}
          </ol>

          <dl className="mt-5 divide-y divide-border border-y border-border">
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">sink call</dt>
              <dd className="text-xs font-bold">호출 시도 · {records.length}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">확인된 저장</dt>
              <dd className="text-xs font-bold">{confirmedStoredLabel}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">다음 trace sequence</dt>
              <dd data-telemetry-next-sequence className="font-mono text-xs font-bold">{nextSequence}</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-xs font-bold text-muted-foreground">durable evidence</dt>
              <dd data-telemetry-durability className="break-words text-xs leading-5 [overflow-wrap:anywhere]">{durableLabel}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="border-t border-border px-4 py-5 sm:px-5">
        <h4 className="text-xs font-bold uppercase text-muted-foreground">3. producer가 아는 것</h4>
        <p
          data-telemetry-action
          aria-live="polite"
          className="mt-3 break-words border-l-2 border-foreground bg-muted/20 px-3 py-3 text-sm leading-6 [overflow-wrap:anywhere]"
        >
          {lastAction}
        </p>
        <div className="mt-4 flex gap-3 border border-amber-600/30 bg-amber-500/[0.05] p-3 text-sm leading-6">
          <CircleAlert className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>핵심 경계:</strong> <code>TelemetrySink::record</code>는 결과를 반환하지 않는다.
            JSONL 오류를 무시해 agent 실행과 분리하는 대신, 호출자는 event 유실 여부를 알 수 없다.
          </p>
        </div>
      </section>
    </div>
  );
}
