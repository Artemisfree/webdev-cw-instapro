import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
	// TODO: реализовать рендер постов из api
	// console.log("Актуальный список постов:", posts);
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
		postsList.appendChild(postItem)
	})
}
