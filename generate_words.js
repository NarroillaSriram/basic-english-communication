const fs = require('fs');

const rawWords = [
    // Original simple words
    { eng: 'palaka', tel: 'పలక', s_eng: ['pa', 'la', 'ka'], s_tel: ['ప', 'ల', 'క'], m: 'Slate' },
    { eng: 'kamalam', tel: 'కమలం', s_eng: ['ka', 'ma', 'la', 'm'], s_tel: ['క', 'మ', 'ల', 'ం'], m: 'Lotus' },
    { eng: 'banti', tel: 'బంతి', s_eng: ['ba', 'n', 'ti'], s_tel: ['బ', 'ం', 'తి'], m: 'Ball' },
    { eng: 'chama', tel: 'చామ', s_eng: ['chaa', 'ma'], s_tel: ['చా', 'మ'], m: 'Yam' },
    { eng: 'tata', tel: 'తాత', s_eng: ['taa', 'ta'], s_tel: ['తా', 'త'], m: 'Grandfather' },
    { eng: 'mata', tel: 'మాట', s_eng: ['maa', 'ta'], s_tel: ['మా', 'ట'], m: 'Word' },
    { eng: 'gadiyaram', tel: 'గడియారం', s_eng: ['ga', 'di', 'yaa', 'ra', 'm'], s_tel: ['గ', 'డి', 'యా', 'ర', 'ం'], m: 'Clock' },
    { eng: 'ravi', tel: 'రవి', s_eng: ['ra', 'vi'], s_tel: ['ర', 'వి'], m: 'Sun' },
    { eng: 'vala', tel: 'వల', s_eng: ['va', 'la'], s_tel: ['వ', 'ల'], m: 'Net' },
    { eng: 'hamsa', tel: 'హంస', s_eng: ['ha', 'm', 'sa'], s_tel: ['హ', 'ం', 'స'], m: 'Swan' },
    { eng: 'chitra', tel: 'చిత్ర', s_eng: ['chi', 'tra'], s_tel: ['చి', 'త్ర'], m: 'Picture' },
    { eng: 'nela', tel: 'నెల', s_eng: ['ne', 'la'], s_tel: ['నె', 'ల'], m: 'Month' },

    // Requested words
    { eng: 'thinnava', tel: 'తిన్నావా', s_eng: ['thi', 'nna', 'vaa'], s_tel: ['తి', 'న్నా', 'వా'], m: 'Did you eat?' },
    { eng: 'sriram', tel: 'శ్రీరామ్', s_eng: ['sri', 'raa', 'm'], s_tel: ['శ్రీ', 'రా', 'మ్'], m: 'Sriram (Name)' },

    // Common Names
    { eng: 'shiva', tel: 'శివ', s_eng: ['shi', 'va'], s_tel: ['శి', 'వ'], m: 'Shiva (Name)' },
    { eng: 'krishna', tel: 'కృష్ణ', s_eng: ['kru', 'shna'], s_tel: ['కృ', 'ష్ణ'], m: 'Krishna (Name)' },
    { eng: 'ramu', tel: 'రాము', s_eng: ['raa', 'mu'], s_tel: ['రా', 'ము'], m: 'Ramu (Name)' },
    { eng: 'sita', tel: 'సీత', s_eng: ['sii', 'ta'], s_tel: ['సీ', 'త'], m: 'Sita (Name)' },
    { eng: 'gopi', tel: 'గోపి', s_eng: ['go', 'pi'], s_tel: ['గో', 'పి'], m: 'Gopi (Name)' },
    { eng: 'rani', tel: 'రాణి', s_eng: ['raa', 'ni'], s_tel: ['రా', 'ణి'], m: 'Queen / Rani (Name)' },
    { eng: 'raju', tel: 'రాజు', s_eng: ['raa', 'ju'], s_tel: ['రా', 'జు'], m: 'King / Raju (Name)' },

    // Everyday Phrases & Verbs
    { eng: 'bagunnara', tel: 'బాగున్నారా', s_eng: ['baa', 'gu', 'nnaa', 'raa'], s_tel: ['బా', 'గు', 'న్నా', 'రా'], m: 'How are you?' },
    { eng: 'namaskaram', tel: 'నమస్కారం', s_eng: ['na', 'ma', 'skaa', 'ra', 'm'], s_tel: ['న', 'మ', 'స్కా', 'ర', 'ం'], m: 'Hello' },
    { eng: 'randi', tel: 'రండి', s_eng: ['ra', 'n', 'di'], s_tel: ['ర', 'ం', 'డి'], m: 'Come (Respectful)' },
    { eng: 'kurchondi', tel: 'కూర్చోండి', s_eng: ['kuu', 'rcho', 'n', 'di'], s_tel: ['కూ', 'ర్చో', 'ం', 'డి'], m: 'Sit down (Respectful)' },
    { eng: 'vellu', tel: 'వెళ్ళు', s_eng: ['ve', 'llu'], s_tel: ['వె', 'ళ్ళు'], m: 'Go' },
    { eng: 'ra', tel: 'రా', s_eng: ['raa'], s_tel: ['రా'], m: 'Come' },
    { eng: 'cheppu', tel: 'చెప్పు', s_eng: ['che', 'ppu'], s_tel: ['చె', 'ప్పు'], m: 'Tell / Say' },
    { eng: 'vinu', tel: 'విను', s_eng: ['vi', 'nu'], s_tel: ['వి', 'ను'], m: 'Listen' },
    { eng: 'chudu', tel: 'చూడు', s_eng: ['chuu', 'du'], s_tel: ['చూ', 'డు'], m: 'Look / See' },
    { eng: 'aagu', tel: 'ఆగు', s_eng: ['aa', 'gu'], s_tel: ['ఆ', 'గు'], m: 'Stop' },
    
    // Family
    { eng: 'amma', tel: 'అమ్మ', s_eng: ['a', 'mma'], s_tel: ['అ', 'మ్మ'], m: 'Mother' },
    { eng: 'nanna', tel: 'నాన్న', s_eng: ['naa', 'nna'], s_tel: ['నా', 'న్న'], m: 'Father' },
    { eng: 'anna', tel: 'అన్న', s_eng: ['a', 'nna'], s_tel: ['అ', 'న్న'], m: 'Elder Brother' },
    { eng: 'thammudu', tel: 'తమ్ముడు', s_eng: ['tha', 'mmu', 'du'], s_tel: ['త', 'మ్ము', 'డు'], m: 'Younger Brother' },
    { eng: 'akka', tel: 'అక్క', s_eng: ['a', 'kka'], s_tel: ['అ', 'క్క'], m: 'Elder Sister' },
    { eng: 'chelli', tel: 'చెల్లి', s_eng: ['che', 'lli'], s_tel: ['చె', 'ల్లి'], m: 'Younger Sister' },
    { eng: 'mama', tel: 'మామ', s_eng: ['maa', 'ma'], s_tel: ['మా', 'మ'], m: 'Uncle' },
    { eng: 'atta', tel: 'అత్త', s_eng: ['a', 'tta'], s_tel: ['అ', 'త్త'], m: 'Aunt' },

    // Animals
    { eng: 'pilli', tel: 'పిల్లి', s_eng: ['pi', 'lli'], s_tel: ['పి', 'ల్లి'], m: 'Cat' },
    { eng: 'kukka', tel: 'కుక్క', s_eng: ['ku', 'kka'], s_tel: ['కు', 'క్క'], m: 'Dog' },
    { eng: 'aavu', tel: 'ఆవు', s_eng: ['aa', 'vu'], s_tel: ['ఆ', 'వు'], m: 'Cow' },
    { eng: 'yenu', tel: 'ఏనుగు', s_eng: ['ye', 'nu', 'gu'], s_tel: ['ఏ', 'ను', 'గు'], m: 'Elephant' },
    { eng: 'kothi', tel: 'కోతి', s_eng: ['ko', 'thi'], s_tel: ['కో', 'తి'], m: 'Monkey' },
    { eng: 'puli', tel: 'పులి', s_eng: ['pu', 'li'], s_tel: ['పు', 'లి'], m: 'Tiger' },
    { eng: 'simham', tel: 'సింహం', s_eng: ['si', 'm', 'ha', 'm'], s_tel: ['సి', 'ం', 'హ', 'ం'], m: 'Lion' },
    { eng: 'chapa', tel: 'చేప', s_eng: ['cha', 'pa'], s_tel: ['చే', 'ప'], m: 'Fish' },
    { eng: 'pitta', tel: 'పిట్ట', s_eng: ['pi', 'tta'], s_tel: ['పి', 'ట్ట'], m: 'Bird' },
    
    // Food & Drink
    { eng: 'annam', tel: 'అన్నం', s_eng: ['a', 'nna', 'm'], s_tel: ['అ', 'న్న', 'ం'], m: 'Rice / Food' },
    { eng: 'neellu', tel: 'నీళ్ళు', s_eng: ['nii', 'llu'], s_tel: ['నీ', 'ళ్ళు'], m: 'Water' },
    { eng: 'paalu', tel: 'పాలు', s_eng: ['paa', 'lu'], s_tel: ['పా', 'లు'], m: 'Milk' },
    { eng: 'pandu', tel: 'పండు', s_eng: ['pa', 'n', 'du'], s_tel: ['ప', 'ం', 'డు'], m: 'Fruit' },
    { eng: 'kura', tel: 'కూర', s_eng: ['kuu', 'ra'], s_tel: ['కూ', 'ర'], m: 'Curry' },
    { eng: 'pappu', tel: 'పప్పు', s_eng: ['pa', 'ppu'], s_tel: ['ప', 'ప్పు'], m: 'Dal / Lentils' },
    
    // Body Parts
    { eng: 'kallu', tel: 'కళ్ళు', s_eng: ['ka', 'llu'], s_tel: ['క', 'ళ్ళు'], m: 'Eyes' },
    { eng: 'mukku', tel: 'ముక్కు', s_eng: ['mu', 'kku'], s_tel: ['ము', 'క్కు'], m: 'Nose' },
    { eng: 'noru', tel: 'నోరు', s_eng: ['no', 'ru'], s_tel: ['నో', 'రు'], m: 'Mouth' },
    { eng: 'chevi', tel: 'చెవి', s_eng: ['che', 'vi'], s_tel: ['చె', 'వి'], m: 'Ear' },
    { eng: 'thala', tel: 'తల', s_eng: ['tha', 'la'], s_tel: ['త', 'ల'], m: 'Head' },
    { eng: 'cheyyi', tel: 'చెయ్యి', s_eng: ['che', 'yyi'], s_tel: ['చె', 'య్యి'], m: 'Hand' },
    { eng: 'kaalu', tel: 'కాలు', s_eng: ['kaa', 'lu'], s_tel: ['కా', 'లు'], m: 'Leg' },

    // Colors
    { eng: 'erupu', tel: 'ఎరుపు', s_eng: ['e', 'ru', 'pu'], s_tel: ['ఎ', 'రు', 'పు'], m: 'Red' },
    { eng: 'pasupu', tel: 'పసుపు', s_eng: ['pa', 'su', 'pu'], s_tel: ['ప', 'సు', 'పు'], m: 'Yellow' },
    { eng: 'neelam', tel: 'నీలం', s_eng: ['nii', 'la', 'm'], s_tel: ['నీ', 'ల', 'ం'], m: 'Blue' },
    { eng: 'aakupacha', tel: 'ఆకుపచ్చ', s_eng: ['aa', 'ku', 'pa', 'cha'], s_tel: ['ఆ', 'కు', 'ప', 'చ్చ'], m: 'Green' },
    { eng: 'nalupu', tel: 'నలుపు', s_eng: ['na', 'lu', 'pu'], s_tel: ['న', 'లు', 'పు'], m: 'Black' },
    { eng: 'telupu', tel: 'తెలుపు', s_eng: ['te', 'lu', 'pu'], s_tel: ['తె', 'లు', 'పు'], m: 'White' },

    // Nature
    { eng: 'gali', tel: 'గాలి', s_eng: ['gaa', 'li'], s_tel: ['గా', 'లి'], m: 'Wind / Air' },
    { eng: 'nela', tel: 'నేల', s_eng: ['ne', 'la'], s_tel: ['నే', 'ల'], m: 'Floor / Earth' },
    { eng: 'aakasam', tel: 'ఆకాశం', s_eng: ['aa', 'kaa', 'sa', 'm'], s_tel: ['ఆ', 'కా', 'శ', 'ం'], m: 'Sky' },
    { eng: 'varksham', tel: 'వృక్షం', s_eng: ['vru', 'ksha', 'm'], s_tel: ['వృ', 'క్ష', 'ం'], m: 'Tree' },
    { eng: 'puvvu', tel: 'పువ్వు', s_eng: ['pu', 'vvu'], s_tel: ['పు', 'వ్వు'], m: 'Flower' },
    { eng: 'varsham', tel: 'వర్షం', s_eng: ['va', 'rsha', 'm'], s_tel: ['వ', 'ర్ష', 'ం'], m: 'Rain' },
    { eng: 'chendrudu', tel: 'చంద్రుడు', s_eng: ['cha', 'n', 'dru', 'du'], s_tel: ['చ', 'ం', 'ద్రు', 'డు'], m: 'Moon' },
    
    // Numbers
    { eng: 'okati', tel: 'ఒకటి', s_eng: ['o', 'ka', 'ti'], s_tel: ['ఒ', 'క', 'టి'], m: 'One' },
    { eng: 'rendu', tel: 'రెండు', s_eng: ['re', 'n', 'du'], s_tel: ['రె', 'ం', 'డు'], m: 'Two' },
    { eng: 'moodu', tel: 'మూడు', s_eng: ['muu', 'du'], s_tel: ['మూ', 'డు'], m: 'Three' },
    { eng: 'nalugu', tel: 'నాలుగు', s_eng: ['naa', 'lu', 'gu'], s_tel: ['నా', 'లు', 'గు'], m: 'Four' },
    { eng: 'aidu', tel: 'ఐదు', s_eng: ['ai', 'du'], s_tel: ['ఐ', 'దు'], m: 'Five' },
    { eng: 'aaru', tel: 'ఆరు', s_eng: ['aa', 'ru'], s_tel: ['ఆ', 'రు'], m: 'Six' },
    { eng: 'yedu', tel: 'ఏడు', s_eng: ['ye', 'du'], s_tel: ['ఏ', 'డు'], m: 'Seven' },
    { eng: 'enimidi', tel: 'ఎనిమిది', s_eng: ['e', 'ni', 'mi', 'di'], s_tel: ['ఎ', 'ని', 'మి', 'ది'], m: 'Eight' },
    { eng: 'thommidi', tel: 'తొమ్మిది', s_eng: ['tho', 'mmi', 'di'], s_tel: ['తొ', 'మ్మి', 'ది'], m: 'Nine' },
    { eng: 'padi', tel: 'పది', s_eng: ['pa', 'di'], s_tel: ['ప', 'ది'], m: 'Ten' },

    // Feelings & Misc
    { eng: 'prema', tel: 'ప్రేమ', s_eng: ['pre', 'ma'], s_tel: ['ప్రే', 'మ'], m: 'Love' },
    { eng: 'kopam', tel: 'కోపం', s_eng: ['ko', 'pa', 'm'], s_tel: ['కో', 'ప', 'ం'], m: 'Anger' },
    { eng: 'santhosham', tel: 'సంతోషం', s_eng: ['sa', 'n', 'tho', 'sha', 'm'], s_tel: ['స', 'ం', 'తో', 'ష', 'ం'], m: 'Happiness' },
    { eng: 'badha', tel: 'బాధ', s_eng: ['baa', 'dha'], s_tel: ['బా', 'ధ'], m: 'Sadness' },
    { eng: 'aakali', tel: 'ఆకలి', s_eng: ['aa', 'ka', 'li'], s_tel: ['ఆ', 'క', 'లి'], m: 'Hunger' },
    { eng: 'nidra', tel: 'నిద్ర', s_eng: ['ni', 'dra'], s_tel: ['ని', 'ద్ర'], m: 'Sleep' },
    { eng: 'bayam', tel: 'భయం', s_eng: ['bha', 'ya', 'm'], s_tel: ['భ', 'య', 'ం'], m: 'Fear' },

    // More Verbs & Actions
    { eng: 'parigettu', tel: 'పరిగెత్తు', s_eng: ['pa', 'ri', 'ge', 'ttu'], s_tel: ['ప', 'రి', 'గె', 'త్తు'], m: 'Run' },
    { eng: 'nadu', tel: 'నడు', s_eng: ['na', 'du'], s_tel: ['న', 'డు'], m: 'Walk' },
    { eng: 'kottu', tel: 'కొట్టు', s_eng: ['ko', 'ttu'], s_tel: ['కొ', 'ట్టు'], m: 'Hit / Beat' },
    { eng: 'paadu', tel: 'పాడు', s_eng: ['paa', 'du'], s_tel: ['పా', 'డు'], m: 'Sing' },
    { eng: 'aadu', tel: 'ఆడు', s_eng: ['aa', 'du'], s_tel: ['ఆ', 'డు'], m: 'Play' },
    { eng: 'chaduvu', tel: 'చదువు', s_eng: ['cha', 'du', 'vu'], s_tel: ['చ', 'దు', 'వు'], m: 'Read / Study' },
    { eng: 'raayi', tel: 'రాయి', s_eng: ['raa', 'yi'], s_tel: ['రా', 'యి'], m: 'Write / Stone' }, // Can be verb or noun
    { eng: 'navvu', tel: 'నవ్వు', s_eng: ['na', 'vvu'], s_tel: ['న', 'వ్వు'], m: 'Smile / Laugh' },
    { eng: 'edu', tel: 'ఏడువు', s_eng: ['ye', 'du', 'vu'], s_tel: ['ఏ', 'డు', 'వు'], m: 'Cry' }
];

// Transform structure to match the expected format in app.js
const formattedData = rawWords.map(w => ({
    eng: w.eng,
    tel: w.tel,
    syllables_eng: w.s_eng,
    syllables_tel: w.s_tel,
    meaning: w.m
}));

const fileContent = `const wordsData = ${JSON.stringify(formattedData, null, 4)};\n`;
fs.writeFileSync('wordsData.js', fileContent, 'utf-8');
console.log('Successfully generated ' + formattedData.length + ' words!');
