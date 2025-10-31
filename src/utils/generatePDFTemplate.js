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

// 🏫 UIPS Branded PDF Template
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

  // 🎨 Maroon Banner
  doc.setFillColor(128, 0, 0);
  doc.rect(0, 0, pageWidth, 80, "F");

  // 🏫 Load UIPS Logo
  const logoUrl = "https://i.postimg.cc/DWkx44nh/uips-logo.png";
  try {
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const reader = new FileReader();
    const logoBase64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
    doc.addImage(logoBase64, "PNG", 25, -2, 80, 80);
  } catch {
    console.warn("⚠️ Logo not loaded, continuing without image.");
  }

  // 🏫 Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("United International Private School", pageWidth / 2, 38, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(subtitle || "EduTrack Report", pageWidth / 2, 58, {
    align: "center",
  });

  // 📅 Date Range (optional)
  if (from || to) {
    const fromDate = from
      ? new Date(from).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Start";
    const toDate = to
      ? new Date(to).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Today";
    doc.setFontSize(9);
    doc.text(`Date Range: ${fromDate} - ${toDate}`, pageWidth / 2, 72, {
      align: "center",
    });
  }

  // 🕒 Generated Date (top right)
  const currentDate = new Date().toLocaleString();
  doc.setFontSize(9);
  doc.text(`Generated on: ${currentDate}`, pageWidth - 160, 72);

  // 🧮 Table
  autoTable(doc, {
    startY: 100,
    head: [tableHeaders.map((key) => formatHeaderName(key))],
    body: tableData,
    styles: { fontSize: 8, halign: "center", cellPadding: 4 },
    headStyles: {
      fillColor: [128, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: (data) => {
      // Repeat header for multi-page
      if (data.pageNumber > 1) {
        doc.setFillColor(128, 0, 0);
        doc.rect(0, 0, pageWidth, 60, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(subtitle || "EduTrack Report", pageWidth / 2, 40, {
          align: "center",
        });
      }
    },
  });

  // 📊 Totals Section
  if (totals) {
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    Object.entries(totals).forEach(([key, value], idx) => {
      doc.text(`${formatHeaderName(key)}: ${value}`, 40, finalY + idx * 15);
    });
  }

  // 📎 Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "UIPS EduTrack — Inventory Management System",
    pageWidth / 2,
    doc.internal.pageSize.height - 20,
    { align: "center" }
  );

  return doc;
}
