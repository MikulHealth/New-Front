import { jsPDF } from "jspdf";

export const generatePDF = async (report, setIsDownloading, toast) => {
  setIsDownloading(true);
  try {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    const title = `${report.recipientFullName} MH Report`;
    doc.text(title, 10, 20);

    doc.setFontSize(12);

    const addText = (label, text, offsetY) => {
      doc.setFont("helvetica", "bold");
      const splitLabel = doc.splitTextToSize(`${label}: `, 180);
      doc.text(splitLabel, 10, offsetY);
      const labelHeight = splitLabel.length * 10;

      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(
        splitText,
        10 + doc.getTextDimensions(splitLabel[0]).w,
        offsetY
      );
      const textHeight = splitText.length * 10;

      const totalHeight = Math.max(labelHeight, textHeight);
      if (offsetY + totalHeight > 280) {
        doc.addPage();
        offsetY = 10;
      }

      return offsetY + totalHeight;
    };

    let offsetY = 30;
    offsetY = addText("Beneficiary name ", report.recipientFullName, offsetY);
    offsetY = addText("Service Plan ", report.servicePlan, offsetY);
    offsetY = addText(
      "Report date and time ",
      formatDateTime(report.createdAt),
      offsetY
    );
    offsetY = addText("Temperature ", `${report.temperature}°C`, offsetY);
    offsetY = addText("Blood Pressure ", report.bloodPressure, offsetY);
    offsetY = addText("Pulse ", `${report.pulse} bpm`, offsetY);
    offsetY = addText("Blood Sugar ", report.bloodSugar, offsetY);
    offsetY = addText("SpO2 ", `${report.sp02}%`, offsetY);
    offsetY = addText("Respiration ", `${report.respiration} c/m`, offsetY);

    offsetY = addText("Mood ", report.mood, offsetY);
    offsetY = addText("Emotional State ", report.emotionalState, offsetY);
    offsetY = addText("Physical State ", report.physicalState, offsetY);
    offsetY = addText("Pain Level ", report.painLevel, offsetY);

    offsetY = addText("Medications ", "", offsetY);
    report.medications.forEach((medication) => {
      offsetY = addText("", formatMedicationTime(medication), offsetY);
    });

    offsetY = addText("Activities ", "", offsetY);
    report.activities.forEach((activity) => {
      offsetY = addText("", activity, offsetY);
    });

    offsetY = addText("Comments ", report.comments, offsetY);
    offsetY = addText("Recommendations ", report.recommendations, offsetY);
    offsetY = addText("Reported by ", report.medicFullName, offsetY);

    if (report.picturePath) {
      if (offsetY + 160 > 280) {
        doc.addPage();
        offsetY = 10;
      }
      doc.addImage(report.picturePath, "JPEG", 10, offsetY, 180, 160);
    }

    doc.save(
      `${report.recipientFullName}_${formatDateTime(
        report.createdAt
      )}_MH_Medical_Report.pdf`
    );
    toast({
      title: "Download Complete",
      description: "Report downloaded successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "An error occurred while generating the PDF.",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });
  } finally {
    setIsDownloading(false);
  }
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
};

const formatMedicationTime = (medication) => {
  const parts = medication.split(",");
  const timePart = parts.find((part) => part.startsWith("Time:"));
  const time = timePart
    ? new Date(timePart.replace("Time:", ""))
    : new Date(NaN);
  return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${
    !isNaN(time.getTime()) ? `Time:${time.toLocaleString()}` : "Time:Invalid Date"
  }`;
};
