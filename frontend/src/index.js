import { createRoot } from "react-dom/client";

import App from "./App";
import { ProgramContextProvider } from './context/ProgramContext'
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <ProgramContextProvider>
        <App />
    </ProgramContextProvider>
);
