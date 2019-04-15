const hideFlowerJar = function(){
  const elementToHide = document.getElementById('flower');
  elementToHide.style.visibility='hidden';
  setTimeout(() => {
    elementToHide.style.visibility='visible';
  }, 1000);
}