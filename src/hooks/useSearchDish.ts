"use client"

import { useState } from "react"

const useSearchDish = () => {
    const [search, setSearch] = useState("");

    return {
        search,
        setSearch,
    }
}

export default useSearchDish;