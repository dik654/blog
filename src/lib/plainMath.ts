const SUBSCRIPT: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
};

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  i: 'ⁱ', n: 'ⁿ', t: 'ᵗ', x: 'ˣ', T: 'ᵀ',
};

const COMMANDS: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ϵ', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ',
  iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
  upsilon: 'υ', phi: 'φ', varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  nabla: '∇', partial: '∂', sum: '∑', prod: '∏', int: '∫', infty: '∞', ell: 'ℓ',
  cdot: '·', times: '×', pm: '±', mp: '∓', div: '÷',
  to: '→', rightarrow: '→', leftarrow: '←', leftrightarrow: '↔', mapsto: '↦',
  le: '≤', leq: '≤', ge: '≥', geq: '≥', neq: '≠', approx: '≈', sim: '∼', propto: '∝',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', superset: '⊃', supseteq: '⊇',
  emptyset: '∅', forall: '∀', exists: '∃', neg: '¬', land: '∧', lor: '∨',
};

function scripted(value: string, table: Record<string, string>, fallback: string): string {
  const converted = Array.from(value).map((char) => table[char] ?? '').join('');
  if (converted.length === value.length) return converted;
  return fallback === '_' ? `₍${value}₎` : `^(${value})`;
}

export function formatPlainMath(source: string): string {
  return source
    .replace(/\$+/g, '')
    .replace(/\\hat\{?\\epsilon\}?/g, 'ε̂')
    .replace(/\\hat\{([^{}]+)\}/g, '$1̂')
    .replace(/\\(?:bar|overline)\{([^{}]+)\}/g, '$1̄')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{C\}/g, 'ℂ')
    .replace(/\\mathbb\{N\}/g, 'ℕ')
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\mathbb\{F\}/g, '𝔽')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\(?:mathrm|mathbf|text|operatorname)\{([^{}]+)\}/g, '$1')
    .replace(/\\(?:left|right)(?=[()[\]{}|])/g, '')
    .replace(/\\([A-Za-z]+)/g, (match, command: string) => COMMANDS[command] ?? match)
    .replace(/_\{([^{}]+)\}/g, (_, value: string) => scripted(value, SUBSCRIPT, '_'))
    .replace(/_([A-Za-z0-9+\-=()α-ωΑ-Ω]+)/g, (_, value: string) => scripted(value, SUBSCRIPT, '_'))
    .replace(/\^\{([^{}]+)\}/g, (_, value: string) => scripted(value, SUPERSCRIPT, '^'))
    .replace(/\^([A-Za-z0-9+\-=()]+)/g, (_, value: string) => scripted(value, SUPERSCRIPT, '^'))
    .replace(/[{}]/g, '');
}
