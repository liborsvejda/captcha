# Jak funguje captcha

Toto je ukázka, jak funguje jednoduchý test, zda stránku ovládá uživatel či robot  
(https://cs.wikipedia.org/wiki/CAPTCHA). 

Zde je použita varianta s obrázky zobrazujícími zdeformovaný text (res/captcha). 
Funkčnost je obsažena v **api-captcha.js**. Každé volání /captcha/next vybere náhodně jeden z obrázků 
a přiřadí mu vygenerované unikátní id, které je pak použito pro zobrazení obrázku (/captcha/img) 
i pro ověření uživatelem zadaného text (/captcha/verify).  

