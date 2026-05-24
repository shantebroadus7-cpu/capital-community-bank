import jsPDF from "jspdf";
import logo from "../assets/bank-logo.png";

export const generateStatement = () => {

  const doc = new jsPDF();

  const username =
    localStorage.getItem("bank_username") || "Client";

  const balance =
    Number(localStorage.getItem("bank_balance")) || 0;

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  const img = new Image();

  img.src = logo;

  img.onload = () => {

    // LOGO
    doc.addImage(
      img,
      "PNG",
      20,
      10,
      35,
      35
    );

    // HEADER
    doc.setFontSize(22);

    doc.text(
      "Capital Community Bank",
      65,
      22
    );

    doc.setFontSize(13);

    doc.text(
      "Official Banking Statement",
      65,
      32
    );

    // LINE
    doc.line(20, 50, 190, 50);

    // CUSTOMER INFO
    doc.setFontSize(12);

    doc.text(
      `Account Holder: ${username}`,
      20,
      65
    );

    doc.text(
      `Available Balance: $${balance.toLocaleString()}`,
      20,
      75
    );

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      85
    );

    // TRANSACTION HEADER
    doc.setFontSize(16);

    doc.text(
      "Recent Transactions",
      20,
      105
    );

    // TABLE HEADER
    doc.setFillColor(15, 23, 42);

    doc.rect(
      20,
      115,
      170,
      10,
      "F"
    );

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(11);

    doc.text("Recipient", 25, 122);

    doc.text("Amount", 110, 122);

    doc.text("Status", 160, 122);

    // RESET TEXT COLOR
    doc.setTextColor(0, 0, 0);

    let y = 135;

    // TRANSACTIONS
    transactions.forEach((tx, index) => {

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);

      doc.text(
        tx.name || "Transfer",
        25,
        y
      );

      doc.text(
        tx.amount || "$0",
        110,
        y
      );

      doc.text(
        tx.status || "Completed",
        160,
        y
      );

      // ROW LINE
      doc.line(20, y + 3, 190, y + 3);

      y += 15;
    });

    // FOOTER
    doc.setFontSize(10);

    doc.text(
      "Confidential Banking Document",
      20,
      285
    );

    doc.text(
      "Capital Community Bank © 2026",
      140,
      285
    );

    // DOWNLOAD PDF
    doc.save("Capital-Community-Bank-Statement.pdf");

  };

};