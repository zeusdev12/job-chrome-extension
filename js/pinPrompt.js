const template = `
    <div class="pin-prompt-root" id='pin-prompt-root'>
    <div class="dn-icon" id="dnicon">
    :D
    </div>
    <div class='prompt-content' id="promptcontent">
    <h3>Pin the extension, keep DNNae handy</h3>
    <ol class='steps-ol'>
        <li>Click the jigsaw icon in the top right</li>
        <li>Look for DNNae and click the pin icon</li>
    </ol>
    <button class='cta-bt' id='okbt'>Okay</button>
    </div>
    </div>
`


chrome.runtime.onMessage.addListener(function(request, sender, sendRespons){
    switch(request.cmd){
        case 'REMOVE_PROMPT':
            $('#pin-prompt-root').remove()
            break

        default:
            break
    }
})


$(document).ready(function(){
    chrome.storage.local.get('isPopupOpened', function(result){
        if(!result.isPopupOpened){
            $('body').append(template)
            $('#dnicon').click(function(){
                $('#promptcontent').toggleClass('hide')
            })
            $('#okbt').click(function(){
                $('#promptcontent').addClass('hide')
            })
        }
    })

})