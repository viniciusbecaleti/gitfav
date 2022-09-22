export class GithubUser {
  static async getUserData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const { login, name, public_repos, followers } = await response.json()

    return {
      login,
      name,
      public_repos,
      followers
    }
  }
}