"use client"

import { PiMapPinLight } from "react-icons/pi";
import { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchAddressType, searchAddress } from "@/actions/address";
import MapArea from "@/components/map-area";
import { Button } from "./ui/button";

interface SearchAddressProsp {
    onChange: (address: SearchAddressType) => void;
    placeholder?: string;
    textLabel?: string;
    disabled?: boolean;
}

const SearchAddress: React.FC<SearchAddressProsp> = ({
    onChange,
    placeholder,
    textLabel,
    disabled,
}) => {
    const [adresses, setAdresses] = useState<SearchAddressType[]>([]);
    const [address, setAddress] = useState<SearchAddressType | null>(null);
    const [textAddress, setTextAddress] = useState<string>('');
    const debouncedValue = useDebounceValue(textAddress, 500);

    const fetchAddresses = useCallback(async () => {
        if (debouncedValue[0].length >= 3) {
            const response = await searchAddress(debouncedValue[0]);
            // console.log(response)
            setAdresses(response || []);
        } else {
            setAdresses([]);
        }
    }, [debouncedValue[0]]);

    const handleSelectAddress = (item: SearchAddressType) => {
        if (
            item.city &&
            item.country &&
            item.latitude &&
            item.longitude &&
            item.neighborhood &&
            item.number &&
            item.state &&
            item.streetAddress &&
            item.uf &&
            item.zipCode
        ) {
            setAddress(item)
            // setTextAddress("")
            setAdresses([])
        }
    }

    useEffect(() => {
        fetchAddresses();
    }, [debouncedValue[0]]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="space-y-2">
                    {textLabel && (
                        <Label>
                            {textLabel}
                        </Label>
                    )}
                    <Input
                        value={textAddress}
                        onChange={(e) => {
                            setTextAddress(e.target.value)
                            setAddress(null)
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </div>
                {!!adresses.length && (
                    <ul className="divide-y divide-gray-300 absolute top-full mt-1 w-full bg-white z-10 max-h-60 overflow-y-auto border-b border-x">
                        {adresses.map((address, key) => (
                            <li 
                                key={key}
                                onClick={() => handleSelectAddress(address)}
                                className="flex py-2 cursor-pointer hover:bg-zinc-50 active:scale-[.99]"
                            >
                                <div className="flex justify-center items-center w-10">
                                    <PiMapPinLight className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col flex-1 mr-2">
                                    <span>
                                        {[address.streetAddress, address.number].filter(Boolean).join(', ')}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {[address.neighborhood, address.city, address.uf, address.country].filter(Boolean).join(' - ')}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <MapArea
                lat={Number(address?.latitude)}
                lng={Number(address?.longitude)}
                zoom={address ? 16 : 11}
            >
                {address && (
                    <div className="absolute top-[10px] left-[10px] space-y-4">
                        <div
                            onClick={() => onChange(address)}
                            className="bg-white rounded-sm flex py-2 cursor-pointer hover:bg-zinc-50 active:scale-[.99]"
                        >
                            <div className="flex justify-center items-center w-10">
                                <PiMapPinLight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col flex-1 mr-2">
                                <span>
                                    {[address.streetAddress, address.number].filter(Boolean).join(', ')}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {[address.neighborhood, address.city, address.uf, address.country].filter(Boolean).join(' - ')}
                                </span>
                            </div>
                        </div>
                        <Button
                            onClick={() => onChange(address)}
                            variant="outline"
                        >
                            Confirmar
                        </Button>
                    </div>
                )}
            </MapArea>
        </div>
    );
}
 
export default SearchAddress;