function makeMadLib(){
    var noun = document.getElementById("noun").value;
    var verb = document.getElementById("verb").value;
	var pluralnoun = document.getElementById("pluralnoun").value;
	var pasttenseverb = document.getElementById("pasttenseverb").value;
    var adjective = document.getElementById("adjective").value;

    var noun2= document.getElementById("noun2").value;
    var noun3 = document.getElementById("noun3").value;
    var noun4 = document.getElementById("noun4").value;
    var noun5 = document.getElementById("noun5").value;
    var noun6 = document.getElementById("noun6").value;

    var pasttenseverb2 = document.getElementById("pasttenseverb2").value;
   

    var story = document.getElementById("story");



    story.innerHTML = " The "+ noun + " likes to " + verb + " with his " + pluralnoun + ". When he was finished, he " + pasttenseverb + " over to his " +  noun2 + " for a " +  noun3 + ". After his " + noun4 + " , he " + pasttenseverb2 + " on the " + noun5 + " and took a " +  adjective + " " + noun6 + "." ;
}