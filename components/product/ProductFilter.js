"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const ProductFilter = () => {

    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((e) => {
        const params = new URLSearchParams(searchParams);

        params.set("sortByPrice", "asc");

        if (e.target.value === "default") {
            params.delete("sortByPrice");
            return replace(`${pathname}?${params}`);
        }

        if (e.target.value) {
            params.set("sortByPrice", e.target.value);
        } else {
            params.delete("sortByPrice");
        }

        replace(`${pathname}?${params}`);
    }, 100)

    return (
        <div className="search-panel">
            <select onChange={(e) => handleSearch(e)}>
                <option value="default">Sort product by Price - Default</option>
                <option value="desc">High To Low</option>
                <option value="asc">Low To High</option>
            </select>
        </div>
    )
}

export default ProductFilter