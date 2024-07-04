
import { range } from "@/lib/utils";

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const HOUR_HEIGHT = 30;
const HOUR_MARGIN_TOP = 24;

export type OpeningHoursType = {
    id: string;
    restaurantId: string;
    dayOfWeek: number;
    opensAt: string;
    closesAt: string;
};

interface WeeklyCalendarProps {
    openingHours: OpeningHoursType[];
    hour?: boolean;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
    openingHours,
    hour 
}) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const parseTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return { hours, minutes };
    };

    const calculateEventPosition = (opensAt: string, closesAt: string) => {
        const { hours: openHour, minutes: openMinutes } = parseTime(opensAt);

        const closesAtTime = parseTime(closesAt);
        const howLong = (closesAtTime.hours - openHour) + (closesAtTime.minutes - openMinutes) / 60;

        return {
            top: (openHour - 1) * HOUR_HEIGHT + HOUR_MARGIN_TOP + openMinutes * HOUR_HEIGHT / 60 + 30, // Ajuste aqui
            height: howLong * HOUR_HEIGHT,
        };
    };

    return (
        <div className="w-full border overflow-auto">
            <div className="grid grid-cols-[60px,repeat(7,1fr)] relative">
                <div 
                    className="grid grid-rows-[repeat(24,1fr)] first:mt-[24px]"
                >
                    {range(24).map((hour, key) => (
                        <span 
                            key={key}
                            className="flex items-center justify-center"
                            style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                            <p>{hour < 10 ? `0${hour}` : hour}:00</p>
                        </span>
                    ))}
                </div>
                {DAYS.map((day, key) => (
                    <div 
                        key={key} 
                        className="border relative overflow-hidden cursor-pointer"
                        style={{
                            // background: areaDatesSame(now, addDateBy(mondayDate, key)) ? '#F2CEE6' : ''
                        }}
                    >
                        <p className="text-center font-medium">{day}</p>
                        <div className="border"/>
                        {openingHours.filter(event => event.dayOfWeek === key).map((event, i) => {
                            const { top, height } = calculateEventPosition(event.opensAt, event.closesAt);
                            return (
                                <div
                                    key={i}
                                    className="absolute left-1 right-1 bg-green-400 text-white text-center font-medium p-1 border flex flex-col justify-between overflow-hidden hover:z-10 cursor-pointer"
                                    style={{
                                        top,
                                        height,
                                    }}
                                >
                                    <span>De {event.opensAt}</span>
                                    <span>às {event.closesAt}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
                {hour && (
                    <div 
                        className="absolute w-full border border-blue-400"
                        style={{
                            top: (currentHour - 1) * HOUR_HEIGHT + HOUR_MARGIN_TOP + currentMinutes * HOUR_HEIGHT / 60 + 30 // Ajuste aqui
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
