import React, { useEffect, useState } from "react";
import '../output.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserCourses } from '../hooks/useUserCourses';

const User = () => {
    const [userCourses, setUserCourses] = useState(null);
    const { getUserCourses, updateUserCourses, error, isLoading } = useUserCourses();
    const { user } = useAuthContext();
    const [newCourse, setNewCourse] = useState("");

    const addCourse = (e) => {
        if (userCourses != null && !userCourses.includes(newCourse)) {
            var currentList = userCourses;
            currentList.push(newCourse)
            setUserCourses([...currentList]);
        }
        e.preventDefault();
    }

    const deleteCourse = (e) => {
        var updatedList = userCourses.filter(c => c !== e.currentTarget.value);
        console.log(updatedList);
        setUserCourses([...updatedList])
    }

    const saveList = () => {
        var success = updateUserCourses(userCourses);
        console.log("updating list success: " + success);
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
                setUserCourses(json[0].courses);
            }
            console.log(response);
        }

        fetchData(); // CHECK FOR LOGGED OUT USER

    }, []);

    return (
        <div>
            <div className="flex flex-wrap w-full">
                {userCourses && userCourses.map(course => <div key={course} className="flex items-center justify-end text-white bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-2.5 text-center mr-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-fit">
                    <span>{course}</span>
                    <button value={course} onClick={deleteCourse}>
                        <svg className="right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>)}
            </div>
            <form>
                <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Add Course"
                        onChange={(e) => setNewCourse(e.target.value)}
                        value={newCourse}
                        required />
                    <button
                        type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={addCourse}
                    >Add</button>
                </div>
            </form>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full absolute bottom-10"
                onClick={saveList}
            >
                Save
            </button>

        </div>
    );
};

export default User;