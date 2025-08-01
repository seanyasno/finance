import { isNullOrUndefined } from "@poke-playbook/libs";
import { useState } from "react";

export function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isNullOrUndefined(ref.current)) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return { mousePosition, setMousePosition, handleMouseMove };
}
