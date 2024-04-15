import { useEffect, useState } from "react"
import { useProgramContext } from "../hooks/useProgramContext"
import '../output.css'
import UserCourses from "./UserCourses";
import Info from "./Info";

const activeClass = "cursor-pointer inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-blue-500";
const inactiveClass = "cursor-pointer inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";

const InteractionPanel = props => {
    const [tab, setTab] = useState("search");
    return (
        <div className="bg-white rounded-2xl h-full w-full p-4 border-2 border-black">
            <div className="mb-3">
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="me-2" onClick={() => setTab("search")}>
                        <span className={tab == "search" ? activeClass : inactiveClass}>Search</span>
                    </li>
                    <li className="me-2" onClick={() => setTab("user")}>
                        <span className={tab == "user" ? activeClass : inactiveClass}>Your Courses</span>
                    </li>
                </ul>
            </div>
            {tab == "search" &&
                <div>
                    <Info fetchProgram={props.fetchProgram} />
                </div>
            }
            {tab == "user" &&
                <UserCourses />
            }
        </div>
    )
}

export default InteractionPanel