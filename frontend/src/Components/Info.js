import { useEffect, useState } from "react"
import '../output.css'

const Info = props => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
        //props.doIt(searchTerm);
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
            {props.program &&
                <div>
                    <p><b>{props.program.name}</b></p>
                    Required Courses:
                    {listCourses(props.program.required_courses)}
                </div>
            }
        </div>

    )
}

export default Info