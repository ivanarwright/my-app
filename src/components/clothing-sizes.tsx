"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTopSize, getBottomSize, getCoatSize } from "@/lib/sizes";

type Props = {
  measurements: {
    height: number | null;
    waist: number | null;
    torso: number | null;
    hips: number | null;
  };
};

export function ClothingSizes({ measurements }: Props) {
  const { waist, torso, hips } = measurements;

  const topSize = getTopSize(torso, waist);
  const bottomSize = getBottomSize(waist, hips);
  const coatSize = getCoatSize(torso, waist, hips);

  const hasMeasurements = waist || torso || hips;

  const sizeClass =
    "rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary text-center";

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Recommended US Clothing Sizes</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasMeasurements ? (
          <p className="text-sm text-muted-foreground">
            Enter your body measurements above to see your recommended US sizes.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm font-medium">Tops</label>
              <span className={sizeClass}>{topSize ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm font-medium">Bottoms</label>
              <span className={sizeClass}>{bottomSize ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm font-medium">Coats</label>
              <span className={sizeClass}>{coatSize ?? "—"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
