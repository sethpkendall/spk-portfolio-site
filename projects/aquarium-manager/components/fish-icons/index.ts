/**
 * Fish icon registry – 10 scientific illustration SVGs representing different species.
 *
 * Each icon renders as a rectangular banner (200×80 viewBox) designed to be
 * used directly as a card header / profile banner.
 *
 * Usage:
 *   import { getFishIcon } from './fish-icons';
 *   const Icon = getFishIcon(inhabitant.id);
 *   <Icon className="w-full h-20" />
 */

import ClownfishIcon from './ClownfishIcon';
import BettaIcon from './BettaIcon';
import GoldfishIcon from './GoldfishIcon';
import AngelfishIcon from './AngelfishIcon';
import PufferfishIcon from './PufferfishIcon';
import SwordtailIcon from './SwordtailIcon';
import GuppyIcon from './GuppyIcon';
import BlueTangIcon from './BlueTangIcon';
import NeonTetraIcon from './NeonTetraIcon';
import SeahorseIcon from './SeahorseIcon';

export {
  ClownfishIcon,
  BettaIcon,
  GoldfishIcon,
  AngelfishIcon,
  PufferfishIcon,
  SwordtailIcon,
  GuppyIcon,
  BlueTangIcon,
  NeonTetraIcon,
  SeahorseIcon,
};

/** Ordered array – index is used for deterministic selection */
export const FISH_ICONS = [
  ClownfishIcon,
  BettaIcon,
  GoldfishIcon,
  AngelfishIcon,
  PufferfishIcon,
  SwordtailIcon,
  GuppyIcon,
  BlueTangIcon,
  NeonTetraIcon,
  SeahorseIcon,
] as const;

export type FishIconComponent = (typeof FISH_ICONS)[number];

/**
 * Pick a fish icon deterministically from a numeric key (e.g. inhabitant id).
 * Wraps around the 10 icons so every inhabitant always gets the same icon.
 */
export function getFishIcon(key: number = 0): FishIconComponent {
  return FISH_ICONS[Math.abs(key) % FISH_ICONS.length];
}
