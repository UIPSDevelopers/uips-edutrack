"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

function Barcode({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    JsBarcode(ref.current, value, {
      format: "CODE128",
      width: 2,
      height: 45,
      displayValue: true,
      fontSize: 10,
    });
  }, [value]);

  return <svg ref={ref}></svg>;
}

export default function PrintBarcodes() {
  const items =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("printBarcodes") || "[]")
      : [];

  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="border p-3 text-center break-inside-avoid"
          >
            <div className="text-xs font-semibold truncate">
              {item.itemName}
            </div>

            <Barcode value={item.barcode || item.itemId} />

            <div className="text-[10px] mt-1">
              {item.barcode || item.itemId}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
