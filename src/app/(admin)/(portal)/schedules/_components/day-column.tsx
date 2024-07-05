import React from "react";
import { range } from "@/lib/utils";
import EventItem from "./event-Item";
import { OpeningHoursType } from "@/types";

const HOUR_HEIGHT = 30;
const HOUR_MARGIN_TOP = 24;

interface DayColumnProps {
    day: string;
    dayIndex: number;
    openingHours: OpeningHoursType[] | null;
    calculateEventPosition: (opensAt: string, closesAt: string) => { top: number; height: number; };
    onClick?: () => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ 
    day,
    dayIndex, 
    openingHours, 
    calculateEventPosition, 
    onClick 
}) => {
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            if (onClick) onClick();
        }
    };

    return (
        <div onClick={handleOutsideClick} className="border-l relative cursor-pointer min-w-16">
            <p className="text-center font-medium">{day}</p>
            {range(24).map((line, lineKey) => (
                <div key={lineKey} className="border-t border-slate-100/95 absolute w-full" style={{ top: line * HOUR_HEIGHT + HOUR_MARGIN_TOP }} />
            ))}
            {!!openingHours && openingHours.filter(event => event.dayOfWeek === dayIndex).map((event, i) => {
                const { top, height } = calculateEventPosition(event.opensAt, event.closesAt);
                return (
                    <EventItem
                        key={i}
                        top={top}
                        height={height}
                        closesAt={event.closesAt}
                        opensAt={event.opensAt}
                        data={event}
                    />
                );
            })}
        </div>
    );
};

export default DayColumn;
