/* Article verification wrapper. The KISS FFT sources are unmodified. */
#include "kiss/_kiss_fft_guts.h"
#include <assert.h>
static void dump(const char *label, const kiss_fft_cpx *a, int n) {
  printf("%s", label);
  for (int i=0;i<n;i++) printf(" [%g,%g]", (double)a[i].r, (double)a[i].i);
  puts("");
}
int main(void) {
  kiss_fft_cpx x[4]={{1,0},{2,0},{3,0},{4,0}}, X[4], inv[4];
  kiss_fft_cpx expected[4]={{10,0},{-2,2},{-2,0},{-2,-2}};
  kiss_fft_cfg f=kiss_fft_alloc(4,0,NULL,NULL), b=kiss_fft_alloc(4,1,NULL,NULL);
  assert(f&&b); printf("factor [%d,%d]; scalar_bytes %zu\n",f->factors[0],f->factors[1],sizeof(kiss_fft_scalar));
  kiss_fft(f,x,X); dump("forward",X,4);
  for(int i=0;i<4;i++){assert(fabs(X[i].r-expected[i].r)<1e-5);assert(fabs(X[i].i-expected[i].i)<1e-5);}
  kiss_fft(b,X,inv);dump("inverse_raw",inv,4);
  for(int i=0;i<4;i++){assert(fabs(inv[i].r/4-x[i].r)<1e-5);assert(fabs(inv[i].i)<1e-5);}
  kiss_fft(f,x,x);dump("alias_buffers",x,4);
  for(int i=0;i<4;i++){assert(fabs(x[i].r-X[i].r)<1e-5);assert(fabs(x[i].i-X[i].i)<1e-5);}
  kiss_fft_free(f);kiss_fft_free(b); puts("PASS: default float, radix4, inverse unscaled, identical input/output pointer supported via upstream temporary buffer.");
}
