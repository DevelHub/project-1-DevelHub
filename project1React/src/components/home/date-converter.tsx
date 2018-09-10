
export function DateConverter(reimbursements: object[]) {
    reimbursements.forEach((ers:any) => {
        const datesToConvert = [ ers.reimb_submitted, ers.reimb_resolved ]
        for (let i = 0; i < 2; i++) {
            if (datesToConvert[i]) {
                const d = new Date(datesToConvert[i]);
                const month = d.getMonth() + 1;
                const date = d.getDate();
                const year = d.getFullYear();
                let day = '';
                switch (d.getDay()) {
                    case 1: day = 'Monday'; break;
                    case 2: day = 'Tuesday'; break;
                    case 3: day = 'Wednesday'; break;
                    case 4: day = 'Thursday'; break;
                    case 5: day = 'Friday'; break;
                    case 6: day = 'Saturday'; break;
                    case 7: day = 'Sunday'; break;
                }
                const hour = d.getHours();
                const min = d.getMinutes();
                const stringMonth = (month < 10) ? '0' + month : month;
                const stringDate = (date < 10) ? '0' + date : date;
                const stringHour = (hour > 12) ? hour - 12 : hour;
                const stringMin = (min < 10) ? '0' + min : min;
                const stringTimeOfDay = (hour < 12) ? 'AM' : 'PM';
                if (datesToConvert[i] === ers.reimb_submitted) {
                    ers.reimb_submitted = stringMonth + '/' + stringDate + '/' + year + ' ' + day + ' ' + stringHour + ':' + stringMin + ' ' + stringTimeOfDay;
                }
                else {
                    ers.reimb_resolved = stringMonth + '/' + stringDate + '/' + year + ' ' + day + ' ' + stringHour + ':' + stringMin + ' ' + stringTimeOfDay;
                }
            }
        }
    });
    return reimbursements;
}