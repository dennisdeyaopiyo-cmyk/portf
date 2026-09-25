// Re-export BinaryVortexCanvas as BinaryRainCanvas for backwards-compatibility
// The 3D rotating cylinder vortex replaces the vertical rain with dynamic changing 0s and 1s,
// ease rotation, and the "FULL-STACK" watermark replacing Shutterstock.
export { BinaryVortexCanvas, BinaryVortexCanvas as BinaryRainCanvas } from './BinaryVortexCanvas';
export type { BinaryVortexCanvasProps, BinaryVortexCanvasProps as BinaryRainCanvasProps, VortexDensity, VortexDensity as RainDensity } from './BinaryVortexCanvas';
export { default } from './BinaryVortexCanvas';
