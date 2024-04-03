import React from 'react';
import '../output.css';

const Header = () => {
    return (
        <header className="bg-[#285797] w-full h-[10vh] absolute top-0 flex items-center justify-center text-white" >
            <p className="text-4xl">UFIND</p>
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