import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      // logger: m => console.log(m)
    });
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to process image');
  }
};

export const parseOCRText = (text) => {
  const result = {
    document_type: null,
    plate_number: null,
    owner_name: null,
    policy_number: null,
    start_date: null,
    expiry_date: null,
    puc_number: null,
    puc_expiry: null
  };

  if (!text) return result;

  // STEP 1: Preprocess
  const upperText = text.toUpperCase();

  // STEP 2: Detect Document Type
  if (upperText.includes("REGISTRATION CERTIFICATE") || upperText.includes("GOVERNMENT OF TAMIL NADU")) {
    result.document_type = "RC";
  } else if (upperText.includes("INSURANCE") || upperText.includes("ICICI LOMBARD")) {
    result.document_type = "INSURANCE";
  } else if (upperText.includes("PUC") || upperText.includes("EMISSION")) {
    result.document_type = "PUC";
  }

  // STEP 3 & 4: Extract and Validate
  const lines = upperText.split('\n').map(l => l.trim()).filter(Boolean);

  const extractDates = (str) => {
    // Looks for DD-MM-YYYY, DD/MM/YYYY, DD-MMM-YYYY
    const dateRegex = /\b(\d{1,2})[-\/](\d{1,2}|[A-Z]{3})[-\/](\d{4})\b/g;
    const matches = str.matchAll(dateRegex);
    const validDates = [];
    for (const match of matches) {
      let [full, d, m, y] = match;
      if (m.length === 3) {
        const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
        m = months[m] !== undefined ? months[m] + 1 : 1;
      }
      const parsedDate = new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      if (!isNaN(parsedDate)) {
        validDates.push(parsedDate);
      }
    }
    return validDates.sort((a, b) => a - b);
  };

  const dates = extractDates(upperText);

  const extractPlateNumber = (str) => {
    const words = str.replace(/[-\s_]/g, '').split(/[^\w]/);
    for (let word of words) {
      if (word.length >= 9 && word.length <= 11) {
         let prefix = word.substring(0, 2);
         let m1 = word.substring(2, 4).replace(/O/g, '0').replace(/I/g, '1').replace(/S/g, '5');
         let mid = word.substring(4, 6);
         let end = word.substring(6).replace(/O/g, '0').replace(/I/g, '1').replace(/S/g, '5');
         
         const candidate = prefix + m1 + mid + end;
         if (/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(candidate)) {
             return candidate;
         }
      }
    }
    return null;
  };

  if (result.document_type === "RC") {
    result.plate_number = extractPlateNumber(upperText);
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("NAME")) {
            let parts = line.split(/NAME\s*[:\-]?\s*/);
            if (parts.length > 1 && parts[1].length > 2) {
                result.owner_name = parts[1].trim();
                break;
            }
            if (i + 1 < lines.length) {
                result.owner_name = lines[i + 1].trim(); 
                break;
            }
        }
    }
    if (result.owner_name) {
       result.owner_name = result.owner_name.replace(/[^A-Z\s]/g, '').trim();
       if (!result.owner_name) result.owner_name = null;
    }

  } else if (result.document_type === "INSURANCE") {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("POLICY") || line.includes("POL NO")) {
            const parts = line.split(/POLICY( NO)?\s*[:\-#]?\s*/);
            const val = parts[parts.length - 1].trim();
            if (val && val.length > 4) {
                result.policy_number = val.replace(/\s+/g, '');
                break;
            }
            if (i + 1 < lines.length) {
                result.policy_number = lines[i + 1].replace(/\s+/g, '');
                break;
            }
        }
    }
    
    if (dates.length >= 2) {
      result.start_date = dates[0].toISOString().split('T')[0];
      result.expiry_date = dates[dates.length - 1].toISOString().split('T')[0];
    } else if (dates.length === 1) {
      result.start_date = dates[0].toISOString().split('T')[0];
    }
  } else if (result.document_type === "PUC") {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("CERTIFICATE NO") || line.includes("PUC NO")) {
            const parts = line.split(/(CERTIFICATE|PUC) NO\s*[:\-#]?\s*/);
            const val = parts[parts.length - 1].trim();
            if (val && val.length > 2) {
                result.puc_number = val.replace(/\s+/g, '');
                break;
            }
            if (i + 1 < lines.length) {
                result.puc_number = lines[i + 1].replace(/\s+/g, '');
                break; 
            }
        }
    }
    if (dates.length >= 1) {
      result.puc_expiry = dates[dates.length - 1].toISOString().split('T')[0];
    }
  }

  return result;
};
