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

export const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];