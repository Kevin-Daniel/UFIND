import { useEffect, useState } from "react"
import '../output.css'

const Info = props => {
    const [program, setProgram] = useState(null)

    const fetchProgram = async (name) => {
        const response = await fetch(`/api/programs/${name}`)
        const json = await response.json()
        console.log(json)
        if (response.ok) {
            setProgram(json["0"])
        }
    }

    useEffect(() => {
        fetchProgram("Computer Science")
    }, [])

    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
        props.doIt(searchTerm);
    };

    const onSearch = (search) => {
        fetchProgram(search)
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
                    Required Courses:
                    {listCourses(program.required_courses)}
                </div>
            }
        </div>

    )
}

export default Info