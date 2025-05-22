"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const DealingFilter = () => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((e) => {
        const params = new URLSearchParams(searchParams);

        params.set("sortByType", "all");

        if (e.target.value === "default") {
            params.delete("sortByType");
            return replace(`${pathname}?${params}`);
        }

        if (e.target.value) {
            params.set("sortByType", e.target.value);
        } else {
            params.delete("sortByType");
        }

        replace(`${pathname}?${params}`);
    }, 100)

    return (
        <div className="search-panel">
            <select onChange={(e) => handleSearch(e)}>
                <option value="all">All - Default</option>
                <option value="ticket">Ticket Dealing</option>
                <option value="normal">Normal Dealing</option>
            </select>
        </div>
    )
}

export default DealingFilter;