"use client"

import WeeklyCalendar from "./weekly-calendar.tsx";

const schedules = [
    {
        id: '1',
        restaurant:   {},
        restaurantId: '1',
        dayOfWeek: 0,
        opensAt: "10:00",
        closesAt: "14:00",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: '2',
        restaurant:   {},
        restaurantId: '1',
        dayOfWeek: 0,
        opensAt: "17:00",
        closesAt: "22:00",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: '3',
        restaurant:   {},
        restaurantId: '1',
        dayOfWeek: 6,
        opensAt: "17:00",
        closesAt: "22:00",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: '4',
        restaurant:   {},
        restaurantId: '1',
        dayOfWeek: 4,
        opensAt: "00:00",
        closesAt: "10:00",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
]


const ClientSchedules = () => {
    return (
        <>
            <WeeklyCalendar openingHours={schedules} hour/>
        </>
    );
}
 
export default ClientSchedules;