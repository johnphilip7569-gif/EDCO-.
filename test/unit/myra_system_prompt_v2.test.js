const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Verify myra-agent prompt & opening message
const agentFilePath = path.join(__dirname, '../../src/lib/ai/myra-agent.ts');
const agentContent = fs.readFileSync(agentFilePath, 'utf8');

console.log('Testing MYRA_SYSTEM_PROMPT in src/lib/ai/myra-agent.ts...');
assert(agentContent.includes('AI study and career mentor from EdWorld Co'), 'Should designate study and career mentor');
assert(agentContent.includes('Class 12 up to undergraduate, postgraduate and early-career'), 'Should target Class 12 to early career');
assert(agentContent.includes('TIMETABLE BUILDER'), 'Should have Timetable Builder section');
assert(agentContent.includes('ROADMAP BUILDER'), 'Should have Roadmap Builder section');
assert(agentContent.includes('Tele-MANAS 14416'), 'Should include Tele-MANAS helpline 14416');
assert(agentContent.includes('emergencies: 112'), 'Should include emergency 112');
assert(agentContent.includes('Never invent exam dates'), 'Should prohibit inventing exam dates');
assert(agentContent.includes('MYRA_OPENING_MESSAGE'), 'Should export MYRA_OPENING_MESSAGE');
assert(agentContent.includes('Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements)'), 'Opening message should match exact prompt');
console.log('✔ myra-agent.ts prompt and opening message verified');

// 2. Verify myra-ai/prompts/myra_system.txt
const promptTxtPath = path.join(__dirname, '../../myra-ai/prompts/myra_system.txt');
const promptTxtContent = fs.readFileSync(promptTxtPath, 'utf8');
console.log('Testing myra-ai/prompts/myra_system.txt...');
assert(promptTxtContent.includes('AI study and career mentor from EdWorld Co'), 'Text file should have mentor persona');
assert(promptTxtContent.includes('Tele-MANAS 14416'), 'Text file should have Tele-MANAS 14416');
console.log('✔ myra_system.txt verified');

// 3. Verify MyraChatbot.tsx
const chatbotPath = path.join(__dirname, '../../src/components/ai/MyraChatbot.tsx');
const chatbotContent = fs.readFileSync(chatbotPath, 'utf8');
console.log('Testing src/components/ai/MyraChatbot.tsx...');
assert(chatbotContent.includes('Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements)'), 'Initial greeting in UI should match canonical text');
assert(chatbotContent.includes('Study &amp; Career Mentor'), 'Badge in UI should be Study & Career Mentor');
assert(chatbotContent.includes('Class 12 • College • Placements • Higher-Ed'), 'Subtitle in UI should reflect Class 12 to Higher-Ed');
console.log('✔ MyraChatbot.tsx verified');

// 4. Verify Dataset JSONL
const datasetPath = path.join(__dirname, '../../myra-ai/data/myra_class12_to_career_dataset.jsonl');
const lines = fs.readFileSync(datasetPath, 'utf8').trim().split('\n');
console.log(`Testing myra_class12_to_career_dataset.jsonl (${lines.length} lines)...`);
assert(lines.length >= 100, 'Should have at least 100 verified dataset entries');
lines.forEach((l, idx) => {
  const parsed = JSON.parse(l);
  assert(Array.isArray(parsed.messages), `Line ${idx+1} messages must be array`);
  assert(parsed.messages.length >= 3, `Line ${idx+1} must have at least 3 messages`);
  assert(parsed.messages[0].role === 'system', `Line ${idx+1} msg 0 must be system`);
  assert(parsed.messages[1].role === 'user', `Line ${idx+1} msg 1 must be user`);
  assert(parsed.messages[2].role === 'assistant', `Line ${idx+1} msg 2 must be assistant`);
});
console.log(`✔ All ${lines.length} dataset rows adhere to JSON Lines chat schema`);

console.log('\n=======================================');
console.log('ALL MYRA SYSTEM PROMPT V2 TESTS PASSED!');
console.log('=======================================');
