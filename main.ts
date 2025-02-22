import {CourseAPI} from "./api.ts";
import {createCalendar} from "./calendar.ts";

const api = new CourseAPI({apiBaseUrl: "https://courses-api.csclub.org.au"});

// My enrolments for CNA
const classes = await api.getClassDetails("fb66109cb372", [11261, 11257]);

console.log(classes);

const calendar = createCalendar(classes);

if (calendar !== undefined) {
    Deno.writeTextFileSync("out.ics", calendar);
}
