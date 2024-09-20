// Получаем ссылку на список карточек и шаблон.
const cardList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// Функция создания новой карточки.
function createCard(cardData) {
  // Клонируем шаблон карточки
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  // Заполняем данными карточки
  cardImage.src = cardData.link;
  cardImage.alt = `Фото ${cardData.name}`;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик на кнопку удаления
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  // Возвращаем готовый элемент карточки
  return cardElement;
}

// Функция удаления карточки 
function deleteCard(cardElement) {
  cardElement.remove();
}

// Функция добавления всех карточек на страницу
function renderCards() {
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData);
    cardList.append(cardElement);
  })
}

renderCards();