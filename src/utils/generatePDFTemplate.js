import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🧠 Converts camelCase or snake_case → clean labels
function formatHeaderName(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// 🏫 UIPS Branded PDF Template (JS version)
export async function generatePDFTemplate({
  title,
  subtitle,
  tableData,
  tableHeaders,
  totals,
  from,
  to,
}) {
  const doc = new jsPDF("l", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const headerHeight = 80;

  // 🏫 Load UIPS Logo ONCE
  const logoUrl = "https://i.postimg.cc/DWkx44nh/uips-logo.png";
  let logoBase64 = null;

  try {
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const reader = new FileReader();

    logoBase64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
  } catch {
    console.warn("⚠️ Logo not loaded, continuing without image.");
  }

  // 🧾 Date range text
  let rangeText = "All Data";

  if (from || to) {
    const fromText = from
      ? new Date(from).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Start";

    const toText = to
      ? new Date(to).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Today";

    rangeText = `${fromText} - ${toText}`;
  }

  const generatedText = new Date().toLocaleString();

  // 🎨 Draw header (for EVERY page)
  const drawHeader = () => {
    // Maroon bar
    doc.setFillColor(128, 0, 0);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // Logo
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 25, -2, 80, 80);
    }

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("United International Private School", pageWidth / 2, 30, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(subtitle || title || "EduTrack Report", pageWidth / 2, 48, {
      align: "center",
    });

    // Date Range & Generated Time
    doc.setFontSize(9);
    doc.text(`Date Range: ${rangeText}`, 40, 68);
    doc.text(`Generated on: ${generatedText}`, pageWidth - 180, 68);
  };

  // 📋 Main table with repeating column headers
  autoTable(doc, {
    startY: headerHeight + 20,
    margin: { top: headerHeight + 20, left: 40, right: 40, bottom: 40 },
    head: [tableHeaders.map((h) => formatHeaderName(h))],
    body: tableData,
    showHead: "everyPage", // 🔁 COLUMN HEADERS ON EVERY PAGE
    styles: {
      fontSize: 8,
      halign: "center",
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [128, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },

    didDrawPage: function (data) {
      // 🔁 Draw full header on every page
      drawHeader();

      // Footer text
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "UIPS EduTrack — Inventory Management System",
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );

      // Page number
      doc.text(`Page ${data.pageNumber}`, pageWidth - 80, pageHeight - 20);
    },
  });

  // 📊 Totals Section (after table)
  if (totals) {
    const finalY =
      (doc.lastAutoTable && doc.lastAutoTable.finalY + 30) || pageHeight - 120;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    Object.entries(totals).forEach(([key, value], idx) => {
      doc.text(`${formatHeaderName(key)}: ${value}`, 40, finalY + idx * 15);
    });
  }

  return doc;
}
