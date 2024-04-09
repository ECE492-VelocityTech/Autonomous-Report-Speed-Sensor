import React, { useState, useEffect, useRef } from "react";
import styles from "./AutoComplete.module.css";

interface AutoCompleteProps {
    onPlaceSelected: (location: google.maps.LatLngLiteral) => void;
    googleMapsApi: typeof google.maps;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    onPlaceSelected,
    googleMapsApi,
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [suggestions, setSuggestions] = useState<
        google.maps.places.AutocompletePrediction[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const autocompleteServiceRef =
        useRef<google.maps.places.AutocompleteService | null>(null);

    useEffect(() => {
        if (googleMapsApi && !autocompleteServiceRef.current) {
            autocompleteServiceRef.current =
                new googleMapsApi.places.AutocompleteService();
        }
    }, [googleMapsApi]);

    const fetchSuggestions = (value: string) => {
        if (value.length > 3 && autocompleteServiceRef.current) {
            autocompleteServiceRef.current.getPlacePredictions(
                { input: value },
                (predictions, status) => {
                    if (
                        status ===
                            googleMapsApi.places.PlacesServiceStatus.OK &&
                        predictions
                    ) {
                        setSuggestions(predictions);
                    }
                }
            );
        } else {
            setSuggestions([]);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        fetchSuggestions(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelect = async (
        suggestion: google.maps.places.AutocompletePrediction
    ) => {
        setInputValue(suggestion.description || "");
        setShowSuggestions(false);
        const geocoder = new googleMapsApi.Geocoder();
        const results = await geocoder.geocode({
            address: suggestion.description || "",
        });
        if (results.results[0]) {
            const location: google.maps.LatLngLiteral = {
                lat: results.results[0].geometry.location.lat(),
                lng: results.results[0].geometry.location.lng(),
            };
            onPlaceSelected(location);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    return (
        <div className={styles.autocomplete}>
            <input
                className="form-control"
                value={inputValue}
                onChange={handleInput}
                onBlur={handleInputBlur}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter an address"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;
