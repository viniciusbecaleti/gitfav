import { GithubUser } from "./GithubUser.js"

class Favorites {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  async add(username) {
    try {
      const userExists = this.data.find(user => user.login == username)
    
      if (userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.getUserData(username)

      if (user.login == undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.data = [user , ...this.data]
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  remove({ login }) {
    this.data = this.data.filter(user => user.login != login)
    this.save()
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.data))
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super()
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector('tbody')
    this.tableFull = this.root.querySelector('[data-table="full"]')
    this.tableEmpty = this.root.querySelector('[data-table="empty"]')
  }

  update() {
    if (this.data.length <= 0) {
      this.tableFull.classList.add('hidden')
      this.tableEmpty.classList.remove('hidden')
      return
    } else {
      this.tableFull.classList.remove('hidden')
      this.tableEmpty.classList.add('hidden')
    }

    this.removeAllTr()

    for (const user of this.data) {
      const row = this.createRow(user)
      const buttonRemove = row.querySelector('a')

      buttonRemove.addEventListener('click', () => {
        const isOk = confirm(`Você tem certeza que quer remover o usuário ${user.name}?`)

        if (isOk) {
          this.remove(user)
          this.update()
        }
      })

      this.tbody.appendChild(row)
    }
  }

  createRow({ login, name, public_repos, followers }) {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td id="usuario">
        <img src="https://github.com/${login}.png">
        
        <div>
          <span id="nome">${name}</span>
          <span id="login">/${login}</span>
        </div>
      </td>
      <td>${public_repos}</td>
      <td>${followers}</td>
      <td>
        <a href="#">Remover</a>
      </td>
    `

    return tr
  }

  removeAllTr() {
    const allTrs = this.tbody.querySelectorAll('tr')

    allTrs.forEach(tr => tr.remove())
  }
}