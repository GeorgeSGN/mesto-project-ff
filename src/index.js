// Импорт функции и данных из модулей.
import { createCard, toggleLike } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import './pages/index.css';

// Ссылка на список карточек.
const cardList = document.querySelector('.places__list');
// Ссылки на попап изображения и его элементы
const popupImage = document.querySelector('.popup_type_image');
const popupImagePicture = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');
// Ссылки на кнопки открытия и закрытия модального окна "редактировать" и само модальное окно
const editButton = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const closeButtons = document.querySelectorAll('.popup__close');
// Ссылка на форму.
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
// Ссылки на элементы профиля и поля формы.
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
// Ссылки на кнопку добавления карточки и на соответствующее модальное окно.
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
// Ссылки на форму добавления карточки и её поля.
const formNewCard = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = document.querySelector('.popup__input_type_card-name');
const placeLinkInput = document.querySelector('.popup__input_type_url');

// Работа c API
// Токен и идентификатор
const token = '08b8cb64-b28b-43f8-bf7a-a0148ff11a79';
const cohortId = 'wff-cohort-25';
let currentUserId;

// Функция для загрузки информации о пользователе
function getUserInfo() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    headers: {
      authorization: token,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error('Ошибка при загрузке данных о пользователе:', err));
}

// Функция для загрузки карточек
function getCards() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    headers: {
      authorization: token,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error('Ошибка при загрузке карточек:', err));
}

// Функция для обновления профиля
function updateProfile(name, about) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, about }),
  })
    .then((res) => res.json())
    .catch((err) => console.error('Ошибка при обновлении профиля:', err));
}


// Сначала загружаем информацию о пользователе, а потом карточки
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    // Получаем currentUserId
    currentUserId = userData._id;

    // Обновляем информацию о пользователе
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;

    // Отображаем карточки
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, openDeletePopup, (cardId, likeButton, likeCountElement) => {
        toggleLike(cardId, likeButton, likeCountElement, cohortId, token);
      }, handleCardClick, currentUserId);
      cardList.append(cardElement);
    });
  })
  .catch((err) => console.error('Ошибка при загрузке данных с сервера:', err));

// Функция для добавления новой карточки
function addNewCard(name, link) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    method: 'POST',
    headers: {
      authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, link })
  })
  .then((res) => res.json())
  .catch((err) => console.error('Ошибка при добавлении карточки:', err));
}

// Ссылка на попап удаления карточки и на кнопку "Да"
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const confirmDeleteButton = popupDeleteCard.querySelector('.popup__button_confirm-delete');

// Переменная для хранения текущей удаляемой карточки
let cardToDelete = null;

// Функция для открытия попапа удаления карточки
function openDeletePopup(cardElement) {
  cardToDelete = cardElement;  // Сохраняем карточку для удаления
  openModal(popupDeleteCard);  // Открываем попап
}

// Добавляем обработчик на кнопку "Да"
confirmDeleteButton.addEventListener('click', () => {
  if (cardToDelete) {
    const cardId = cardToDelete.dataset.cardId; // Берем _id карточки из data-атрибута
    deleteCardFromServer(cardId, cardToDelete);
  }
  closeModal(popupDeleteCard);  // Закрываем попап после подтверждения
});

// Функция отправки DELETE-запроса на сервер
function deleteCardFromServer(cardId, cardElement) {
  fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    },
  })
    .then((res) => res.json())
    .then(() => {
      // Удаляем карточку из DOM
      cardElement.remove();
    })
    .catch((err) => console.error('Ошибка при удалении карточки:', err));
}

// Аватар
const avatarEditIcon = document.querySelector('.profile__image'); // Иконка редактирования
const avatarPopup = document.querySelector('.popup_type_avatar'); // Форма для обновления аватара
const avatarInput = avatarPopup.querySelector('#avatar-link');

avatarEditIcon.addEventListener('click', () => {
  openModal(avatarPopup);
  clearValidation(avatarPopup, validationConfig);
});

