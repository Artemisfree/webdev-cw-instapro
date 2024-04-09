import { uploadImage } from '../api.js'
import { renderHeaderComponent } from './header-component.js'
import { protector } from '../helpers.js'


export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
	const render = () => {
		const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
		<div class="form">
			<h3 class="form-title">Страница добавления поста</h3>
			<form class="form-inputs" id="add-post-form">
				<div class="upload-image-container">
					<div class="upload-image">
						<label class="file-upload-label secondary-button">Выберите фото
							<input type="file" class="file-upload-input" style="display:none" id="image-input" accept="image/*" required>
						</label>
					</div>
				</div>
				<input class="input" type="text" id="description-input" placeholder="Описание поста" required>
				<button type="submit" class="button">Добавить</button>
			</form>
		</div>
      </div>
    `
		appEl.innerHTML = appHtml

		renderHeaderComponent({
			element: document.querySelector('.header-container'),
		});

		document
			.getElementById('add-post-form')
			.addEventListener('submit', function (event) {
				event.preventDefault()

				const description = protector(document.getElementById('description-input').value)
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
