// State variables
let voiceTeacherEnabled = false;
let learnedLetters = JSON.parse(localStorage.getItem('learnedLetters')) || [];
let currentQuizCorrectItem = null;
let currentlySelectedCard = null;

function handleCardSelection(card) {
    if (currentlySelectedCard) {
        currentlySelectedCard.classList.remove('active-card');
    }
    card.classList.add('active-card');
    currentlySelectedCard = card;
}

// DOM Elements
const startLearningBtn = document.getElementById('start-learning-btn');
const toggleVoiceBtn = document.getElementById('toggle-voice-btn');
const alphabetGrid = document.getElementById('alphabet-grid');
const alphabetSection = document.getElementById('alphabet-section');
const quizSection = document.getElementById('quiz-section');
const progressCount = document.getElementById('progress-count');
const progressFill = document.getElementById('progress-fill');
const startQuizBtn = document.getElementById('start-quiz-btn');
const endQuizBtn = document.getElementById('end-quiz-btn');
const playQuizSoundBtn = document.getElementById('play-quiz-sound-btn');
const backHomeBtn = document.getElementById('back-home-btn');
const viewStructuredBtn = document.getElementById('view-structured-btn');
const viewVocabularyBtn = document.getElementById('view-vocabulary-btn');
const startJumbledBtn = document.getElementById('start-jumbled-btn');
const jumbledSection = document.getElementById('jumbled-section');
const jumbledMeaning = document.getElementById('jumbled-meaning');
const jumbledAnswerBox = document.getElementById('jumbled-answer-box');
const jumbledOptions = document.getElementById('jumbled-options');
const jumbledFeedback = document.getElementById('jumbled-feedback');
const nextWordBtn = document.getElementById('next-word-btn');
const endJumbledBtn = document.getElementById('end-jumbled-btn');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const nextQuizBtn = document.getElementById('next-quiz-btn');

// Initialize Synthesis API
const synth = window.speechSynthesis;

// Functions
function init() {
    renderAlphabet();
    updateProgress();
}

function updateProgress() {
    let total = 0;
    guninthaluData.forEach(c => total += c.combinations.length);
    const learned = learnedLetters.length;
    progressCount.innerText = learned;
    progressFill.style.width = `${(learned / total) * 100}%`;
}

function speak(text, lang = 'en-US') {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Slightly slower rate for clarity
    utterance.rate = 0.9;
    utterance.lang = lang;
    synth.speak(utterance);
}

function pronounceLetter(item) {
    let baseLetter = item.eng; // e.g., 'kaa'
    let spelledOut = baseLetter.split('').join(', '); // e.g., 'k, a, a'
    
    let textToSpeak = `${spelledOut}, , , ${baseLetter}`;
    if (voiceTeacherEnabled) {
        textToSpeak = `${spelledOut}. ${baseLetter}. Repeat after me, ${baseLetter}`;
    }
    speak(textToSpeak);
}

function markAsLearned(letter) {
    if (!learnedLetters.includes(letter)) {
        learnedLetters.push(letter);
        localStorage.setItem('learnedLetters', JSON.stringify(learnedLetters));
        updateProgress();
        const card = document.querySelector(`.card[data-letter="${letter}"]`);
        if (card) card.classList.add('learned');
    }
}

function renderAlphabet() {
    renderStructured();
}

function createCard(item) {
    const isLearned = learnedLetters.includes(item.eng);
    const card = document.createElement('div');
    card.className = `card ${isLearned ? 'learned' : ''}`;
    card.dataset.letter = item.eng;
    
    card.innerHTML = `
        <i class="fa-solid fa-volume-up sound-icon"></i>
        <h3 style="margin-bottom: 0;">${item.eng}</h3>
        <div style="font-size: 1.2rem; color: var(--text-light); margin-top: 5px;">${item.tel}</div>
    `;
    
    card.addEventListener('click', () => {
        pronounceLetter(item);
        markAsLearned(item.eng);
        handleCardSelection(card);
        
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.style.transform = '', 150);
    });
    return card;
}

function renderStructured() {
    alphabetGrid.innerHTML = '';
    
    guninthaluData.forEach(group => {
        const groupHeader = document.createElement('h3');
        groupHeader.style.color = 'var(--primary-dark)';
        groupHeader.style.marginBottom = '0.5rem';
        groupHeader.style.fontSize = '1.8rem';
        groupHeader.innerText = `${group.consonant_tel} (${group.consonant_eng})`;
        alphabetGrid.appendChild(groupHeader);
        
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row-group';
        
        group.combinations.forEach(item => {
            rowDiv.appendChild(createCard(item));
        });
        
        alphabetGrid.appendChild(rowDiv);
    });
}

