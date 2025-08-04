const totalLevels = 12;
let currentLevel = 1;
let correctAnswers = 0;
let finalCorrectAnswers = 0;
let finalTimeSeconds = 0;
let timeoutShown = false;
const startTime = Date.now();

// Общий таймер на всю игру
const totalGameTime = 70; 
let remainingTime = totalGameTime;
let gameTimer;

const targetNumberDiv = document.getElementById('targetNumber');
const answersContainer = document.getElementById('answersContainer');
const resultDiv = document.getElementById('result');

// Запуск общего таймера
function startGameTimer() {
  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.querySelector('.timer').textContent = `Время: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateTimerDisplay();

  gameTimer = setInterval(() => {
    remainingTime--;
    if (remainingTime < 0) {
      clearInterval(gameTimer);
      showTimeoutMessage(); 
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

// Запуск уровня
function startLevel(level) {
  // Обновляем уровень на экране
  document.querySelector('.level').textContent = `Уровень: ${level}-12`;
}

// Функция отображения сообщения "Время вышло"
function showTimeoutMessage() {
  if (timeoutShown) return;
  timeoutShown = true;

  const container = document.querySelector('.game-container');

  // Создаем затемняющий фон
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999'; 
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Создаем окно сообщения
  const msgDiv = document.createElement('div');
  msgDiv.id = 'timeoutMessage';
  msgDiv.style.position = 'fixed'; 
  msgDiv.style.top = '50%';
  msgDiv.style.left = '50%';
  msgDiv.style.transform = 'translate(-50%, -50%) scale(0)'; 
  msgDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  msgDiv.style.color = '#fff';
  msgDiv.style.padding = '20px';
  msgDiv.style.borderRadius = '10px';
  msgDiv.style.textAlign = 'center';
  msgDiv.style.transition = 'transform 0.3s ease';
  msgDiv.style.minWidth = '300px';

  const messageText = document.createElement('p');
  messageText.textContent = 'Время вышло';
  messageText.style.fontSize = '24px';
  messageText.style.marginBottom = '20px';

  const okButton = document.createElement('button');
  okButton.textContent = 'Ок';
  okButton.style.borderRadius= '10px';
  okButton.style.padding = '10px 20px';
  okButton.style.fontSize = '16px';
  okButton.style.cursor = 'pointer';
  okButton.style.fontWeight = 'bold';
  okButton.style.fontFamily = 'Comic Sans MS, sans-serif';

  okButton.addEventListener('click', () => {
    overlay.remove();
    showResults();
  });

  msgDiv.appendChild(messageText);
  msgDiv.appendChild(okButton);
  overlay.appendChild(msgDiv);
  container.appendChild(overlay);

  // Анимация появления
  requestAnimationFrame(() => {
    msgDiv.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

// Запуск первого уровня и таймера
startLevel(currentLevel);
startGameTimer();

// Генерация уровня
function generateLevel() {
  const level = currentLevel;
  const answersCount = (level <= 6) ? 6 : 12;
  answersContainer.className = (answersCount === 6) ? 'answers-6' : 'answers-12';

  const targetNum = Math.floor(Math.random() * 50) + 1;
  targetNumberDiv.textContent = targetNum;

  const answers = [];
  const correctIndex = Math.floor(Math.random() * answersCount);

  for (let i = 0; i < answersCount; i++) {
    if (i === correctIndex) {
      answers.push(targetNum);
    } else {
      let rand;
      do {
        rand = Math.floor(Math.random() * 100) + 1;
      } while (rand === targetNum || answers.includes(rand));
      answers.push(rand);
    }
  }

  answersContainer.innerHTML = '';

  answers.forEach((ans, index) => {
    const box = document.createElement('div');
    box.className = 'answer-box';
    const digitSpan = document.createElement('span');
    digitSpan.className = 'digit';
    digitSpan.textContent = ans;
    box.appendChild(digitSpan);
    box.dataset.answer = ans;
    box.dataset.correct = (index === correctIndex);
    box.style.backgroundColor = getRandomColor();

    // Обработчик клика
    box.addEventListener('click', () => {
      // Удаление предыдущих иконок
      const existingIcon = box.querySelector('.answer-icon');
      if (existingIcon) existingIcon.remove();

      if (box.dataset.correct === 'true') {
        correctAnswers++;
        showIcon(box, 'tick.png');
        showResultImageInHeader3(true); // правильный ответ
      } else {
        showIcon(box, 'the_cross.png');
        showResultImageInHeader3(false); // неправильный ответ
      }
      nextLevel();
    });

    answersContainer.appendChild(box);
  });

  animateAnswers();
}

// Новая функция для отображения иконки
function showIcon(answerBox, iconFilename) {
  const icon = document.createElement('img');
  icon.src = iconFilename; // имя файла
  icon.className = 'answer-icon';
  icon.alt = 'icon';

  // Удаляем предыдущие иконки, если есть
  const existingIcon = answerBox.querySelector('.answer-icon');
  if (existingIcon) existingIcon.remove();

  // Устанавливаем позицию
  answerBox.style.position = 'relative';

  // Вставляем иконку
  answerBox.appendChild(icon);
}

// Новая функция для отображения картинки в header3
function showResultImageInHeader3(isCorrect) {
  const header3 = document.querySelector('.header3');
  header3.innerHTML = '';

  const img = document.createElement('img');
  img.src = isCorrect ? 'tick.png' : 'the_cross.png';
  img.alt = isCorrect ? 'Правильно' : 'Неправильно';

  // Добавляем CSS-класс для размера и позиционирования
  img.className = 'result-image fade-in-out';

  header3.appendChild(img);

  // Удаляем изображение после окончания анимации
  img.addEventListener('animationend', () => {
    header3.innerHTML = '';
  });
}

// Анимации
function animateAnswers() {
  const boxes = document.querySelectorAll('.answer-box');
  boxes.forEach(box => {
    box.classList.remove('blink', 'move-forward-back', 'shake', 'animate-zoom', 'animate-zoom-alt');

    const delay = Math.random() * 0;
    const duration = Math.random() * 1 + 0.2;
    const amplitude = Math.random() * 20 + 10;

    box.style.setProperty('--animation-delay', delay + 's');
    box.style.setProperty('--animation-duration', duration + 's');
    box.style.setProperty('--amplitude', amplitude + 'px');

    if (currentLevel >= 2) {
      box.classList.add('blink');
    }
    if (currentLevel >= 3) {
      box.classList.add('move-forward-back');
    }
    if (currentLevel >= 4) {
      box.classList.add('shake');
    }
    if (currentLevel >= 5) {
      box.classList.add('animate-zoom');
    }
    if (currentLevel >= 7) {
      box.classList.add('animate-zoom', 'blink');
    }
    if (currentLevel >= 9) {
      box.classList.add('animate-zoom', 'blink', 'shake');
    }
    if (currentLevel >= 10) {
      box.classList.add('animate-zoom', 'blink', 'shake', 'move-forward-back');
    }
    if (currentLevel >= 11) {
      const digitSpan = box.querySelector('.digit');
      if (digitSpan) {
        digitSpan.classList.remove('rotate');
        digitSpan.classList.add('rotate');
      }
    }
  });
}

// Переход к следующему уровню
function nextLevel() {
  const answerBoxes = document.querySelectorAll('.answer-box');

  // Запускаем анимацию смахивания
  answerBoxes.forEach(box => {
    box.classList.add('swipe-left');
  });

  // Ждем окончания анимации, чтобы перейти к следующему уровню
  setTimeout(() => {
    // Удаляем все квадраты из DOM
    answerBoxes.forEach(box => box.remove());

    if (currentLevel >= totalLevels) {
      showResults();
    } else {
      currentLevel++;
      startLevel(currentLevel);
      generateLevel();
    }
  }, 1000); // должна совпадать с длительностью анимации
}

// Получение случайного цвета
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Показать результаты
function showResults() {
  clearInterval(gameTimer);
  finalCorrectAnswers = correctAnswers;
  const endTime = Date.now();
  finalTimeSeconds = Math.round((endTime - startTime) / 1000);
  const url = `index3.html?correct=${finalCorrectAnswers}&total=${totalLevels}&time=${finalTimeSeconds}`;
  window.location.href = url;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  generateLevel();
 // startGameTimer();
});