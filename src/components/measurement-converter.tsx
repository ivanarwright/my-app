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
import {
  cmToInches,
  inchesToCm,
  getSize,
  SIZE_CONVERSIONS,
} from "@/lib/sizes";

const MEASUREMENTS = ["height", "waist", "torso", "hips"] as const;

const LABELS: Record<string, string> = {
  height: "Height",
  waist: "Waist",
  torso: "Torso",
  hips: "Hips",
};

type Props = {
  saved: Record<string, number | null>;
};

export function MeasurementConverter({ saved }: Props) {
  const [cmValues, setCmValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of MEASUREMENTS) {
      if (saved[key] != null) initial[key] = String(saved[key]);
    }
    return initial;
  });
  const [inValues, setInValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of MEASUREMENTS) {
      if (saved[key] != null) initial[key] = cmToInches(saved[key]!);
    }
    return initial;
  });

  function handleCmChange(name: string, value: string) {
    setCmValues((prev) => ({ ...prev, [name]: value }));
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      setInValues((prev) => ({ ...prev, [name]: cmToInches(parsed) }));
    } else {
      setInValues((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleInChange(name: string, value: string) {
    setInValues((prev) => ({ ...prev, [name]: value }));
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      setCmValues((prev) => ({ ...prev, [name]: inchesToCm(parsed) }));
    } else {
      setCmValues((prev) => ({ ...prev, [name]: "" }));
    }
  }

  const inputClass =
    "w-24 shrink-0 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveMeasurements}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0" />
              <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground text-center">cm</span>
              <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground text-center">in</span>
            </div>
            {MEASUREMENTS.map((name) => {
              const cm = parseFloat(cmValues[name] || "");
              const size =
                !isNaN(cm) && cm > 0 ? getSize(name, cm) : null;

              return (
                <div key={name} className="flex items-center gap-3">
                  <label className="w-16 shrink-0 text-sm font-medium">
                    {LABELS[name]}
                  </label>
                  <input type="hidden" name={name} value={cmValues[name] || ""} />
                  <input
                    type="number"
                    placeholder="cm"
                    value={cmValues[name] || ""}
                    onChange={(e) => handleCmChange(name, e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    placeholder="in"
                    value={inValues[name] || ""}
                    onChange={(e) => handleInChange(name, e.target.value)}
                    className={inputClass}
                  />
                  {size && (
                    <div className="flex items-center gap-2">
                      {name === "height" ? (
                        <span className="w-24 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary text-center">
                          {size}
                        </span>
                      ) : (
                        Object.entries(SIZE_CONVERSIONS[size] || {}).map(
                          ([region, regionSize]) => (
                            <span
                              key={region}
                              className="w-20 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary text-center"
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
