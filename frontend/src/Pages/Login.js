import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import Footer from "../components/Footer"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        await login(email, password);
    }
    
    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div className="relative pb-[10vh] min-h-screen">
            <Header/>
            <div>
              <h1 className="text-6xl text-center pt-[15vh]">Login</h1>
              <div className="flex justify-center items-center pt-[15vh]">
    
                <div className="w-1/5">
                  <span>Email:</span>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter")
                        handleLogin(e);
                      }}
                  />
                  {error && error.username &&
                    <span className="text-sm text-red-500">*{error.username}</span>
                  }
                  <br />
                  <span>Password:</span>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                          handleLogin(e);
                      }}
                  />
                  {error && error.password &&
                    <span className="text-sm text-red-500">*{error.password}</span>
                  }
                  <br />
                  <div className="flex flex-col justify-center items-center">
                    <button
                      className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      Login
                    </button>
                    {error && error.server &&
                      <span className="text-sm text-red-500">Something went wrong! Error: {error.server}</span>
                    }
                    <br />
                    <p>Don't have an account? Create on <span className="text-blue-500 cursor-pointer" onClick={goToSignup}>here</span>!</p>
                  </div>
                </div><br />
              </div>
            </div>
            <Footer/>
        </div>
      );
}

export default Login