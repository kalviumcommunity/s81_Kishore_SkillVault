function Login() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <form>
          <input type="email" placeholder="Email" className="block mb-2 p-2 border" />
          <input type="password" placeholder="Password" className="block mb-2 p-2 border" />
          <button className="bg-blue-500 text-white px-4 py-2">Login</button>
        </form>
      </div>
    );
  }
  
  export default Login;
  