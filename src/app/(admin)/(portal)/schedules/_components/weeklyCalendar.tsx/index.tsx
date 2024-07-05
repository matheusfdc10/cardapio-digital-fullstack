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

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ openingHours, hour }) => {
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
        const duration = (closesAtTime.hours - openHour) + (closesAtTime.minutes - openMinutes) / 60;

        return {
            top: openHour * HOUR_HEIGHT + HOUR_MARGIN_TOP + openMinutes * HOUR_HEIGHT / 60,
            height: duration * HOUR_HEIGHT,
        };
    };

    return (
        <div className="w-full border overflow-auto">
            <div className="grid grid-cols-[40px,repeat(7,1fr)] relative">
                <div className="grid grid-rows-[repeat(24,1fr)] first:mt-[24px]">
                    {range(24).map((hour, key) => (
                        <span key={key} className="flex items-center justify-center" style={{ height: `${HOUR_HEIGHT}px` }}>
                            <p className="text-sm text-muted-foreground">{hour}h</p>
                        </span>
                    ))}
                </div>
                {DAYS.map((day, key) => (
                    <div key={key} className="border-l relative cursor-pointer min-w-16">
                        <p className="text-center font-medium">{day}</p>
                        {range(24).map((line, lineKey) => (
                            <div key={lineKey} className="border-t border-slate-100/95 absolute w-full" style={{ top: line * HOUR_HEIGHT + HOUR_MARGIN_TOP }} />
                        ))}
                        {openingHours.filter(event => event.dayOfWeek === key).map((event, i) => {
                            const { top, height } = calculateEventPosition(event.opensAt, event.closesAt);
                            return (
                                <div
                                    key={i}
                                    className="absolute left-1 right-1 bg-green-400/30 hover:bg-green-500/30 text-green-600 text-center text-sm font-medium p-1 shadow-sm flex flex-col justify-center hover:z-10 cursor-pointer"
                                    style={{ top, height }}
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
                        className="absolute w-full border-t border-blue-400/90 z-20"
                        style={{
                            top: currentHour * HOUR_HEIGHT + HOUR_MARGIN_TOP + currentMinutes * HOUR_HEIGHT / 60,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
