
// Simple logger
html2canvas.prototype.log = function(a){
    
    if (this.opts.logging){
        
        var logger = window.console.log || function(log){
            alert(log);
        };
        /*
        if (typeof(window.console) != "undefined" && console.log){
            console.log(a);
        }else{
            alert(a);
        }*/
    }
}                    


/**
 * Function to provide bounds for element
 * @return {Bounds} object with position and dimension information
 */
html2canvas.prototype.getBounds = function(el){
        
    window.scroll(0,0);
        
    if (el.getBoundingClientRect){	
        var bounds = el.getBoundingClientRect();	
        bounds.top = bounds.top;
        bounds.left = bounds.left;
        return bounds;
    }else{
            
        // TODO remove jQuery dependancy
        var p = $(el).offset();       
          
        return {               
            left: p.left + parseInt(this.getCSS(el,"border-left-width"),10),
            top: p.top + parseInt(this.getCSS(el,"border-top-width"),10),
            width:$(el).innerWidth(),
            height:$(el).innerHeight()                
        }

    }           
}
    
     
     
/*
 * Function for looping through array
 */
html2canvas.prototype.each = function(arrayLoop,callbackFunc){
    callbackFunc = callbackFunc || function(){};
    for (var i=0;i<arrayLoop.length;i++){       
        callbackFunc(i,arrayLoop[i]);
    }
}


    
/*
 * Function for fetching the element attribute
 */  
html2canvas.prototype.getAttr = function(el,attribute){
    return el.getAttribute(attribute);
//return $(el).attr(attribute);
}

/*
 * Function to extend object
 */
html2canvas.prototype.extendObj = function(options,defaults){
    for (var key in options){              
        defaults[key] = options[key];
    }
    return defaults;           
}
    

    
/*
 * Get element childNodes
 */
    
html2canvas.prototype.getContents = function(el){
    return (el.nodeName ==  "iframe" ) ?
    el.contentDocument || el.contentWindow.document :
    el.childNodes;
}

    
/*
 * Function for fetching the css attribute
 * TODO remove jQuery dependancy
 */
html2canvas.prototype.getCSS = function(el,attribute){
    return $(el).css(attribute);
}