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
        var currentIndex = event.resultIndex;
        var transcript = event.results[currentIndex][0].transcript.trim();

        console.log('resultIndex: ' + currentIndex);
        console.log('transcript: ' + transcript);

        var routeArray = transcript.toLowerCase().split(' ')

        if(routeArray[0] == commandConfig.callToAttention.toLowerCase()){
            console.log('SpeechCommander should do something.');
            var currentRoute = commands[routeArray[1]];
            var i = 2;
            while(typeof currentRoute !== "function"){ // when the command is finally a function we execute that with the rest of the arguments as params
                currentRoute = currentRoute[routeArray[i]];
            }
            if(typeof currentRoute !== "function") {
                throw new Error("Not a valid route. Nothing to execute.");
            }
            //Need to decide here about passing in parameters. Would they be passed in split up, or concatenated?
            currentRoute();
        }
    };

    listener.onerror = function(SRerror){
        console.log('SpeechCommander Error: ' + SRerror.error);
    };

    listener.onend = function(){
        console.log('The browser has ended speech recognition.');
        isListening = false;
        if(commandConfig.renewListening){
            commandConfig.beginListening();
        }
    }

    var commands = {};

    var isListening = false;

    var commandConfig = {
        callToAttention:'',
        renewListening:false,
        addCommand:function(routeArray, callback){
            if((!routeArray instanceof Array) || routeArray.length < 1) return;
            if(typeof callback !=="function") return;

            if (routeArray.length == 1){
                commands[routeArray[0]] = callback;
                return;
            }

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
        },
        stopListening:function(){
            if(isListening){
                listener.stop();
                isListening = false;
            }
        }
    };

    context.SpeechCommander = commandConfig;
}(window));