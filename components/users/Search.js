"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const Search = ({ authenticatedUser }) => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState();

    const handleSearch = useDebouncedCallback((e) => {
        setLoading(true);
        const params = new URLSearchParams(searchParams);

        params.set("page", 1);

        if (e.target.value) {
            params.set("q", e.target.value);
        } else {
            params.delete("q");
        }

        replace(`${pathname}?${params}`);

        const valueOfParams = params.get("q");
        if (!valueOfParams) {
            setLoading(false);
        }
        
    }, 100)

    const handleReset = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        replace(`${pathname}?${params}`);
    }

    useEffect(() => {
        setLoading(false);
    }, [searchParams]);

    return (
        <div className="search-panel">
            {
                loading
                    ?
                    <div className="search-progress-gloabl"></div>
                    :
                    <></>
            }
            <input
                type="text"
                placeholder={authenticatedUser?.language === "en" ? "Search..." : "搜索"}
                onChange={handleSearch}
            />
            <button className="btn btn-outline mr-4" onClick={() => handleReset()}>{authenticatedUser?.language === "en" ? "Reset" : "重置"}</button>
        </div>
    )
}

export default Search