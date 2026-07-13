const fs = require('fs');

const vowels = [
  { eng: 'a', suffix: '' },
  { eng: 'aa', suffix: '\u0c3e' },
  { eng: 'i', suffix: '\u0c3f' },
  { eng: 'ii', suffix: '\u0c40' },
  { eng: 'u', suffix: '\u0c41' },
  { eng: 'uu', suffix: '\u0c42' },
  { eng: 'ru', suffix: '\u0c43' },
  { eng: 'ruu', suffix: '\u0c44' },
  { eng: 'e', suffix: '\u0c46' },
  { eng: 'ee', suffix: '\u0c47' },
  { eng: 'ai', suffix: '\u0c48' },
  { eng: 'o', suffix: '\u0c4a' },
  { eng: 'oo', suffix: '\u0c4b' },
  { eng: 'au', suffix: '\u0c4c' },
  { eng: 'am', suffix: '\u0c02' }
];

const consonants = [
  { engBase: 'k', telBase: 'క' },
  { engBase: 'kh', telBase: 'ఖ' },
  { engBase: 'g', telBase: 'గ' },
  { engBase: 'gh', telBase: 'ఘ' },
  { engBase: 'ng', telBase: 'ఙ' },
  { engBase: 'ch', telBase: 'చ' },
  { engBase: 'chh', telBase: 'ఛ' },
  { engBase: 'j', telBase: 'జ' },
  { engBase: 'jh', telBase: 'ఝ' },
  { engBase: 'ny', telBase: 'ఞ' },
  // Retroflex
  { engBase: 't', telBase: 'ట' },
  { engBase: 'th', telBase: 'ఠ' },
  { engBase: 'd', telBase: 'డ' },
  { engBase: 'dh', telBase: 'ఢ' },
  { engBase: 'n', telBase: 'ణ' },
  // Dental
  { engBase: 't', telBase: 'త' },
  { engBase: 'th', telBase: 'థ' },
  { engBase: 'd', telBase: 'ద' },
  { engBase: 'dh', telBase: 'ధ' },
  { engBase: 'n', telBase: 'న' },
  // Labial
  { engBase: 'p', telBase: 'ప' },
  { engBase: 'ph', telBase: 'ఫ' },
  { engBase: 'b', telBase: 'బ' },
  { engBase: 'bh', telBase: 'భ' },
  { engBase: 'm', telBase: 'మ' },
  // Misc
  { engBase: 'y', telBase: 'య' },
  { engBase: 'r', telBase: 'ర' },
  { engBase: 'l', telBase: 'ల' },
  { engBase: 'v', telBase: 'వ' },
  { engBase: 'sh', telBase: 'శ' },
  { engBase: 'ss', telBase: 'ష' },
  { engBase: 's', telBase: 'స' },
  { engBase: 'h', telBase: 'హ' }
];

const dataset = [];

for (const c of consonants) {
    const row = {
        consonant_eng: c.engBase + 'a',
        consonant_tel: c.telBase,
        combinations: []
    };
    
    for (const v of vowels) {
        row.combinations.push({
            eng: c.engBase + v.eng,
            tel: c.telBase + v.suffix
        });
    }
    
    dataset.push(row);
}

// Generate the JS file content
const fileContent = `const guninthaluData = ${JSON.stringify(dataset, null, 4)};\n`;

fs.writeFileSync('guninthaluData.js', fileContent, 'utf-8');
console.log('Dataset generated successfully in guninthaluData.js!');
