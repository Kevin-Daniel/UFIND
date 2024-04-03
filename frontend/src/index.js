import { createRoot } from "react-dom/client";

import App from "./App";
import { ProgramContextProvider } from './context/ProgramContext'
import { AuthContextProvider } from './context/AuthContext'
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <AuthContextProvider>
        <ProgramContextProvider>
            <App />
        </ProgramContextProvider>
    </AuthContextProvider>
);
