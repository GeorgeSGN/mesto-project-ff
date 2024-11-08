// Функция включает валидацию всех форм по переданным настройкам
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    setEventListeners(form, config)
  })
}

function setEventListeners(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      validateInput(input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });

  form.addEventListener('submit', (e) => e.preventDefault());
}

function validateInput(input, config) {
  const errorElement = input.nextElementSibling; // Находим элемент для отображения ошибки
  const validity = input.validity; // Проверка на валидность введенных данных

  // Если поле пустое, показываем ошибку
  if (validity.valueMissing) {
    showError(input, errorElement, "Вы пропустили это поле.", config);
  }
  // Проверка регулярного выражения для разрешенных символов
  else if ((input.id === 'name' || input.id === 'about' || input.id === 'place-name') && !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(input.value)) {
    showError(input, errorElement, "Разрешены только буквы, пробелы и дефисы.", config);
  }
  // Проверка длины введенного текста для полей имени и описания
  else if (input.id === 'name' || input.id === 'about') {
    checkInputLength(input, 2, 200, config);
  }
  // Проверка на URL для поля ссылки
  else if (input.type === 'url' && !validity.valid) {
    showError(input, errorElement, "Введите корректный URL.", config);
  }
  // Если поле валидно, скрываем ошибку
  else {
    hideError(input, errorElement, config);
  }
}

// Универсальная функция для проверки длины введенного текста
function checkInputLength(input, minLength, maxLength, config) {
  const errorElement = input.nextElementSibling; // Находим элемент ошибки для текущего поля

  // Если длина текста меньше минимальной, показываем ошибку
  if (input.value.length < minLength) {
    showError(input, errorElement, `Минимальное количество символов: ${minLength}. Длина текста сейчас: ${input.value.length} символ.`, config);
  } 
  // Если длина текста больше максимальной, показываем ошибку
  else if (input.value.length > maxLength) {
    showError(input, errorElement, `Максимальное количество символов: ${maxLength}. Длина текста сейчас: ${input.value.length} символ.`, config);
  } 
  // Если длина текста в пределах допустимого диапазона, скрываем ошибку
  else {
    hideError(input, errorElement, config);
  }
}

// Функция для показа ошибки и применения стилей к полю с ошибкой
function showError(input, errorElement, message, config) {
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = message;
  errorElement.classList.add(config.errorClass);
}

// Функция для скрытия ошибки
function hideError(input, errorElement, config) {
  input.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

// Функция управления состоянием кнопки отправки
function toggleButtonState(inputs, submitButton, config) {
  const isValid = Array.from(inputs).every((input) => input.validity.valid);
  if (isValid) {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// Функция очистки ошибок валидации
export function clearValidation(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    const errorElement = input.nextElementSibling;
    hideError(input, errorElement, config);
  });

  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
}