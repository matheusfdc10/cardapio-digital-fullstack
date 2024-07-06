import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { Address } from "@prisma/client";
import { toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const range = (keyCount: number): number[] => {
  return Array.from({ length: keyCount }, (_, i) => i);
};

export function date(): Date {
  const timeZone = process.env.TIME_ZONE || 'America/Sao_Paulo';
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);
  return zonedDate;
}

export function getTodayWeekdayIndex(): number {
  const zonedDate = date();
  return zonedDate.getDay();
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