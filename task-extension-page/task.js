document.addEventListener('DOMContentLoaded', () => {
    let urlp = new URLSearchParams(window.location.search);
    let task = urlp.get("task");
    let taskID = urlp.get("id");
    document.getElementById('task').innerHTML = "\u{2192} " + task;

    const snoozeBtn = document.getElementById('snooze');
    const doneBtn = document.getElementById('done');
    doneBtn.addEventListener('click', async function () {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true })
        console.log(tabs)
        await browser.runtime.sendMessage({
            case: 'doneBtn',
            task: task,
            id: taskID
        }).catch(e => console.log(`error: ${e} occured`))
        // const tabs = await browser.tabs.query({ currentWindow: true, active: true })
        await browser.tabs.remove(tabs[0].id);
    })

    // handling snooze btn:
    // for now snooze 10 minutes
    snoozeBtn.addEventListener('click', async function () {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true })
        // console.log(tabs)
        await browser.runtime.sendMessage({
            case: 'snoozeBtn',
            task: task,
            id: taskID
        })

        // const tabs = await browser.tabs.query({ currentWindow: true, active: true })
        await browser.tabs.remove(tabs[0].id);
    })

})

