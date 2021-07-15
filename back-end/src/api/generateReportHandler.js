const Response = require("../model/response/response");
const GenerateReportService = require("../services/generateReportService");

class GenerateReportHandler {
    async handle(req, res) {
        const service = new GenerateReportService();

        let startDate = req.body.start;
        let endDate = req.body.end;
        let tasksFilter = req.body.tasks||[];
        let projectsFilter = req.body.projects||[];
        let userid = req.user._id;

        //Start time should be the beginning of the day.
        let tmpDate = new Date(startDate);
        tmpDate.setHours(0);
        tmpDate.setMinutes(0);
        tmpDate.setSeconds(0);
        tmpDate.setMilliseconds(0);

        startDate = tmpDate.getTime();

        //End time should be the end of the day.
        tmpDate = new Date(endDate);
        tmpDate.setHours(23);
        tmpDate.setMinutes(59);
        tmpDate.setSeconds(59);
        tmpDate.setMilliseconds(999);

        endDate = tmpDate.getTime();

        try {
            let report = await service.generateReport(userid, startDate, endDate, projectsFilter, tasksFilter);
            res.send(Response.Success(report));
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error generating report."));
        }

    }
}

module.exports = GenerateReportHandler;