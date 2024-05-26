import React, { useEffect, useState, useMemo } from "react";
import '../output.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserCourses } from '../hooks/useUserCourses';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';

const User = props => {
    const [userCourses, setUserCourses] = useState([]);
    const [userCritical, setUserCritical] = useState([]);
    const { getUserCourses, updateUserCourses, error, isLoading } = useUserCourses();
    const { generateData } = useData();
    const { user } = useAuthContext();
    const [newCourse, setNewCourse] = useState("");
    const [newCritical, setNewCritical] = useState("");

    const addCourse = (e) => {
        if (userCourses != null && !userCourses.includes(newCourse) && newCourse.match("[A-Za-z]{3}\\d{4}[A-Za-z]?") != null) {
            var currentList = userCourses;
            currentList.push(newCourse)
            setUserCourses([...currentList]);
            setNewCourse("");
        }
        e.preventDefault();
    }

    const addCritical = (e) => {
        if (userCritical != null && !userCritical.includes(newCritical) && newCritical.match("[A-Za-z]{3}\\d{4}[A-Za-z]?") != null) {
            var currentList = userCritical;
            currentList.push(newCritical)
            setUserCritical([...currentList]);
            setNewCritical("");
        }
        e.preventDefault();
    }

    const deleteCourse = (e) => {
        var updatedList = userCourses.filter(c => c !== e.currentTarget.value);
        setUserCourses([...updatedList])
    }

    const deleteCritical = (e) => {
        var updatedList = userCritical.filter(c => c !== e.currentTarget.value);
        setUserCritical([...updatedList])
    }

    const saveAndGenerate = async () => {
        let success = await updateUserCourses(userCourses, userCritical);
        if (success) {
            await generateData();
            await props.fetchData();
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
                setUserCourses(json[0].core);
                setUserCritical(json[0].critical_tracking);
            }
        }

        if (user != null) {
            fetchData();
        }

    }, [user]);

    return (
        <div className="flex flex-col grow">
            {user ? (<div className="grow relative">
                <span className="text-xl mb-2">Completed Critical Tracking Courses</span>
                <form className="mb-3">
                    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Add Critical Tracking Course"
                            onChange={(e) => setNewCritical(e.target.value)}
                            value={newCritical}
                            required />
                        <button
                            type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-[#285797] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={addCritical}
                        >Add</button>
                    </div>
                </form>
                <div className="h-1/4">
                    <div className="flex flex-wrap w-full h-full content-start overflow-y-auto bg-slate-100 p-1">
                        {userCritical && userCritical.map(course => <div key={course} className="flex items-center justify-end text-white bg-[#285797] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit h-fit">
                            <span>{course}</span>
                            <button value={course} onClick={deleteCritical}>
                                <svg className="right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>)}
                    </div>

                </div>

                <div className="h-[7%]"></div>

                <span className="text-xl mb-2">Completed Core Courses</span>
                <form className="mb-3">
                    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Add Core Course"
                            onChange={(e) => setNewCourse(e.target.value)}
                            value={newCourse}
                            required />
                        <button
                            type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-[#285797] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={addCourse}
                        >Add</button>
                    </div>
                </form>
                <div className="h-1/4">
                    <div className="flex flex-wrap w-full h-full overflow-y-auto bg-slate-100 p-1">
                        {userCourses && userCourses.map(course => <div key={course} className="flex items-center justify-end text-white bg-[#285797] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">
                            <span>{course}</span>
                            <button value={course} onClick={deleteCourse}>
                                <svg className="right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>)}
                    </div>
                </div>

                <div className="flex justify-center w-full absolute bottom-0">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 mx-auto rounded-full"
                        onClick={saveAndGenerate}
                    >
                        Save & Generate
                    </button>
                </div>


            </div>) : (<div className="grow flex flex-col items-center justify-center">
                <span className="text-xl text-center">Login <Link className="text-blue-500" to="/login">here</Link> to view your courses.</span><br></br><br></br>
                <span className="text-xl text-center">Don't have an account? Create one <Link className="text-blue-500" to="/signup">here</Link>!</span>
            </div>)}
        </div>
    );
};

export default User;