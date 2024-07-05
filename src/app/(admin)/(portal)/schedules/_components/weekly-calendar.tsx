"use client"

import React, { useState } from "react";
import HourColumn from "./hour-column";
import DayColumn from "./day-column";
import Modal from "@/components/modals";
import OpeningHoursForm from "./form";
import { OpeningHoursType } from "@/types";

export const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const HOUR_HEIGHT = 30;
const HOUR_MARGIN_TOP = 24;

// export type OpeningHoursType = {
//     id: string;
//     restaurantId: string;
//     dayOfWeek: number;
//     opensAt: string;
//     closesAt: string;
// };

interface WeeklyCalendarProps {
    openingHours: OpeningHoursType[] | null;
    hour?: boolean;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
    openingHours,
    hour
}) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const [modalForm, setModalForm] = useState<{state: boolean, dayOfWeek?: number}>({ state: false })

    const parseTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return { hours, minutes };
    };

    const calculateEventPosition = (opensAt: string, closesAt: string) => {
        const { hours: openHour, minutes: openMinutes } = parseTime(opensAt);
        const closesAtTime = parseTime(closesAt);
        const duration = (closesAtTime.hours - openHour) + (closesAtTime.minutes - openMinutes) / 60;

        return {
            top: openHour * HOUR_HEIGHT + HOUR_MARGIN_TOP + openMinutes * HOUR_HEIGHT / 60,
            height: duration * HOUR_HEIGHT,
        };
    };

    return (
        <>
            <Modal
                title="Adicionar horário"
                onClose={() => setModalForm({state: false})}
                isOpen={modalForm.state}
            >
                <OpeningHoursForm
                    initialDate={null}
                    dayOfWeek={modalForm.dayOfWeek}
                />
            </Modal>
            <span>{new Date().getHours()}:{new Date().getMinutes()}</span>
            <div className="w-full border overflow-auto">
                <div className="grid grid-cols-[40px,repeat(7,1fr)] relative">
                    <HourColumn />
                    {DAYS.map((day, key) => (
                        <DayColumn
                            key={key}
                            day={day}
                            dayIndex={key}
                            openingHours={openingHours}
                            calculateEventPosition={calculateEventPosition}
                            onClick={() => setModalForm({state: true, dayOfWeek: key})}
                        />
                    ))}
                    {hour && (
                        <div
                            className="absolute w-full border-t border-blue-400/90 z-20"
                            style={{
                                top: currentHour * HOUR_HEIGHT + HOUR_MARGIN_TOP + currentMinutes * HOUR_HEIGHT / 60,
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default WeeklyCalendar;
