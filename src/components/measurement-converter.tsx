"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveMeasurements } from "@/app/dashboard/actions";

const MEASUREMENTS = ["height", "waist", "torso", "hips"] as const;

const LABELS: Record<string, string> = {
  height: "Height",
  waist: "Waist",
  torso: "Torso",
  hips: "Hips",
};

function cmToInches(cm: number): string {
  return (cm / 2.54).toFixed(1);
}

const SIZE_RANGES: Record<string, { label: string; max: number }[]> = {
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

function getSize(measurement: string, cm: number): string | null {
  const ranges = SIZE_RANGES[measurement];
  if (!ranges) return null;
  for (const range of ranges) {
    if (cm <= range.max) return range.label;
  }
  return null;
}

type Props = {
  saved: Record<string, number | null>;
};

export function MeasurementConverter({ saved }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of MEASUREMENTS) {
      if (saved[key] != null) initial[key] = String(saved[key]);
    }
    return initial;
  });

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveMeasurements}>
          <div className="space-y-4">
            {MEASUREMENTS.map((name) => {
              const cm = parseFloat(values[name] || "");
              const inches = !isNaN(cm) && cm > 0 ? cmToInches(cm) : null;
              const size =
                !isNaN(cm) && cm > 0 ? getSize(name, cm) : null;

              return (
                <div key={name} className="flex items-center gap-3">
                  <label className="w-16 text-sm font-medium">
                    {LABELS[name]}
                  </label>
                  <input
                    type="number"
                    name={name}
                    placeholder="cm"
                    value={values[name] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [name]: e.target.value,
                      }))
                    }
                    className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground w-20">
                    {inches ? `= ${inches} in` : ""}
                  </span>
                  {size && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {size}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <Button type="submit">
              {Object.keys(saved).some((k) => saved[k] != null)
                ? "Update"
                : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
