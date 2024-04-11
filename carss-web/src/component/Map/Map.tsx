import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import ConfirmDeviceModal from "../ConfirmDeviceModal/ConfirmDeviceModal";
import styles from "./Map.module.css";
import AutoComplete from "../AutoComplete/AutoComplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { ServerUrl } from "../../util/RestApi";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;
const googleMapsLibraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

function Map() {
    const [coordinates, setCoordinates] = useState<
        Array<{
            id: number;
            lat: number;
            lng: number;
            address: string;
            name: string;
            speedLimit: number;
        }>
    >([]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(`${ServerUrl}/api/v1/devices`);
                if (!response.ok) {
                    throw new Error("Failed to fetch coordinates");
                }

                const data = await response.json();
                setCoordinates(
                    data.map((item: any) => ({
                        id: item.id,
                        lat: item.lat,
                        lng: item.lng,
                        address: item.address,
                        name: item.name,
                        speedLimit: item.speedLimit,
                    }))
                );
            } catch (error) {
                console.error(error);
            }
        };
        fetchCoordinates();
    }, []);

    const [isSetOpen, setIsOpen] = useState(false);
    const [deviceAddress, setDeviceAddress] = useState("");
    const [deviceId, setDeviceId] = useState(0);
    const [speedLimit, setSpeedLimit] = useState(0);
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 53.5444,
        lng: -113.4909,
    });
    const [zoom, setZoom] = useState(10);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: googleMapsLibraries as "places"[],
    });

    const handlePlaceSelect = async (location: google.maps.LatLngLiteral) => {
        const results = await getGeocode({ location });
        const { lat, lng } = await getLatLng(results[0]);
        setCenter({ lat, lng });
        setZoom(18);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps</div>;

    return (
        <>
            <div
                className="places-container"
                style={{ paddingBottom: "10px", width: "100%" }}
            >
                <AutoComplete
                    onPlaceSelected={handlePlaceSelect}
                    googleMapsApi={window.google.maps}
                />
            </div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={zoom}
                center={center}
                options={options}
            >
                {coordinates.map((coordinate) => (
                    <MarkerF
                        key={coordinate.id}
                        position={{ lat: coordinate.lat, lng: coordinate.lng }}
                        onClick={() => {
                            setIsOpen(true);
                            setDeviceId(coordinate.id);
                            sessionStorage.setItem(
                                "deviceId",
                                coordinate.id.toString()
                            );
                            setDeviceAddress(coordinate.address);
                            setSpeedLimit(coordinate.speedLimit);
                        }}
                    />
                ))}
            </GoogleMap>
            {isSetOpen && (
                <div className={styles.modalOverlay}>
                    <ConfirmDeviceModal
                        setIsOpen={setIsOpen}
                        deviceId={deviceId}
                        address={deviceAddress}
                        speedLimit={speedLimit}
                    />
                </div>
            )}
        </>
    );
}

export default Map;
