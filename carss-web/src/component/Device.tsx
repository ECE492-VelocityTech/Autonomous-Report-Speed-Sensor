import Maps from "./Maps";
import radiatorSprings from "../images/radiator_springs.jpeg";

function Device() {
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
                    alignItems: "flex-start", // Change alignItems to "flex-start" to align the logo at the top
                }}
            >
                <div className="container mt-5">
                    <div className="card">
                        <div className="card-header">Device</div>
                        <div className="card-body">
                            <h5 className="card-title">Select your device:</h5>
                            <p className="card-text">
                                Please select the device you would like to view.
                            </p>
                            <Maps />
                        </div>
                        <div className="card-footer text-muted">
                            &copy; Velocity Tech
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Device;
