import { uploadImage } from '../api.js'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
	const render = () => {
		const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <h3 class="form-title">Страница добавления поста</h3>
        <form class="form-inputs" id="add-post-form">
          <input class="file-upload-label secondary-button" type="file" id="image-input" accept="image/*" required>
          <input class="input" type="text" id="description-input" placeholder="Описание поста" required>
          <button type="submit" class="button">Добавить</button>
        </form>
      </div>
    `
		appEl.innerHTML = appHtml

		document
			.getElementById('add-post-form')
			.addEventListener('submit', function (event) {
				event.preventDefault()

				const description = document.getElementById('description-input').value
				const imageFile = document.getElementById('image-input').files[0]

				if (!description || !imageFile) {
					alert('Необходимо заполнить описание и выбрать изображение.')
					return
				}

				uploadImage({ file: imageFile })
					.then(response => {
						if (response.fileUrl) {
							onAddPostClick({
								description,
								imageUrl: response.fileUrl,
							})
								.then(() => {
									alert('Пост успешно добавлен!')
									document.getElementById('description-input').value = ''
									document.getElementById('image-input').value = ''
								})
								.catch(error => {
									console.error('Ошибка при добавлении поста: ', error)
								})
						} else {
							console.error('Ошибка при загрузке изображения.')
						}
					})
					.catch(error => {
						console.error('Ошибка при загрузке изображения: ', error)
					})
			})
	}

	render()
}
