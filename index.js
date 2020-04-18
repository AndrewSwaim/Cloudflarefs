//Name: Andrew Swaim
//Email: Andrewcs2017@gmail.com
//Subdomain: https://internshipfs.andrewinternfs.workers.dev/

// I know global variables are bad form, 
// but i wanted to get the assignment done as soon as possible
// So if i were to write this for production, i would not use the global variable.
let cookieSet = false;
let varNum = 0

// Handler for all of my html rewrites
class ElementHandler {
  element(element) {
    // Takes different actions based on the tag that it is recieving
    
    if (element.tagName == "h1") {
      
      //Simply rewrites the variant that has been rerouted to.
      if (varNum == 0) {
        element.setInnerContent("This is variant 1");
      }
      else{
        element.setInnerContent("This is variant 2");
      }
      
      
    }
    else if (element.tagName == "a") 
    {

      // Rewrites the href attribute inside the a tag to my github page
      element.setAttribute("href", "https://github.com/AndrewSwaim");

      // Sets content of a tag to cheeky message. Please hire me :)
      element.setInnerContent("Future intern Github page");
    } 
    else if (element.tagName == "title") 
    {
      // Looks for the title attribute in the head tag and rewrites it
      element.setInnerContent("Rerouted Variant");
      //element.setAttribute("title", "Rerouted Variant");
    } 
    else if (element.tagName == "p") 
    {
      // Checks if the cookie is set or not
      // Displays approriate message
      if(cookieSet){
        
        element.setInnerContent("Arrived at variant because of previous cookie");
      }
      else{
        element.setInnerContent("Arrived at variant with no cookies");
      }
    } 
    
  }

  comments(comment) {
    // Not needed for this situation
  }

  text(text) {
    // Not needed for this situation
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})



/**
 * Fetches json from https://cfw-takehome.developers.workers.dev/api/variants
 * Parses it, then evenly and randomly chooses which variant to go to.
 * Also rewrites the inner html of said variant.
 * @param {Request} request
 */
async function handleRequest(request) {

  //Fetches JSON from website
  let variantJson = await fetch('https://cfw-takehome.developers.workers.dev/api/variants').then((resp)=>{return resp.json()});
  //Pulls the variants array from the JSON
  let varArray = variantJson.variants;

  //Checks if relevant cookie is present
  let varCVal = -1;
  let cookies = null;
  cookies = request.headers.get('Cookie');
  if (cookies) {
    let cArr = cookies.split(';');

    cArr.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === "varNum") {
        //console.log("Cookie found");
        let cookieVal = cookie.split('=')[1]
        varCVal = cookieVal
      }
    })
  }

  // If no preexisting cookie, randomly chooses one variant
  if (varCVal == -1) {
    varNum = Math.floor((Math.random() * 2));
  }
  // Else sets variant to preexisting cookie
  else{
    varNum = varCVal;
  }
  
  // Sets variant url off form chosen variant in variants array
  let variantUrl = varArray[varNum];


  let varFetch = await fetch(variantUrl);
  varFetch = new Response(varFetch.body, varFetch);

  // Sets cookie if none exists, and notifies for html rewriting purposes
  if (varCVal == -1) {
    varCookie = "varNum="+varNum+"; Expires=Wed, 22 Apr 2020 09:30:00 GMT; Path='/';`";
    varFetch.headers.set('Set-Cookie', varCookie)
  }
  else{
    cookieSet = true;
  }

  // Creates new HTMLRewriter to rewrite the variant fetched
  // Acts on h1#title, a#url, the title located in head, and p#description
  return new HTMLRewriter().on('h1#title', new ElementHandler())
  .on('a#url', new ElementHandler())
  .on('title', new ElementHandler())
  .on('p#description', new ElementHandler()).transform(varFetch);
  
  
}


