import Wip from "../images/wip.png";
import radiatorSprings from "../images/radiator_springs.jpeg";

const About = () => {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${radiatorSprings})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "110vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                <h1 style={{ color: "black", fontWeight: "bold" }}> About </h1>
            </div>
        </>
    );
};

export default About;
