import { range } from "@/lib/utils";
import React from "react";

const HOUR_HEIGHT = 30;

const HourColumn: React.FC = () => {
    return (
        <div className="grid grid-rows-[repeat(24,1fr)] first:mt-[24px]">
            {range(24).map((hour, key) => (
                <span key={key} className="flex items-center justify-center" style={{ height: `${HOUR_HEIGHT}px` }}>
                    <p className="text-sm text-muted-foreground">{hour}h</p>
                </span>
            ))}
        </div>
    );
};

export default HourColumn;
