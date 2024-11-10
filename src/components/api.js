export const token = '08b8cb64-b28b-43f8-bf7a-a0148ff11a79';
export const cohortId = 'wff-cohort-25';

// Функция для проверки ответа сервера
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
}

// Функция добавления или удаления лайка
export function toggleLikeApi(cardId, isLiked, cohortId, token) {
  const method = isLiked ? 'DELETE' : 'PUT';
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
    method: method,
    headers: {
      authorization: token,
    },
  })
  .then(checkResponse);
}

export function getUserInfo() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    headers: {
      authorization: token,
    },
  })
  .then(checkResponse)
}

export function getCards() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    headers: {
      authorization: token,
    },
  })
  .then(checkResponse)
}

export function updateProfile(name, about) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, about }),
  })
  .then(checkResponse)
}

export function addNewCard(name, link) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    method: 'POST',
    headers: {
      authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, link })
  })
  .then(checkResponse)
}

export function deleteCardFromServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    },
  })
  .then(checkResponse)
}

export function updateAvatar(avatarLink) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar: avatarLink })
  })
  .then(checkResponse)
}