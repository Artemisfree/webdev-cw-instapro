import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from '../api.js'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'


const toggleLike = (postId, isLiked) => {
	const token = user ? `Bearer ${user.token}` : undefined
	if (!token) {
		console.log('Пользователь не авторизован')
		return
	}

	const action = isLiked ? dislikePost : likePost

	action({ postId, token })
		.then(updatedPost => {
			const postIndex = posts.findIndex(post => post.id === updatedPost.post.id)
			if (postIndex !== -1) {
				posts[postIndex] = updatedPost.post
				renderPostsPageComponent({ appEl: document.getElementById('app') })
			}
		})
		.catch(error => console.error('Ошибка при обработке лайка:', error))
}


export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);
  appEl.innerHTML = ''
  const pageContainer = document.createElement('div')
	pageContainer.className = 'page-container'

	appEl.appendChild(pageContainer)

	const headerContainer = document.createElement('div')
	headerContainer.className = 'header-container'
	pageContainer.appendChild(headerContainer)

	renderHeaderComponent({ element: headerContainer })

	const postsList = document.createElement('ul')
	postsList.className = 'posts'
	pageContainer.appendChild(postsList)

  posts.forEach(post => {
		const postItem = document.createElement('li')
		postItem.className = 'post'
    let likesText;
		if (post.likes.length > 0) {
			likesText = `${post.likes[0].name}`
			if (post.likes.length > 1) {
				likesText += ` и еще ${post.likes.length - 1}`
			}
		} else {
			likesText = '0'
		}
    const likeImagePath = `./assets/images/${
			post.isLiked ? 'like-active' : 'like-not-active'
		}.svg`
		/**
		 * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
		 * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
		 */
		postItem.innerHTML = `
			<div class="post-header" data-user-id="${post.user.id}">
				<img src="${post.user.imageUrl}" class="post-header__user-image">
				<p class="post-header__user-name">${post.user.name}</p>
			</div>
			<div class="post-image-container">
				<img class="post-image" src="${post.imageUrl}">
			</div>
			<div class="post-likes">
				<button data-post-id="${post.id}" class="like-button">
					<img src="${likeImagePath}">
				</button>
				<p class="post-likes-text">Нравится: <strong>${likesText}</strong></p>
			</div>
			<p class="post-text"><span class="user-name">${post.user.name}</span> ${
			post.description
		}</p>
			<p class="post-date">${formatDistanceToNow(new Date(post.createdAt), {
				addSuffix: true,
				locale: ru,
			})}</p>
		`
    postItem.querySelector('.post-header').addEventListener('click', function () {
				goToPage(USER_POSTS_PAGE, { userId: post.user.id })
		})
		postsList.appendChild(postItem)
	})
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', function () {
      const postId = this.getAttribute('data-post-id')
      const isLiked = posts.find(post => post.id === postId).isLiked
      toggleLike(postId, isLiked)
    })
  })
}


export function renderUserPostsPageComponent({ appEl, userPosts }) {
	appEl.innerHTML = ''
	const pageContainer = document.createElement('div')
	pageContainer.className = 'page-container'
	appEl.appendChild(pageContainer)

	const headerContainer = document.createElement('div')
	headerContainer.className = 'header-container'
	pageContainer.appendChild(headerContainer)

	renderHeaderComponent({ element: headerContainer })

	const postsList = document.createElement('ul')
	postsList.className = 'posts'
	pageContainer.appendChild(postsList)

	userPosts.forEach(post => {
		const postItem = document.createElement('li')
		postItem.className = 'post'

		let likesText =
			post.likes.length > 0
				? `${post.likes[0].name}${
						post.likes.length > 1 ? ` и еще ${post.likes.length - 1}` : ''
				  }`
				: '0'

		const likeImagePath = `./assets/images/${
			post.isLiked ? 'like-active' : 'like-not-active'
		}.svg`

		postItem.innerHTML = `
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${
									post.user.imageUrl
								}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                    <img src="${likeImagePath}">
                </button>
                <p class="post-likes-text">Нравится: <strong>${likesText}</strong></p>
            </div>
            <p class="post-text"><span class="user-name">${
							post.user.name
						}</span> ${post.description}</p>
            <p class="post-date">${formatDistanceToNow(
							new Date(post.createdAt),
							{
								addSuffix: true,
								locale: ru,
							}
						)}</p>
        `
		postsList.appendChild(postItem)
	})
}