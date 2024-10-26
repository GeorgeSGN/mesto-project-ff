import { initialCards } from './components/cards.js';
// Получаем ссылку на список карточек и шаблон.
const cardList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');


// Ссылки на попап изображения и его элементы
const popupImage = document.querySelector('.popup_type_image');
const popupImagePicture = popupImage.querySelector('.popup__image')
const popupImageCaption = popupImage.querySelector('.popup__caption')

// Открытие попапа изображения
function handleCardClick(link, name) {
  popupImagePicture.src = link;
  popupImagePicture.alt = `Фото ${name}`;
  popupImageCaption.textContent = name;
  openModal(popupImage);
}

// Функция создания новой карточки.
function createCard(cardData, handleDeleteCard, handleLikeCard, handleCardClick) {
  // Клонируем шаблон карточки
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  // Находим кнопку лайка
  const likeButton = cardElement.querySelector('.card__like-button')

  // Заполняем данными карточки
  cardImage.src = cardData.link;
  cardImage.alt = `Фото ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  // Открытие попапа при клике на изображение карточки
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData.link, cardData.name)
  })

  // Добавляем обработчик на кнопку удаления
  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

  // Добавляем обработчик на кнопку лайка
  likeButton.addEventListener('click', () => {
    handleLikeCard(likeButton);
  })

  // Возвращаем готовый элемент карточки
  return cardElement;
}

// Функция переключения лайка
function toggleLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// Функция удаления карточки 
function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция добавления всех карточек на страницу
function renderCards() {
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, toggleLike, handleCardClick);
    cardList.append(cardElement);
  })
}

renderCards();

import '../pages/index.css';


// Находим кнопки открытия и закрытия модального окна редактировать и само модальное окно.
const editButton = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const closeButtons = document.querySelectorAll('.popup__close');

// Находим форму в DOM 
const formElement = document.querySelector('.popup__form[name="edit-profile"]')

// Находим элементы профиля и поля формы
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description')
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

// Функция открытия модального окна
function openModal(popup) {
  // Заполнение полей текущими значениями, если это попап для редактирования профиля
  if (popup.classList.contains('popup_type_edit')) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
  }
  
   // Добавляем класс анимации, чтобы подготовить попап к плавному открытию
   popup.classList.add('popup_is-animated');

   // Задержка перед добавлением 'popup_is-opened' для плавного перехода
   setTimeout(() => {
     popup.classList.add('popup_is-opened');
   }, 10); // небольшая задержка, чтобы анимация успела сработать
  document.addEventListener('keydown', handleEscClose);
}

// Функция закрытия модального окна
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');

    // Убираем класс 'popup_is-animated' после завершения анимации закрытия
  setTimeout(() => {
    popup.classList.remove('popup_is-animated');
  }, 600);

  document.removeEventListener('keydown', handleEscClose);
}

// Закрытие на клавишу Esc
function handleEscClose(event) {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened')
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Закрытие по клику на overlay 
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closeModal(popup);
    }
  })
})

// Закрытие модальных окон по крестику
closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
  })
})

// Открытие модального окна по кнопке редактирования
editButton.addEventListener('click', () => {
  openModal(popupEdit);
})

// Обработчик "отправки" формы
function handleFormSubmit(evt) {
  evt.preventDefault(); // Отменяем стандартную отправку формы

  // Получаем значения из полей формы
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;

  closeModal(popupEdit);
}

// Привязываем обработчик события отправки формы к форме
formElement.addEventListener('submit', handleFormSubmit);



// Находим кнопку добавления карточки и соответствующее модальное окно.
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');

// Обработчик события для открытия модального окна по нажатию по кнопке "+"
addButton.addEventListener('click', () => {
  openModal(popupNewCard);
})


 
// Находим форму добавления карточки и её поля.
const formNewCard = document.querySelector('.popup__form[name="new-place"]')
const placeNameInput = document.querySelector('.popup__input_type_card-name');
const placeLinkInput = document.querySelector('.popup__input_type_url');

// Обработчик для формы добавления карточки.
function handleNewCardSubmit(event) {
  event.preventDefault(); 

  // Получаем значения из полей формы
  const placeName = placeNameInput.value;
  const placeLink = placeLinkInput.value;

  // Создаём новую карточку
  const newCard = createCard({ name: placeName, link: placeLink}, deleteCard, toggleLike, handleCardClick);

  // Добавляем карточку в начало списка
  cardList.prepend(newCard);

  // Закрываем модальное окно и очищаем форму
  closeModal(popupNewCard);
  formNewCard.reset();
}

// Привязываем обработчик события отправки формы к форме добавления карточки
formNewCard.addEventListener('submit', handleNewCardSubmit);


