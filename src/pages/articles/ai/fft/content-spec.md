# FFT article specification

## Reader contract

- Audience: AI readers who know arrays and sine waves but have not taken a full signal-processing course.
- Entry knowledge: basic trigonometry, vector dot-product intuition, sampled data.
- Exit capability: distinguish DFT from FFT, interpret complex bins, diagnose sampling artifacts, and decide when an FFT-based AI design is justified.

## Narrative spine

1. Mix two sine components and show the same signal in time and frequency coordinates.
2. Interpret DFT as projection onto rotating complex bases and preserve magnitude plus phase.
3. Compute the same DFT by even/odd reuse, butterfly combination, and logarithmic stages.
4. Put sampling before spectrum interpretation: Nyquist, aliasing, leakage, resolution, windowing, and STFT.
5. Separate FFT as a feature transform from FFT as convolution or operator acceleration.

## Visual rules

- The sine mixer is the central live visualization; both amplitude sliders must work at 0 and 1.
- SVG plot coordinates must remain inside the viewBox for the maximum summed amplitude.
- Algorithm decomposition uses responsive HTML groups rather than fixed-width butterfly labels.
- Every formula is KaTeX-rendered and split before it requires horizontal scrolling at 360px.
- Color distinguishes low-frequency, high-frequency, and neutral structure only.

## Accuracy boundaries

- FFT computes the DFT; it is not a different approximate transform.
- Modern libraries do not require every length to be a power of two.
- Zero-padding interpolates displayed bins but does not improve true frequency resolution.
- Magnitude-only processing is task-dependent; phase can be essential.
- Spectrograms are common audio inputs, not a requirement for every audio model.
- Complexity is not a hardware performance guarantee; benchmark actual shapes and kernels.
