import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { Address } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type SearchAddress = {
  street?: string;
  city?: string;
  country?: string;
  // postalcode?: string;
}

export type ResponseSearchAddress = {
  lat?: string;
  lon?: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    ["ISO3166-2-lvl4"]?: string;
    region?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  }
}

export type SearchAddressResponse = Omit<Address, 'complement' | 'createdAt' | 'updatedAt' | 'id' | 'userId'> & {
  uf: string;
}

export async function searchAddress(data: SearchAddress): Promise<SearchAddressResponse[] | null> {
  const params = new URLSearchParams();

  if (data.street) {
    params.append('street', data.street);
  }

  if (data.city) {
    params.append('city', data.city);
  }

  if (data.country) {
    params.append('country', data.country);
  }

  // if (data.postalcode) {
  //   params.append('postalcode', data.postalcode);
  // }

  params.append('format', 'json');
  params.append('addressdetails', '1');

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const response = await axios.get<ResponseSearchAddress[]>(url)

    if (!response?.data) return []
    
    return response.data.map((item) => ({
      streetAddress: item.address.road || '',
      number: item.address.house_number || '',
      country: item.address.country || '',
      state: item.address.state || '',
      neighborhood: item.address.suburb || '',
      city: item.address.city || '',
      zipCode: item.address.postcode || '',
      latitude: item.lat || '',
      longitude: item.lon || '',
      uf: item.address["ISO3166-2-lvl4"]?.split('-')[1] || '',
    })).filter(address => 
      address.streetAddress &&
      address.country &&
      address.state &&
      address.neighborhood &&
      address.city &&
      address.zipCode &&
      address.latitude &&
      address.longitude &&
      address.uf
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao buscar endereço:', error.message);
    } else {
      console.error('Erro inesperado:', error);
    }
    return null;
  }
}

export const range = (keyCount: number): number[] => {
  return Array.from({ length: keyCount }, (_, i) => i);
};

export function getTodayWeekdayIndex() {
  const today = new Date();
  return today.getDay();
}

// type searchCEP = {
//   uf: string;
//   city: string;
//   street: string;
// }

// export async function searchCEP(data: searchCEP) {
//   const url = `https://viacep.com.br/ws/${data.uf}/${data.city}/${data.street}/json/`;

//   try {
//     const response = await axios.get(url);
    
//     if (response.data.length === 1) {
//       return response.data as string
//     }

//     return null
//   } catch(error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Erro ao buscar endereço:', error.message);
//     } else {
//       console.error('Erro inesperado:', error);
//     }
//     return null
//   }
// }

// export async function searchAddress(data: SearchAddress): Promise<ResponseSearchAddress[] | null> {
//   const params = new URLSearchParams();

//   if (data.street) {
//     params.append('street', data.street);
//   }

//   if (data.city) {
//     params.append('city', data.city);
//   }

//   if (data.country) {
//     params.append('country', data.country);
//   }

//   if (data.postalcode) {
//     // params.append('postalcode', data.postalcode);
//   }

//   params.append('format', 'json');
//   params.append('addressdetails', '1');

//   const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

//   try {
    
    
//     if (data.city || data.country || data.street) {
//       // CEP RETORNA ERRADO
//       const response = await axios.get<ResponseSearchAddress[]>(url)

//       if (response.data.length === 1 && response.status === 200) {
//         const address = response.data[0].address;
//         const uf = address["ISO3166-2-lvl4"].split('-')[1];
//         const city = encodeURIComponent(address.city);
//         const street = encodeURIComponent(address.road);

//         const responseCEP = await axios.get(`https://viacep.com.br/ws/${uf}/${city}/${street}/json/`);
//         if (responseCEP.data.length === 1) {
//           const cep = responseCEP.data[0].cep;

//           response.data[0].address.postcode = cep;

//           return response.data;
//         } else {
//           return null;
//         }
//       }

//       return response.data;
//     } else if (data.postalcode) {
//       const responseCEP = await axios.get(`https://brasilapi.com.br/api/cep/v2/${data.postalcode}`);

//       if (responseCEP.data && responseCEP.status === 200) {
//         const street = encodeURIComponent(responseCEP.data.street);
//         const city = encodeURIComponent(responseCEP.data.city);
//         const country = 'brasil';

//         const response = await axios.get<ResponseSearchAddress[]>(`https://nominatim.openstreetmap.org/search?street=${street}&city=${city}&country=${country}&format=json&addressdetails=1`)
//         if (response.data.length === 1) {
//           const cep = responseCEP.data[0].cep;

//           response.data[0].address.postcode = cep;

//           return response.data;
//         }

//         return response.data;
//       }
//       return [];
//     }
//     return null;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Erro ao buscar endereço:', error.message);
//     } else {
//       console.error('Erro inesperado:', error);
//     }
//     return null;
//   }
// }