// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
// const personalKey = "prod";
const personalKey = "own";
// const baseHost = "https://webdev-hw-api.vercel.app";
const baseHost = 'https://wedev-api.sky.pro/'
const postsHost = `${baseHost}api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(`https://wedev-api.sky.pro/api/upload/image`, {
		method: 'POST',
		body: data,
	})
		.then(response => {
      if (!response.ok) {
				throw new Error('Ошибка при загрузке изображения')
			}
			return response.json();
		})
		.then(data => {
			console.log(data.fileUrl);
      return data;
		});
}

export function addPost({ token, description, imageUrl }) {
	return fetch(`${postsHost}/`, {
		method: 'POST',
		headers: {
			Authorization: token,
		},
		body: JSON.stringify({
			description,
			imageUrl,
		}),
	}).then(response => {
		if (!response.ok) {
			throw new Error('Не удалось добавить пост')
		}
		return response.json()
	})
}

export function getUserPosts({ userId, token }) {
  console.log(`ПОСТЫ ЮЗЕРА: ${token}`)
  console.log(`ПОСТЫ ЮЗЕРА: ${userId}`)
	return fetch(`${postsHost}/user-posts/${userId}`, {
		method: 'GET',
		headers: {
			Authorization: token,
		},
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка при получении постов пользователя')
			}
			return response.json()
		})
		.then(data => data.posts)
}

export function likePost({ postId, token }) {
	return fetch(`${postsHost}/${postId}/like`, {
		method: 'POST',
		headers: {
			Authorization: token,
		},
	}).then(response => {
		if (!response.ok) {
			throw new Error('Не удалось поставить лайк на пост')
		}
		return response.json()
	})
}

export function dislikePost({ postId, token }) {
	return fetch(`${postsHost}/${postId}/dislike`, {
		method: 'POST',
		headers: {
			Authorization: token,
		},
	}).then(response => {
		if (!response.ok) {
			throw new Error('Не удалось убрать лайк с поста')
		}
		return response.json()
	})
}
