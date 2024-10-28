// Функция открытия модального окна.
export function openModal(popup) {
  // Добавление класса анимации для подготовки попапа к плавному открытию.
  popup.classList.add('popup_is-animated');
  // Задержка перед добавлением 'popup_is-opened' для плавного перехода.
  setTimeout(() => popup.classList.add('popup_is-opened'), 10);
  document.addEventListener('keydown', handleEscClose);
}

// Функция закрытия модального окна.
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  
  setTimeout(() => popup.classList.remove('popup_is-animated'), 600);
  document.removeEventListener('keydown', handleEscClose);
}

// Функция закрытия на клавишу Esc
function handleEscClose(event) {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}