import { describe, it, expect } from "vitest";
import {
  cmToInches,
  inchesToCm,
  getSize,
  getTopSize,
  getBottomSize,
  getCoatSize,
  SIZE_CONVERSIONS,
} from "./sizes";

describe("cmToInches", () => {
  it("converts 2.54 cm to 1.0 inch", () => {
    expect(cmToInches(2.54)).toBe("1.0");
  });

  it("converts 170 cm to approximately 66.9 inches", () => {
    expect(cmToInches(170)).toBe("66.9");
  });

  it("converts 0 cm to 0.0 inches", () => {
    expect(cmToInches(0)).toBe("0.0");
  });
});

describe("inchesToCm", () => {
  it("converts 1 inch to 2.5 cm", () => {
    expect(inchesToCm(1)).toBe("2.5");
  });

  it("converts 66 inches to 167.6 cm", () => {
    expect(inchesToCm(66)).toBe("167.6");
  });

  it("round-trips correctly", () => {
    const cm = 175;
    const inches = parseFloat(cmToInches(cm));
    const backToCm = parseFloat(inchesToCm(inches));
    expect(Math.abs(backToCm - cm)).toBeLessThan(0.2);
  });
});

describe("getSize", () => {
  it("returns Petite for height <= 160 cm", () => {
    expect(getSize("height", 155)).toBe("Petite");
    expect(getSize("height", 160)).toBe("Petite");
  });

  it("returns Regular for height 161-175 cm", () => {
    expect(getSize("height", 165)).toBe("Regular");
    expect(getSize("height", 175)).toBe("Regular");
  });

  it("returns Tall for height > 175 cm", () => {
    expect(getSize("height", 180)).toBe("Tall");
  });

  it("returns correct waist sizes at boundaries", () => {
    expect(getSize("waist", 66)).toBe("XS");
    expect(getSize("waist", 67)).toBe("S");
    expect(getSize("waist", 71)).toBe("S");
    expect(getSize("waist", 81)).toBe("M");
    expect(getSize("waist", 91)).toBe("L");
    expect(getSize("waist", 101)).toBe("XL");
    expect(getSize("waist", 102)).toBe("XXL");
  });

  it("returns null for unknown measurement type", () => {
    expect(getSize("unknown", 100)).toBeNull();
  });
});

describe("getTopSize", () => {
  it("returns null when both measurements are null", () => {
    expect(getTopSize(null, null)).toBeNull();
  });

  it("returns XS for small torso and waist", () => {
    expect(getTopSize(80, 60)).toBe("0-2 (XS)");
  });

  it("returns M for medium measurements", () => {
    expect(getTopSize(95, 78)).toBe("8-10 (M)");
  });

  it("uses the larger size when measurements span ranges", () => {
    // Small torso but large waist (85 > M max of 81) should size up to L
    expect(getTopSize(80, 85)).toBe("12-14 (L)");
  });

  it("returns XXL for very large measurements", () => {
    expect(getTopSize(120, 110)).toBe("20+ (XXL)");
  });

  it("works with only torso provided", () => {
    expect(getTopSize(95, null)).toBe("8-10 (M)");
  });

  it("works with only waist provided", () => {
    expect(getTopSize(null, 75)).toBe("8-10 (M)");
  });
});

describe("getBottomSize", () => {
  it("returns null when both measurements are null", () => {
    expect(getBottomSize(null, null)).toBeNull();
  });

  it("returns correct size for waist and hips", () => {
    expect(getBottomSize(70, 90)).toBe("4-6 (S)");
  });

  it("sizes up when hips are larger than waist range", () => {
    expect(getBottomSize(65, 100)).toBe("12-14 (L)");
  });
});

describe("getCoatSize", () => {
  it("returns null when all measurements are null", () => {
    expect(getCoatSize(null, null, null)).toBeNull();
  });

  it("considers all three measurements", () => {
    expect(getCoatSize(95, 78, 97)).toBe("8-10 (M)");
  });

  it("sizes up to accommodate the largest measurement", () => {
    // Small torso and waist but large hips
    expect(getCoatSize(80, 60, 110)).toBe("16-18 (XL)");
  });
});

describe("SIZE_CONVERSIONS", () => {
  it("has conversions for all standard sizes", () => {
    expect(Object.keys(SIZE_CONVERSIONS)).toEqual(["XS", "S", "M", "L", "XL", "XXL"]);
  });

  it("includes all regions for each size", () => {
    for (const size of Object.keys(SIZE_CONVERSIONS)) {
      expect(Object.keys(SIZE_CONVERSIONS[size])).toEqual(["US", "UK", "JP", "FR", "IT"]);
    }
  });

  it("has correct US M size", () => {
    expect(SIZE_CONVERSIONS["M"].US).toBe("8-10");
  });
});
