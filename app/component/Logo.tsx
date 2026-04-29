/**
 * Logo — replaces the original figma:asset/… raster import.
 * Renders an inline LabamuWordmark so there are no virtual-module
 * resolution dependencies.
 */
import { LabamuWordmark } from './LabamuWordmark';

export function Logo() {
  return <LabamuWordmark size="sm" />;
}
