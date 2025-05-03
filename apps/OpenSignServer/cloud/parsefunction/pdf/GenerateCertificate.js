import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'node:fs';
import fontkit from '@pdf-lib/fontkit';
import { formatDateTime } from '../../../Utils.js';
import axios from 'axios';

function base64ToBuffer(base64Input) {
  try {
    // Check if the input is empty
    if (!base64Input || !base64Input.trim()) {
      console.error('Please enter a Base64 string');
      return null;
    }

    // Remove data URL prefix if present (e.g., 'data:image/png;base64,')
    const base64 = base64Input.replace(/^data:image\/\w+;base64,/, '');
    
    // Validate the base64 string
    const isValid = /^[A-Za-z0-9+/]*={0,2}$/.test(base64);
    
    if (!isValid) {
      console.error('Invalid Base64 string');
      return null;
    }

    // Convert base64 string to binary buffer
    return Buffer.from(base64, 'base64');
    // return dataUrl;
  } catch (err) {
    console.error('Error processing Base64 string:', err);
    return null;
  }
}

// Function to get KYC details for signers
async function getKYCDetails(docId, signerEmails) {
  try {
    if (!docId) {
      console.error('Document ID is required for KYC verification');
      return {};
    }
    
    const response = await axios.post(`${process.env.DJANGO_SERVER_URL}/base/api/v1/kycee/get/details/`, {
      document_id: docId,
      client_secret: process.env.KYCEE_DJANGO_CLIENT_SECRET
    });
    
    const result = response.data;
    console.log("KYC API Response:", result); // Log the entire response
    
    if (!result.status) {
      console.error('KYC API returned an error');
      return {};
    }
    
    // Create a map of email to verification status and details
    const kycData = {};
    
    // Process response data according to the new format
    if (result.data && Array.isArray(result.data)) {
      result.data.forEach(entry => {
        const email = entry.signer_email;
        if (email) {
          kycData[email] = {
            verified: entry.status === true,
            details: entry.kycee_data || {},
            verificationImage: entry.kycee_data?.verification_image || null
          };
        }
      });
    }
    
    // Ensure all requested emails have an entry
    signerEmails.forEach(email => {
      if (!kycData[email]) {
        kycData[email] = {
          verified: false,
          details: {},
          verificationImage: null
        };
      }
    });
    
    return kycData;
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
  const fontBytes = fs.readFileSync('./font/times.ttf');
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
  const titleColor = rgb(0, 0.2, 0.4);
  const titleUnderline = rgb(0, 0.2, 0.4);
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
    x: Math.max(startX, maxX),
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

  page.drawText('Document ID :', {
    x: 30,
    y: 710,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(docDetails.objectId, {
    x: 140,
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
    x: 140,
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
    x: 140,
    y: 670,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Created On :', {
    x: 30,
    y: 650,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${typeof createdAt === 'string' && createdAt ? formatDateTime(new Date(createdAt), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
    x: 140,
    y: 650,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('Completed On :', {
    x: 30,
    y: 630,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });

  page.drawText(`${typeof completedAt === 'object' ? completedUTCtime : typeof docDetails?.completedAt === 'string' ? formatDateTime(new Date(docDetails.completedAt), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
    x: 140,
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
    x: 140,
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
    x: 140,
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
    x: 140,
    y: 553,
    size: text,
    font: timesRomanFont,
    color: textValueColor,
  });
  page.drawText('IP Address :', {
    x: 30,
    y: 533,
    size: text,
    font: timesRomanFont,
    color: textKeyColor,
  });
  page.drawText(`${OriginIp}`, {
    x: 140,
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
  let yPosition1 = 512-10;
  let yPosition2 = 487-10;
  let yPosition3 = 462-10;
  let yPosition4 = 437-10;
  let yPosition5 = 412-10;
  let yPosition6 = 387-10;
  let yPosition7 = 362;
  let yPosition8 = 363;

  // Get KYC verification status for all signers
  const isKycRequired = docDetails?.KycRequired === true;
  console.log("this is docDetails :", docDetails);
  let kycData = {};
  
  if (isKycRequired && docDetails?.Signers?.length > 0) {
    const signerEmails = docDetails.Signers.map(signer => signer.Email || '');
    kycData = await getKYCDetails(docDetails.objectId, signerEmails);
    console.log("KYC Data Retrieved:", kycData);
  }

  // Process first 3 signers
  for (const [i, x] of auditTrail.slice(0, 3).entries()) {
    const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';
    const signerEmail = x?.Email || '';
    const isVerified = isKycRequired && kycData[signerEmail]?.verified;
    const borderColor = isVerified ? verifiedColor : rgb(1, 0, 0); // Red color for unverified

    console.log(`Signer ${i + 1} - Email: ${signerEmail}, Verified: ${isVerified}`);
    page.drawText(`Signer ${1 + i}`, {
      x: 30,
      y: yPosition1,
      size: subtitle,
      font: timesRomanFont,
      color: titleColor,
    });

    // if (isVerified) {
      // Draw verification badge
      // page.drawImage(verifiedBadgeImage, {
      //   x: width - 60,
      //   y: yPosition1 - 35,
      //   width: 40,
      //   height: 40,
      // });

      // page.drawImage(verifiedBadgeImage, {
      //   x: width - 75,
      //   y: yPosition1 - 65,
      //   width: 40,
      //   height: 40,
      // });
      
      // Add KYC Verified text
      // page.drawText('KYC Verified', {
      //   x: width - 140,
      //   y: yPosition1 - 15,
      //   size: 12,
      //   font: timesRomanFont,
      //   color: verifiedColor,
      // });
      
      // If there's a verification image in base64, convert and embed it
      const verificationImage = kycData[signerEmail]?.verificationImage;
      console.log(`Verification Image for ${signerEmail}:`, verificationImage?.slice(0, 50));

      // if (verificationImage) {
        try {
          const imageBuffer = base64ToBuffer(verificationImage);
          console.log(`Image Buffer Length for ${signerEmail}:`, imageBuffer, imageBuffer?.length);
          if (imageBuffer) {
            let embeddedImage = await pdfDoc.embedJpg(imageBuffer);
            console.log('Embedded Image:', embeddedImage);
            // page.drawImage(embeddedImage, {
            //   x: width - 100,
            //   y: yPosition1 - 125,
            //   width: 60,
            //   height: 60,
            // });

            page.drawRectangle({
              x: width - 152,
              y: yPosition1 - 77,
              width: 74,
              height: 74,
              borderColor: borderColor,
              borderWidth: 2,
            });
            
            // Verification image - moved above
            page.drawImage(embeddedImage, {
              x: width - 150,
              y: yPosition1 - 75, // Moved above
              width: 70, // Kept larger size
              height: 70, // Kept larger size
            });
          } else {
            console.error(`No valid image buffer for ${signerEmail}`);
          }
        } catch (error) {
          console.error(`Error embedding verification image for ${signerEmail}:`, error);
        }
      // }
    // }
    
    page.drawText('Name :', {
      x: 30,
      y: yPosition2,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.Name, {
      x: 140,
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
      x: 140,
      y: yPosition3,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Viewed On :', {
      x: 30,
      y: yPosition4,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${typeof x.ViewedOn === 'string' && x.ViewedOn ? formatDateTime(new Date(x.ViewedOn), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
      x: 140,
      y: yPosition4,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('Signed On :', {
      x: 30,
      y: yPosition5,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(`${typeof x.SignedOn === 'string' && x.SignedOn ? formatDateTime(new Date(x.SignedOn), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
      x: 140,
      y: yPosition5,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    page.drawText('IP Address :', {
      x: 30,
      y: yPosition6,
      size: signertext,
      font: timesRomanFont,
      color: textKeyColor,
    });

    page.drawText(x?.ipAddress, {
      x: 140,
      y: yPosition6,
      size: signertext,
      font: timesRomanFont,
      color: textValueColor,
    });

    // page.drawText('Signature :', {
    //   x: 30,
    //   y: yPosition7,
    //   size: signertext,
    //   font: timesRomanFont,
    //   color: textKeyColor,
    // });

    page.drawRectangle({
      x: width - 162,
      y: yPosition7 + 5 , // Adjusted to match new spacing
      width: 104,
      height: 44,
      borderColor: rgb(0.22, 0.18, 0.47),
      borderWidth: 1,
    });
    if (embedPng) {
      page.drawImage(embedPng, {
        x: width - 160,
        y: yPosition7 + 2, // Adjusted to match new spacing
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
    yPosition2 = yPosition1 - 25;
    yPosition3 = yPosition2 - 25;
    yPosition4 = yPosition3 - 25;
    yPosition5 = yPosition4 - 25;
    yPosition6 = yPosition5 - 25;
    yPosition7 = yPosition6 - 25;
    yPosition8 = yPosition8 - 174;
  }

  if (auditTrail.length > 3) {
    let currentPageIndex = 1;
    let currentPage = page;
    for (const [i, x] of auditTrail.slice(3).entries()) {
      const embedPng = x.Signature ? await pdfDoc.embedPng(x.Signature) : '';

      // Calculate remaining space on current page
      const remainingSpace = yPosition8;

      // If there's not enough space for the next entry, create a new page
      if (remainingSpace < 90) {
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
        yPosition6 = yPosition5 - 20;
        yPosition7 = yPosition6 - 20;
        yPosition8 = currentPage.getHeight() - 170;
      }

      currentPage.drawText(`Signer ${4 + i}`, {
        x: 30,
        y: yPosition1,
        size: subtitle,
        font: timesRomanFont,
        color: titleColor,
      });
      
      // Add verification badge and KYC info if available
      const signerEmail = x?.Email || '';
      const isVerified = isKycRequired && kycData[signerEmail]?.verified;
      const borderColor = isVerified ? verifiedColor : rgb(1, 0, 0); // Red color for unverified
      
      // if (isVerified) {
        // currentPage.drawImage(verifiedBadgeImage, {
        //   x: width - 60,
        //   y: yPosition1 - 35,
        //   width: 40,
        //   height: 40,
        // });

        // currentPage.drawImage(verifiedBadgeImage, {
        //   x: width - 75,
        //   y: yPosition1 - 65, // Moved below
        //   width: 40,
        //   height: 40,
        // });
        
        // currentPage.drawText('KYC Verified', {
        //   x: width - 140,
        //   y: yPosition1 - 15,
        //   size: 12,
        //   font: timesRomanFont,
        //   color: verifiedColor,
        // });
        
        const verificationImage = kycData[signerEmail]?.verificationImage;
        console.log(`Verification Image for ${signerEmail}:`, verificationImage?.slice(0, 50));

        if (verificationImage) {
          try {
            const imageBuffer = base64ToBuffer(verificationImage);
            console.log(`Image Buffer Length for ${signerEmail}:`, imageBuffer, imageBuffer?.length);
            if (imageBuffer) {
              let embeddedImage = await pdfDoc.embedJpg(imageBuffer);
              console.log('Embedded Image:', embeddedImage);
              // currentPage.drawImage(embeddedImage, {
              //   x: width - 100,
              //   y: yPosition1 - 125,
              //   width: 60,
              //   height: 60,
              // });

              currentPage.drawRectangle({
                x: width - 152,
                y: yPosition1 - 77,
                width: 74,
                height: 74,
                borderColor: borderColor,
                borderWidth: 2,
              });
              
              // Verification image - moved above
              currentPage.drawImage(embeddedImage, {
                x: width - 150,
                y: yPosition1 - 75, // Moved above
                width: 70, // Kept larger size
                height: 70, // Kept larger size
              });
            } else {
              console.error(`No valid image buffer for ${signerEmail}`);
            }
          } catch (error) {
            console.error(`Error embedding verification image for ${signerEmail}:`, error);
          }
        }
      // }
      
      currentPage.drawText('Name :', {
        x: 30,
        y: yPosition2,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.Name, {
        x: 140,
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
        x: 140,
        y: yPosition3,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('Viewed On :', {
        x: 30,
        y: yPosition4,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${typeof x.ViewedOn === 'string' && x.ViewedOn ? formatDateTime(new Date(x.ViewedOn), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
        x: 140,
        y: yPosition4,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });
      
      currentPage.drawText('Signed On :', {
        x: 30,
        y: yPosition5,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(`${typeof x.SignedOn === 'string' && x.SignedOn ? formatDateTime(new Date(x.SignedOn), DateFormat, timezone, Is12Hr) : generatedUTCTime}`, {
        x: 140,
        y: yPosition5,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      currentPage.drawText('IP Address :', {
        x: 30,
        y: yPosition6,
        size: signertext,
        font: timesRomanFont,
        color: textKeyColor,
      });

      currentPage.drawText(x?.ipAddress, {
        x: 140,
        y: yPosition6,
        size: signertext,
        font: timesRomanFont,
        color: textValueColor,
      });

      // currentPage.drawText('Signature :', {
      //   x: 30,
      //   y: yPosition7,
      //   size: signertext,
      //   font: timesRomanFont,
      //   color: textKeyColor,
      // });
      
      currentPage.drawRectangle({
        x: width - 162,
        y: yPosition7 + 5 , // Adjusted to match new spacing
        width: 104,
        height: 44,
        borderColor: rgb(0.22, 0.18, 0.47),
        borderWidth: 1,
      });
      if (embedPng) {
        currentPage.drawImage(embedPng, {
          x: width - 160,
          y: yPosition7 + 2 , // Adjusted to match new spacing
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
      yPosition2 = yPosition1 - 25;
      yPosition3 = yPosition2 - 25;
      yPosition4 = yPosition3 - 25;
      yPosition5 = yPosition4 - 25;
      yPosition6 = yPosition5 - 25;
      yPosition7 = yPosition6 - 25;
      yPosition8 = yPosition8 - 174;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}