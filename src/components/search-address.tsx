"use client"

import { PiMapPinLight } from "react-icons/pi";
import { useCallback, useEffect, useState } from "react";
import { SearchAddressResponse, searchAddress } from "@/lib/utils";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchAddressProsp {
    onChange: (address: SearchAddressResponse) => void;
    placeholder?: string;
    textLabel?: string;
}

const SearchAddress: React.FC<SearchAddressProsp> = ({
    onChange,
    placeholder,
    textLabel
}) => {
    const [adresses, setAdresses] = useState<SearchAddressResponse[]>([]);
    const [address, setAddress] = useState<string>('');
    const debouncedValue = useDebounceValue(address, 500);

    const fetchAddresses = useCallback(async () => {
        if (debouncedValue[0].length >= 3) {
            const response = await searchAddress({ street: debouncedValue[0] });
            setAdresses(response || []);
        } else {
            setAdresses([]);
        }
    }, [debouncedValue[0]]);

    const handleOnChange = (item: SearchAddressResponse) => {
        onChange(item);
        setAdresses([])
    }

    useEffect(() => {
        fetchAddresses();
    }, [debouncedValue[0]]);

    return (
        <div className="relative">
            <div className="space-y-2">
                {textLabel && (
                    <Label>
                        Busca endereço
                    </Label>
                )}
                <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={placeholder}
                />
            </div>
            {!!adresses.length && (
                <ul className="divide-y divide-gray-300 absolute top-full mt-1 w-full bg-white z-10 max-h-60 overflow-y-auto border-b border-x">
                    {adresses.map((address, key) => (
                        <li 
                            key={key}
                            onClick={() => handleOnChange(address)}
                            className="flex py-2 cursor-pointer hover:bg-zinc-50 active:scale-[.99]"
                        >
                            <div className="flex justify-center items-center w-10">
                                <PiMapPinLight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span>
                                    {address.streetAddress}{address.number ?  `, ${address.number}` : ''}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {address.neighborhood} - {address.city} - {address.uf} - {address.country}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
 
export default SearchAddress;