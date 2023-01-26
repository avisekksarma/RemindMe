document.addEventListener('DOMContentLoaded', () => {
    console.log('loaded dom')
    let mainPage = document.getElementById('main-page')
    let seeRem = document.getElementById('see-rem')
    seeRem.style.display = 'none'
    let makeRem = document.getElementById('make-new-rem')
    makeRem.style.display = 'none'

    let backBtn = document.getElementById('image-back')
    backBtn.style.display = 'none'



    function listenForClicks() {
        document.addEventListener("click", (e) => {
            if (e.target.id === "final-submit") {
                const task = document.getElementById('task').value
                const timeset = document.getElementById('time').value
                if (task == "") {
                    console.log('empty');
                } else {
                    console.log(`Typed task=${task} at ${timeset}`);
                    handleAddingRem(task, timeset);
                }

            } else if (e.target.id === "click-see-rem") {
                setDisplay('none', 'none', 'block', 'block');
                browser.storage.local.get(null)
                    .then(handleSeeRems)
            }
            else if (e.target.id === "click-make-new-rem") {
                setDisplay('none', 'block', 'none', 'block');
                console.log('click make new rem clicked ')
            } else if (e.target.id === 'image-back') {
                setDisplay('block', 'none', 'none', 'none');
            } else if (e.target.className === "delete-rem-btn") {
                handleDeleteRem(e.target.dataset.remid);
            }
        });
    }

    function handleDeleteRem(x) {
        browser.storage.local.get(null)
            .then(obj => {
                console.log('first one')
                console.log(obj)
            })
        console.log(`remid=${x}`)
        // browser.storage.local.set({a:10})
        // browser.storage.local.get(null)
        // .then(obj=>console.log(obj))
        // TODO: find better way to do promise inside a promise i.e. child promise thing.
        browser.storage.local.get(null)
            .then(obj => {
                delete obj[x]
                console.log('second one')
                console.log(obj)
                const { count, ...newObj } = obj;
                console.log(newObj)
                browser.storage.local.clear()
                .then(()=>{
                    browser.storage.local.set({...newObj,count:obj.count-1})
                    .then(()=>{
                        browser.storage.local.get(null)
                            .then(handleSeeRems)
                    })
                })
            })
    }

    function handleSeeRems(obj) {
        let adiv = document.querySelector('.outer-div-rems')
        if (adiv !== null) {
            adiv.remove()
        }
        const outerDiv = document.createElement('div')
        outerDiv.className = 'outer-div-rems'
        const seeRem = document.querySelector('#see-rem')
        for (const prop in obj) {
            if (prop === 'count' || prop === 'id') { } else {
                const i = document.createElement('div')
                i.className = 'each-rem'
                const pTask = document.createElement('p')
                // btn start
                const delBtn = document.createElement('button')
                delBtn.className = 'delete-rem-btn'
                delBtn.setAttribute('data-remid', prop)
                delBtn.innerHTML = 'Delete'
                // btn end
                const pTime = document.createElement('p')
                pTask.innerHTML = `<b>Task: </b> ${obj[prop]['rem']}`;
                pTime.innerHTML = `<b>Time: </b> ${obj[prop]['time']}`
                i.appendChild(pTask)
                i.appendChild(pTime)
                i.appendChild(delBtn)
                outerDiv.appendChild(i)
            }
        }
        seeRem.appendChild(outerDiv)
    }
    function handleAddingRem(task, timeset) {
        browser.storage.local.get(null)
            .then(obj => {
                let x = { rem: task, time: timeset }
                if (!obj.hasOwnProperty('count')) {

                    browser.storage.local.set({ count: 1, id: 2, 1: x })
                    console.log('no count')
                } else {
                    const { count, id, ...newObj } = obj;
                    let newId = obj.id;
                    browser.storage.local.clear()
                    browser.storage.local.set({ ...newObj, [newId]: x, count: obj.count + 1, id: obj.id + 1 })
                    console.log('has count')
                }
            }
            ).catch(err => console.log(err))
    }


    function setDisplay(mainPageVal, makeRemVal, seeRemVal, backBtnVal) {
        mainPage.style.display = mainPageVal
        makeRem.style.display = makeRemVal
        seeRem.style.display = seeRemVal
        backBtn.style.display = backBtnVal
    }


    function reportExecuteScriptError(error) {
        document.querySelector("#popup-content").classList.add("hidden");
        document.querySelector("#error-content").classList.remove("hidden");
        console.error(`Failed to execute task-remainder content script: ${error.message}`);
    }

    browser.tabs
        .executeScript({ file: "/content_scripts/remind.js" })
        .then(listenForClicks)
        .catch(reportExecuteScriptError);
})
