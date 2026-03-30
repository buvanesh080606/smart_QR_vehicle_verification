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

// Extremely naive extraction based on common keywords for a simulated environment
// In reality, specific regexes for RC, Insurance, and PUC would be used
export const parseOCRText = (text, docType) => {
  const parsedData = {};
  const lines = text.split('\n').map(l => l.toUpperCase().trim());
  
  if (docType === 'RC') {
    // Attempt to extract Vehicle Number (e.g., MH 12 AB 1234)
    const vehNumMatch = text.match(/[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,2}[-\s]?[0-9]{4}/i);
    if (vehNumMatch) parsedData.vehicleNumber = vehNumMatch[0].replace(/[-\s]/g, '');
    else parsedData.vehicleNumber = "XX00XX0000"; // fallback fake extraction
    
    parsedData.ownerName = "JOHN DOE"; // fallback for demo purposes
    // Try finding "NAME:"
    const nameLine = lines.find(l => l.includes('NAME'));
    if(nameLine) {
        let parts = nameLine.split(/NAME[:\-]?/i);
        if(parts[1]) parsedData.ownerName = parts[1].trim();
    }
  } else if (docType === 'INSURANCE') {
    parsedData.policyNumber = "POL" + Math.floor(Math.random() * 1000000); // Random fallback
    const policyLine = lines.find(l => l.includes('POLICY NO') || l.includes('POLICY'));
    if(policyLine) {
       const parts = policyLine.split(/[#:]/);
       if(parts[1]) parsedData.policyNumber = parts[1].trim();
    }

    parsedData.insuranceStartDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    parsedData.insuranceExpiryDate = new Date().toISOString().split('T')[0]; 
    
    // We try to extract DD/MM/YYYY or DD-MM-YYYY
    const dates = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/g);
    if(dates && dates.length >= 2) {
       // Just taking the first two as start and expiry for a simple assumption
       parsedData.insuranceStartDate = new Date(dates[0].split(/[/-]/).reverse().join('-')).toISOString().split('T')[0];
       parsedData.insuranceExpiryDate = new Date(dates[1].split(/[/-]/).reverse().join('-')).toISOString().split('T')[0];
    }
  } else if (docType === 'PUC') {
    parsedData.pucNumber = "PUC" + Math.floor(Math.random() * 10000);
    parsedData.pucExpiryDate = new Date().toISOString().split('T')[0];
    
    const dates = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/g);
    if(dates && dates.length >= 1) {
       parsedData.pucExpiryDate = new Date(dates[dates.length-1].split(/[/-]/).reverse().join('-')).toISOString().split('T')[0];
    }
  }

  return parsedData;
};
