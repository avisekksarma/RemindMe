browser.alarms.onAlarm.addListener(async function (alarmInfo) {
    console.log("Alarm fired: ", alarmInfo.name);
    let task = await browser.storage.local.get(alarmInfo.name)
    console.log(task);
    task = task[alarmInfo.name].rem;
    console.log(task)
    browser.notifications.create(
        {
            type: 'basic',
            title: 'Remainder!!!',
            message: task 
        }
    )
});
