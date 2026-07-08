import type { ApplicationFormData } from "./applicationSchema";

interface CandidateInfo {
  registrationNo: string;
  name: string;
}

export async function generateApplicationPDF(
  formData: ApplicationFormData,
  candidate: CandidateInfo,
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  const contentW = pageW - margin * 2;

  let y = 0;

  const drawBorder = () => {
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageW - 10, pageH - 10);
    doc.setDrawColor(219, 234, 254);
    doc.setLineWidth(0.3);
    doc.rect(6, 6, pageW - 12, pageH - 12);
  };

  const addPage = () => {
    doc.addPage();
    y = margin;
    drawBorder();
  };

  const checkBreak = (needed: number) => {
    if (y + needed > pageH - 18) addPage();
  };

  const sectionHeader = (text: string) => {
    checkBreak(12);
    doc.setFillColor(30, 64, 175);
    doc.rect(margin, y, contentW, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin + 3, y + 5.5);
    y += 10;
  };

  const twoCol = (l1: string, v1: string, l2: string, v2: string) => {
    checkBreak(10);
    const half = (contentW - 2) / 2;
    // Left cell
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, y, half, 9, "F");
    doc.setDrawColor(219, 234, 254);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, half, 9);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(l1, margin + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((v1 || "—").substring(0, 30), margin + 2, y + 7.5);
    // Right cell
    const rx = margin + half + 2;
    doc.setFillColor(239, 246, 255);
    doc.rect(rx, y, half, 9, "F");
    doc.rect(rx, y, half, 9);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(l2, rx + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((v2 || "—").substring(0, 30), rx + 2, y + 7.5);
    y += 10;
  };

  const oneRow = (label: string, value: string) => {
    checkBreak(10);
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, y, contentW, 9, "F");
    doc.setDrawColor(219, 234, 254);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentW, 9);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((value || "—").substring(0, 80), margin + 2, y + 7.5);
    y += 10;
  };

  const divider = () => {
    y += 2;
    doc.setDrawColor(219, 234, 254);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y);
    y += 3;
  };

  // ─── PAGE 1 ───────────────────────────────────────────────────────────────
  drawBorder();

  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, margin, contentW, 28, "F");

  // Emblem circle
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.circle(margin + 14, margin + 14, 10, "S");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("BSSC", margin + 14, margin + 15, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("BIHAR STAFF SELECTION COMMISSION", margin + 30, margin + 9);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Bihar Karmachari Chayan Ayog", margin + 30, margin + 15);
  doc.setFontSize(7);
  doc.text("P.O.-Veterinary College, Patna - 800014", margin + 30, margin + 20);

  // Exam strip
  doc.setFillColor(30, 64, 175);
  doc.rect(margin, margin + 28, contentW, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    "4th Graduate Level Combined Competitive Examination — 2025",
    pageW / 2,
    margin + 34,
    { align: "center" },
  );
  doc.setFontSize(7);
  doc.text(
    "ADV NO.-05/25 | Chaturthi Snatak Stariya Sanyukt Pratiyogita Pariksha",
    pageW / 2,
    margin + 39,
    { align: "center" },
  );

  // Form title bar
  doc.setFillColor(219, 234, 254);
  doc.rect(margin, margin + 38, contentW, 8, "F");
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("APPLICATION FORM / Avedan Patra", pageW / 2, margin + 43.5, {
    align: "center",
  });

  y = margin + 50;

  // Reg info bar
  doc.setFillColor(30, 58, 138);
  doc.rect(margin, y, contentW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Registration No.: ${candidate.registrationNo}`,
    margin + 3,
    y + 5.5,
  );
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`;
  doc.text(`Date: ${dateStr}`, margin + contentW - 3, y + 5.5, {
    align: "right",
  });
  y += 11;

  // Photo box (top right)
  const photoBoxX = margin + contentW - 32;
  const photoBoxY = y;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.rect(photoBoxX, photoBoxY, 30, 38);

  if (formData.photos?.passportPhoto) {
    try {
      doc.addImage(
        formData.photos.passportPhoto,
        "JPEG",
        photoBoxX + 1,
        photoBoxY + 1,
        28,
        36,
      );
    } catch {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6);
      doc.text("PHOTO", photoBoxX + 15, photoBoxY + 20, { align: "center" });
    }
  } else {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.text("PASSPORT", photoBoxX + 15, photoBoxY + 16, { align: "center" });
    doc.text("PHOTO", photoBoxX + 15, photoBoxY + 21, { align: "center" });
  }

  doc.setTextColor(30, 58, 138);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.text("PASSPORT PHOTO", photoBoxX + 15, photoBoxY + 42, {
    align: "center",
  });

  // ─── Personal Details ─────────────────────────────────────────────────────
  const p = formData.personal;
  const mainW = contentW - 34;

  sectionHeader("PERSONAL DETAILS / Vyaktigat Vivaran");

  // Name (full width left side)
  checkBreak(10);
  doc.setFillColor(239, 246, 255);
  doc.rect(margin, y, mainW, 9, "F");
  doc.setDrawColor(219, 234, 254);
  doc.setLineWidth(0.2);
  doc.rect(margin, y, mainW, 9);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("NAME OF APPLICANT / Avedan ka Naam", margin + 2, y + 3.5);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text((p?.applicantName || "—").substring(0, 35), margin + 2, y + 7.5);
  y += 10;

  // Father / Mother
  const halfM = (mainW - 2) / 2;
  checkBreak(10);
  doc.setFillColor(239, 246, 255);
  doc.rect(margin, y, halfM, 9, "F");
  doc.rect(margin, y, halfM, 9);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("FATHER'S NAME / Pita ka Naam", margin + 2, y + 3.5);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text((p?.fatherName || "—").substring(0, 22), margin + 2, y + 7.5);

  const rx2 = margin + halfM + 2;
  doc.setFillColor(239, 246, 255);
  doc.rect(rx2, y, halfM, 9, "F");
  doc.rect(rx2, y, halfM, 9);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("MOTHER'S NAME / Mata ka Naam", rx2 + 2, y + 3.5);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text((p?.motherName || "—").substring(0, 22), rx2 + 2, y + 7.5);
  y += 10;

  // DOB / Gender / Category (3 cols)
  const thirdW = (mainW - 4) / 3;
  checkBreak(10);
  const threeFields = [
    { l: "DATE OF BIRTH", v: p?.dateOfBirth || "—" },
    { l: "GENDER / Ling", v: p?.gender || "—" },
    { l: "CATEGORY / Shreni", v: p?.category || "—" },
  ];
  threeFields.forEach((f, i) => {
    const fx = margin + i * (thirdW + 2);
    doc.setFillColor(239, 246, 255);
    doc.rect(fx, y, thirdW, 9, "F");
    doc.setDrawColor(219, 234, 254);
    doc.setLineWidth(0.2);
    doc.rect(fx, y, thirdW, 9);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(f.l, fx + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(f.v.substring(0, 16), fx + 2, y + 7.5);
  });
  y += 10;

  twoCol(
    "EMAIL ID",
    p?.emailId || "—",
    "NATIONALITY",
    p?.nationality || "INDIAN",
  );
  twoCol(
    "BIHAR DOMICILE",
    p?.domicileOfBihar || "—",
    "CASTE / Jati",
    p?.caste || "—",
  );
  twoCol(
    "DISABILITY / Divyangata",
    p?.disability || "—",
    "EX-SERVICEMAN",
    p?.exServiceman || "—",
  );
  twoCol(
    "NCC CADET",
    p?.nccCadet || "—",
    "BIHAR GOVT EMPLOYEE",
    p?.biharGovtEmployee || "—",
  );
  twoCol(
    "BSSC ATTEMPTS AFTER 12-12-2022",
    p?.numberOfAttempts || "—",
    "CONTRACTUAL EMPLOYEE",
    p?.contractualEmployee || "—",
  );

  divider();

  // ─── Addresses ────────────────────────────────────────────────────────────
  sectionHeader("PERMANENT ADDRESS / Sthayi Pata");
  const permAddr = [
    p?.permVillage,
    p?.permPoliceStation,
    p?.permPostOffice,
    p?.permDistrict,
    p?.permState,
    p?.permPinCode,
  ]
    .filter(Boolean)
    .join(", ");
  oneRow("PERMANENT ADDRESS", permAddr || "—");

  sectionHeader("CORRESPONDENCE ADDRESS / Patrachar Pata");
  const corrAddr = [
    p?.corrVillage,
    p?.corrPoliceStation,
    p?.corrPostOffice,
    p?.corrDistrict,
    p?.corrState,
    p?.corrPinCode,
  ]
    .filter(Boolean)
    .join(", ");
  oneRow("CORRESPONDENCE ADDRESS", corrAddr || "—");

  divider();

  // ─── Payment ──────────────────────────────────────────────────────────────
  sectionHeader("PAYMENT DETAILS / Bhugtan Vivaran");
  twoCol(
    "PAYMENT STATUS",
    "PAID",
    "EXAMINATION FEE / Pariksha Shulk",
    "Rs. 135",
  );
  twoCol(
    "PAYMENT MODE",
    formData.payment?.paymentMode || "—",
    "PAYMENT DATE",
    dateStr,
  );

  divider();

  // ─── Education ────────────────────────────────────────────────────────────
  checkBreak(70);
  sectionHeader("EDUCATIONAL QUALIFICATION / Shaikshnik Yogyata");

  const eduRows = [
    {
      label: "10TH / EQUIVALENT (10vi / Samkaksh)",
      data: formData.education?.tenth,
    },
    {
      label: "12TH / EQUIVALENT (12vi / Samkaksh)",
      data: formData.education?.twelfth,
    },
    {
      label: "GRADUATION / EQUIVALENT (Snatak / Samkaksh)",
      data: formData.education?.graduation,
    },
  ];

  for (const edu of eduRows) {
    checkBreak(30);
    doc.setFillColor(219, 234, 254);
    doc.rect(margin, y, contentW, 7, "F");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(edu.label, margin + 3, y + 5);
    y += 8;

    if (edu.data) {
      const cols = [
        { label: "SUBJECT", w: 28 },
        { label: "BOARD/UNIVERSITY", w: 40 },
        { label: "TOTAL MARKS", w: 24 },
        { label: "OBTAINED", w: 22 },
        { label: "%", w: 16 },
        { label: "CERT NO.", w: 26 },
        { label: "ISSUE DATE", w: 34 },
      ];
      let cx = margin;
      doc.setFillColor(30, 64, 175);
      cols.forEach((col) => {
        doc.rect(cx, y, col.w, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "bold");
        doc.text(col.label, cx + 1, y + 4);
        cx += col.w;
      });
      y += 6;

      const vals = [
        edu.data.subject,
        edu.data.boardUniversity,
        edu.data.totalMarks,
        edu.data.obtainedMarks,
        edu.data.percentage,
        edu.data.certNumber,
        edu.data.certIssueDate,
      ];
      cx = margin;
      cols.forEach((col, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(239, 246, 255);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(cx, y, col.w, 8, "F");
        doc.setDrawColor(219, 234, 254);
        doc.setLineWidth(0.2);
        doc.rect(cx, y, col.w, 8);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        const val = (vals[i] || "—").substring(0, 14);
        doc.text(val, cx + 1, y + 5.5);
        cx += col.w;
      });
      y += 9;
    } else {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text("Not filled", margin + 3, y + 5);
      y += 8;
    }
    y += 2;
  }

  divider();

  // ─── Photos & Signatures ──────────────────────────────────────────────────
  checkBreak(55);
  sectionHeader("PHOTOGRAPH & SIGNATURE / Photo aur Hastakshar");

  const photoItems = [
    {
      label: "PASSPORT PHOTO",
      src: formData.photos?.passportPhoto,
      w: 25,
      h: 32,
    },
    {
      label: "SIGNATURE (EN)",
      src: formData.photos?.signatureEn,
      w: 40,
      h: 14,
    },
    {
      label: "SIGNATURE (HI)",
      src: formData.photos?.signatureHi,
      w: 40,
      h: 14,
    },
    { label: "LIVE PHOTO", src: formData.livePhoto?.livePhoto, w: 25, h: 32 },
  ];

  let px = margin + 5;
  const photoY = y;
  const maxH = Math.max(...photoItems.map((i) => i.h));

  for (const item of photoItems) {
    const boxH = item.h + 14;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.rect(px, photoY, item.w + 4, boxH);

    if (item.label === "LIVE PHOTO" && item.src) {
      doc.setFillColor(22, 163, 74);
      doc.rect(px, photoY, item.w + 4, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5.5);
      doc.text("VERIFIED", px + (item.w + 4) / 2, photoY + 3.5, {
        align: "center",
      });
    }

    if (item.src) {
      try {
        doc.addImage(
          item.src,
          "JPEG",
          px + 2,
          photoY + (item.label.includes("LIVE") ? 6 : 2),
          item.w,
          item.h,
        );
      } catch {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(6);
        doc.text("IMAGE", px + (item.w + 4) / 2, photoY + item.h / 2 + 5, {
          align: "center",
        });
      }
    } else {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6);
      doc.text("NOT", px + (item.w + 4) / 2, photoY + item.h / 2 + 2, {
        align: "center",
      });
      doc.text("UPLOADED", px + (item.w + 4) / 2, photoY + item.h / 2 + 6, {
        align: "center",
      });
    }

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.label, px + (item.w + 4) / 2, photoY + boxH - 3, {
      align: "center",
    });

    px += item.w + 10;
  }

  y = photoY + maxH + 18;
  divider();

  // ─── Declaration ──────────────────────────────────────────────────────────
  checkBreak(40);
  sectionHeader("DECLARATION / Ghoshna");

  doc.setFillColor(239, 246, 255);
  doc.rect(margin, y, contentW, 22, "F");
  doc.setDrawColor(219, 234, 254);
  doc.setLineWidth(0.2);
  doc.rect(margin, y, contentW, 22);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  const declText =
    "I hereby declare that all the information furnished by me in this application form is true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect or ineligibility being detected before or after the examination, my candidature is liable to be cancelled and action can be taken against me as per rules.";
  const declLines = doc.splitTextToSize(declText, contentW - 6);
  doc.text(declLines, margin + 3, y + 5);
  y += 24;

  // Signature line
  checkBreak(20);
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.3);
  doc.line(margin + contentW - 50, y + 12, margin + contentW, y + 12);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Signature of Candidate", margin + contentW - 50, y + 16);

  if (formData.photos?.signatureEn) {
    try {
      doc.addImage(
        formData.photos.signatureEn,
        "JPEG",
        margin + contentW - 48,
        y + 1,
        46,
        10,
      );
    } catch {
      /* ignore */
    }
  }

  y += 22;

  // ─── Footer on all pages ──────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(30, 58, 138);
    doc.rect(margin, pageH - 12, contentW, 7, "F");
    doc.setTextColor(191, 219, 254);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(
      "© 2025 Bihar Staff Selection Commission | ADV NO.-05/25 | 4th Graduate Level Combined Competitive Examination",
      pageW / 2,
      pageH - 7.5,
      { align: "center" },
    );
    doc.text(`Page ${i} of ${totalPages}`, margin + contentW - 3, pageH - 7.5, {
      align: "right",
    });
  }

  doc.save(`BSSC_Application_${candidate.registrationNo}.pdf`);
}
