import '../output.css'
import ForceGraph from "../Components/ForceGraph"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

const Home = () => {
    return (
        <div className="w-screen h-screen bg-orange-50">
            <Header/>
            <div className="flex justify-center">
                <ForceGraph/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home