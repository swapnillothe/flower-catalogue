const hideFlowerJar = function(){
  let elementToHide = document.getElementById('flower');
  elementToHide.style.visibility='hidden';
  setTimeout(() => {
    elementToHide.style.visibility='visible';
  }, 1000);
}
