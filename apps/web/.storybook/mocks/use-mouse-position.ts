/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Mock for @/hooks/use-mouse-position
export const useMousePosition = (_ref: any) => ({
  mousePosition: { x: 0, y: 0 },
  setMousePosition: () => console.log("Set mouse position"),
  handleMouseMove: () => console.log("Handle mouse move"),
});
