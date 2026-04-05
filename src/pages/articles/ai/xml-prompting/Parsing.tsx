import ParsingViz from './viz/ParsingViz';

export default function Parsing() {
  return (
    <section id="parsing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">출력 파싱 &amp; 추출</h2>
      <div className="not-prose mb-8"><ParsingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML 출력 파싱 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// XML Output Parsing:

// Strategy 1: Regex extraction (simple):
// import re
//
// def extract_tag(text, tag):
//     pattern = f'<{tag}>(.*?)</{tag}>'
//     match = re.search(pattern, text, re.DOTALL)
//     return match.group(1) if match else None
//
// response = llm.complete(prompt)
// answer = extract_tag(response, 'answer')
// confidence = extract_tag(response, 'confidence')

// Strategy 2: XML parser (robust):
// from xml.etree import ElementTree as ET
//
// wrapped = f"<root>{response}</root>"
// tree = ET.fromstring(wrapped)
// answer = tree.find('answer').text

// Strategy 3: BeautifulSoup (permissive):
// from bs4 import BeautifulSoup
//
// soup = BeautifulSoup(response, 'xml')
// answer = soup.find('answer').text

// Strategy 4: lxml (fast):
// from lxml import etree
// tree = etree.fromstring(response)
// answer = tree.xpath('//answer/text()')[0]

// Error handling:
//
// Common issues:
// - Malformed XML (missing close tags)
// - Unescaped special chars (<, >, &)
// - Truncated response
// - Mixed content
//
// Solutions:
// 1. Try-except with fallback
// 2. Retry with stricter prompt
// 3. Use permissive parser (BeautifulSoup)
// 4. Regex as fallback

// Robust parser:
// def parse_response(response):
//     try:
//         # Primary: lxml
//         return lxml_parse(response)
//     except:
//         try:
//             # Fallback 1: BeautifulSoup
//             return bs4_parse(response)
//         except:
//             # Fallback 2: regex
//             return regex_parse(response)

// Validation:
// def validate_response(parsed):
//     required_fields = ['answer', 'confidence']
//     for field in required_fields:
//         if field not in parsed:
//             raise ValueError(f'Missing {field}')
//     return parsed

// Prompt engineering for parseability:
// - Tell LLM exactly what tags to use
// - Show example output format
// - Specify all required fields
// - Provide error recovery instructions

// Example prompt with format spec:
// <instructions>
// Respond ONLY in this format:
// <response>
//   <answer>your answer here</answer>
//   <confidence>low|medium|high</confidence>
//   <reasoning>brief explanation</reasoning>
// </response>
// Do not include any other text.
// </instructions>

// JSON alternative:
// Similar patterns but with JSON schema
// - simpler for programs
// - but XML often easier for LLMs

// Mixing XML + JSON:
// <response>
//   {"answer": "...", "confidence": 0.9}
// </response>
// - tags for sections
// - JSON for structured data

// Schema validation:
// - XSD (XML Schema)
// - Pydantic models
// - JSON Schema
// - custom validators

// Streaming parsing:
// - LLM produces tokens over time
// - partial XML as it arrives
// - SAX parser for streams
// - incremental parsing

// Production tools:
// - instructor (Pydantic + LLM)
// - guardrails-ai
// - langchain parsers
// - custom regex-based`}
        </pre>
        <p className="leading-7">
          Parsing: <strong>regex → xml.etree → BeautifulSoup → lxml</strong>.<br />
          robust parser: try 여러 방법 + fallback chain.<br />
          prompt에 explicit format spec이 parseability 핵심.
        </p>
      </div>
    </section>
  );
}
