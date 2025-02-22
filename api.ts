import {Class, ClassInstance, Course} from "./types.ts";

export type APIConfig = {
    apiBaseUrl: string;
}
export class CourseAPI {
    private _config: APIConfig;

    constructor(config: APIConfig) {
        this._config = config;
    }

    public async getClassDetails(courseCustomID: string, classNumbers: number[]): Promise<Class[]> {
        const res = await (await fetch(this._config.apiBaseUrl + "/courses/" + courseCustomID, {})).json();

        if (res.id != courseCustomID) throw Error("Invalid Course CID.");

        const year: number = res.year;

        const courseDetails: Course = {
            subjectCategory: res.name.subject,
            subjectCode: res.name.code,
            title: res.name.title,
        }

        let classes: Class[] = [];

        for (const classSlot of res.class_list) {
            for (const classDetail of classSlot.classes) {
                if (!classNumbers.includes(+classDetail["number"])) continue;

                let instances: Array<ClassInstance> = [];

                for (const meetingDetail of classDetail.meetings) {
                    const [startMonth, startDay] = (meetingDetail.date.start as string).split("-")
                    const [endMonth, endDay] = (meetingDetail.date.end as string).split("-");
                    const [startHour, startMinutes] = (meetingDetail.time.start as string).split(":");
                    const [endHour, endMinutes] = (meetingDetail.time.end as string).split(":");

                    const firstDate = Temporal.PlainDate.from({
                        year: year,
                        month: +startMonth,
                        day: +startDay
                    });
                    const lastDate = Temporal.PlainDate.from({
                        year: year,
                        month: +endMonth,
                        day: +endDay
                    });

                    let currentDate = Temporal.PlainDate.from(firstDate);
                    while (Temporal.PlainDate.compare(currentDate, lastDate) <= 0) {
                        const start = Temporal.ZonedDateTime.from({
                            timeZone: "Australia/Adelaide",
                            year: year,
                            month: currentDate.month,
                            day: currentDate.day,
                            hour: +startHour,
                            minute: +startMinutes,
                        })
                        const end = Temporal.ZonedDateTime.from({
                            timeZone: "Australia/Adelaide",
                            year: year,
                            month: currentDate.month,
                            day: currentDate.day,
                            hour: +endHour,
                            minute: +endMinutes,
                        })

                        const classInstance: ClassInstance = {
                            location: meetingDetail.location,
                            start: start,
                            end: end,
                        }

                        instances.push(classInstance);

                        currentDate = currentDate.add({weeks: 1});
                    }
                }

                const classData: Class = {
                    classNumber: classDetail["number"],
                    type: classSlot.type,
                    course: courseDetails,
                    instances: instances,
                }

                classes.push(classData);
            }
        }

        return classes;
    }
}
