// export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
// 	const render = () => {
// 		const appHtml = `
//       <div class="page-container">
//         <div class="header-container"></div>
//         <h1>Добавление нового поста</h1>
//         <form id="add-post-form">
//           <input type="text" id="description" placeholder="Описание" required />
//           <input type="file" id="imageFile" required />
//           <button type="submit" class="button">Добавить</button>
//         </form>
//       </div>
//     `

// 		appEl.innerHTML = appHtml

// 		document
// 			.getElementById('add-post-form')
// 			.addEventListener('submit', event => {
// 				event.preventDefault()
// 				const description = document.getElementById('description').value
// 				const imageFile = document.getElementById('imageFile').files[0]

// 				onAddPostClick({
// 					description,
// 					imageFile,
// 				})
// 			})
// 	}
// 	render()
// }

export function renderAddPostPageComponent({
	appEl,
	onAddPostClick,
	uploadImage,
}) {
	const render = () => {
		const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div>Страница добавления поста</div>
      <input type="text" id="description-input" placeholder="Описание" />
      <input type="file" id="image-input" />
      <button class="button" id="add-button">Добавить</button>
    </div>
    `

		appEl.innerHTML = appHtml

		document.getElementById('add-button').addEventListener('click', () => {
			const description = document.getElementById('description-input').value
			const imageFile = document.getElementById('image-input').files[0]

			if (!description || !imageFile) {
				alert('Необходимо добавить описание и выбрать изображение.')
				return
			}

			uploadImage(imageFile)
				.then(imageUrl => {
					onAddPostClick({ description, imageUrl })
				})
				.catch(error => {
					console.error('Ошибка при загрузке изображения: ', error)
				})
		})
	}

	render()
}
