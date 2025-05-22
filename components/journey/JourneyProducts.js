"use client"

import { fetchAllProducts } from "@/app/actions/product/data";
import { useEffect, useState } from "react";

const JourneyProducts = ({ addProduct, replaceNextOrder, journeyProduct }) => {

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleScreening = () => {
        fetchAllData();
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        const res = await fetchAllProducts(page, limit, minPrice, maxPrice) || [];
        const newRes = JSON.parse(res);

        if (newRes?.status === 201) {
            setFilteredProducts(newRes?.products);
            setTotalPages(Math.ceil(newRes?.count / limit) || 1);
            setIsLoading(false);
        } else {
            setFilteredProducts([]);
            setIsLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        setPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    useEffect(() => {
        fetchAllData();
    }, [page, limit]);


    const pageNumbers = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1, 2, 3);

        if (page < totalPages - 3) {
            pageNumbers.push('...');
        }

        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return (
        <>
            <div className="journey-list-all-product">
                <div className="content-information-wrapper">
                    <h3>Product List</h3>
                    <div className="search-panel mt1">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Lowest Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Highest Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <button
                                className="btn btn-tertiary mr-4"
                                onClick={handleScreening}
                                type="submit"
                            >
                                Screening
                            </button>
                        </form>
                        <ul className="notranslate">
                            {
                                isLoading
                                    ?
                                    <div className="product-loading">
                                        <h3> <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></></h3>
                                    </div>
                                    :
                                    <></>
                            }
                            {filteredProducts?.map((data, index) => (
                                <li key={index}>
                                    <div className="product-childs">
                                        <p>{data?.productName}</p>
                                    </div>
                                    <div className="product-childs">
                                        <p>{data?.productPrice}</p>
                                    </div>
                                    <div className="product-childs">
                                        <button
                                            onClick={() => addProduct(data)}
                                            className={journeyProduct?.some(item => item?._id === data?._id) ? "managedDisabled btn btn-tertiary mr1" : "btn btn-tertiary mr1"}
                                        >
                                            Add to Continuous Order
                                        </button>
                                        <button
                                            onClick={() => replaceNextOrder(data)}
                                            className="btn btn-tertiary"
                                        >
                                            Replace Next Order
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {
                            isLoading
                                ?
                                <></>
                                :
                                <>
                                    <div className="pagination-controls-parent">
                                        <div className="pagination-controls">
                                            <button onClick={handlePrevPage} disabled={page === 1}>
                                                Previous
                                            </button>

                                            <div className="page-numbers">
                                                {pageNumbers.map((pageNumber, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        disabled={page === pageNumber}
                                                        className={page === pageNumber ? "active" : ""}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                ))}
                                            </div>

                                            <button onClick={handleNextPage} disabled={page === totalPages}>
                                                Next
                                            </button>
                                        </div>
                                        <div className="limit-control">
                                            <label htmlFor="limit">Products per page: </label>
                                            <select id="limit" value={limit} onChange={handleLimitChange}>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                                <option value={200}>100</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default JourneyProducts;