avatarPopup.addEventListener('submit', (event) => {
  event.preventDefault();

  const avatarLink = avatarPopup.querySelector('#avatar-link').value;

  const submitButton = avatarPopup.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar: avatarLink })
  })
  .then((res) => res.ok ? res.json() : Promise.reject(res.statusText))
  .then((data) => {
    document.querySelector('.profile__image').style.backgroundImage = `url("${data.avatar}")`; // Добавлены кавычки
    closeModal(avatarPopup); // Закрываем попап

    // Очищаем поле ссылки аватара
    avatarInput.value = '';

    // Возвращаем кнопку в исходное состояние
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  })
  .catch((err) => {
    console.error(`Ошибка: ${err}`);
  });
});

// Валидация
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Включение валидации всех форм
enableValidation(validationConfig);

// Открытие попапа изображения.
function handleCardClick(link, name) {
  popupImagePicture.src = link;
  popupImagePicture.alt = `Фото ${name}`;
  popupImageCaption.textContent = name;
  openModal(popupImage);
}

// Закрытие модальных окон по крестику.
closeButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.popup')));
});

// Открытие модального окна по кнопке.
editButton.addEventListener('click', () => { 
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  // Очищаем ошибки валидации перед открытием.
  clearValidation(profileForm, validationConfig);
  // Включаем валидацию для данной формы, чтобы проверка валидности сработала сразу.
  enableValidation(validationConfig);
  // Обновляем состояние кнопки "Сохранить" (если форма валидна, кнопка будет активной).
  toggleSubmitButton(profileForm);
  openModal(popupEdit)
});

// Функция для обновления состояния кнопки отправки в зависимости от валидности формы.
function toggleSubmitButton(form) {
  const submitButton = form.querySelector(validationConfig.submitButtonSelector);
  const isValid = form.checkValidity(); // Проверяем, валидна ли форма
  if (isValid) {
    submitButton.disabled = false;
    submitButton.classList.remove(validationConfig.inactiveButtonClass);
  } else {
    submitButton.disabled = true;
    submitButton.classList.add(validationConfig.inactiveButtonClass);
  }
}

// Привязка обработчика события отправки формы к форме
profileForm.addEventListener('submit', function handleFormSubmit(evt) {
  evt.preventDefault();
  const updatedName = nameInput.value;
  const updatedAbout = jobInput.value;

  // Меняем текст кнопки на «Сохранение...»
  const submitButton = profileForm.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = 'Сохранение...';

  // Отключаем кнопку, чтобы избежать повторной отправки
  submitButton.disabled = true;

  // Отправляем запрос для обновления данных на сервере
  updateProfile(updatedName, updatedAbout)
    .then((updatedUser) => {
      // Обновляем данные на странице
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;

      // Возвращаем кнопку в исходное состояние
      submitButton.textContent = 'Сохранить';
      submitButton.disabled = false;
      closeModal(popupEdit);
    })
    .catch((err) => console.error('Ошибка при обновлении профиля:', err));
});

// Обработчик события для открытия модального окна по нажатию кнопки "+"
addButton.addEventListener('click', () => openModal(popupNewCard));

// Привязываем обработчик события отправки формы к форме добавления карточки.
formNewCard.addEventListener('submit', function handleNewCardSubmit(event) {
  event.preventDefault();

  const newCardName = placeNameInput.value;
  const newCardLink = placeLinkInput.value;

  // Меняем текст кнопки на «Сохранение...»
  const submitButton = formNewCard.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;  // Отключаем кнопку

  addNewCard(newCardName, newCardLink)
    .then((newCard) => {
      if (newCard && newCard._id) { // Проверка, что карточка была успешно создана
        const cardElement = createCard(
          newCard,
          openDeletePopup,
          (cardId, likeButton, likeCountElement) => {
            toggleLike(cardId, likeButton, likeCountElement, cohortId, token);
          },
          handleCardClick,
          currentUserId // Передаём корректный userId
        );
        cardList.prepend(cardElement);

        // Закрываем попап и сбрасываем форму
        closeModal(popupNewCard);
        formNewCard.reset();
        // Возвращаем кнопку в исходное состояние
        submitButton.textContent = 'Сохранить';
        submitButton.disabled = false;
      } else {
        throw new Error('Ошибка при создании карточки: неверный формат данных');
      }
    })
    .catch((err) => console.error('Ошибка при добавлении карточки:', err));
});

// Закрытие модальных окон по клику вне их области.
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeModal(popup);
  });
});