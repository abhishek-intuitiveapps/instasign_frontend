import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'node:fs';
import fontkit from '@pdf-lib/fontkit';
import { formatDateTime } from '../../../Utils.js';
import axios from 'axios';

// Function to get KYC details for signers
async function getKYCDetails(docId, signerEmails) {
  try {
    if (!docId) {
      console.error('Document ID is required for KYC verification');
      return {};
    }
    
    // Call the actual KYC API using axios
    const response = await axios.post('https://api.dev.instasign.ai/base/api/v1/kycee/get/details/', {
      document_Id: docId,
      client_secret: "5QkILuGKURaA3ZKqemdXmT8Fogp2IMz1"
      // Add client secret if needed
      // clientSecret: 'your-client-secret'
    });
    
    const result = response.data;
    console.log(result);
    
    if (!result.status || !result.data) {
      console.error('KYC API returned an error or invalid data');
      return {};
    }
    
    // Create a map of email to verification status
    const kycStatuses = {};
    
    // Process each signer email
    signerEmails.forEach(email => {
      // Check if this email exists in the KYC response and has a valid status
      if (result.data[email] && result.data[email].status === true) {
        kycStatuses[email] = true;
      } else {
        kycStatuses[email] = false;
      }
    });
    
    return kycStatuses;
  } catch (error) {
    console.error('Error fetching KYC details:', error);
    return {};
  }
}

