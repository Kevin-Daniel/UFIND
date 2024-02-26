import { useEffect, useState } from "react"
import { useProgramContext } from "../hooks/useProgramContext"
import '../output.css'

const Info = props => {
    const {program, dispatch} = useProgramContext()

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
        return courses.map(course => <li key={course}>{course}</li>)
    }

    return (

        <div className="bg-blue-400 rounded-2xl h-full p-5">
            <div>
                <input
                    className="border-black border-2"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button className="bg-white border-black border-2" onClick={handleSearch}>Search</button>
            </div><br/>
            {program &&
                <div>
                    <p><b>{program.name}</b></p>
                    Critical Tracking Courses:
                    {listCourses(program.critical_tracking)}
                    <br></br>
                    Core Courses:
                    {listCourses(program.core)}
                </div>
            }
        </div>

    )
}

export default Info