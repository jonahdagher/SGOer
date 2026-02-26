
export default function LoginPage({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
  msg,
}){
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>

        <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

      </form>

      <p>{msg}</p>
    </div>
  )
} 
