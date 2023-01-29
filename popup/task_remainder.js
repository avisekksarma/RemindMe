document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded dom')
    let mainPage = document.getElementById('main-page')
    let seeRem = document.getElementById('see-rem')
    seeRem.style.display = 'none'
    let makeRem = document.getElementById('make-new-rem')
    makeRem.style.display = 'none'

    let backBtn = document.getElementById('image-back')
    backBtn.style.display = 'none'

    let editSubmit = document.getElementById('edit-done')
    editSubmit.style.display = 'none'

    let remindSubmit = document.getElementById('final-submit')

    const convTo = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)


    function listenForClicks() {
        document.addEventListener("click", (e) => {
            let task = document.getElementById('task')
            let timeset = document.getElementById('time')
            if (e.target.id === "final-submit") {
                if (task.value == "") {
                    console.log('empty');
                } else {
                    const prom = handleAddingRem(task.value, timeset.value);
                    prom.then(() => {
                        task.value = ""
                        let newTime = convTo(new Date())
                        timeset.value = newTime
                    })
                }

            } else if (e.target.id === "click-see-rem") {
                setDisplay('none', 'none', 'block', 'block');
                browser.storage.local.get(null)
                    .then(handleSeeRems)
            }
            else if (e.target.id === "click-make-new-rem") {
                setDisplay('none', 'block', 'none', 'block');
                remindSubmit.style.display = 'block'
                editSubmit.style.display = 'none'
                task.value = ""
                const val = convTo(new Date())
                timeset.value = val;
            } else if (e.target.id === 'image-back') {
                setDisplay('block', 'none', 'none', 'none');
            } else if (e.target.className === "delete-rem-btn") {
                handleDeleteRem(e.target.dataset.remid);
            } else if (e.target.className === "edit-rem-btn") {
                setDisplay('none', 'block', 'none', 'block');
                const idOfEditTask = e.target.dataset.remid;

                editSubmit.style.display = 'block';
                editSubmit.dataset.id = idOfEditTask;
                remindSubmit.style.display = 'none';
                let task = document.getElementById('task')
                let timePicker = document.getElementById('time')
                browser.storage.local.get(null)
                    .then((obj) => {
                        task.value = obj[idOfEditTask].rem;
                        timePicker.value = convTo(obj[idOfEditTask].time)
                    })
            } else if (e.target.id === 'edit-done') {
                let task = document.getElementById('task')
                let timeset = document.getElementById('time')
                handleEditRem(task.value, timeset.value, editSubmit.dataset.id)

            }

        });
    }
    async function handleEditRem(newTask, newTime, currId) {
        await browser.storage.local.remove(currId);
        const obj = await browser.storage.local.get(null)
        // console.log(obj)
        const { id, ...newObj } = obj;
        const x = { rem: newTask, time: new Date(newTime), id: Number(id) };
        await browser.storage.local.set({ ...newObj, [id]: x, id: Number(id) + 1 })
        const updatedObj = await browser.storage.local.get(null)
        setDisplay('none', 'none', 'block', 'block');
        // clear previously set alarm:
        let clearPromise = await browser.alarms.clear(`${currId}`)
        if (clearPromise === true) {
            console.log(`alarms of ${currId} successfully cleared`)
            let timeSinceEpochMs = x.time.getTime()
            browser.alarms.create(`${x.id}`, {
                when: timeSinceEpochMs,
            })
        } else {
            console.log(`alarms of ${currId} not cleared due to some error.`)
            // likely error = this task is of past date
            let timeSinceEpochMs = x.time.getTime()
            browser.alarms.create(`${x.id}`, {
                when: timeSinceEpochMs,
            })
        }
        handleSeeRems(updatedObj)
    }

    async function handleDeleteRem(x) {
        const obj = await browser.storage.local.get(null)
        delete obj[x]
        const { count, ...newObj } = obj;
        await browser.storage.local.clear()
        await browser.storage.local.set({ ...newObj, count: obj.count - 1 })
        const updatedObj = await browser.storage.local.get(null)
        handleSeeRems(updatedObj)
    }

    function handleSeeRems(obj) {
        let adiv = document.querySelector('.outer-div-rems')
        if (adiv !== null) {
            adiv.remove()
        }
        const outerDiv = document.createElement('div')
        outerDiv.className = 'outer-div-rems'
        const seeRem = document.querySelector('#see-rem')
        let keys = Object.keys(obj).reverse()
        for (const prop of keys) {
            if (prop === 'count' || prop === 'id') { } else {
                const i = document.createElement('div')
                i.className = 'each-rem'
                const pTask = document.createElement('p')
                pTask.className = 'each-task';
                // del btn start
                const delBtn = document.createElement('button')
                delBtn.className = 'delete-rem-btn'
                delBtn.setAttribute('data-remid', prop)
                delBtn.innerHTML = 'Delete'
                // btn end
                // edit button start    
                const editBtn = document.createElement('button')
                editBtn.className = 'edit-rem-btn'

                editBtn.setAttribute('data-remid', prop)
                editBtn.innerHTML = 'Edit'
                // edit button end
                const pTime = document.createElement('p')
                const pBtnWrapper = document.createElement('p')
                pTask.innerHTML = `<b>Task: </b><br> ${obj[prop]['rem']}`;
                pTime.innerHTML = `<b>Time: </b><br> ${obj[prop]['time'].toDateString()} (${obj[prop]['time'].toLocaleTimeString()})`
                i.appendChild(pTask)
                i.appendChild(pTime)
                i.appendChild(pBtnWrapper)
                pBtnWrapper.appendChild(editBtn)
                pBtnWrapper.appendChild(delBtn)
                outerDiv.appendChild(i)
            }
        }
        seeRem.appendChild(outerDiv)
    }
    async function handleAddingRem(task, timeset) {
        let obj = await browser.storage.local.get(null)
        let x = { rem: task, time: new Date(timeset) }
        let idX = 0;
        if (!obj.hasOwnProperty('count')) {
            idX = 1;
            x.id = idX;
            await browser.storage.local.set({ count: 1, id: 2, 1: x })
        } else {
            const { count, id, ...newObj } = obj;
            let newId = obj.id;
            idX = newId;
            await browser.storage.local.clear()
            x.id = idX;
            await browser.storage.local.set({ ...newObj, [newId]: x, count: obj.count + 1, id: obj.id + 1 })
        }
        // for notification part
        //TODO: a. handle past date, throwing error (b). work on repeat 
        // remainder
        let timeSinceEpochMs = x.time.getTime()
        browser.alarms.create(`${idX}`, {
            when: timeSinceEpochMs,
        })
    }


    function setDisplay(mainPageVal, makeRemVal, seeRemVal, backBtnVal) {
        mainPage.style.display = mainPageVal
        makeRem.style.display = makeRemVal
        seeRem.style.display = seeRemVal
        backBtn.style.display = backBtnVal
    }

    listenForClicks()

})

