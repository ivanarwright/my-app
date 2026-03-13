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

const SIZE_CONVERSIONS: Record<string, Record<string, string>> = {
  XS:  { US: "XS",  UK: "4-6",   JP: "5",    FR: "32-34", IT: "36-38" },
  S:   { US: "S",   UK: "8-10",  JP: "7",    FR: "36-38", IT: "40-42" },
  M:   { US: "M",   UK: "12-14", JP: "9-11", FR: "40-42", IT: "44-46" },
  L:   { US: "L",   UK: "16-18", JP: "13-15", FR: "44-46", IT: "48-50" },
  XL:  { US: "XL",  UK: "20-22", JP: "17-19", FR: "48-50", IT: "52-54" },
  XXL: { US: "XXL", UK: "24-26", JP: "21-23", FR: "52-54", IT: "56-58" },
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
    <Card className="max-w-2xl mx-auto">
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
                <div key={name} className="space-y-2">
                  <div className="flex items-center gap-3">
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
                  </div>
                  {size && (
                    <div className="ml-[calc(4rem+0.75rem)] grid grid-cols-5 gap-2">
                      {name === "height" ? (
                        <span className="col-span-5 w-24 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary text-center">
                          {size}
                        </span>
                      ) : (
                        Object.entries(SIZE_CONVERSIONS[size] || {}).map(
                          ([region, regionSize]) => (
                            <span
                              key={region}
                              className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary text-center"
                            >
                              <span className="block text-[10px] uppercase tracking-wide text-primary/60">
                                {region}
                              </span>
                              {regionSize}
                            </span>
                          )
                        )
                      )}
                    </div>
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
