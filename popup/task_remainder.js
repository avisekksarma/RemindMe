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
            if (e.target.id === "final-submit") {
                let task = document.getElementById('task')
                let timeset = document.getElementById('time')
                console.log('Time set is: ')
                console.log(timeset.value)
                if (task.value == "") {
                    console.log('empty');
                } else {
                    console.log(`Typed task=${task.value}`);
                    console.log(`Typed at time:  ${timeset.value}`);
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
                const val = convTo(new Date())
                const timePicker = document.getElementById('time')
                timePicker.value = val;
                console.log('click make new rem clicked ')
            } else if (e.target.id === 'image-back') {
                setDisplay('block', 'none', 'none', 'none');
            } else if (e.target.className === "delete-rem-btn") {
                handleDeleteRem(e.target.dataset.remid);
            } else if (e.target.className === "edit-rem-btn") {
                setDisplay('none', 'block', 'none', 'block');
                editSubmit.style.display = 'block';
                remindSubmit.style.display = 'none';
                const idOfEditTask = e.target.dataset.remid;
                let task = document.getElementById('task')
                let timePicker = document.getElementById('time')
                browser.storage.local.get(null)
                    .then((obj) => {
                        task.value = obj[idOfEditTask].rem;
                        timePicker.value = convTo(obj[idOfEditTask].time)
                    })
            }

        });
    }
    async function handleEditRem(x) {
        await browser.storaetg
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
                pTask.innerHTML = `<b>Task: </b> ${obj[prop]['rem']}`;
                pTime.innerHTML = `<b>Time: </b> ${obj[prop]['time'].toDateString()} (${obj[prop]['time'].toLocaleTimeString()})`
                i.appendChild(pTask)
                i.appendChild(pTime)
                i.appendChild(editBtn)
                i.appendChild(delBtn)
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


    // function reportExecuteScriptError(error) {
    //     document.querySelector("#popup-content").classList.add("hidden");
    //     document.querySelector("#error-content").classList.remove("hidden");
    //     console.error(`Failed to execute task-remainder content script: ${error.message}`);
    // }
    // browser.tabs
    //     .executeScript({ file: "/content_scripts/remind.js" })
    //     .then(listenForClicks)
    //     .catch(reportExecuteScriptError);
    listenForClicks()

})
// ,
//     "content_scripts": [
//         {
//             "matches": [
//                "<all_urls>" 
//             ],
//             "js": [
//                 "content_scripts/remind.js"
//             ]
//         }
//     ]


