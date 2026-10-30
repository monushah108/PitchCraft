// pdf-parser.js - Client-side lightweight PDF and document text extractor

async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('latin1');
    const fullBinaryString = textDecoder.decode(uint8);

    // Strategy 1: Find compressed text streams and decompress using native DecompressionStream
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    let extractedChunks = [];

    // Check if DecompressionStream is available (native in modern Chrome/Edge)
    if (typeof DecompressionStream !== 'undefined') {
      while ((match = streamRegex.exec(fullBinaryString)) !== null) {
        const streamStart = match.index + match[0].indexOf('\n') + 1;
        const streamEnd = match.index + match[0].lastIndexOf('\n');
        if (streamEnd > streamStart) {
          const streamSlice = uint8.slice(streamStart, streamEnd);
          try {
            const ds = new DecompressionStream('deflate');
            const writer = ds.writable.getWriter();
            writer.write(streamSlice);
            writer.close();
            const response = new Response(ds.readable);
            const decompressedBuffer = await response.arrayBuffer();
            const decompressedText = new TextDecoder('utf-8').decode(decompressedBuffer);
            
            // Extract text from PDF text operators: (Text) Tj, [(T) 20 (ext)] TJ
            const textMatches = extractPdfOperators(decompressedText);
            if (textMatches) extractedChunks.push(textMatches);
          } catch {
            // Ignore streams that aren't deflate (images, fonts, etc.)
          }
        }
      }
    }

    if (extractedChunks.length > 0) {
      const result = extractedChunks.join('\n').replace(/\s{2,}/g, ' ').trim();
      if (result.length > 50) {
        return cleanExtractedResume(result);
      }
    }

    // Strategy 2: Direct ASCII/UTF-8 extraction from uncompressed text / metadata
    const rawMatches = extractPdfOperators(fullBinaryString);
    if (rawMatches && rawMatches.length > 50) {
      return cleanExtractedResume(rawMatches);
    }

    // Strategy 3: Fallback regex for parenthesized strings in PDF format (Text)
    const parenMatches = [];
    const parenRegex = /\(([^()]{2,150})\)/g;
    let pMatch;
    while ((pMatch = parenRegex.exec(fullBinaryString)) !== null) {
      const val = pMatch[1].trim();
      if (val && !val.includes('obj') && !val.includes('endobj') && /[a-zA-Z]{2,}/.test(val)) {
        parenMatches.push(val);
      }
    }

    if (parenMatches.length > 0) {
      return cleanExtractedResume(parenMatches.join(' '));
    }

    throw new Error('Could not extract readable text from this PDF format. You can paste the resume text directly.');
  } catch (err) {
    console.warn('PDF parsing notice:', err);
    throw err;
  }
}

function extractPdfOperators(streamText) {
  const parts = [];
  
  // Match single text strings: (text) Tj or '
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let m;
  while ((m = tjRegex.exec(streamText)) !== null) {
    parts.push(unescapePdfString(m[1]));
  }

  // Match array text strings: [(part1) 12 (part2)] TJ
  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((m = tjArrayRegex.exec(streamText)) !== null) {
    const arrayContent = m[1];
    const subRegex = /\(([^)]+)\)/g;
    let subM;
    let line = '';
    while ((subM = subRegex.exec(arrayContent)) !== null) {
      line += unescapePdfString(subM[1]);
    }
    if (line.trim()) parts.push(line);
  }

  return parts.join(' ');
}

function unescapePdfString(str) {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\([()])/g, '$1')
    .replace(/\\\\/g, '\\');
}

function cleanExtractedResume(text) {
  return text
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Strip weird unprintable chars
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

// Export for usage
if (typeof window !== 'undefined') {
  window.extractTextFromPdf = extractTextFromPdf;
}
