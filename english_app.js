// Routing Logic
const landingPage = document.getElementById('landing-page');
const teluguApp = document.getElementById('telugu-app');
const englishApp = document.getElementById('english-app');

document.getElementById('select-telugu-btn').addEventListener('click', () => {
    landingPage.classList.add('hidden');
    teluguApp.classList.remove('hidden');
});

document.getElementById('select-english-btn').addEventListener('click', () => {
    landingPage.classList.add('hidden');
    englishApp.classList.remove('hidden');
});

document.getElementById('telugu-home-btn').addEventListener('click', () => {
    teluguApp.classList.add('hidden');
    landingPage.classList.remove('hidden');
});

document.getElementById('english-home-btn').addEventListener('click', () => {
    englishApp.classList.add('hidden');
    landingPage.classList.remove('hidden');
});

// English Trainer Logic
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const apiWarning = document.getElementById('api-warning');
const chatHistory = document.getElementById('chat-history');
const paragraphContainer = document.getElementById('paragraph-container');
const recordBtn = document.getElementById('record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const speechStatus = document.getElementById('speech-status');
const moduleTitle = document.getElementById('module-title');
const moduleInstructions = document.getElementById('module-instructions');

const englishSpeakingArea = document.getElementById('english-speaking-area');
const englishQuizArea = document.getElementById('english-quiz-area');
const englishQuizQuestion = document.getElementById('english-quiz-question');
const englishQuizOptions = document.getElementById('english-quiz-options');
const englishQuizFeedback = document.getElementById('english-quiz-feedback');
const englishQuizNextBtn = document.getElementById('english-quiz-next-btn');

// Settings
document.getElementById('settings-btn').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    apiKeyInput.value = localStorage.getItem('gemini_api_key') || '';
});
document.getElementById('close-settings-btn').addEventListener('click', () => settingsModal.classList.add('hidden'));
document.getElementById('save-settings-btn').addEventListener('click', () => {
    localStorage.setItem('gemini_api_key', apiKeyInput.value.trim());
    settingsModal.classList.add('hidden');
    checkApiKey();
});

function getApiKey() {
    return localStorage.getItem('gemini_api_key') || '';
}

function checkApiKey() {
    if (!getApiKey()) {
        apiWarning.innerText = "Tip: Set your Google Gemini API Key in settings for a much faster Conversation Bot!";
        apiWarning.classList.remove('hidden');
    } else {
        apiWarning.classList.add('hidden');
    }
}

// Module State
let currentModule = 0;
let chatMessages = []; // for conversation bot context
let recognition = null;
let isRecording = false;
let currentParagraph = "";

const sampleParagraphs = [
    "I wake up early in the morning and go for a walk. The fresh air makes me feel energetic and ready for the day. After my walk, I eat a healthy breakfast and read the news.",
    "Shopping at the local market is always an exciting experience. The colorful vegetables, the smell of fresh fruits, and the friendly vendors make it very enjoyable.",
    "Last weekend, I went to the beach with my friends. We played volleyball, built sandcastles, and watched the beautiful sunset together."
];

// Open Module
function openEnglishModule(moduleId) {
    currentModule = moduleId;
    chatMessages = [];
    document.getElementById('english-dashboard').classList.add('hidden');
    document.getElementById('english-module-container').classList.remove('hidden');
    chatHistory.innerHTML = '';
    paragraphContainer.classList.add('hidden');
    checkApiKey();
    
    if (moduleId === 4) {
        englishSpeakingArea.classList.add('hidden');
        englishQuizArea.classList.remove('hidden');
        moduleTitle.innerText = "Skills Improvement Quiz";
        moduleInstructions.innerText = "Answer these grammar and vocabulary questions to test your skills!";
        startEnglishQuiz();
    } else {
        englishSpeakingArea.classList.remove('hidden');
        englishQuizArea.classList.add('hidden');
        
        if(moduleId === 1) {
            moduleTitle.innerText = "Speaking Practice & Analysis";
            moduleInstructions.innerText = "Read the paragraph aloud. The AI will analyze your pronunciation and missing words.";
            currentParagraph = sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)];
            paragraphContainer.innerText = currentParagraph;
            paragraphContainer.classList.remove('hidden');
        } else if(moduleId === 2) {
            moduleTitle.innerText = "Conversation Bot";
            moduleInstructions.innerText = "Chat with a friendly AI trainer. Say 'Hello' to begin!";
            addMessageToChat("AI", "Hello! I am your friendly English trainer. How are you doing today?");
        } else if(moduleId === 3) {
            moduleTitle.innerText = "Topic-Based Speaking";
            moduleInstructions.innerText = "Speak for 30-60 seconds on the topic given by the AI.";
            generateTopic();
        }
    }
}

