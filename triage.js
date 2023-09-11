
const questions = [
    "Does the child have any allergies to medicines, food, or any vaccine?",
    "Has the child had a serious reaction to a vaccine in the past?",

];
let questionIndex = 0;
const responses = {};

//Get DOM elements
const questionContainer = document.getElementById("question-container");
const responseTextarea = document.getElementById("response");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button"); 
const settingsButton = document.getElementById("settings-button");
const settingsModal = document.getElementById("settings-modal");
const closeModal = document.querySelector(".close");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true; 


const speechSynthesis = window.speechSynthesis;
const tts = new SpeechSynthesisUtterance();
startButton.addEventListener("click", () => {
    if (questionIndex < questions.length) {
        askQuestion();
    } else {

        processResponses();
    }
});

function askQuestion() {

    responses[questions[questionIndex]] = "";


    questionContainer.innerHTML = questions[questionIndex];


    tts.text = questions[questionIndex];


    speechSynthesis.speak(tts);


    tts.onend = () => {
        startSpeechRecognition();
    };
}


function startSpeechRecognition() {
    
    recognition.start();

   
    startButton.disabled = true;
    stopButton.style.display = "inline-block"; 
    responseTextarea.value = "Listening... (Click 'Stop' to finish)";
}


stopButton.addEventListener("click", () => {

    recognition.stop();


    startButton.disabled = false;


    stopButton.style.display = "none";
});


recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    responses[questions[questionIndex]] += transcript;
    responseTextarea.value = responses[questions[questionIndex]];
};


recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    responseTextarea.value = "Speech recognition error. Please try again.";
};


recognition.onend = () => {

    recognition.stop();


    startButton.disabled = false;


    if (questionIndex < questions.length) {
        questionIndex++;
        askQuestion();
    } else {
        
        processResponses();
    }
};


function processResponses() {
    console.log("Responses:");
    for (const [question, response] of Object.entries(responses)) {
        console.log(`Question: ${question}`);
        console.log(`Response: ${response}`);
        console.log("-----");
    }
}


settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "block";
});


closeModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
});


window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});


