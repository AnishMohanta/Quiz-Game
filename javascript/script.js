const questionStatus = document.querySelector(".question-status")
const nextQuestionBtn = document.querySelector(".next-question-btn")
const answerOprtions = document.querySelector(".answer-options")
const timerDisplay = document.querySelector(".time-duration")
const resultContainer = document.querySelector(".result-container")
const quizContainer = document.querySelector(".quiz-container")
const configContainer = document.querySelector(".config-container")
let quizCategory = "programming"
const questionsIndexHistory = []
let currentQuestion = null
let numberOfQuestions =10
const QUIZ_TIME_LIMIT =10
let currentTime = QUIZ_TIME_LIMIT;
let timer= null;
let correctAnswersCount=0

const resetTimer =()=>{
    clearInterval(timer)
    currentTime= QUIZ_TIME_LIMIT;
    timerDisplay.textContent=`${currentTime}s`
}
const startTimer=()=>{
    timer = setInterval(()=>{
        currentTime--
timerDisplay.textContent=`${currentTime}s`
        if(currentTime<=0){
            clearInterval(timer)
             highlightCorrectAnswer()
             
  answerOprtions.querySelectorAll(".answer-option").forEach((option) => {
        option.style.pointerEvents = "none"
    });
    nextQuestionBtn.style.visibility = "visible";
             
        }
    },1000)
}
const showQuizResult=()=>{
quizContainer.style.display = "none"
resultContainer.style.display = "block"

const resultText=`You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly.Nice try!`

document.querySelector(".result-message").innerHTML = resultText
}

const getRandomQuestion = () => {
    const catagoryQuestions = questions.find(cat => cat.category.toLocaleLowerCase() === quizCategory.toLocaleLowerCase()).questions || [];

    if(questionsIndexHistory.length>= Math.min(catagoryQuestions.length,numberOfQuestions)){
return showQuizResult();
    }



    const availableQuestions = catagoryQuestions.filter((_, index) => {
        return !questionsIndexHistory.includes(index);
    });
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    questionsIndexHistory.push(catagoryQuestions.indexOf(randomQuestion))
    return randomQuestion
}

const highlightCorrectAnswer = () => {
    const correctOption = answerOprtions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct")

    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML)
};

const handleAnswer = (option, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
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
    currentQuestion = getRandomQuestion()
    if (!currentQuestion) return
    console.log(currentQuestion)
resetTimer()
    startTimer()


    answerOprtions.innerHTML = ""
    nextQuestionBtn.style.visibility = "hidden";

    document.querySelector(".question-text").textContent = currentQuestion.question;

questionStatus.innerHTML =`<b>${questionsIndexHistory.length}</b> / <b>${numberOfQuestions}</b> Questions`

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li")
        li.classList.add("answer-option")
        li.textContent = option
        answerOprtions.appendChild(li)
        li.addEventListener("click", () => handleAnswer(li, index))
    })
}
const resetQuiz=()=>{
    correctAnswersCount=0
    resetTimer()
    questionsIndexHistory.length=0;
configContainer.style.display="block"
resultContainer.style.display="none"
}
const startQuiz=()=>{
    quizContainer.style.display="block";
    configContainer.style.display="none";
quizCategory = configContainer.querySelector(".catagory-option.active").textContent;
console.log("Category from button:", `"${quizCategory}"`);
numberOfQuestions =parseInt(configContainer.querySelector(".question-option.active").textContent);
console.log("Category from button:", `"${numberOfQuestions}"`);
renderQuestion()
}


document.querySelectorAll(".question-option, .catagory-option").forEach(option=>{
    option.addEventListener("click",()=>{
        option.parentNode.querySelector(".active").classList.remove("active")
        option.classList.add("active")
    })
})
// renderQuestion()

nextQuestionBtn.addEventListener("click", renderQuestion)
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz)
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz)