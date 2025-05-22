"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const LoginHistorySearch = () => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState();

    const handleSearchUsingUsername = useDebouncedCallback((e) => {
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

    const handleSearchUsingPhone = useDebouncedCallback((e) => {
        setLoading(true);
        const params = new URLSearchParams(searchParams);

        params.set("page", 1);

        if (e.target.value) {
            params.set("qphone", e.target.value);
        } else {
            params.delete("qphone");
        }

        replace(`${pathname}?${params}`);

        const valueOfParams = params.get("qphone");
        if (!valueOfParams) {
            setLoading(false);
        }

    }, 100)

    const handleSearchUsingIP = useDebouncedCallback((e) => {
        setLoading(true);
        const params = new URLSearchParams(searchParams);

        params.set("page", 1);

        if (e.target.value) {
            params.set("ip", e.target.value);
        } else {
            params.delete("ip");
        }

        replace(`${pathname}?${params}`);

        const valueOfParams = params.get("ip");
        if (!valueOfParams) {
            setLoading(false);
        }

    }, 100)

    const handleReset = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.delete("qphone");
        params.delete("ip");
        replace(`${pathname}?${params}`);
    };

    useEffect(() => {
        setLoading(false);
    }, [searchParams]);

    return (
        <div className="search-panel user-search-panel">
            {
                loading
                    ?
                    <div className="search-progress-gloabl"></div>
                    :
                    <></>
            }
            <input
                type="text"
                placeholder="Please enter username"
                onChange={handleSearchUsingUsername}
            />
            <input
                type="text"
                placeholder="Please enter phone number"
                onChange={handleSearchUsingPhone}
            />
            <input
                type="text"
                placeholder="Please enter IP"
                onChange={handleSearchUsingIP}
            />
            <button className="btn btn-outline resetBtn mr-4" onClick={() => handleReset()}>Reset</button>
        </div>
    )
}

export default LoginHistorySearch;