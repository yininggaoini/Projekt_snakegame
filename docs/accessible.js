const oMimikHinweis = document.getElementById("mimikInfo");
const joyConHinweis = document.getElementById("joyConHinweis");
const kameraHinweis = document.getElementById("kameraHinweis");
const defaultHinweis = document.getElementById("defaultInfo");
const joyConButtonHinweis = document.getElementById("joyConButtonHinweis");
const joyConBewegungHinweis = document.getElementById("joyConBewegungHinweis");
const kameraKopfHinweis = document.getElementById("kameraKopfHinweis");

joyConHinweis.style.display="none";
kameraHinweis.style.display="none";
oMimikHinweis.style.display="none";
joyConButtonHinweis.style.display="block";
joyConBewegungHinweis.style.display="none";
kameraKopfHinweis.style.display="none";
defaultHinweis.style.display="block";
const actualEmoDircDiv = document.getElementById('actualEmotDirc');
const actualEmoDirIcons = document.getElementById('actualIcons');
const actualDiv = document.getElementById('actualEmotion');

document.getElementById("inputs").addEventListener('change',function(){
    const oHinweise = document.getElementById("Hinweise");
    var oinputsIndex = document.getElementById("inputs").selectedIndex;
    var oinputsValue = document.getElementById("inputs").options[oinputsIndex].value;

    switch(oinputsValue){
      case 'joyconButtonStick':
        defaultHinweis.style.display="none";
        joyConHinweis.style.display="block";
        kameraHinweis.style.display="none";
        oMimikHinweis.style.display="none";
        actualDiv.style.display = "none";
        actualEmoDircDiv.style.display = "none";
        actualEmoDirIcons.style.display = "none";

        joyConButtonHinweis.style.display="block";
        joyConBewegungHinweis.style.display="none";
        kameraKopfHinweis.style.display="none";
        break;
      case 'joyconBewegung':
        defaultHinweis.style.display="none";
        joyConHinweis.style.display="block";
        kameraHinweis.style.display="none";
        oMimikHinweis.style.display="none";     
        actualDiv.style.display = "none";
        actualEmoDircDiv.style.display = "none";
        actualEmoDirIcons.style.display = "none";
                
        joyConButtonHinweis.style.display="none";
        joyConBewegungHinweis.style.display="block";
        kameraKopfHinweis.style.display="none";
        break;
      case 'mimikKamera':
        defaultHinweis.style.display="none";
        joyConHinweis.style.display="none";
        kameraHinweis.style.display="block";
        oMimikHinweis.style.display="block";
        actualDiv.style.display = "block";
        actualEmoDircDiv.style.display = "block";
        actualEmoDirIcons.style.display = "block";
                
        joyConButtonHinweis.style.display="none";
        joyConBewegungHinweis.style.display="none";
        kameraKopfHinweis.style.display="none";
        break;
      case 'kopfBewegung':
        defaultHinweis.style.display="none";
        joyConHinweis.style.display="none";
        kameraHinweis.style.display="block";
        oMimikHinweis.style.display="none";
        actualDiv.style.display = "block";
        actualEmoDircDiv.style.display = "block";
        actualEmoDirIcons.style.display = "block";
        
        joyConButtonHinweis.style.display="none";
        joyConBewegungHinweis.style.display="none";
        kameraKopfHinweis.style.display="block";
        break;
    }   
})

document.addEventListener('touchstart',function(){
  document.getElementById("gameMusic").play();
  document.getElementById("gameMusic").volume=0.2;
})

const oMusicBtn = document.getElementById("gameBtn");
const ovolumeBtn = document.getElementById("volume-high");
const ovolumeSlashBtn = document.getElementById("volume-slash"); 
const oMusic = document.getElementById("gameMusic");
var tag = true;
ovolumeSlashBtn.style.display = "none";

oMusicBtn.onclick = function(){
  if(tag){
    oMusic.pause();
    ovolumeBtn.style.display = "none";
    ovolumeSlashBtn.style.display = "block";
    tag = false;
  }else{
    oMusic.play();
    tag = true;
    ovolumeBtn.style.display = "block";
    ovolumeSlashBtn.style.display = "none";
  } 
}
