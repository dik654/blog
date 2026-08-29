import katex from "katex";

const KATEX_TEXT_UNICODE_REPLACEMENTS: Readonly<Record<string, string>> = {
  Α: "Alpha",
  Β: "Beta",
  Γ: "Gamma",
  Δ: "Delta",
  Ε: "Epsilon",
  Ζ: "Zeta",
  Η: "Eta",
  Θ: "Theta",
  Ι: "Iota",
  Κ: "Kappa",
  Λ: "Lambda",
  Μ: "Mu",
  Ν: "Nu",
  Ξ: "Xi",
  Ο: "Omicron",
  Π: "Pi",
  Ρ: "Rho",
  Σ: "Sigma",
  Τ: "Tau",
  Υ: "Upsilon",
  Φ: "Phi",
  Χ: "Chi",
  Ψ: "Psi",
  Ω: "Omega",
  α: "alpha",
  β: "beta",
  γ: "gamma",
  δ: "delta",
  ε: "epsilon",
  ζ: "zeta",
  η: "eta",
  θ: "theta",
  ι: "iota",
  κ: "kappa",
  λ: "lambda",
  μ: "mu",
  // U+00B5 MICRO SIGN (visually near-identical to μ but a distinct codepoint,
  // typically typed as the unit prefix in "µs"/"µm") also lacks \text{} metrics.
  // Spelling it "mu" would misread as the letter name, so use the ASCII "u"
  // engineering convention for the micro- prefix instead ("48 µs" → "48 us").
  µ: "u",
  ν: "nu",
  ξ: "xi",
  ο: "omicron",
  π: "pi",
  ρ: "rho",
  σ: "sigma",
  ς: "sigma",
  τ: "tau",
  υ: "upsilon",
  φ: "phi",
  χ: "chi",
  ψ: "psi",
  ω: "omega",
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "₊": "+",
  "₋": "-",
  "₌": "=",
  "₍": "(",
  "₎": ")",
  ₐ: "a",
  ₑ: "e",
  ₒ: "o",
  ₓ: "x",
  ₔ: "schwa",
  ₕ: "h",
  ₖ: "k",
  ₗ: "l",
  ₘ: "m",
  ₙ: "n",
  ₚ: "p",
  ₛ: "s",
  ₜ: "t",
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "-",
  "⁼": "=",
  "⁽": "(",
  "⁾": ")",
  ⁱ: "i",
  ⁿ: "n",
  ᵀ: "T",
  ᵢ: "i",
  ⱼ: "j",
  ᵥ: "v",
  ᵧ: "y",
  ᵤ: "u",
  ʳ: "r",
  ˣ: "x",
  ʸ: "y",
  ᵏ: "k",
  ˢ: "s",
};

const KATEX_TEXT_UNICODE_PATTERN = new RegExp(
  Object.keys(KATEX_TEXT_UNICODE_REPLACEMENTS).join("|"),
  "gu",
);

function normalizeTextBody(body: string) {
  return body.replace(
    KATEX_TEXT_UNICODE_PATTERN,
    (character) => KATEX_TEXT_UNICODE_REPLACEMENTS[character] ?? character,
  );
}

function isEscaped(source: string, index: number) {
  let slashCount = 0;
  for (let position = index - 1; position >= 0; position -= 1) {
    if (source[position] !== "\\") break;
    slashCount += 1;
  }
  return slashCount % 2 === 1;
}

/**
 * KaTeX accepts Unicode math shorthand in math mode, but logs missing-metric
 * warnings when the same glyph appears inside `\\text{...}`. Keep math mode
 * untouched and transliterate only those text spans to stable, readable ASCII.
 */
function normalizeKatexTextUnicode(source: string) {
  const marker = "\\text{";
  let cursor = 0;
  let output = "";

  while (cursor < source.length) {
    const markerIndex = source.indexOf(marker, cursor);
    if (markerIndex === -1) {
      output += source.slice(cursor);
      break;
    }

    const bodyStart = markerIndex + marker.length;
    let depth = 1;
    let position = bodyStart;

    while (position < source.length && depth > 0) {
      const character = source[position];
      const escaped = isEscaped(source, position);

      if (!escaped && character === "{") depth += 1;
      if (!escaped && character === "}") depth -= 1;
      position += 1;
    }

    if (depth !== 0) {
      output += source.slice(cursor);
      break;
    }

    output += source.slice(cursor, bodyStart);
    output += normalizeTextBody(source.slice(bodyStart, position - 1));
    output += "}";
    cursor = position;
  }

  return output;
}

interface Props {
  /** LaTeX string */
  children: string | readonly string[];
  /** display mode (block) vs inline */
  display?: boolean;
  className?: string;
}

export default function Math({ children, display = false, className }: Props) {
  const source = typeof children === "string" ? children : children.join("");
  const html = katex.renderToString(normalizeKatexTextUnicode(source), {
    displayMode: display,
    throwOnError: false,
    // Operation annotations intentionally use Korean inside \text{...}.
    // KaTeX renders it with the surrounding text font; strict warnings would
    // otherwise turn every useful annotation into a browser-console warning.
    strict: "ignore",
  });
  if (display) {
    return (
      <div
        data-math-display="true"
        className={`not-prose my-3 max-w-full overflow-x-auto overflow-y-hidden px-1 py-4 text-center ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <span
      className={`not-prose inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
