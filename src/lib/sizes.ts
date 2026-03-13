// Pure measurement conversion and sizing logic

export function cmToInches(cm: number): string {
  return (cm / 2.54).toFixed(1);
}

export function inchesToCm(inches: number): string {
  return (inches * 2.54).toFixed(1);
}

export const SIZE_RANGES: Record<string, { label: string; max: number }[]> = {
  height: [
    { label: "Petite", max: 160 },
    { label: "Regular", max: 175 },
    { label: "Tall", max: Infinity },
  ],
  waist: [
    { label: "XS", max: 66 },
    { label: "S", max: 71 },
    { label: "M", max: 81 },
    { label: "L", max: 91 },
    { label: "XL", max: 101 },
    { label: "XXL", max: Infinity },
  ],
  torso: [
    { label: "XS", max: 40 },
    { label: "S", max: 43 },
    { label: "M", max: 46 },
    { label: "L", max: 49 },
    { label: "XL", max: 52 },
    { label: "XXL", max: Infinity },
  ],
  hips: [
    { label: "XS", max: 86 },
    { label: "S", max: 91 },
    { label: "M", max: 99 },
    { label: "L", max: 107 },
    { label: "XL", max: 117 },
    { label: "XXL", max: Infinity },
  ],
};

export const SIZE_CONVERSIONS: Record<string, Record<string, string>> = {
  XS:  { US: "0-2",   UK: "4-6",   JP: "5",    FR: "32-34", IT: "36-38" },
  S:   { US: "4-6",   UK: "8-10",  JP: "7",    FR: "36-38", IT: "40-42" },
  M:   { US: "8-10",  UK: "12-14", JP: "9-11", FR: "40-42", IT: "44-46" },
  L:   { US: "12-14", UK: "16-18", JP: "13-15", FR: "44-46", IT: "48-50" },
  XL:  { US: "16-18", UK: "20-22", JP: "17-19", FR: "48-50", IT: "52-54" },
  XXL: { US: "20-22", UK: "24-26", JP: "21-23", FR: "52-54", IT: "56-58" },
};

export function getSize(measurement: string, cm: number): string | null {
  const ranges = SIZE_RANGES[measurement];
  if (!ranges) return null;
  for (const range of ranges) {
    if (cm <= range.max) return range.label;
  }
  return null;
}

// Clothing size recommendation logic

const TOP_SIZES = [
  { size: "0-2 (XS)", maxBust: 84, maxWaist: 66 },
  { size: "4-6 (S)", maxBust: 90, maxWaist: 71 },
  { size: "8-10 (M)", maxBust: 97, maxWaist: 81 },
  { size: "12-14 (L)", maxBust: 105, maxWaist: 91 },
  { size: "16-18 (XL)", maxBust: 115, maxWaist: 101 },
  { size: "20+ (XXL)", maxBust: Infinity, maxWaist: Infinity },
];

const BOTTOM_SIZES = [
  { size: "0-2 (XS)", maxWaist: 66, maxHips: 86 },
  { size: "4-6 (S)", maxWaist: 71, maxHips: 91 },
  { size: "8-10 (M)", maxWaist: 81, maxHips: 99 },
  { size: "12-14 (L)", maxWaist: 91, maxHips: 107 },
  { size: "16-18 (XL)", maxWaist: 101, maxHips: 117 },
  { size: "20+ (XXL)", maxWaist: Infinity, maxHips: Infinity },
];

const COAT_SIZES = [
  { size: "0-2 (XS)", maxBust: 84, maxWaist: 66, maxHips: 86 },
  { size: "4-6 (S)", maxBust: 90, maxWaist: 71, maxHips: 91 },
  { size: "8-10 (M)", maxBust: 97, maxWaist: 81, maxHips: 99 },
  { size: "12-14 (L)", maxBust: 105, maxWaist: 91, maxHips: 107 },
  { size: "16-18 (XL)", maxBust: 115, maxWaist: 101, maxHips: 117 },
  { size: "20+ (XXL)", maxBust: Infinity, maxWaist: Infinity, maxHips: Infinity },
];

export function getTopSize(torso: number | null, waist: number | null): string | null {
  if (!torso && !waist) return null;
  for (const s of TOP_SIZES) {
    const bustFit = !torso || torso <= s.maxBust;
    const waistFit = !waist || waist <= s.maxWaist;
    if (bustFit && waistFit) return s.size;
  }
  return TOP_SIZES[TOP_SIZES.length - 1].size;
}

export function getBottomSize(waist: number | null, hips: number | null): string | null {
  if (!waist && !hips) return null;
  for (const s of BOTTOM_SIZES) {
    const waistFit = !waist || waist <= s.maxWaist;
    const hipsFit = !hips || hips <= s.maxHips;
    if (waistFit && hipsFit) return s.size;
  }
  return BOTTOM_SIZES[BOTTOM_SIZES.length - 1].size;
}

export function getCoatSize(torso: number | null, waist: number | null, hips: number | null): string | null {
  if (!torso && !waist && !hips) return null;
  for (const s of COAT_SIZES) {
    const bustFit = !torso || torso <= s.maxBust;
    const waistFit = !waist || waist <= s.maxWaist;
    const hipsFit = !hips || hips <= s.maxHips;
    if (bustFit && waistFit && hipsFit) return s.size;
  }
  return COAT_SIZES[COAT_SIZES.length - 1].size;
}
