document.addEventListener('DOMContentLoaded', () => {
    let urlp = new URLSearchParams(window.location.search);
    let task = urlp.get("task");
    let taskID = urlp.get("id");
    document.getElementById('task').textContent = task;

    const snoozeBtn = document.getElementById('snooze');
    const doneBtn = document.getElementById('done');
    doneBtn.addEventListener('click', async function () {
        const tabs = await browser.tabs.query({ currentWindow: true, active: true })
        browser.tabs.remove(tabs[0].id);
        console.log(taskID)
    })

})

