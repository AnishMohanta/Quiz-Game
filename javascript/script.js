const questionStatus = document.querySelector(".questionstatus")
const nextQuestionBtn = document.querySelector(".next-question-btn")
const answerOprtions = document.querySelector(".answer-options")
const timerDisplay = document.querySelector(".time-duration")
const resultContainer = document.querySelector(".resContainer")
const quizContainer = document.querySelector(".quiz-container")
const configContainer = document.querySelector(".configContainer")

let quizCategory = "programming"
const QIndexHistory = []
let currQuestion = null
let numOfQ = 10

const Quiz_TIME_Limit = 10
let currentTime = Quiz_TIME_Limit;

let timer = null;
let correctAnswersCount = 0


document.addEventListener("visibilitychange", () => {
    if (document.hidden && quizContainer.style.display === "block") {
        clearInterval(timer)
        quizContainer.style.display = "none"

      
        resultContainer.style.display = "block";

        document.querySelector(".result-message").innerHTML = `Quiz ended because you tried to cheat<br>You answered <b>${correctAnswersCount}</b> out of <b>${numOfQ}</b> questions correctly.`
    }
});


function stopTimerAnim() {
    const timerI = document.querySelector(".quiz-timer span")
    timerI.style.animation = "none"
}
const resetTimer = () => {

    currentTime = Quiz_TIME_Limit;
    timerDisplay.textContent = `${currentTime}s`

    const timerI = document.querySelector(".quiz-timer span");
    timerI.style.animation = "pulse 1s infinite ease-in-out"
    clearInterval(timer)
}
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--
        timerDisplay.textContent = `${currentTime}s`
        if (currentTime <= 0) {
            clearInterval(timer)


            stopTimerAnim()
            highlightCorrectAnswer()

            answerOprtions.querySelectorAll(".answer-option").forEach((option) => {
                option.style.pointerEvents = "none"
            });
            nextQuestionBtn.style.visibility = "visible";

        }
    }, 1000)
}
const showQuizResult = () => {
    quizContainer.style.display = "none"
    resultContainer.style.display = "block"

    const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numOfQ}</b> questions correctly.Nice try!`

    document.querySelector(".result-message").innerHTML = resultText
}

const getRandomQuestion = () => {
    const catagoryQuestions = questions.find(cat => cat.category.toLocaleLowerCase() === quizCategory.toLocaleLowerCase()).questions || [];

    if (QIndexHistory.length >= Math.min(catagoryQuestions.length, numOfQ)) {
        return showQuizResult();
    }



    const availableQ = catagoryQuestions.filter((_, index) => {

        return !QIndexHistory.includes(index);
    });
    const randomQuestion = availableQ[Math.floor(Math.random() * availableQ.length)]
    QIndexHistory.push(catagoryQuestions.indexOf(randomQuestion))
   
   
    return randomQuestion
}



const highlightCorrectAnswer = () => {
    const correctOption = answerOprtions.querySelectorAll(".answer-option")[currQuestion.correctAnswer];
    correctOption.classList.add("correct")

    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;


    correctOption.insertAdjacentHTML("beforeend", iconHTML)
};
const handleAnswer = (option, answerIndex) => {
    const isCorrect = currQuestion.correctAnswer === answerIndex;
    stopTimerAnim()


    clearInterval(timer)
    if (isCorrect) {
        correctAnswersCount++
    }

    option.classList.add(isCorrect ? "correct" : "incorrect")
    const iconName = isCorrect ? "check_circle" : "cancel";
    option.insertAdjacentHTML("beforeend", `<span class="material-symbols-rounded">${iconName}</span>`);

    if (!isCorrect) {
        highlightCorrectAnswer()
    }

    answerOprtions.querySelectorAll(".answer-option").forEach((option) => {
        option.style.pointerEvents = "none"
    });
    nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
    currQuestion = getRandomQuestion()
    if (!currQuestion) return
    console.log(currQuestion)


    resetTimer()
    startTimer()


    answerOprtions.innerHTML = ""
    nextQuestionBtn.style.visibility = "hidden";

    document.querySelector(".question-text").textContent = currQuestion.question;

    questionStatus.innerHTML = `<b>${QIndexHistory.length}</b> / <b>${numOfQ}</b> Questions`

    currQuestion.options.forEach((option, index) => {
        const li = document.createElement("li")
        li.classList.add("answer-option")

        li.textContent = option


        answerOprtions.appendChild(li)
        li.addEventListener("click", () => handleAnswer(li, index))
    })
}



const resetQuiz = () => {
    correctAnswersCount = 0
    resetTimer()

    QIndexHistory.length = 0;
    configContainer.style.display = "block"

    resultContainer.style.display = "none"
}
function startQuiz() {
    quizContainer.style.display = "block"
   
   
    configContainer.style.display = "none";

    quizCategory = configContainer.querySelector(".catagory-option.active").textContent;
    console.log("Category from button:", `"${quizCategory}"`)
    numOfQ = parseInt(configContainer.querySelector(".questionoption.active").textContent)
    console.log("Category from button:", `"${numOfQ}"`);
    
    
    renderQuestion()
}


document.querySelectorAll(".questionoption, .catagory-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active").classList.remove("active")
        option.classList.add("active")
    })
})





// renderQuestion()
nextQuestionBtn.addEventListener("click", renderQuestion)
document.querySelector(".start-quizButton").addEventListener("click", startQuiz)
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz)