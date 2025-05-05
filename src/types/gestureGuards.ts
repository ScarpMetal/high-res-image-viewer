import { FullGestureState, GestureKey } from "@use-gesture/react";

export function isWheelState(
  state: FullGestureState<GestureKey>
): state is FullGestureState<"wheel"> {
  const checkForKeys = ["xy"];
  return (
    checkForKeys.every((key) => key in state) &&
    state.event instanceof WheelEvent
  );
}

export function isPinchState(
  state: FullGestureState<GestureKey>
): state is FullGestureState<"pinch"> {
  const checkForKeys = [
    "_pointerEvents",
    "_touchIds",
    "da",
    "origin",
    "turns",
    "canceled",
  ];
  const possibleEvents = [PointerEvent, TouchEvent, WheelEvent];
  return (
    checkForKeys.every((key) => key in state) &&
    possibleEvents.some((Event) => state.event instanceof Event)
  );
}
