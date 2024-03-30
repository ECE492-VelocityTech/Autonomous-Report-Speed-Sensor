import {
    GoogleMap,
    useLoadScript,
    LoadScriptProps,
    MarkerF,
} from "@react-google-maps/api";

import SetModal from "./SetModal";
import { useEffect, useState } from "react";
import ResetModal from "./ResetModal";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

function Maps() {
    const [coordinates, setCoordinates] = useState<
        Array<{ lat: number; lng: number; address: string; deviceNo: string }>
    >([]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/v1/devices"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch coordinates");
                }
                const data = await response.json();
                const fetchedCoordinates = data.map((item: any) => ({
                    lat: item.lat,
                    lng: item.lng,
                    address: item.address,
                    deviceNo: item.deviceNo,
                }));
                setCoordinates(fetchedCoordinates);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCoordinates();
    }, []);

    const markerPosition = {
        lat: 46.0851248,
        lng: -64.786682,
    };

    const [isSetOpen, setIsOpen] = useState(false);
    const [deviceAddress, setDeviceAddress] = useState("");
    const [deviceNumber, setDeviceNumber] = useState("0");
    const [isResetOpen, setResetIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [center, setCenter] = useState({
        lat: 53.5444,
        lng: -113.4909,
    });
    const [zoom, setZoom] = useState(10);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey || "", //sessionStorage.getItem("googleApiKey") || "",
        libraries: googleMapsLibraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps</div>;

    return (
        <>
            <div className="places-container" style={{ paddingBottom: "10px" }}>
                <PlacesAutoComplete
                    setSelected={setSelected}
                    setZoom={setZoom}
                    setCenter={setCenter}
                />
            </div>
            <div>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={zoom}
                    center={center}
                    options={options}
                >
                    {/* <MarkerF
                        position={markerPosition}
                        onClick={() => setIsOpen(true)}
                    /> */}
                    {/* {selected && <Marker position={selected} />} */}
                    {coordinates.map((coordinate, index) => (
                        <MarkerF
                            key={index}
                            position={coordinate}
                            onClick={() => {
                                setIsOpen(true);
                                setDeviceNumber(coordinate.deviceNo);
                                setDeviceAddress(coordinate.address);
                            }}
                        />
                    ))}
                </GoogleMap>
                <div style={{ paddingTop: "10px" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setResetIsOpen(true)}
                    >
                        Reset
                    </button>
                </div>
                {isResetOpen && <ResetModal setIsOpen={setResetIsOpen} />}
                {isSetOpen && (
                    <SetModal
                        setIsOpen={setIsOpen}
                        deviceNumber={deviceNumber}
                        address={deviceAddress}
                    />
                )}
            </div>
        </>
    );
}

const PlacesAutoComplete = ({ setSelected, setZoom, setCenter }: any) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
        setCenter({ lat, lng });
        setZoom(15);
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input form-control me-sm-2"
                placeholder="Enter an address"
            />
            <ComboboxPopover>
                <ComboboxList className="combobox-list">
                    {status === "OK" &&
                        data.map(({ place_id, description }) => (
                            <ComboboxOption
                                key={place_id}
                                value={description}
                            />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
};

export default Maps;
