import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export function renderPostsPageComponent({ appEl }) {
	console.log('Актуальный список постов:', posts)

	const postsHtml = posts
		.map(post => {
      let likesText;
			if (post.likes.length > 0) {
				likesText = `${post.likes[0].name}`
				if (post.likes.length > 1) {
					likesText += ` и еще ${post.likes.length - 1}`
				}
			} else {
				likesText = '0'
			}

    return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
          <img src="./assets/images/${
						post.isLiked ? 'like-active' : 'like-not-active'
					}.svg">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${likesText}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span> ${post.description}
      </p>
      <p class="post-date">
        ${formatDistanceToNow(new Date(post.createdAt), {
					addSuffix: true,
					locale: ru,
				})}
      </p>
    </li>
  `
  })
		.join('')

	const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">${postsHtml}</ul>
    </div>`

	appEl.innerHTML = appHtml

	renderHeaderComponent({
		element: document.querySelector('.header-container'),
	})

	for (let userEl of document.querySelectorAll(".post-header")) {
	  userEl.addEventListener("click", () => {
	    goToPage(USER_POSTS_PAGE, {
	      userId: userEl.dataset.userId,
	    });
	  });
	}

  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', function () {
      const postId = this.dataset.postId
      const token = `Bearer ${user.token}`
      const likesTextElement = this.nextElementSibling

      if (this.classList.contains('liked')) {
        dislikePost({ postId, token }).then(data => {
          this.classList.remove('liked')
          updateLikesText(
            likesTextElement,
            data.post.likes.length,
            data.post.likes[0]?.name
          )
        })
      } else {
        likePost({ postId, token }).then(data => {
          this.classList.add('liked')
          updateLikesText(
            likesTextElement,
            data.post.likes.length,
            data.post.likes[0]?.name
          )
        })
      }
    })
  })

  function updateLikesText(element, likesCount, firstLikerName) {
    let likesText = '0'
    if (likesCount > 0) {
      likesText = `${firstLikerName}`
      if (likesCount > 1) {
        likesText += ` и еще ${likesCount - 1}`
      }
    }
    element.innerHTML = `Нравится: <strong>${likesText}</strong>`
  }

}


export function renderUserPostsPageComponent({ appEl, userPosts }) {
	console.log('Посты конкретного пользователя:', userPosts)

	const postsHtml = userPosts
		.map(
			post => {
      let likesText;
			if (post.likes.length > 0) {
				likesText = `${post.likes[0].name}`
				if (post.likes.length > 1) {
					likesText += ` и еще ${post.likes.length - 1}`
				}
			} else {
				likesText = '0'
			}
      return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/${
							post.isLiked ? 'like-active' : 'like-not-active'
						}.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likesText}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span> ${post.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(new Date(post.createdAt), {
						addSuffix: true,
						locale: ru,
					})}
        </p>
      </li>
    `
    })
		.join('')

	const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">${postsHtml}</ul>
    </div>`

	appEl.innerHTML = appHtml

	renderHeaderComponent({
		element: document.querySelector('.header-container'),
	})

  document.querySelectorAll('.like-button').forEach(button => {
		button.addEventListener('click', function () {
			const postId = this.dataset.postId
			const token = `Bearer ${user.token}`
			const likesTextElement = this.nextElementSibling

			if (this.classList.contains('liked')) {
				dislikePost({ postId, token }).then(data => {
					this.classList.remove('liked')
					updateLikesText(
						likesTextElement,
						data.post.likes.length,
						data.post.likes[0]?.name
					)
				})
			} else {
				likePost({ postId, token }).then(data => {
					this.classList.add('liked')
					updateLikesText(
						likesTextElement,
						data.post.likes.length,
						data.post.likes[0]?.name
					)
				})
			}
		})
	})

	function updateLikesText(element, likesCount, firstLikerName) {
		let likesText = '0'
		if (likesCount > 0) {
			likesText = `${firstLikerName}`
			if (likesCount > 1) {
				likesText += ` и еще ${likesCount - 1}`
			}
		}
		element.innerHTML = `Нравится: <strong>${likesText}</strong>`
	}

}