document.addEventListener('DOMContentLoaded',()=>{
    console.log('loaded dom')
    let mainPage = document.getElementById('main-page')
    let seeRem = document.getElementById('see-rem')
    seeRem.style.display='none'
    let makeRem = document.getElementById('make-new-rem')
    makeRem.style.display = 'none'
    function listenForClicks() {
        document.addEventListener("click", (e) => {
            if (e.target.id === "final-submit") {
                console.log('clicked submit!!')
                const task = document.getElementById('task').value
                const timeset = document.getElementById('time').value
                if (task == "") {
                    console.log('empty');
                } else {
                    console.log(`Typed task=${task} at ${timeset}`);
                    browser.storage.local.set({ rem: task, time: timeset })
                }

            } else if (e.target.id==="click-make-new-rem") {
                makeRem.style.display = 'block'
                mainPage.style.display = 'none'
                seeRem.style.display = 'none'
                console.log('make new rem btn clicked')
            }
        });
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