function renderVocabulary() {
    alphabetGrid.innerHTML = '';
    
    // Header for vocabulary
    const groupHeader = document.createElement('h3');
    groupHeader.style.color = 'var(--primary-dark)';
    groupHeader.style.marginBottom = '0.5rem';
    groupHeader.style.fontSize = '1.8rem';
    groupHeader.innerText = `Vocabulary Words (${wordsData.length})`;
    alphabetGrid.appendChild(groupHeader);
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row-group';
    
    wordsData.forEach(w => {
        const card = document.createElement('div');
        card.className = `card`;
        
        card.innerHTML = `
            <i class="fa-solid fa-volume-up sound-icon"></i>
            <h3 style="margin-bottom: 0;">${w.eng}</h3>
            <div style="font-size: 1.2rem; color: var(--text-light); margin-top: 5px;">${w.tel}</div>
            <div style="font-size: 0.9rem; color: var(--primary); margin-top: 5px; font-weight: bold;">${w.meaning}</div>
        `;
        
        card.addEventListener('click', () => {
            speak(w.tel, 'te-IN');
            handleCardSelection(card);
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.style.transform = '', 150);
        });
        
        rowDiv.appendChild(card);
    });
    
    alphabetGrid.appendChild(rowDiv);
}

// (Removed old playAll)

// Quiz Functions
function startQuiz() {
    alphabetSection.classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    quizSection.classList.remove('hidden');
    loadQuizQuestion();
}

function endQuiz() {
    quizSection.classList.add('hidden');
    alphabetSection.classList.remove('hidden');
    if(synth.speaking) synth.cancel();
}

function loadQuizQuestion() {
    quizFeedback.innerText = '';
    quizFeedback.className = 'quiz-feedback';
    nextQuizBtn.classList.add('hidden');
    quizOptions.innerHTML = '';
    
    // Flatten all items
    let allItems = [];
    guninthaluData.forEach(g => allItems.push(...g.combinations));
    
    // Pick random letter
    const randomIndex = Math.floor(Math.random() * allItems.length);
    currentQuizCorrectItem = allItems[randomIndex];
    
    // Pick 3 wrong options
    const options = [currentQuizCorrectItem];
    while(options.length < 4) {
        const randomWrong = allItems[Math.floor(Math.random() * allItems.length)];
        if(!options.includes(randomWrong)) {
            options.push(randomWrong);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerText = option.eng; // show english in quiz
        btn.onclick = () => handleQuizAnswer(option, btn);
        quizOptions.appendChild(btn);
    });
    
    playQuizSound();
}

function playQuizSound() {
    speak(currentQuizCorrectItem.tel, 'te-IN');
}

function handleQuizAnswer(selectedOption, btnElement) {
    const allBtns = document.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (selectedOption.eng === currentQuizCorrectItem.eng) {
        btnElement.classList.add('correct');
        quizFeedback.innerText = 'Excellent! Correct!';
        quizFeedback.className = 'quiz-feedback correct-text';
        speak('Correct!');
    } else {
        btnElement.classList.add('wrong');
        // Find correct button and highlight it
        allBtns.forEach(b => {
            if(b.innerText === currentQuizCorrectItem.eng) {
                b.classList.add('correct');
            }
        });
        quizFeedback.innerText = `Oops! The correct answer was ${currentQuizCorrectItem.eng}`;
        quizFeedback.className = 'quiz-feedback wrong-text';
        speak(`Oops, that was incorrect.`);
    }
    
    nextQuizBtn.classList.remove('hidden');
}

// Jumbled Word Game Functions
let currentWordIndex = 0;
let currentJumbledWord = null;
let currentSyllableIndex = 0;

function startJumbledGame() {
    alphabetSection.classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    jumbledSection.classList.remove('hidden');
    
    // Shuffle words Data for variety
    wordsData.sort(() => Math.random() - 0.5);
    currentWordIndex = 0;
    
    loadJumbledWord();
}

