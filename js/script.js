import { FavoritesView } from "./Favorites.js"

const favoritesView = new FavoritesView("#container")

favoritesView.update()

const buttonForm = document.querySelector('form button')

buttonForm.addEventListener('click', async (event) => {
  event.preventDefault()

  buttonForm.setAttribute('disabled', true)

  const input = document.querySelector('form input')

  await favoritesView.add(input.value)

  favoritesView.update()
  
  buttonForm.removeAttribute('disabled')
  input.value = ''
})