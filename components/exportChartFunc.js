import html2canvas from "html2canvas";
import jsPDF from "jspdf";


 // Export conversation as JSON or PDF
export const exportConversation = (format) => {
    if (format === "json") {
      const fileData = JSON.stringify(messages, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "conversation.json";
      link.click();
    } else if (format === "pdf") {
      const element = document.getElementById("conversation-container");
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("conversation.pdf");
      });
    }
  };

  // Copy to clipboard
  export const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Response copied to clipboard!");
  };

  // Toggle message expansion
  export const toggleExpandMessage = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  