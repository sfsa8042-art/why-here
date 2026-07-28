/**
 * lib/mapStatus.ts — pure map lifecycle state machine (M1 correction).
 *
 * Separates the map's lifecycle phases from the MapLibre component so the
 * transitions are unit-testable. A timeout is NON-FATAL: it moves to `slow`
 * (map stays mounted, retryable), never to `fatal_error`. Only WebGL
 * unavailability, a constructor failure, or a genuine style-load failure are
 * fatal.
 */

export type MapPhase =
  | 'initializing'
  | 'loading_style'
  | 'ready'
  | 'slow'
  | 'fatal_error'
  | 'webgl_unavailable';

export type MapEvent =
  | 'style_loading' // MapLibre instance created; style fetch in flight
  | 'loaded' // map.on('load')
  | 'timeout' // first render is slow — NOT a failure
  | 'style_error' // genuine style-load failure (fatal)
  | 'webgl_missing' // WebGL unavailable
  | 'init_error' // constructor threw
  | 'retry'; // user pressed "Retry map"

export function nextMapPhase(phase: MapPhase, event: MapEvent): MapPhase {
  switch (event) {
    case 'webgl_missing':
      return 'webgl_unavailable';
    case 'init_error':
    case 'style_error':
      return 'fatal_error';
    case 'loaded':
      return 'ready';
    case 'style_loading':
      return phase === 'ready' ? 'ready' : 'loading_style';
    case 'timeout':
      /* slow only if we have not already reached ready; never fatal */
      return phase === 'ready' ? 'ready' : 'slow';
    case 'retry':
      return 'initializing';
    default:
      return phase;
  }
}

/** These phases replace the map with the accessible fallback. */
export function mapIsFatal(phase: MapPhase): boolean {
  return phase === 'fatal_error' || phase === 'webgl_unavailable';
}

/** The MapLibre instance stays mounted for all non-fatal phases (incl. slow). */
export function mapIsMounted(phase: MapPhase): boolean {
  return !mapIsFatal(phase);
}
