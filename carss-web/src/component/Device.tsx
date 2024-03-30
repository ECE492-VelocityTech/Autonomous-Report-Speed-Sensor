import Maps from "./Maps";

function Device() {
    return (
        <>
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
        </>
    );
}

export default Device;