function loadJumbledWord() {
    jumbledFeedback.innerText = '';
    nextWordBtn.classList.add('hidden');
    jumbledAnswerBox.innerHTML = '';
    jumbledOptions.innerHTML = '';
    currentSyllableIndex = 0;
    
    if (currentWordIndex >= wordsData.length) {
        jumbledFeedback.innerText = "You've practiced all the words! Great job!";
        jumbledFeedback.className = 'quiz-feedback correct-text';
        return;
    }
    
    currentJumbledWord = wordsData[currentWordIndex];
    jumbledMeaning.innerText = `Meaning: ${currentJumbledWord.meaning}`;
    
    // Shuffle syllables
    const shuffled = currentJumbledWord.syllables_eng.map((syllable, idx) => ({ 
        eng: syllable, 
        tel: currentJumbledWord.syllables_tel[idx] 
    })).sort(() => Math.random() - 0.5);
    
    shuffled.forEach(s => {
        const btn = document.createElement('div');
        btn.className = 'syllable-card';
        btn.innerText = s.eng;
        btn.onclick = () => handleSyllableClick(s, btn);
        jumbledOptions.appendChild(btn);
    });
}

function handleSyllableClick(syllableObj, btnElement) {
    const expectedEng = currentJumbledWord.syllables_eng[currentSyllableIndex];
    
    if (syllableObj.eng === expectedEng) {
        // Correct
        speak(syllableObj.tel, 'te-IN');
        btnElement.classList.add('used');
        
        // Move to answer box
        const ansBlock = document.createElement('div');
        ansBlock.className = 'syllable-card';
        ansBlock.style.cursor = 'default';
        ansBlock.style.textAlign = 'center';
        ansBlock.innerHTML = `<div>${syllableObj.eng}</div><div style="font-size: 0.9rem; color:var(--text-light); margin-top:2px;">${syllableObj.tel}</div>`;
        jumbledAnswerBox.appendChild(ansBlock);
        
        currentSyllableIndex++;
        
        // Check if word is complete
        if (currentSyllableIndex === currentJumbledWord.syllables_eng.length) {
            jumbledFeedback.innerText = 'Excellent!';
            jumbledFeedback.className = 'quiz-feedback correct-text';
            
            setTimeout(() => speak(currentJumbledWord.tel, 'te-IN'), 500);
            nextWordBtn.classList.remove('hidden');
        }
    } else {
        // Wrong
        jumbledFeedback.innerText = 'Oops! Try the next sound.';
        jumbledFeedback.className = 'quiz-feedback wrong-text';
        speak("Oops");
        setTimeout(() => jumbledFeedback.innerText = '', 1500);
    }
}

function endJumbledGame() {
    jumbledSection.classList.add('hidden');
    alphabetSection.classList.remove('hidden');
    if(synth.speaking) synth.cancel();
}

// Event Listeners
startLearningBtn.addEventListener('click', () => {
    document.querySelector('.hero').classList.add('hidden');
    document.querySelector('.hero').style.display = ''; 
    alphabetSection.classList.remove('hidden');
    renderStructured();
});

backHomeBtn.addEventListener('click', () => {
    alphabetSection.classList.add('hidden');
    document.querySelector('.hero').classList.remove('hidden');
});

viewStructuredBtn.addEventListener('click', () => {
    renderStructured();
});

viewVocabularyBtn.addEventListener('click', () => {
    renderVocabulary();
});

startJumbledBtn.addEventListener('click', startJumbledGame);

nextWordBtn.addEventListener('click', () => {
    currentWordIndex++;
    loadJumbledWord();
});

endJumbledBtn.addEventListener('click', endJumbledGame);

toggleVoiceBtn.addEventListener('click', () => {
    voiceTeacherEnabled = !voiceTeacherEnabled;
    const icon = toggleVoiceBtn.querySelector('i');
    if (voiceTeacherEnabled) {
        icon.className = 'fa-solid fa-microphone';
        toggleVoiceBtn.classList.replace('secondary-btn', 'primary-btn');
        toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Voice Teacher ON';
        speak("Voice teacher enabled. Let's learn Telugu together!");
    } else {
        icon.className = 'fa-solid fa-microphone-slash';
        toggleVoiceBtn.classList.replace('primary-btn', 'secondary-btn');
        toggleVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Enable Voice Teacher';
        if(synth.speaking) synth.cancel();
    }
});

startQuizBtn.addEventListener('click', startQuiz);
endQuizBtn.addEventListener('click', endQuiz);
playQuizSoundBtn.addEventListener('click', playQuizSound);
nextQuizBtn.addEventListener('click', loadQuizQuestion);

// Run init
init();
