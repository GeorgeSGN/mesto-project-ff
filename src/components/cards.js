import { toggleLikeApi } from './api.js';


// Функция создания новой карточки
export function createCard(cardData, handleDeleteCard, handleLikeCard, handleCardClick, currentUserId) {
  // Поиск шаблона и клонирование.
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = cardTemplate.cloneNode(true);
  // Элементы карточки.
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  // Кнопка лайка.
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Заполняем данными карточки.
  cardImage.src = cardData.link;
  cardImage.alt = `Фото ${cardData.name}`;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

 // Устанавливаем data-атрибут с _id для использования при удалении
 cardElement.dataset.cardId = cardData._id;

  // Проверка: показывать иконку удаления только для карточек, созданных текущим пользователем
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none'; // Скрыть иконку удаления, если это не карточка текущего пользователя
  } else {
    deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
  }

  likeButton.addEventListener('click', () => handleLikeCard(cardData._id, likeButton, likeCount));
  cardImage.addEventListener('click', () => handleCardClick(cardData.link, cardData.name));

  // Возврат готовой карточки.
  return cardElement;
}

// Функция переключения лайка.
export function toggleLike(cardId, likeButton, likeCountElement, cohortId, token) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  toggleLikeApi(cardId, isLiked, cohortId, token)
    .then((cardData) => {
      // Переключаем класс для лайк-кнопки
      likeButton.classList.toggle('card__like-button_is-active');

      // Обновляем количество лайков
      likeCountElement.textContent = cardData.likes.length;
    })
    .catch((err) => console.error('Ошибка при переключении лайка:', err));
}
