//  === Импорт функций и стилей из других модулей ===
import { createCard, toggleLike } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation, toggleButtonState } from './components/validation.js';
import { getUserInfo, getCards, updateProfile, addNewCard, deleteCardFromServer, updateAvatar, cohortId, token } from './components/api.js';
import './pages/index.css';

// === Ссылки на элементы страницы ===

// Контейнер для добавленных карточек
const cardList = document.querySelector('.places__list');

// Попап для просмотра изображения и его элементы
const popupImage = document.querySelector('.popup_type_image');
const popupImagePicture = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

// Кнопка редактирования профиля и попап редактирования
const editButton = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');

// Кнопки закрытия всех попапов
const closeButtons = document.querySelectorAll('.popup__close');

// Форма профиля и её элементы
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');

// Кнопка добавления карточки и попап для добавления
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');

// Форма добавления новой карточки и её поля
const formNewCard = document.querySelector('.popup__form[name="new-place"]');
const placeNameInput = document.querySelector('.popup__input_type_card-name');
const placeLinkInput = document.querySelector('.popup__input_type_url');

// === Работа с API и данные пользователя ===

let currentUserId; // ID текущего пользователя

// Загружаем информацию о пользователе и карточках с сервера
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id; // Сохраняем ID пользователя

    // Обновляем профиль на странице
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;

    // Отображаем карточки на странице
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, openDeletePopup, (cardId, likeButton, likeCountElement) => {
        toggleLike(cardId, likeButton, likeCountElement, cohortId, token);
      }, handleCardClick, currentUserId);
      cardList.append(cardElement);
    });
  })
  .catch((err) => console.error('Ошибка при загрузке данных с сервера:', err));

// === Удаление карточки ===

// Попап для удаления карточки и кнопка подтверждения
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const confirmDeleteButton = popupDeleteCard.querySelector('.popup__button_confirm-delete');
let cardToDelete = null; // Переменная для хранения удаляемой карточки

// Открытие попапа для подтверждения удаления
function openDeletePopup(cardElement) {
  cardToDelete = cardElement;
  openModal(popupDeleteCard);
}

// Обработчик кнопки подтверждения удаления
confirmDeleteButton.addEventListener('click', () => {
  if (cardToDelete) {
    const cardId = cardToDelete.dataset.cardId;
    deleteCardFromServer(cardId, cardToDelete)
      .then(() => {
        cardToDelete.remove();
        closeModal(popupDeleteCard);
      })
      .catch((err) => console.error('Ошибка при удалении карточки:', err));
  }
});


// === Обновление аватара пользователя ===

const avatarEditIcon = document.querySelector('.profile__image'); // Кнопка редактирования аватара
const avatarPopup = document.querySelector('.popup_type_avatar'); // Попап редактирования аватара
const avatarInput = avatarPopup.querySelector('#avatar-link'); // Поле ввода ссылки для аватара

// Открытие попапа для редактирования аватара
avatarEditIcon.addEventListener('click', () => {
  openModal(avatarPopup);
  clearValidation(avatarPopup, validationConfig);
});

// Обработчик отправки формы для обновления аватара
avatarPopup.addEventListener('submit', (event) => {
  event.preventDefault();

  const avatarLink = avatarPopup.querySelector('#avatar-link').value;
  const submitButton = avatarPopup.querySelector('.popup__button');

  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  updateAvatar(avatarLink)
  .then((data) => {
    document.querySelector('.profile__image').style.backgroundImage = `url("${data.avatar}")`;
    closeModal(avatarPopup);
    avatarInput.value = '';
  })
  .catch((err) => console.error(`Ошибка: ${err}`))
  .finally(() => {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  });
});

// === Валидация форм ===

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

enableValidation(validationConfig); // Включаем валидацию всех форм


// === Функции для модальных окон и форм ===

// Открытие попапа с изображением
function handleCardClick(link, name) {
  popupImagePicture.src = link;
  popupImagePicture.alt = `Фото ${name}`;
  popupImageCaption.textContent = name;
  openModal(popupImage);
}

// Закрытие модальных окон по кнопке "закрыть"
closeButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.popup')));
});

// Открытие попапа редактирования профиля и установка значений полей
editButton.addEventListener('click', () => { 
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  enableValidation(validationConfig);
  toggleButtonState(profileForm.querySelectorAll(validationConfig.inputSelector), profileForm.querySelector(validationConfig.submitButtonSelector), validationConfig);
  openModal(popupEdit);
});

// Обработчик отправки формы профиля
profileForm.addEventListener('submit', function handleFormSubmit(evt) {
  evt.preventDefault();
  const updatedName = nameInput.value;
  const updatedAbout = jobInput.value;
  const submitButton = profileForm.querySelector(validationConfig.submitButtonSelector);

  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  updateProfile(updatedName, updatedAbout)
  .then((updatedUser) => {
    profileTitle.textContent = updatedUser.name;
    profileDescription.textContent = updatedUser.about;
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
    closeModal(popupEdit);
  })
  .catch((err) => console.error('Ошибка при обновлении профиля:', err))
  .finally(() => {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  });
});

// Открытие попапа для добавления новой карточки
addButton.addEventListener('click', () => {
  openModal(popupNewCard);

  // Обновляем состояние кнопки сабмита
  toggleButtonState(
    formNewCard.querySelectorAll(validationConfig.inputSelector),
    formNewCard.querySelector(validationConfig.submitButtonSelector),
    validationConfig
  );

  formNewCard.reset(); // Очистка полей формы
});

// Обработчик формы добавления новой карточки
formNewCard.addEventListener('submit', function handleNewCardSubmit(event) {
  event.preventDefault();

  const newCardName = placeNameInput.value;
  const newCardLink = placeLinkInput.value;
  const submitButton = formNewCard.querySelector(validationConfig.submitButtonSelector);

  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  addNewCard(newCardName, newCardLink)
  .then((newCard) => {
    if (newCard && newCard._id) {
      const cardElement = createCard(
        newCard,
        openDeletePopup,
        (cardId, likeButton, likeCountElement) => {
          toggleLike(cardId, likeButton, likeCountElement, cohortId, token);
        },
        handleCardClick,
        currentUserId
      );
      cardList.prepend(cardElement);
      closeModal(popupNewCard);
      formNewCard.reset();
    } else {
      throw new Error('Ошибка при создании карточки: неверный формат данных');
    }
  })
  .catch((err) => console.error('Ошибка при добавлении карточки:', err))
  .finally(() => {
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  });
});

// Закрытие попапов при клике вне их области
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeModal(popup);
  });
});