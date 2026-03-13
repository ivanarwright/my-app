"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveClothingSizes } from "@/app/dashboard/actions";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const CLOTHING_ITEMS = ["tops", "bottoms", "coats"] as const;

const LABELS: Record<string, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  coats: "Coats",
};

const inputClass =
  "w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const selectClass =
  "w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type Props = {
  saved: {
    tops: string | null;
    bottoms: string | null;
    coats: string | null;
    shoeLeft: number | null;
    shoeRight: number | null;
  };
};

export function ClothingSizes({ saved }: Props) {
  const [clothing, setClothing] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of CLOTHING_ITEMS) {
      if (saved[key]) initial[key] = saved[key];
    }
    return initial;
  });
  const [shoes, setShoes] = useState({
    left: saved.shoeLeft != null ? String(saved.shoeLeft) : "",
    right: saved.shoeRight != null ? String(saved.shoeRight) : "",
  });

  function handleShoeChange(foot: "left" | "right", value: string) {
    if (value === "" || /^\d+\.?\d{0,1}$/.test(value)) {
      setShoes((prev) => ({ ...prev, [foot]: value }));
    }
  }

  const hasSaved =
    saved.tops || saved.bottoms || saved.coats || saved.shoeLeft || saved.shoeRight;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Clothing Sizes</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={saveClothingSizes}>
          <div className="space-y-4">
            {CLOTHING_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <label className="w-24 text-sm font-medium">
                  {LABELS[item]}
                </label>
                <select
                  name={item}
                  value={clothing[item] || ""}
                  onChange={(e) =>
                    setClothing((prev) => ({
                      ...prev,
                      [item]: e.target.value,
                    }))
                  }
                  className={selectClass}
                >
                  <option value="">Select</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-medium">Shoes (L)</label>
              <input
                type="text"
                inputMode="decimal"
                name="shoeLeft"
                placeholder="e.g. 9.5"
                value={shoes.left}
                onChange={(e) => handleShoeChange("left", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-medium">Shoes (R)</label>
              <input
                type="text"
                inputMode="decimal"
                name="shoeRight"
                placeholder="e.g. 9.5"
                value={shoes.right}
                onChange={(e) => handleShoeChange("right", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit">{hasSaved ? "Update" : "Save"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
