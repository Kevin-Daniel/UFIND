import { useEffect, useState } from "react"
import { useProgramContext } from "../hooks/useProgramContext"
import { useAuthContext } from '../hooks/useAuthContext';
import '../output.css'

const Info = props => {
    const { user } = useAuthContext();
    const [userCourses, setUserCourses] = useState([]);

    const { program, dispatch } = useProgramContext()

    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const onSearch = (search) => {
        props.fetchProgram(search)
    }

    const listCourses = (courses) => {
        return courses.map(course => <li className={userCourses.includes(course) ? "text-green-600" : "text-[#C54418]"} key={course}><b>{course}</b></li>);
    }

    const beta = (event) => {
        if(event.key === 'Enter') {
            onSearch(event.target.value);
        }
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/userCourses/fetch', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                setUserCourses(json[0].core.concat(json[0].critical_tracking));
            }
        }

        if (user != null) {
            fetchData();
        } else {
            setUserCourses([])
        }

    }, [user]);

    return (
        <div className="grow">
            <div className="max-w-md mx-auto">
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search majors..."
                    value={searchTerm} 
                    onChange={handleInputChange} 
                    onKeyDown={beta}
                    required />
                    <button class="text-white absolute end-2.5 bottom-2.5 bg-[#285797] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSearch}>Search</button>
                </div>
            </div><br></br>
            {program && 
                <p className="text-2xl pb-3"><b>{program.name}</b></p>
            }
            {program &&
                <div className="font-sans h-[400px] overflow-y-scroll">
                    <span className="text-xl"><b>Critical Tracking Courses:</b></span>
                    <ul className="pl-2">{listCourses(program.critical_tracking)}</ul>
                    <br></br>
                    <span className="text-xl"><b>Core Courses:</b></span>
                    <ul className="pl-2">{listCourses(program.core)}</ul>
                </div>
            }
            <div className="mt-3">
                <span className="text-green-600">&#9632;</span>
                <span className="mr-5"> - Course Completed</span>
                <span className="text-[#C54418]">&#9632;</span>
                <span> - Course Not Completed</span>
            </div>
            
        </div>

    )
}

export default Info