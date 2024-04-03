export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
	const render = () => {
		const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <h1>Добавление нового поста</h1>
        <form id="add-post-form">
          <input type="text" id="description" placeholder="Описание" required />
          <input type="file" id="imageFile" required />
          <button type="submit" class="button">Добавить</button>
        </form>
      </div>
    `

		appEl.innerHTML = appHtml

		document
			.getElementById('add-post-form')
			.addEventListener('submit', event => {
				event.preventDefault()
				const description = document.getElementById('description').value
				const imageFile = document.getElementById('imageFile').files[0]

				onAddPostClick({
					description,
					imageFile,
				})
			})
	}

	render()
}
