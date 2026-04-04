import { useState } from 'react';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';

export default function PositionalEncodingChart() {
  const [dimension, setDimension] = useState(0);

  return (
    <div className="rounded-lg border p-6">
      <p className="text-sm text-foreground/75 mb-3">
        슬라이더로 차원(i)을 변경하면 주파수가 어떻게 변하는지 확인할 수 있습니다.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium">차원 i = {dimension}</label>
        <input
          type="range"
          min={0}
          max={10}
          value={dimension}
          onChange={(e) => setDimension(Number(e.target.value))}
          className="flex-1"
        />
      </div>
      <Mafs
        height={200}
        viewBox={{ x: [0, 6.3], y: [-1.2, 1.2], padding: 0 }}
      >
        <Coordinates.Cartesian
          xAxis={{ lines: Math.PI, labels: (v) => `${(v / Math.PI).toFixed(1)}π` }}
          yAxis={{ lines: 0.5 }}
        />
        <Plot.OfX
          y={(x) => Math.sin(x / Math.pow(10000, (2 * dimension) / 512))}
          color={Theme.blue}
        />
        <Plot.OfX
          y={(x) => Math.cos(x / Math.pow(10000, (2 * dimension) / 512))}
          color={Theme.pink}
        />
      </Mafs>
      <div className="flex justify-center gap-6 mt-3 text-xs text-foreground/75">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-blue-500 rounded" /> sin (짝수 차원)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-pink-500 rounded" /> cos (홀수 차원)
        </span>
      </div>
    </div>
  );
}
