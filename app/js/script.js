const quizSection = document.querySelector('.quiz');
const subjectBtns = document.querySelectorAll('.quiz__subject-btn');
const questionsSection = document.querySelector('.questions');
const selectedQuiz = document.querySelector('#selected-quiz');
const topicTitle = document.querySelector('#title');
const topicIcon = document.querySelector('#icon img');
const questionNumber = document.querySelector('#question-number');
const quizQuestion = document.querySelector('#question');
const questionProgress = document.querySelector('.questions__progress');
const answerList = document.querySelector('#options');
const submitBtn = document.querySelector('#submit-answer');
const nextBtn = document.querySelector('#next-question');
const errorMessage = document.querySelector('#error-message');
const resultsSection = document.querySelector('.results');
const scoreDisplay = document.querySelector('#score');
const playAgainBtn = document.querySelector('#play-again');
const themeToggleBtn = document.querySelector('#theme-toggle');

const resultsTitle = document.querySelector('#results-title');
const resultsIcon = document.querySelector('#results-icon img');

let currentQuestionIndex = 0;
let score = 0;
let selectedSubject = '';
let questions = [];
let quizData = {};

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    quizData = data.quizzes;

    subjectBtns.forEach((button) => {
      button.addEventListener('click', () => {
        selectedSubject = button.dataset.subject;
        loadQuestions(selectedSubject);
        quizSection.style.display = 'none';
        questionsSection.style.display = 'block';
      });
    });
  });

function escapeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

function loadQuestions(subject) {
  const selectedQuizData = quizData.find(
    (quiz) => quiz.title.toLowerCase() === subject
  );

  if (selectedQuizData) {
    questions = selectedQuizData.questions;
    currentQuestionIndex = 0;
    score = 0;

    topicTitle.textContent = selectedQuizData.title.toUpperCase();
    topicIcon.src = selectedQuizData.icon;

    resultsTitle.textContent = selectedQuizData.title.toUpperCase();
    resultsIcon.src = selectedQuizData.icon;

    showQuestion();
  }
}

function showQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionNumber.textContent = currentQuestionIndex + 1;
    quizQuestion.textContent = currentQuestion.question;

    answerList.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('questions__list-item');

      listItem.innerHTML = `
        <button class="questions__answer-btn" data-answer="${option}">
          <span class="questions__letter">${String.fromCharCode(
            65 + index
          )}</span>
          <span class="questions__text">${escapeHTML(option)}</span>
          <span class="questions__icon-wrapper">
            <img src="/img/icon-correct.svg" alt="correct" class="correct-icon" style="display: none;"/>
            <img src="/img/icon-incorrect.svg" alt="incorrect" class="incorrect-icon" style="display: none;"/>
          </span>
        </button>`;

      answerList.appendChild(listItem);
    });

    questionProgress.style.width = `${
      ((currentQuestionIndex + 1) / questions.length) * 100
    }%`;

    document.querySelectorAll('.questions__answer-btn').forEach((button) => {
      button.addEventListener('click', handleAnswerSelection);
    });

    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
    errorMessage.style.display = 'none';
  } else {
    showResults();
  }
}

function handleAnswerSelection(event) {
  const selectedAnswerButton = event.currentTarget;
  const letterSpan = selectedAnswerButton.querySelector('.questions__letter');

  document.querySelectorAll('.questions__answer-btn').forEach((button) => {
    button.classList.remove('selected');
    button.style.borderColor = '';
    button.querySelector('.questions__letter').style.backgroundColor = '';
  });

  selectedAnswerButton.classList.add('selected');
  selectedAnswerButton.style.borderColor = 'hsl(277, 91%, 56%)';
  letterSpan.style.backgroundColor = 'hsl(277, 91%, 56%)';
  letterSpan.style.color = '#fff';
}

function handleAnswerSubmit() {
  const selectedAnswerButton = document.querySelector('.selected');

  if (!selectedAnswerButton) {
    errorMessage.style.display = 'flex';
    return;
  }

  const selectedAnswer = selectedAnswerButton.dataset.answer;
  const correctAnswer = questions[currentQuestionIndex].answer;

  document.querySelectorAll('.questions__answer-btn').forEach((btn) => {
    const isCorrect = btn.dataset.answer === correctAnswer;
    const correctIcon = btn.querySelector('.correct-icon');
    const incorrectIcon = btn.querySelector('.incorrect-icon');
    const letterSpan = btn.querySelector('.questions__letter');

    correctIcon.style.display = 'none';
    incorrectIcon.style.display = 'none';

    if (isCorrect) {
      btn.style.borderColor = '#26D782';
      letterSpan.style.backgroundColor = '#26D782';
      letterSpan.style.color = '#fff';
      correctIcon.style.display = 'block';
    } else {
      if (btn.classList.contains('selected')) {
        btn.style.borderColor = '#EE5454';
        letterSpan.style.backgroundColor = '#EE5454';
        letterSpan.style.color = '#fff';
        incorrectIcon.style.display = 'block';
      }
    }

    btn.disabled = true;
  });

  if (selectedAnswer === correctAnswer) {
    score++;
  }

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
}

function showResults() {
  questionsSection.style.display = 'none';
  resultsSection.style.display = 'block';
  scoreDisplay.textContent = `${score} / ${questions.length}`;
}

submitBtn.addEventListener('click', handleAnswerSubmit);

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion();
});

playAgainBtn.addEventListener('click', () => {
  resultsSection.style.display = 'none';
  quizSection.style.display = 'block';
});

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
