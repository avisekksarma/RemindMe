document.addEventListener('DOMContentLoaded', () => {
    let urlp = new URLSearchParams(window.location.search);
    let task = urlp.get("task");
    let taskID = urlp.get("id");
    document.getElementById('task').textContent = task;

    const snoozeBtn = document.getElementById('snooze');
    const doneBtn = document.getElementById('done');
    doneBtn.addEventListener('click', async function () {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true })
        console.log(tabs)
        await browser.runtime.sendMessage({
            case:'doneBtn',
            task: task,
            id: taskID
        }).catch(e => console.log(`error: ${e} occured`))
        // const tabs = await browser.tabs.query({ currentWindow: true, active: true })
        await browser.tabs.remove(tabs[0].id);
    })

})

