// Импорт функции и данных из модулей.
import { initialCards } from './components/initialCards.js';
import { createCard, toggleLike, deleteCard } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
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

// Открытие попапа изображения.
function handleCardClick(link, name) {
  popupImagePicture.src = link;
  popupImagePicture.alt = `Фото ${name}`;
  popupImageCaption.textContent = name;
  openModal(popupImage);
}

// Функция добавления всех карточек на страницу.
function renderCards() {
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, toggleLike, handleCardClick);
    cardList.append(cardElement);
  });
}

renderCards();

// Закрытие модальных окон по крестику.
closeButtons.forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.popup')));
});

// Открытие модального окна по кнопке.
editButton.addEventListener('click', () => { 
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEdit)
});

// Привязка обработчика события отправки формы к форме
profileForm.addEventListener('submit', function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
});

// Обработчик события для открытия модального окна по нажатию кнопки "+"
addButton.addEventListener('click', () => openModal(popupNewCard));

// Привязываем обработчик события отправки формы к форме добавления карточки.
formNewCard.addEventListener('submit', function handleNewCardSubmit(event) {
  event.preventDefault();
  const newCard = createCard(
    { name: placeNameInput.value, link: placeLinkInput.value },
    deleteCard, toggleLike, handleCardClick
  );
  cardList.prepend(newCard);
  closeModal(popupNewCard);
  formNewCard.reset();
});

// Закрытие модальных окон по клику вне их области.
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeModal(popup);
  });
});