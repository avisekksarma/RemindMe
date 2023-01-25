
function listenForClicks(){
    document.addEventListener("click", (e) => {
        if(e.target.id==="final-submit"){
            console.log('clicked submit!!')
            const task = document.getElementById('task').value
            if (task==""){
                console.log('empty');
            }else{
                console.log(`Typed task=${task}`);
                
            }
            
        }else{
            console.log('other place clicked')
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