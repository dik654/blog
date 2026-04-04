import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 벤더 라이브러리 분할
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts';
            if (id.includes('mafs')) return 'vendor-mafs';
            if (id.includes('react-dom')) return 'vendor-react';
            if (id.includes('react')) return 'vendor-react';
          }
          // node-architecture codebase 소스파일 CL/EL 분리
          if (id.includes('codebase/lighthouse')) return 'codebase-cl';
          if (id.includes('codebase/reth')) return 'codebase-el';
          // halo2 codebase 소스파일
          if (id.includes('codebase/halo2_proofs')) return 'codebase-halo2';
          // claude-code codebase 소스파일
          if (id.includes('codebase/claude-code')) return 'codebase-claude-code';
          // vllm codebase 소스파일
          if (id.includes('codebase/vllm')) return 'codebase-vllm';
          // cometbft codebase 소스파일
          if (id.includes('codebase/cometbft')) return 'codebase-cometbft';
          // jolt codebase 소스파일
          if (id.includes('codebase/jolt')) return 'codebase-jolt';
          // nova codebase 소스파일
          if (id.includes('codebase/nova')) return 'codebase-nova';
          // walrus codebase 소스파일
          if (id.includes('codebase/walrus-core')) return 'codebase-walrus';
          // rust-fil-proofs codebase 소스파일
          if (id.includes('codebase/rust-fil-proofs')) return 'codebase-fil-proofs';
          // zkevm-circuits codebase 소스파일
          if (id.includes('codebase/zkevm-circuits')) return 'codebase-zkevm';
          // bulletproofs codebase 소스파일
          if (id.includes('codebase/bulletproofs')) return 'codebase-bulletproofs';
          // irys codebase 소스파일
          if (id.includes('codebase/irys')) return 'codebase-irys';
          // plonky3 codebase 소스파일
          if (id.includes('codebase/plonky3')) return 'codebase-plonky3';
          // sui consensus codebase 소스파일
          if (id.includes('codebase/sui')) return 'codebase-sui';
          // beacon-kit codebase 소스파일
          if (id.includes('codebase/beacon-kit')) return 'codebase-beacon-kit';
          // openclaw codebase 소스파일
          if (id.includes('codebase/openclaw')) return 'codebase-openclaw';
          // lotus codebase 소스파일
          if (id.includes('codebase/lotus')) return 'codebase-lotus';
          // bellperson codebase 소스파일
          if (id.includes('codebase/bellperson')) return 'codebase-bellperson';
          // go-ethereum codebase 소스파일
          if (id.includes('codebase/go-ethereum')) return 'codebase-geth';
          // tss-lib codebase 소스파일 (MPC)
          if (id.includes('codebase/tss-lib')) return 'codebase-tss';
          // oasis-core codebase 소스파일 (TEE)
          if (id.includes('codebase/oasis-core')) return 'codebase-oasis';
          if (id.includes('node-architecture/archFlowData')) return 'data-eth-flow';
          if (id.includes('node-architecture/archCodeRefs')) return 'data-eth-coderefs';
        },
      },
    },
  },
})
