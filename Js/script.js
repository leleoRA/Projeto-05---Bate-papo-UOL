let name_user;
let addressee = "Todos", type = "message";


function startchat(){
    name_user = document.querySelector(".inputscreen input").value;

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: name_user});
    
    promise.then(() => {
        const screen = document.querySelector(".inputscreen");
        screen.classList.add("minimize");

        stayonline();
        message_users();
    });

    promise.catch((answer) => {
        const erro = document.querySelector(".inputscreen .erro");
        erro.classList.remove("minimize");
    });

    
    
}
function stayonline(){
    setInterval(() => {
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: name_user});
       // promise.then((answer) => {console.log(answer.data);});
        promise.catch((erro) => {console.log(erro.data);});
    }, 5000);
}
function message_users(){
    const messagepromisse = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    messagepromisse.then((answer) => {
        const message = document.querySelector(".chatscreen");
        message.innerHTML="";
        for(let i = 90; i < answer.data.length; i++){
            if(answer.data[i].type === 'status'){
                message.innerHTML +=`
                <div class="message in-out">
                        <div class="hour">(${answer.data[i].time})</div>
                        <div class="text"><span>${answer.data[i].from}</span> ${answer.data[i].text}</div>
                </div>
                `;
            } else if(answer.data[i].type === 'private_message'){
                if(answer.data[i].to === name_user || answer.data[i].from == name_user){
                    message.innerHTML +=`
                    <div class="message private">
                            <div class="hour">(${answer.data[i].time})</div>
                            <div class="text"><span>${answer.data[i].from}</span> reservadamente para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
                    </div>
                    `;
                }
            } else{
                message.innerHTML +=`
                <div class="message">
                        <div class="hour">(${answer.data[i].time})</div>
                        <div class="text"><span>${answer.data[i].from}</span> para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
                </div>
                `;
            }
            
        }
        const lastmessage = document.querySelector(".message:last-child");
        lastmessage.scrollIntoView();
    });
    messagepromisse.catch((erro) => {
        alert("ferrou");
        console.log(erro.response);});
    setInterval(message_users, 3000);

}
function send_message(){

    const input = document.querySelector("footer div input");
    if(input.classList.contains("textinput")){
        const messagepromisse = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',{from: name_user, to: addressee, text:input.value, type: type });
        //messagepromisse.then((answer) => {console.log(answer.data);});
        messagepromisse.catch((erro) => {console.log(erro.response);});
        input.value = "Escreva aqui ...";
        input.classList.remove("textinput");
    }    
}
function users_area(){
    const screen_visibility = document.querySelector(".userscreen");
    screen_visibility.classList.toggle("minimize");
    if(!(screen_visibility.classList.contains("minimize"))){
        const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
        promise.then((answer) => {
            let participants = document.querySelector(".participants");

            for(let i = 0; i < answer.data.length; i++){
                participants.innerHTML += `
                <li onclick="selected(this, 'participants')">
                    <ion-icon name="person-circle"></ion-icon>
                    ${answer.data[i].name}
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </li>
                `;
            }
        });
        promise.catch((erro) => {console.log(erro.response)});
    }
    
}
function selected(selected, classname){
    const otherselected = document.querySelector("."+classname+" .selected");
    otherselected.classList.remove("selected");
    selected.classList.add("selected");
    
}
function clickinput(input){
    if(!input.classList.contains("textinput")){
        input.classList.add("textinput");
        input.value = "";
    }
}