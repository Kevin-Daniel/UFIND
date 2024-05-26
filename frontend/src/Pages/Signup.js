import { useState } from 'react';
import { useSignup } from "../hooks/useSignup";
import Header from "../components/Header"
import Footer from "../components/Footer"

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signup, error, isLoading} = useSignup();

    const handleSignup = async (e) => {
        e.preventDefault();

        await signup(firstName, lastName, email, password);
    }

    return (
        <div className="relative pb-[10vh] min-h-screen">
          <Header/>
          <h1 className="text-6xl text-center pt-[15vh]">Sign Up</h1>
          <div className="flex justify-center items-center pt-[7vh]">
    
            <div className="w-1/5">
              <span>First Name:</span>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                placeholder="Robert"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                      handleSignup(e);
                  }}
              />
              
              <br />
              <span>Last Name:</span>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                placeholder="Brown"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                      handleSignup(e);
                  }}
              />
              
              <br />
              <span>Email Address:</span>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                placeholder="robertbrown@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                      handleSignup(e);
                  }}
              />
              
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
                      handleSignup(e);
                  }}
              />
              <br />
              <div className="flex flex-col justify-center items-center">
                <button
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
                {error && error.server && 
                <span className="text-sm text-red-500">Something went wrong! Error: {error.server}</span>
                }
              <br />
              </div>
            </div><br />
    
          </div>
          <Footer/>
        </div>
      );
}

export default Signup