document.getElementById('back-to-english-dashboard').addEventListener('click', () => {
    document.getElementById('english-module-container').classList.add('hidden');
    document.getElementById('english-dashboard').classList.remove('hidden');
    if(isRecording) stopRecording();
});

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isRecording = true;
        recordBtn.classList.add('hidden');
        stopRecordBtn.classList.remove('hidden');
        speechStatus.innerText = "Listening...";
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        speechStatus.innerText = "Hearing: " + (interimTranscript || finalTranscript);
        
        if(finalTranscript) {
            recognition.finalText = (recognition.finalText || '') + " " + finalTranscript;
        }
    };

    recognition.onerror = function(event) {
        speechStatus.innerText = "Error occurred in recognition: " + event.error;
        stopRecording();
    };

    recognition.onend = function() {
        if(isRecording) {
            // Restart if stopped unexpectedly (e.g. due to pause in speech)
            try {
                recognition.start();
            } catch (e) {
                console.error("Could not restart recognition automatically", e);
            }
        }
    };
} else {
    speechStatus.innerText = "Speech recognition is not supported in this browser. Please use Google Chrome.";
}

recordBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.finalText = ""; // Clear text on new manual start
        recognition.start();
    }
});

stopRecordBtn.addEventListener('click', () => {
    if (recognition && isRecording) {
        isRecording = false; // Prevents onend from firing twice
        recognition.stop();
        recordBtn.classList.remove('hidden');
        stopRecordBtn.classList.add('hidden');
        speechStatus.innerText = "Processing...";
        processSpeech(recognition.finalText);
        recognition.finalText = "";
    }
});

// Process User Speech
async function processSpeech(text) {
    if(!text || text.trim() === '') {
        speechStatus.innerText = "No speech detected. Try again.";
        return;
    }
    
    addMessageToChat("You", text.trim());
    speechStatus.innerText = "AI is thinking...";
    
    let prompt = "";
    if (currentModule === 1) {
        prompt = `You are an English speaking trainer. The expected paragraph is: "${currentParagraph}". The user spoke: "${text.trim()}". Analyze the user's speaking in a beginner-friendly way. Output EXACTLY in this format:

1. Mistakes:
- [issues]
2. Correct Sentence:
- [correct version]
3. Fluency Score:
- [score/10]
4. Tips to Improve:
- [tips]

Keep language simple.`;
    } else if (currentModule === 2) {
        prompt = `You are a friendly English communication trainer. The user says: "${text.trim()}". Talk with the user in simple English. Keep sentences short. Ask a question to continue the conversation. If they made mistakes, first show correct sentence then explain simply. Be supportive.`;
    } else if (currentModule === 3) {
        prompt = `You are an English speaking coach. The user just spoke on their topic: "${text.trim()}". Analyze their speaking, give short simple feedback, and then give them a NEW simple daily life topic to speak about for 30-60 seconds, along with 2-3 guiding questions.`;
    } else if (currentModule === 4) {
        prompt = `You are an English communication expert. The user said: "${text.trim()}". Output EXACTLY in this format:

1. Grammar Feedback:
- [correction]
2. Better Sentence:
- [improved]
3. Vocabulary Suggestion:
- [1-2 words]
4. Communication Tips:
- [2 tips]`;
    }
    
    try {
        const aiResponse = await callOpenSourceAPI(prompt);
        addMessageToChat("AI", aiResponse);
    } catch(err) {
        addMessageToChat("System", "Error: " + err.message);
    }
    speechStatus.innerText = "";
}

async function generateTopic() {
    if(!getApiKey()) return;
    speechStatus.innerText = "Generating topic...";
    const prompt = `You are an English speaking coach. Give the user ONE simple daily life speaking topic to speak about for 30-60 seconds. Also give 2-3 simple guiding questions. Format nicely.`;
    try {
        const topic = await callOpenSourceAPI(prompt);
        addMessageToChat("AI", topic);
    } catch(err) {
        addMessageToChat("System", "Error: " + err.message);
    }
    speechStatus.innerText = "";
}