export default async function GenerateCertificate(docDetails) {
  const timezone = docDetails?.ExtUserPtr?.Timezone || '';
  const Is12Hr = docDetails?.ExtUserPtr?.Is12HourTime || false;
  const DateFormat = docDetails?.ExtUserPtr?.DateFormat || 'MM/DD/YYYY';
  const pdfDoc = await PDFDocument.create();
  // `fontBytes` is used to embed custom font in pdf
  const fontBytes = fs.readFileSync('./font/times.ttf'); //
  pdfDoc.registerFontkit(fontkit);
  const timesRomanFont = await pdfDoc.embedFont(fontBytes, { subset: true });
  const pngUrl = fs.readFileSync('./new_instasign_logo.png').buffer;
  const pngImage = await pdfDoc.embedPng(pngUrl);
  
  // Load the verified badge image
  const verifiedBadgeUrl = fs.readFileSync('./verified-badge.png').buffer;
  const verifiedBadgeImage = await pdfDoc.embedPng(verifiedBadgeUrl);
  
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const startX = 15;
  const startY = 15;
  const borderColor = rgb(0.12, 0.12, 0.12);
  const titleColor = rgb(0, 0.2, 0.4); //rgb(0, 0.53, 0.71);
  const titleUnderline = rgb(0, 0.2, 0.4); // rgb(0.12, 0.12, 0.12);
  const title = 25;
  const subtitle = 16;
  const text = 13;
  const signertext = 13;
  const timeText = 11;
  const textKeyColor = rgb(0.12, 0.12, 0.12);
  const textValueColor = rgb(0.3, 0.3, 0.3);
  const verifiedColor = rgb(0.13, 0.55, 0.13); // Green color for verification
  const completedAt = docDetails?.completedAt ? new Date(docDetails?.completedAt) : new Date();
  const completedAtperTimezone = formatDateTime(completedAt, DateFormat, timezone, Is12Hr);
  const completedUTCtime = completedAtperTimezone;
  const signersCount = docDetails?.Signers?.length || 1;
  const generateAt = docDetails?.completedAt ? new Date(docDetails?.completedAt) : new Date();
  const generatedAtperTimezone = formatDateTime(generateAt, DateFormat, timezone, Is12Hr);
  const generatedUTCTime = generatedAtperTimezone;
  const generatedOn = 'Generated On ' + generatedUTCTime;
  const textWidth = timesRomanFont.widthOfTextAtSize(generatedOn, 12);
  const margin = 30;
  const maxX = width - margin - textWidth; // Ensures text stays inside the border with 30px margin
  const OriginIp = docDetails?.OriginIp || '';
  const company = docDetails?.ExtUserPtr?.Company || '';
  const createdAt = docDetails?.DocSentAt?.iso || docDetails.createdAt;
  const createdAtperTimezone = formatDateTime(createdAt, DateFormat, timezone, Is12Hr);
  const IsEnableOTP = docDetails?.IsEnableOTP || false;
  const filteredaudit = docDetails?.AuditTrail?.filter(x => x?.UserPtr?.objectId);
  const auditTrail =
    docDetails?.Signers?.length > 0
      ? filteredaudit?.map(x => {
          const data = docDetails.Signers.find(y => y.objectId === x.UserPtr.objectId);
          return {
            ...data,
            ipAddress: x.ipAddress,
            SignedOn: x?.SignedOn || generatedUTCTime,
            ViewedOn: x?.ViewedOn || x?.SignedOn || generatedUTCTime,
            Signature: x?.Signature || '',
          };
        })
      : [
          {
            ...docDetails.ExtUserPtr,
            ipAddress: filteredaudit[0].ipAddress,
            SignedOn: filteredaudit[0]?.SignedOn || generatedUTCTime,
            ViewedOn: filteredaudit[0]?.ViewedOn || filteredaudit[0]?.SignedOn || generatedUTCTime,
            Signature: filteredaudit[0]?.Signature || '',
          },
        ];

  const ownerName = docDetails?.SenderName || docDetails.ExtUserPtr?.Name || 'n/a';
  const ownerEmail = docDetails?.SenderMail || docDetails.ExtUserPtr?.Email || 'n/a';
  const half = width / 2;
  // Draw a border
  page.drawRectangle({
    x: startX,
    y: startY,
    width: width - 2 * startX,
    height: height - 2 * startY,
    borderColor: borderColor,
    borderWidth: 1,
  });
  page.drawImage(pngImage, {
    x: 30,
    y: 790,
    width: 100,
    height: 25,
  });

  page.drawText(generatedOn, {
    x: Math.max(startX, maxX), // Adjusts dynamically 320
    y: 810,
    size: 12,
    font: timesRomanFont,
    color: rgb(0.12, 0.12, 0.12),
  });

  page.drawText('Certificate of Completion', {
    x: 160,
    y: 755,
    size: title,
    font: timesRomanFont,
    color: titleColor,
  });

  const underlineY = 745;
  page.drawLine({
    start: { x: 30, y: underlineY },
    end: { x: width - 30, y: underlineY },
    color: titleUnderline,
    thickness: 1,
  });

  page.drawText('Summary', {
    x: 30,
    y: 727,
    size: subtitle,
    font: timesRomanFont,
    color: titleColor,
  });

  page.drawText('Document Id :', {
    x: 30,
    y: 710,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(docDetails.objectId, {
    x: 110,
    y: 710,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawText('Document Name :', {
    x: 30,
    y: 690,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(docDetails?.Name, {
    x: 130,
    y: 690,
    size: docDetails?.Name?.length >= 78 ? 12 : text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawText('Organization :', {
    x: 30,
    y: 670,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(company, {
    x: 110,
    y: 670,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Created on :', {
    x: 30,
    y: 650,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${createdAtperTimezone}`, {
    x: 97,
    y: 650,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Completed on :', {
    x: 30,
    y: 630,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${completedUTCtime}`, {
    x: 115,
    y: 630,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Signers :', {
    x: 30,
    y: 610,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${signersCount}`, {
    x: 80,
    y: 610,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Document originator', {
    x: 30,
    y: 590,
    size: 17,
    font: timesRomanFont,
    color: titleColor,
  });
  page.drawText('Name :', {
    x: 30,
    y: 573,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(ownerName, {
    x: 75,
    y: 573,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Email :', {
    x: 30,
    y: 553,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(ownerEmail, {
    x: 75,
    y: 553,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('IP address :', {
    x: 30,
    y: 533,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(`${OriginIp}`, {
    x: 95,
    y: 533,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });

  page.drawLine({
    start: { x: 30, y: 527 },
    end: { x: width - 30, y: 527 },
    color: rgb(0.12, 0.12, 0.12),
    thickness: 0.5,
  });
  let yPosition1 = 512;
  let yPosition2 = 498;
  let yPosition3 = 478;
  let yPosition4 = 458;
  let yPosition5 = 438;
  let yPosition6 = 418;
  let yPosition7 = 398;
  let yPosition8 = 363;

  // Get KYC verification status for all signers
  const isKycRequired = docDetails?.kycRequired === true;
  let kycStatuses = {};
  
  if (isKycRequired && docDetails?.Signers?.length > 0) {
    const signerEmails = docDetails.Signers.map(signer => signer.Email || '');
    kycStatuses = await getKYCDetails(docDetails.objectId, signerEmails);
  }

  auditTrail.slice(0, 3).forEach(async (x, i) => {
    const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';
    page.drawText(`Signer ${i + 1}`, {
      x: 30,
      y: yPosition1,
      size: subtitle,
      font: timesRomanFont,
      color: titleColor,
    });
    
    // Add verification badge image only if KYC is required and verified for this signer
    const signerEmail = x?.Email || '';
    if (isKycRequired && kycStatuses[signerEmail]) {
      page.drawImage(verifiedBadgeImage, {
        x: width - 60,
        y: yPosition1 - 35,
        width: 50,
        height: 50,
      });
    }
    
    page.drawText('Name :', {
      x: 30,
      y: yPosition2,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.Name, {
      x: 75,
      y: yPosition2,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    if (IsEnableOTP) {
      page.drawText('Security level :', {
        x: half + 120,
        y: yPosition2,
        size: timeText,
        font: timesRomanFont,
        color: textKeyColor,
      });
      page.drawText('Email, OTP Auth', {
        x: half + 190,
        y: yPosition2,
        size: timeText,
        font: timesRomanFont,
        color: textValueColor,
      });
    }

    page.drawText('Email :', {
      x: 30,
      y: yPosition3,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.Email, {
      x: 75,
      y: yPosition3,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Viewed on :', {
      x: 30,
      y: yPosition4,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${formatDateTime(x.ViewedOn, DateFormat, timezone, Is12Hr)}`, {
      x: 97,
      y: yPosition4,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Signed on :', {
      x: 30,
      y: yPosition5,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${formatDateTime(x.SignedOn, DateFormat, timezone, Is12Hr)}`, {
      x: 95,
      y: yPosition5,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('IP address :', {
      x: 30,
      y: yPosition6,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.ipAddress, {
      x: 95,
      y: yPosition6,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Signature :', {
      x: 30,
      y: yPosition7,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawRectangle({
      x: 98,
      y: yPosition7 - 30,
      width: 104,
      height: 44,
      borderColor: rgb(0.22, 0.18, 0.47),
      borderWidth: 1,
    });
    if (embedPng) {
      page.drawImage(embedPng, {
        x: 100,
        y: yPosition7 - 27,
        width: 100,
        height: 40,
      });
    }
    page.drawLine({
      start: { x: 30, y: yPosition8 },
      end: { x: width - 30, y: yPosition8 },
      color: rgb(0.12, 0.12, 0.12),
      thickness: 0.5,
    });

    yPosition1 = yPosition8 - 20;
    yPosition2 = yPosition1 - 20;
    yPosition3 = yPosition2 - 20;
    yPosition4 = yPosition3 - 20;
    yPosition5 = yPosition4 - 20;
    yPosition6 = yPosition5 - 20;
    yPosition7 = yPosition6 - 20;
    yPosition8 = yPosition8 - 174;
  });

  if (auditTrail.length > 3) {
    let currentPageIndex = 1;
    let currentPage = page;
    auditTrail.slice(3).forEach(async (x, i) => {
      const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';

      // Calculate remaining space on current page
      const remainingSpace = yPosition8;

      // If there's not enough space for the next entry, create a new page
      if (remainingSpace < 90) {
        // Adjust the value as needed
        currentPageIndex++;
        currentPage = pdfDoc.addPage();
        currentPage.drawRectangle({
          x: startX,
          y: startY,
          width: width - 2 * startX,
          height: height - 2 * startY,
          borderColor: borderColor,
          borderWidth: 1,
        });
        yPosition1 = currentPage.getHeight() - 40;
        yPosition2 = yPosition1 - 20;
        yPosition3 = yPosition2 - 20;
        yPosition4 = yPosition3 - 20;
        yPosition5 = yPosition4 - 20;
        yPosition5 = yPosition4 - 20;
        yPosition6 = yPosition5 - 20;
        yPosition7 = yPosition6 - 20;
        yPosition8 = currentPage.getHeight() - 190;
      }

      currentPage.drawText(`Signer ${4 + i}`, {
        x: 30,
        y: yPosition1,
        size: subtitle,
        font: timesRomanFont,
        color: titleColor,
      });
      
      // Add verification badge image only if KYC is required and verified for this signer
      const signerEmail = x?.Email || '';
      if (isKycRequired && kycStatuses[signerEmail]) {
        currentPage.drawImage(verifiedBadgeImage, {
          x: width - 60,
          y: yPosition1 - 35,
          width: 50,
          height: 50,
        });
      }
      
      currentPage.drawText('Name :', {
        x: 30,
        y: yPosition2,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.Name, {
        x: 75,
        y: yPosition2,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      if (IsEnableOTP) {
        currentPage.drawText('Security level :', {
          x: half + 120,
          y: yPosition2,
          size: timeText,
          font: timesRomanFont,
          color: textKeyColor,
        });
        currentPage.drawText(`Email, OTP Auth`, {
          x: half + 190,
          y: yPosition2,
          size: timeText,
          font: timesRomanFont,
          color: textValueColor,
        });
      }

      currentPage.drawText('Email :', {
        x: 30,
        y: yPosition3,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.Email, {
        x: 75,
        y: yPosition3,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Viewed on :', {
        x: 30,
        y: yPosition4,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${formatDateTime(x.ViewedOn, DateFormat, timezone, Is12Hr)}`, {
        x: 97,
        y: yPosition4,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });
      currentPage.drawText('Signed on :', {
        x: 30,
        y: yPosition5,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${formatDateTime(x.SignedOn, DateFormat, timezone, Is12Hr)}`, {
        x: 95,
        y: yPosition5,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('IP address :', {
        x: 30,
        y: yPosition6,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.ipAddress, {
        x: 100,
        y: yPosition6,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Signature :', {
        x: 30,
        y: yPosition7,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });
      currentPage.drawRectangle({
        x: 98,
        y: yPosition7 - 27,
        width: 104,
        height: 44,
        borderColor: rgb(0.22, 0.18, 0.47),
        borderWidth: 1,
      });
      if (embedPng) {
        currentPage.drawImage(embedPng, {
          x: 100,
          y: yPosition7 - 25,
          width: 100,
          height: 40,
        });
      }

      currentPage.drawLine({
        start: { x: 30, y: yPosition8 },
        end: { x: width - 30, y: yPosition8 },
        color: rgb(0.12, 0.12, 0.12),
        thickness: 0.5,
      });

      // Update y positions for the next entry
      yPosition1 = yPosition8 - 20;
      yPosition2 = yPosition1 - 20;
      yPosition3 = yPosition2 - 20;
      yPosition4 = yPosition3 - 20;
      yPosition5 = yPosition4 - 20;
      yPosition6 = yPosition5 - 20;
      yPosition7 = yPosition6 - 20;
      yPosition8 = yPosition8 - 174;
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
