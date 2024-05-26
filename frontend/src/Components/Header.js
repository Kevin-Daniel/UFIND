import React from 'react';
import '../output.css';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header className="bg-[#285797] w-full h-[10vh] absolute top-0 flex items-center justify-between text-white px-10" >
            <p className="text-4xl">UFIND</p>
            {user && (
                <div>
                    <span className="mx-5">{user.name}</span>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 border border-orange-700 rounded" onClick={handleClick}>Log out</button>
                </div>
            )}
            {!user && (
                <div>
                    <Link className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 border border-orange-700 rounded mx-3" to="/login">Login</Link>
                    <Link className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 border border-orange-700 rounded" to="/signup">Signup</Link>
                </div>
            )}
        </header>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
};

export default Header;