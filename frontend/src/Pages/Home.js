import '../output.css'
import ForceGraph from "../components/ForceGraph"
import Header from "../components/Header"
import Footer from "../components/Footer"

const Home = () => {
    return (
        <div className="w-screen h-screen bg-[#F1F1F1]">
            <Header/>
            <div className="flex justify-center">
                <ForceGraph/>
            </div>
            <Footer/>
        </div>
    )
}

export default Home