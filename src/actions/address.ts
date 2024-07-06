"use server"

import { Address } from "@prisma/client";
import axios from "axios";

export type SearchAddressType = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'complement'> & {
  uf: string;
}

export const searchAddress = async (address: string): Promise<SearchAddressType[] | null> => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = await response.data;
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results.map((result: any) => {
          const { lat, lng } = result.geometry.location as {lat: number, lng: number};
  
          const getComponentLongName = (type: string) => {
            const component = result.address_components.find((c: any) => c.types.includes(type));
            return component ? component.long_name : '';
          };

          const getComponentShortName = (type: string) => {
            const component = result.address_components.find((c: any) => c.types.includes(type));
            return component ? component.short_name : '';
          };
  
          return {
            streetAddress: getComponentLongName('route'),
            number: getComponentLongName('street_number'),
            country: getComponentLongName('country'),
            state: getComponentLongName('administrative_area_level_1'),
            neighborhood: getComponentLongName('sublocality_level_1'),
            city: getComponentLongName('administrative_area_level_2'),
            zipCode: getComponentLongName('postal_code'),
            uf: getComponentShortName('administrative_area_level_1'),
            latitude: lat.toString(),
            longitude: lng.toString(),
          } as SearchAddressType
        });
      } else {
        return null
        throw new Error('Endereço não encontrado ou inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      return null;
    }
}