function addMessageToChat(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '15px';
    msgDiv.style.width = '100%';
    
    // Formatting text (convert newlines to <br> and bold text)
    let formattedText = text.replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
    
    if (sender === "You") {
        msgDiv.innerHTML = `<strong style="color: var(--primary);">${sender}:</strong> <div style="background: rgba(255,107,107,0.1); padding: 10px; border-radius: 8px; margin-top: 5px;">${formattedText}</div>`;
    } else if (sender === "AI") {
        msgDiv.innerHTML = `<strong style="color: var(--tertiary-dark);">${sender}:</strong> <div style="background: rgba(29,209,161,0.1); padding: 10px; border-radius: 8px; margin-top: 5px;">${formattedText}</div>`;
    } else {
        msgDiv.innerHTML = `<strong style="color: red;">${sender}:</strong> <div style="color: red;">${formattedText}</div>`;
    }
    
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// API Call Router
async function callOpenSourceAPI(promptText) {
    const apiKey = getApiKey();
    if (apiKey) {
        return await callGeminiAPI(promptText, apiKey);
    }

    const url = `https://text.pollinations.ai/openai`;
    
    // Add to chat history context for conversation mode
    if(currentModule === 2) {
        chatMessages.push({ role: "user", content: promptText });
    } else {
        // For other modules, just single shot
        chatMessages = [{ role: "user", content: promptText }];
    }
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: chatMessages,
            model: "openai"
        })
    });
    
    if(!response.ok) {
        throw new Error("Failed to fetch from the open-source API");
    }
    
    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    if(currentModule === 2) {
        chatMessages.push({ role: "assistant", content: reply });
    }
    
    return reply;
}

// Google Gemini API Call
async function callGeminiAPI(promptText, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    let contents = [];
    if (currentModule === 2) {
        chatMessages.push({ role: "user", content: promptText });
        contents = chatMessages.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));
    } else {
        contents = [{ role: "user", parts: [{ text: promptText }] }];
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contents })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API. Check your API key.");
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    if (currentModule === 2) {
        chatMessages.push({ role: "assistant", content: reply });
    }

    return reply;
}

// Skills Improvement Quiz Logic
let currentQuizIndex = 0;
let quizScore = 0;

function startEnglishQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    // Shuffle grammarData
    grammarData.sort(() => Math.random() - 0.5);
    loadEnglishQuizQuestion();
}

function loadEnglishQuizQuestion() {
    englishQuizOptions.innerHTML = '';
    englishQuizFeedback.innerHTML = '';
    englishQuizNextBtn.classList.add('hidden');
    
    if (currentQuizIndex >= grammarData.length || currentQuizIndex >= 5) {
        englishQuizQuestion.innerText = `Quiz Complete! Your score: ${quizScore} out of ${Math.min(5, grammarData.length)}`;
        return;
    }

    const q = grammarData[currentQuizIndex];
    englishQuizQuestion.innerText = `Q${currentQuizIndex + 1}: ${q.question}`;

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.style.width = "100%"; // Take full width
        btn.innerText = opt;
        btn.onclick = () => checkEnglishQuizAnswer(opt, q, btn);
        englishQuizOptions.appendChild(btn);
    });
}

function checkEnglishQuizAnswer(selected, q, btnElement) {
    const allBtns = englishQuizOptions.querySelectorAll('button');
    allBtns.forEach(b => b.disabled = true);

    if (selected === q.answer) {
        btnElement.classList.add('correct');
        englishQuizFeedback.innerHTML = `<span style="color: #2e7d32; font-weight: bold;">Correct!</span> ${q.explanation}`;
        quizScore++;
    } else {
        btnElement.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.innerText === q.answer) {
                b.classList.add('correct');
            }
        });
        englishQuizFeedback.innerHTML = `<span style="color: #c62828; font-weight: bold;">Incorrect.</span> ${q.explanation}`;
    }
    englishQuizNextBtn.classList.remove('hidden');
}

englishQuizNextBtn.addEventListener('click', () => {
    currentQuizIndex++;
    loadEnglishQuizQuestion();
});
