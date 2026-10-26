const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function main() {
  const transcriptPath = 'C:\\Users\\adars\\.gemini\\antigravity\\brain\\fbfa0bd9-70ff-4f87-b947-3f66925c8ac1\\.system_generated\\logs\\transcript_full.jsonl';
  
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let targetUserInput = null;
  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      if (data.type === 'USER_INPUT' && data.content && data.content.includes('id,category,question,answer')) {
        targetUserInput = data.content;
      }
    } catch (e) {}
  }

  if (!targetUserInput) {
    console.error('Target user input containing CSV was not found.');
    process.exit(1);
  }

  const startIdx = targetUserInput.indexOf('id,category,question,answer');
  let csvText = targetUserInput.slice(startIdx);
  const truncIdx = csvText.indexOf('<truncated');
  if (truncIdx !== -1) {
    csvText = csvText.slice(0, truncIdx);
  }
  const tagIdx = csvText.indexOf('</USER_REQUEST>');
  if (tagIdx !== -1) {
    csvText = csvText.slice(0, tagIdx);
  }

  // Parse CSV
  // Custom RFC 4180 CSV parser
  function parseCSV(text) {
    const lines = [];
    let row = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cur);
        cur = '';
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        row.push(cur);
        cur = '';
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [];
      } else {
        cur += c;
      }
    }
    if (cur.length > 0 || row.length > 0) {
      row.push(cur);
      lines.push(row);
    }
    return lines;
  }

  const rawRows = parseCSV(csvText);
  console.log(`Parsed ${rawRows.length} total raw CSV rows.`);

  // Skip header and extract valid Q&A items
  const records = [];
  for (let r = 0; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (row.length >= 4) {
      const id = row[0].trim();
      if (/^B\d{4}$/.test(id)) {
        const category = row[1].trim();
        const question = row[2].trim();
        const answer = row.slice(3).join(',').trim(); // in case commas were inside unquoted answer
        
        // Extract search keywords (exam, branch, duration)
        const textCombined = (question + ' ' + answer).toLowerCase();
        const exams = ['gate', 'ese', 'net', 'csir', 'ugc', 'iit jam', 'jam', 'ca intermediate', 'ca', 'cfa', 'gpat', 'ssc je', 'upsc', 'mba', 'm.tech', 'ms abroad']
          .filter(e => textCombined.includes(e));
        const branches = ['ece', 'mechanical', 'civil', 'electrical', 'chemical', 'biotechnology', 'b.pharm', 'pharmacy', 'b.sc', 'b.com', 'bba', 'ba', 'law', 'architecture']
          .filter(b => textCombined.includes(b));
        const durations = ['3 months', '6 months', '9 months', '12 months', '3 hours', '4 hours', '5 hours', '6 hours', '8 hours', '10 hours', '15 days', '30 days']
          .filter(d => textCombined.includes(d));

        records.push({
          id,
          category,
          question,
          answer,
          examKeywords: Array.from(new Set(exams)),
          branchKeywords: Array.from(new Set(branches)),
          durationKeywords: Array.from(new Set(durations))
        });
      }
    }
  }

  console.log(`Extracted ${records.length} valid Myra QA records.`);
  if (records.length === 0) {
    console.error('No valid records extracted.');
    process.exit(1);
  }

  console.log('First record:', records[0].id, records[0].category, records[0].question);
  console.log('Last record:', records[records.length - 1].id, records[records.length - 1].category, records[records.length - 1].question);

  // Write files
  const outputJsonPath = path.join(__dirname, '..', 'src', 'lib', 'ai', 'data', 'myra-qa-training-dataset.json');
  const outputCsvPath = path.join(__dirname, '..', 'src', 'lib', 'ai', 'data', 'myra-qa-training.csv');

  const datasetPayload = {
    dataset_name: "Myra Academic & Career Q&A Master Benchmark Training Dataset",
    version: "2026.1",
    total_records: records.length,
    updated_at: new Date().toISOString(),
    categories: Array.from(new Set(records.map(r => r.category))),
    records
  };

  fs.writeFileSync(outputJsonPath, JSON.stringify(datasetPayload, null, 2), 'utf-8');
  console.log(`Wrote JSON dataset to ${outputJsonPath}`);

  fs.writeFileSync(outputCsvPath, csvText, 'utf-8');
  console.log(`Wrote raw CSV to ${outputCsvPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
