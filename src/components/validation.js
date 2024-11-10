// === Включение валидации для всех форм по переданным настройкам ===
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((form) => {
    setEventListeners(form, config);
  });
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
  const errorElement = input.nextElementSibling;

  // Если поле пустое, показываем ошибку
  if (input.validity.valueMissing) {
    showError(input, errorElement, "Вы пропустили это поле.", config);
  }
  // Если это поле URL, проверяем только на корректность URL
  else if (input.type === 'url' && input.validity.patternMismatch) {
    showError(input, errorElement, "Введите корректный URL.", config);
  }
  // Если patternMismatch для имени или описания (проверка на буквы, пробелы и дефисы)
  else if (input.validity.patternMismatch) {
    showError(input, errorElement, "Разрешены только буквы, пробелы и дефисы.", config);
  }
  // Если поле не соответствует минимальной длине
  else if (input.minLength && input.value.length < input.minLength && input.type !== 'url') {
    showError(
      input,
      errorElement,
      `Минимальное количество символов: ${input.minLength}. Длина текста сейчас: ${input.value.length} символ.`,
      config
    );
  }
  // Если поле превышает максимальную длину
  else if (input.maxLength && input.value.length > input.maxLength && input.type !== 'url') {
    showError(
      input,
      errorElement,
      `Максимальное количество символов: ${input.maxLength}. Длина текста сейчас: ${input.value.length} символ.`,
      config
    );
  }
  // Если поле валидно, скрываем ошибку
  else {
    hideError(input, errorElement, config);
  }
}

// === Универсальная функция для управления ошибками ===
function showError(input, errorElement, message, config) {
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = message;
  errorElement.classList.add(config.errorClass);
}

function hideError(input, errorElement, config) {
  input.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

// === Функция управления состоянием кнопки отправки ===
export function toggleButtonState(inputs, submitButton, config) {
  const isValid = Array.from(inputs).every((input) => input.validity.valid);
  if (isValid) {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// === Функция очистки ошибок валидации ===
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
