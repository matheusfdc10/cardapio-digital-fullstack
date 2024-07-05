import { getOpeningHoursAll } from "@/actions/admin/opening-hours";
import WeeklyCalendar from "./_components/weekly-calendar";

const SchedulesPage = async () => {
    const reponse = await getOpeningHoursAll()

    return (
        <WeeklyCalendar openingHours={reponse.data} hour/>
    )
}
export default SchedulesPage;