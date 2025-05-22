"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = ({ count }) => {
    const searchParams = useSearchParams();
    const { replace, refresh } = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(false);

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const params = new URLSearchParams(searchParams);
    const ITEM_PER_PAGE = limit;
    const totalPages = Math.ceil(count / ITEM_PER_PAGE);

    const hasPrev = ITEM_PER_PAGE * (parseInt(page) - 1) > 0;
    // const hasNext = ITEM_PER_PAGE * (parseInt(page) - 1) + ITEM_PER_PAGE < count;
    const hasNext = page < totalPages;

    const handleChangePage = (type) => {
        setLoading(true);
        type === "prev"
            ? params.set("page", parseInt(page) - 1)
            : params.set("page", parseInt(page) + 1);
        replace(`${pathname}?${params}`);
        refresh();
    };

    const handleDirectChanges = (number) => {
        if (number === Number(page)) {
            setLoading(false);
        } else {
            setLoading(true);
            params.set("page", parseInt(number));
            replace(`${pathname}?${params}`);
        }
        refresh();
    };

    const handleDataLimit = (e) => {
        setLoading(true);
        params.set("limit", parseInt(e.target.value));
        replace(`${pathname}?${params}`);
    }

    useEffect(() => {
        setLoading(false);
    }, [searchParams]);

    return (
        <div className="pagination-wrapper" >
            <ul className="notranslate">
                <button
                    disabled={!hasPrev}
                    className="navigate-left"
                    onClick={() => handleChangePage("prev")}>
                    {
                        loading
                            ?
                            <i className="fa fa-circle-notch rotating-spinner-alt"></i>
                            :
                            <i className="fa fa-angle-left"></i>
                    }
                </button>
                <ul className="pagination-pages">
                    {[...Array(Math.min(totalPages, 5)).keys()].map((_, index) => (
                        <li
                            key={index}
                            onClick={() => handleDirectChanges(index + 1)}
                            className={index + 1 === parseInt(page) ? "pagination_active" : ""}
                        >
                            {index + 1}
                        </li>
                    ))}
                    {totalPages > 5 && <li className="pagination-skips">......</li>}
                    {totalPages > 5 && <li onClick={() => handleDirectChanges(totalPages)}>{totalPages}</li>}
                </ul>
                <button className="show-only-btn-data">Page - {page}/{totalPages}</button>
                <button
                    disabled={!hasNext}
                    className="navigate-right"
                    onClick={() => handleChangePage("next")}>
                    {
                        loading
                            ?
                            <i className="fa fa-circle-notch rotating-spinner-alt"></i>
                            :
                            <i className="fa fa-angle-right"></i>
                    }
                </button>
                <div className="page-limit">
                    <select onChange={(e) => handleDataLimit(e)}>
                        <option value="10">10 / Page</option>
                        <option value="20">20 / Page</option>
                        <option value="30">30 / Page</option>
                        <option value="40">40 / Page</option>
                        <option value="50">50 / Page</option>
                        <option value="100">100 / Page</option>
                    </select>
                </div>
            </ul>
        </div>
    );
};

export default Pagination;