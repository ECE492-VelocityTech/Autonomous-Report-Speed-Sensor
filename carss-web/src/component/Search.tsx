import React from "react";

const Search = () => {
    return (
        <div
            style={{
                maxWidth: "600px",
                paddingBottom: "20px",
            }}
        >
            <form className="d-flex">
                <input
                    className="form-control me-sm-2"
                    type="search"
                    placeholder="Search"
                />
                <button className="btn btn-primary my-2 my-sm-0" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
};

export default Search;
