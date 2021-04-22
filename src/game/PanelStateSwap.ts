import { StringDict } from "../interfaces/common";
import { Direction } from "./cursor";
import Panel, { PanelStateModifier } from "./panel";

export enum SwapDirection {
  Left = -1,
  Right = 1
}

// four frames to swap
const SWAP_DURATION = 1000 / 60 * 4;

export default function PanelStateSwap(direction: SwapDirection): PanelStateModifier {
  return function(panel: Panel, delta: number): StringDict<any> {
    const state = panel.state || {
      offsetX: 0,
      counter: 0
    };

    if (state.counter + delta >= SWAP_DURATION) {
      return null;
    }

    return {
      offsetX: (state.counter + delta) / SWAP_DURATION * 32 * direction,
      counter: state.counter + delta
    };
  }
}
