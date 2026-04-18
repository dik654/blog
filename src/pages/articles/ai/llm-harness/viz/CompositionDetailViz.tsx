import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: '하네스 3대 요소 — System Prompt + Tools + Guardrails', body: '① System Prompt:\nRole ("senior software engineer") + Persona (tone, style)\nInstructions (what to do) + Constraints (what NOT to do)\nOutput format (how to respond)\n\n② Tools:\nAPI calls (search, DB), Code execution (Python, shell)\nFile operations (read, write), Custom functions\nLLM이 필요할 때 자동 호출 (function calling)\n\n③ Guardrails:\nInput: PII detection, prompt injection defense, length limits\nOutput: toxicity check, factuality, format validation, bias detection\n\nComposition: User → Input Guardrail → System+LLM+Tools → Output Guardrail → User\n\nModern: Claude Code (system+tools+hooks+guardrails+memory)\nOpenAI Assistants API (managed harness, built-in tools)\nDIY (full control, more work, better optimization)' },
];
const visuals = [
  { title: 'System + Tools + Guardrails', color: '#10b981', rows: [
    { label: 'System Prompt', value: 'Role + Persona + Instructions + Format' },
    { label: 'Tools', value: 'API, Code exec, File ops, Custom' },
    { label: 'Input Guard', value: 'PII, injection, length, policy' },
    { label: 'Output Guard', value: 'toxicity, factuality, format, bias' },
    { label: 'Flow', value: 'User → Guard → LLM+Tools → Guard → User' },
  ]},
];
export default function CompositionDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
