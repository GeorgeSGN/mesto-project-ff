const token = '08b8cb64-b28b-43f8-bf7a-a0148ff11a79';
const cohortId = 'wff-cohort-25';

export function getUserInfo() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
    headers: {
      authorization: token,
    },
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при загрузке данных о пользователе: ${res.status}`);
  })
  .catch((err) => console.error(err));
}

export function getCards() {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
    headers: {
      authorization: token,
    },
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при загрузке карточек: ${res.status}`);
  })
  .catch((err) => console.error(err));
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
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при обновлении профиля: ${res.status}`);
  })
  .catch((err) => console.error(err));
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
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при добавлении карточки: ${res.status}`);
  })
  .catch((err) => console.error(err));
}

export function deleteCardFromServer(cardId) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    },
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при удалении карточки: ${res.status}`);
  })
  .catch((err) => console.error(err));
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
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка при обновлении аватара: ${res.status}`);
  })
  .catch((err) => console.error(err));
}