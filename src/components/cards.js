
// Функция создания новой карточки
export function createCard(cardData, handleDeleteCard, handleLikeCard, handleCardClick) {
  // Поиск шаблона и клонирование.
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = cardTemplate.cloneNode(true);
  // Элементы карточки.
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  // Кнопка лайка.
  const likeButton = cardElement.querySelector('.card__like-button');

  // Заполняем данными карточки.
  cardImage.src = cardData.link;
  cardImage.alt = `Фото ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  // Открытие попапа при клике на изображение карточки.
  cardImage.addEventListener('click', () => handleCardClick(cardData.link, cardData.name));

  // Обработчик на кнопку удаления.
  deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));

  // Обработчик на кнопку лайка.
  likeButton.addEventListener('click', () => handleLikeCard(likeButton));

  // Возврат готовой карточки.
  return cardElement;
}

// Функция переключения лайка.
export function toggleLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// Функция удаления карточки.
export function deleteCard(cardElement) {
  cardElement.remove();
}

