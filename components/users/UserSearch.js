"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import moment from "moment";
import { DatePicker } from "antd";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

const UserSearch = () => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState();

    const [dates, setDates] = useState([
        searchParams.get('startDate') ? moment(searchParams.get('startDate')) : null,
        searchParams.get('endDate') ? moment(searchParams.get('endDate')) : null
    ]);

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

    const handleDateRangeChange = (values) => {
        setLoading(true);
        const params = new URLSearchParams(searchParams);

        if (values) {
            const [start, end] = values;
            const startDate = start ? start.format("YYYY-MM-DD") : "";
            const endDate = end ? end.format("YYYY-MM-DD") : "";

            params.set("startDate", startDate);
            params.set("endDate", endDate);
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }

        replace(`${pathname}?${params}`);
        setDates(values);

        const valueOfParams = params.get("startDate");
        if (!valueOfParams) {
            setLoading(false);
        }
    };

    const handleReset = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        params.delete("qphone");
        params.delete("startDate");
        params.delete("endDate");
        replace(`${pathname}?${params}`);
        setDates([null, null]);
    };

    useEffect(() => {
        setLoading(false);
    }, [searchParams]);

    return (
        <>
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
                <p>Registration Time:</p>
                <div className="dateAndTime">
                    <RangePicker
                        value={dates}
                        onChange={handleDateRangeChange}
                    />
                </div>
                <button className="btn btn-outline resetBtn mr-4" onClick={() => handleReset()}>Reset</button>
            </div>
        </>
    )
}

export default UserSearch