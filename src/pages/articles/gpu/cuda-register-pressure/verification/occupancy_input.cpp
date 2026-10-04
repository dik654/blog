#include <iostream>
#include <cassert>
#include "cuda_occupancy.h"
// Authored CPU-only example. Requires installed CUDA13.0.96 cuda_occupancy.h.
// All device properties below are supplied inputs, not hardware queries.
int main(){
 cudaOccDeviceProp p; p.computeMajor=7;p.computeMinor=0;p.maxThreadsPerBlock=1024;p.maxThreadsPerMultiprocessor=2048;p.regsPerBlock=65536;p.regsPerMultiprocessor=65536;p.warpSize=32;p.sharedMemPerBlock=49152;p.sharedMemPerMultiprocessor=98304;p.numSms=4;p.sharedMemPerBlockOptin=98304;p.reservedSharedMemPerBlock=0;
 cudaOccDeviceState state;cudaOccFuncAttributes a;a.maxThreadsPerBlock=1024;
 for(auto row: {std::pair<int,int>{37,128},{37,320},{96,256},{64,256},{128,256},{255,1024}}){a.numRegs=row.first;cudaOccResult r;auto e=cudaOccMaxActiveBlocksPerMultiprocessor(&r,&p,&a,&state,row.second,0);assert(e==CUDA_OCC_SUCCESS);
 int expected=row.first==37?(row.second==128?12:4):row.first==64?4:row.first==255?0:2;
 assert(r.activeBlocksPerMultiprocessor==expected);
 std::cout<<row.first<<" "<<row.second<<" error="<<e<<" blocks="<<r.activeBlocksPerMultiprocessor<<" regs="<<r.allocatedRegistersPerBlock<<" occupancy="<<100.0*r.activeBlocksPerMultiprocessor*(row.second/32)/64<<"%\n";}
}
