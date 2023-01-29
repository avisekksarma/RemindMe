
let notificationClicked = false;

browser.notifications.onClicked.addListener(function (notificationId) {
    notificationClicked = true;
    console.log('notificantion is clicekd by user.')
});

// browser.notifications.onClosed.addListener(function (notificationId) {
//     if (notificationClicked) {
//         console.log("Notification closed by user");
//     } else {
//         console.log("Notification closed by operating system");
//     }
// });


async function createNotification(task) {
    await browser.notifications.create(
        {
            type: 'basic',
            title: 'Remainder!!!',
            message: task,
            // eventtime: Date.now()+1000*5
            // buttons: [{
            //     title: 'Close',
            //     iconUrl: 'icons/close-48.png',
            // }]
        }
    )
}



browser.alarms.onAlarm.addListener(async function (alarmInfo) {
    console.log("Alarm fired: ", alarmInfo.name);
    let obj = await browser.storage.local.get(alarmInfo.name)
    let task = obj[alarmInfo.name].rem;
    let ID = obj[alarmInfo.name].id;
    // createnotification returns a promise
    // await createNotification(task);
    let taskURL = browser.runtime.getURL("task-extension-page/task.html") + "?task=" + task + "&id=" + ID;
    browser.tabs.create({ url: taskURL })
});

browser.runtime.onMessage.addListener(async function (data, sender) {
    if (data.case === 'doneBtn') {
        // handle clicking doneBtn on extension page
        // i.e. delete that remainder
        const currObj = await browser.storage.local.get(null);
        if (currObj.hasOwnProperty(data.id)) {
            browser.storage.local.remove(data.id)
            let obj = await browser.storage.local.get(null)
            const { count, ...newObj } = obj;
            await browser.storage.local.set({ ...newObj, count: count - 1 })
            console.log('removed')
        }
    } else if (data.case === 'snoozeBtn') {
        await browser.alarms.clear(data.id)
        let minutes = 10;
        let timeSinceEpochMs = Date.now() + minutes * 60 * 1000;
        await browser.alarms.create(`${data.id}`, {
            when: timeSinceEpochMs,
        })
        const obj = await browser.storage.local.get(null)
        console.log('++++++++')
        console.log(obj)
        delete obj[data.id];
        console.log(obj)
        console.log('++++++++')
        await browser.storage.local.set({ ...obj, [data.id]: { rem: data.task, time: new Date(timeSinceEpochMs), id: data.id } })
        const newObj = await browser.storage.local.get(null)
        console.log(newObj)
        console.log('++++++++')
    }
})

// browser.notifications.onButtonClicked.addListener(function (notifID, buttonIndex) {
//     console.log('Closed by clicking')
//     // if (buttonIndex == 1) {
//     //     // clear that notification.
//     //     browser.notifications.clear(notifID)
//     // }
// })

// browser.notifications.onClicked.addListener(function(notifId){
//     console.log('clicked by user')
//     console.log(notifId)
//     // browser.notifications.clear(notifId);
// })

// browser.notifications.onClosed.addListener(function (notifId,byUser) {
//     console.log(notifId)
//     console.log('Closed on own')
//     console.log(byUser)

// })
