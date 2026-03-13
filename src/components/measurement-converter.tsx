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
                  <span className="text-sm text-muted-foreground">
                    {inches ? `= ${inches} in` : ""}
                  </span>
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
