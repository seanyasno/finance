import { useMemo } from "react";
import { useWindowSize } from "./use-window-size";

export function useItemsPerRowWindowChange(itemsPerRowMap: {
  xl: number;
  lg: number;
  sm: number;
  mobile: number;
}) {
  const size = useWindowSize();
  const width = size.width;

  return useMemo(() => {
    if (width >= 1280) {
      return itemsPerRowMap.xl;
    }

    if (width >= 1024) {
      return itemsPerRowMap.lg;
    }

    if (width >= 640) {
      return itemsPerRowMap.sm;
    }

    return itemsPerRowMap.mobile;
  }, [itemsPerRowMap, width]);
}
