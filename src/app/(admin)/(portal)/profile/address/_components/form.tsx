"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchAddressResponse, searchAddress } from "@/lib/utils";
import { AddressSchema } from "@/schemas/address";
import { AddressType } from "@/types";
import { useState } from "react";
import { z } from "zod";
import SearchAddress from "@/components/search-address";

const formSchema = AddressSchema.omit({ id: true, updatedAt:true, createdAt: true, addressId: true });

export type AddressFormValues = z.infer<typeof formSchema>;

interface AddressFormPros {
    initialDate: AddressType | null
}

const FormAddress: React.FC<AddressFormPros> = ({
    initialDate
}) => {

    

    
    return (
        <div className="h-full">
            <SearchAddress 
                onChange={(address) => console.log(address)}
                placeholder="Ex.: Rua teste, 123"
                textLabel="Buscar endereço"
            />
            <div>form</div>
        </div>
    );
}
 
export default FormAddress;