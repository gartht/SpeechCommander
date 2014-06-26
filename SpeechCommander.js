/**
 * Created by garth.tutor on 5/8/2014.
 */

(function(context){

    var speechRecognition = context.SpeechRecognition || context.webkitSpeechRecognition;

    if(!speechRecognition){
        context.SpeechCommander = null;
        return;
    }

    var listener = new speechRecognition();
    listener.continuous = true;

    listener.onresult = function(event){
        alert('resultIndex: ' + event.resultIndex);
    };

    listener.onerror = function(error){
        alert('error: ' + error.error);
    };

    var commands = {};

    var isListening = false;

    var commandConfig = {
        callToAttention:'',
        addCommand:function(routeArray, callback){
            if((!routeArray instanceof Array) || routeArray.length < 1) return;
            if(typeof callback !=="function") return;

            if(!commands[routeArray[0]])commands[routeArray[0]] = {};
            var currentRoute = commands[routeArray[0]];

            for(var i=1; i<routeArray.length; i++){
                if(!currentRoute[routeArray[i]]){
                    currentRoute[routeArray[i]] = i < routeArray.lenth - 1 ? {} : callback;
                }
                currentRoute = currentRoute[routeArray[i]];
            }
        },
        beginListening:function(){
            if(!isListening){
                if(Object.keys(commands) < 1 || commandConfig.callToAttention === '') throw new Error('SpeechCommander has no commands available.');
                listener.start();
                isListening = true;
            }
        }
    };

    context.SpeechCommander = commandConfig;
}(window));