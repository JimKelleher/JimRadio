// My homemade Standard Streams object Part A, the class definition/constructor:
// This is my elaboration, modeled after the Unix concept of standard I/O "streams", those
// being "standard input" (stdin), "standard output" (stdout) and "standard error" (stderr).
// It also serves to "regulate" the re-writing of the GUI while balancing the various needs
// of the competing functions that wish to do so.
function standard_streams() {
    // Map the logical concepts to the physical GUI, which exist as HTML DIVs:
    this.DEBUG_FIELD = "debug";
    this.ERROR_FIELD = "error";
    this.MESSAGE_FIELD = "message";
    this.OUTPUT_FIELD = "output";
}
// My homemade Standard Streams object Part B, utility functions:
standard_streams.prototype.clear = function (stream) {
    switch (stream) {
        // Clear as broadly or narrowly as needed:  
        // NOTE:  Try/catch is used in case the calling function is being executed by Node.js in
        // which the GUI would not be available.
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                             
        case "all":
            try {
                document.getElementById(this.DEBUG_FIELD).innerHTML = "";
                document.getElementById(this.ERROR_FIELD).innerHTML = "";
                document.getElementById(this.MESSAGE_FIELD).innerHTML = "";
                document.getElementById(this.OUTPUT_FIELD).innerHTML = "";
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                
        case "debug":
            try {
                document.getElementById(this.DEBUG_FIELD).innerHTML = "";
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                 
        case "error":
            try {
                document.getElementById(this.ERROR_FIELD).innerHTML = "";
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                 
        case "message":
            try {
                document.getElementById(this.MESSAGE_FIELD).innerHTML = "";
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                
        case "output":
            try {
                document.getElementById(this.OUTPUT_FIELD).innerHTML = "";
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                
        default:
    }
};
standard_streams.prototype.write = function (stream, text_to_write) {
    // Make this a "line printer" by automatically appending a line break:
    var text_to_write_modified = text_to_write + "<br>";
    switch (stream) {
        // To "write" is to append:   
        // NOTE:  Try/catch is used in case the calling function is being executed by Node.js in
        // which the GUI would not be available.
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                              
        case "debug":
            try {
                document.getElementById(this.DEBUG_FIELD).innerHTML += text_to_write_modified;
            }
            catch (e) {
                // This crashes on www.tutorialspoint.com/nodejs
                //console.debug(text_to_write_modified);
                console.log(text_to_write_modified);
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                
        case "error":
            try {
                document.getElementById(this.ERROR_FIELD).innerHTML += text_to_write_modified;
            }
            catch (e) {
                console.error(text_to_write_modified);
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                
        case "message":
            try {
                document.getElementById(this.MESSAGE_FIELD).innerHTML += text_to_write_modified;
            }
            catch (e) {
                console.info(text_to_write_modified);
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                               
        case "output":
            try {
                document.getElementById(this.OUTPUT_FIELD).innerHTML += text_to_write_modified;
            }
            catch (e) {
            }
            break;
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                               
        default:
    }
};
//# sourceMappingURL=StandardStreams.js.map