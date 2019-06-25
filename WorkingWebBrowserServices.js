//-----------------------------------------------------------------------------------------------------------
// GUI objects:
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Replace a DOM element serving as a placeholder with a meaningful element:
function replace_element(old_element_id, new_element_definition, new_element_id, new_element_type) {
    var old_element = document.getElementById(old_element_id);
    var new_element = document.createElement(new_element_type);
    old_element.parentNode.replaceChild(new_element, old_element);
    new_element.innerHTML = new_element_definition;
    new_element.id = new_element_id;
}
function slideshow(images) {
    // My homemade Slideshow object Part A, the class definition/constructor:
    // Save the Image array argument value:
    this.images = images;
    // Create/init:
    this.image_index = 0;
    this.SCENE_DURATION_SECONDS = 5; // constant
}
slideshow.prototype.show_image = function () {
    // My homemade Slideshow object Part B, a utility method:
    // For this time:
    document.getElementById("Image").src = this.images[this.image_index];
    // Increment for the next time through:
    this.image_index++;
    if (this.image_index >= this.images.length) {
        this.image_index = 0; // "roll over"/reset
    }
};
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function tab(tab_name, tab_count, entry_count, titles, contents) {
    // My homemade Tab object Part A, the class definition/constructor:
    // Example usage and hierachy:
    // TabContainer
    //     BiographyTabSet
    //         BiographyTab1
    //         BiographyTab2
    //         BiographyTab3
    //             biography_tab.show_tab_set(this);
    //     BiographyTabContent
    // BiographyTab1Content
    // BiographyTab2Content
    // BiographyTab3Content
    // Save the argument values:
    // Descriptive info:
    this.tab_name = tab_name;
    // Counters:
    this.tab_count = tab_count; // is a maximum
    this.entry_count = entry_count; // may be zero
    // Content data arrays:
    this.titles = titles;
    this.contents = contents;
    // DOM/GUI object references:
    this.tab_content =
        document.getElementById(this.tab_name + "TabContent");
    this.tab_set =
        document.getElementById(this.tab_name + "TabSet");
    this.tab_list_items = new Array();
    for (var i = 0; i < this.tab_count; i++) {
        this.tab_list_items[i] =
            document.getElementById(this.tab_name +
                "Tab" + (i + 1).toString());
    }
    // If detail data was provided, it's OK to load and show the tabs:
    if (this.entry_count > 0) {
        // Set the default (ie, the first) tab title and contents on the page:
        this.tab_content.innerHTML = this.contents[0];
        for (var i = 0; i < Math.min(this.tab_count, this.entry_count); i++) {
            // Set the individual tabs' titles and contents on the page:
            document.getElementById(this.tab_name + "Tab" +
                (i + 1).toString()).innerHTML = this.titles[i];
            document.getElementById(this.tab_name + "Tab" +
                (i + 1).toString() + "Content").innerHTML = this.contents[i];
        }
    }
    // Remove unneeded tab stuff:  
    this.trim_extra_tabs();
}
tab.prototype.show_tab_set = function (selected_tab) {
    // My homemade Tab object Part B, a utility method: 
    // NOTE: We will construct HTML, for example, as follows:
    // onclick="show_tab_set('Biography', biography_tab, this);"></li>
    // Init by removing the classes from the List Items:
    for (var i = 0; i < this.tab_count; i++) {
        this.tab_list_items[i].className = "";
    }
    // The clicked tab gets this class:
    selected_tab.className = "Selected";
    // Set the tab content on the page based on the user selection:
    switch (selected_tab.id) {
        case this.tab_name + "Tab1":
            this.tab_content.innerHTML = document.getElementById(this.tab_name + "Tab1Content").innerHTML;
            break;
        case this.tab_name + "Tab2":
            this.tab_content.innerHTML = document.getElementById(this.tab_name + "Tab2Content").innerHTML;
            break;
        case this.tab_name + "Tab3":
            this.tab_content.innerHTML = document.getElementById(this.tab_name + "Tab3Content").innerHTML;
            break;
        default:
            this.tab_content.innerHTML = document.getElementById(this.tab_name + "Tab1Content").innerHTML;
            break;
    }
};
tab.prototype.trim_extra_tabs = function () {
    // My homemade Tab object Part C, a utility method: 
    // We want the number of tabs (static) to match the number of
    // entries (dynamic).  Part 1 of 2: If there are no entries,
    // we don't need this:
    if (this.entry_count == 0) {
        this.tab_content.parentNode.removeChild(this.tab_content);
    }
    // Part 2 of 2: Remove tabs that are superfluous, if any:
    for (var i = this.tab_count - 1; i >= 0; i--) {
        if (i > this.entry_count - 1) {
            this.tab_set.removeChild(this.tab_list_items[i]);
        }
    }
};
//-----------------------------------------------------------------------------------------------------------
// Stand-alone Functions:
// Amazon ASIN number functions:
function get_amazon_standard_ids(look_in) {
    // NOTE: Creation of this ASIN process was a waste of time because it ended up fixing no actual problems.
    // Despite this, I will keep it as an example of how to do this type of processing:
    // An Amazon Standard Identification Number (ASIN) is similar to a Universal Product Code (UPC).
    // It is a unique blocks of 10 letters and/or numbers that identify items.  You can find the ASIN
    // on the item's product information page at Amazon.com.  Lookup services are available here:
    // http://www.asinlookup.com/
    // Original from website but didn't work:
    // http://www.sebastianviereck.de/en/PHP-check-whether-a-string-is-a-valid-asin/
    // "/B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}(X|0-9])/"
    var amazon_standard_ids = new Array;
    var match_result = look_in.match(new RegExp("B[0-9]{2}[0-9A-Z]{7}|[0-9]{9}(X|0-9])", "g"));
    if (match_result) {
        amazon_standard_ids = match_result;
    }
    return amazon_standard_ids;
}
function remove_amazon_standard_ids(look_in) {
    var look_in_edited = look_in;
    // Get all of the ASIN (Amazon Standard Identification Number) numbers:
    var ASIN_array = get_amazon_standard_ids(look_in_edited);
    // Remove them all:
    for (var i = 0; i < ASIN_array.length; i++) {
        look_in_edited = remove_all_procedural(look_in_edited, ASIN_array[i]);
    }
    return look_in_edited;
}
//-----------------------------------------------------------------------------------------------------------
// Array functions:
function accept_clean_parse_to_array(input_string, sort) {
    // Accept a token-separated list of input elements, clean it up and parse it to an array:
    // Since we will be modifying the argument, let's make a copy and work with that:
    var input_string_edited = input_string;
    var PARSE_TOKEN1 = "<br>"; // HTML pasted lists
    var PARSE_TOKEN2 = "\\n"; // ASCII pasted lists
    // Consolidate the parse tokens so we can use them on an equal basis:
    input_string_edited = replace_all(input_string_edited, PARSE_TOKEN2, PARSE_TOKEN1);
    var output_array = new Array;
    if (input_string_edited.indexOf(PARSE_TOKEN1) > -1) {
        // Parse to an array:
        output_array = input_string_edited.split(PARSE_TOKEN1);
        // If necessary, clean out any empty elements in the array.
        // NOTE: The argument to this function is called a string but it can contain line breaks and, when it does,
        // javascript very much wants to treat it as an array (when debugging, "console.log()" will do so). 
        // NOTE 2: Originally this clean out process was not necessary but some change in JavaScript forced me to
        // have to do so.
        var output_array_work = new Array();
        for (var i = 0; i < output_array.length; i++) {
            if (output_array[i]) {
                output_array_work.push(output_array[i]);
            }
        }
        output_array = output_array_work;
    }
    else {
        // Load the array manually:
        output_array.push(input_string_edited);
    }
    if (sort == true) {
        output_array = output_array.sort();
    }
    // Return the input string converted to an output array:
    return output_array;
}
function deduplicate_sorted_array(input_array) {
    var output_array = new Array;
    for (var i = 0; i < input_array.length; i++) {
        if (i == 0) {
            output_array[0] = input_array[0];
        }
        else {
            if (input_array[i] != input_array[i - 1]) {
                output_array.push(input_array[i]);
            }
        }
    }
    return output_array;
}
function get_array_pages(total_results, results_per_page) {
    // Calculate how many pages it will take to show the contents of this array:
    // NOTE: I first coded the equivalent of this back in 1984 at Wang:
    var total_pages = total_results / results_per_page;
    var total_pages_remainder = total_results % results_per_page; // modulus division
    if (total_pages_remainder > 0) {
        total_pages++;
    }
    return total_pages;
}
function get_column_values_as_array(table_id, column_number, has_header) {
    var column_values = new Array;
    var html_table_element = document.getElementById(table_id);
    var rows = html_table_element.rows;
    var start_row;
    if (has_header == true) {
        start_row = 1;
    }
    else {
        start_row = 0;
    }
    for (var i = start_row; i < rows.length; i++) {
        column_values.push(html_table_element.rows[i].cells[column_number].innerHTML);
    }
    return column_values;
}
//-----------------------------------------------------------------------------------------------------------
// CORS and JSON functions:
function get_CORS_request(url) {
    var XML_HTTP_request = new XMLHttpRequest();
    if ("withCredentials" in XML_HTTP_request) {
        // Do a synchronous "open()".  This way, when we use the object, it will
        // pause processing and wait until it finishes and we have results back:
        XML_HTTP_request.open("GET", url, false); // asynch = false = synchronous
    }
    return XML_HTTP_request;
}
function get_xml_http_request(uri) {
    var xml_http_request = new XMLHttpRequest();
    var response = ""; // init
    try {
        xml_http_request.open("GET", uri, false); // async = false = synchronous
        xml_http_request.send();
        response = xml_http_request.responseText;
    }
    catch (e) {
        standard_streams_services.write("error", e.message);
    }
    return response;
}
function get_xml_http_request_via_proxy_server(uri) {
    var PROXY_SERVER_PREFIX = "http://www.workingweb.info/Utility/WorkingWebWebServices/api/proxy/?request=";
    // Cross-Origin Resource Sharing (CORS)
    // CORS Same-Origin Policy - Restricts how a document or script loaded from one origin can interact with a resource
    // from another origin. It is a critical security mechanism for isolating potentially malicious documents.  Definition
    // of an origin: two pages have the same origin if the protocol, port (if one is specified), and host are the same
    // for both pages.  In English, this means they originate from the same location (eg: Working Web).
    // NOTE: Though CORS processing is supposed to be legal if one has done the proper message and configuration preparation,
    // all browsers but one (Internet Explorer) treat it as prohibited, at least when employing a PHP preprocessor
    // (eg: en.wikipedia.org/w/api.php) from Wikipedia.  Since the (home-grown) proxy server is host-resident, it satisfies
    // the CORS same-origin policy and makes CORS truly available to me.
    // Create, open and send a synchronous XML HTTP GET request, by way of the host proxy server, and return the response:
    var response = get_xml_http_request(PROXY_SERVER_PREFIX + encodeURIComponent(uri));
    return response;
}
function get_XML_HTTP_request_response_text(url_to_get, description) {
    var request_response_text = ""; // init
    // Execute the query, part 1 of 2, by way of a synchronous "open()" which completes
    // "in line" before continuing:
    var XML_HTTP_request = get_CORS_request(url_to_get);
    if (!XML_HTTP_request) {
        return request_response_text;
    }
    // Response handlers:
    XML_HTTP_request.onload = function () {
        request_response_text = XML_HTTP_request.responseText;
    };
    XML_HTTP_request.onerror = function () {
        standard_streams_services.write("error", "There was an error making the XML HTTP request.");
    };
    // Execute the query, part 2 of 2:
    XML_HTTP_request.send();
    var request_response_JSON_object;
    // Examine the result looking for errors:
    if (request_response_text.match(new RegExp('"error":'))) {
        // Convert the response, turning our "flat" JSON string into a "live" JavaScript object:
        request_response_JSON_object = JSON.parse(request_response_text);
    }
    // Since we did a synchronous "open()" we can be assured that this variable
    // has been filled:
    return request_response_text;
}
function remove_response_packaging(response) {
    // Decode the characters that get messed up in transit and remove the "packaging" (either String or
    // XML) that encloses the data:
    var response_edited = response;
    //---------------------------------------------------------------------------------------------------
    // CORS-compliant XML HTTP GET request/response
    // CROSS-REFERENCE: PROXY TRANSIT ENCODING/DECODING 3 OF 3:
    // THIS IS:  C:\a_dev\ASP\WorkingWebWebServices\WorkingWebWebServices(WorkingWebBrowserServices.js)
    // SEE ALSO: C:\a_dev\ASP\WorkingWebWebServices\WorkingWebWebServices(ProxyController.cs)
    // SEE ALSO: C:\a_dev\ASP\WikipediaDiscography\WikipediaDiscography(WikipediaDiscography.js)
    // Decode the only characters that get messed up in transit:
    response_edited = response_edited.split("DOUBLEQUOTE").join('"');
    response_edited = response_edited.split("BACKSLASH").join("\\");
    //---------------------------------------------------------------------------------------------------
    // NOTE: In operation, with no content-type specified, all browsers returned a content-type
    // of "application/json" except FireFox, which returned "application/xml".  I had settled on
    // a string result because the whole ASP/.NET JSON process, as currently built, is strongly
    // linked to JSON object creation and subseqent serialization, etc (complete, unneeded over-kill).
    // To make matter worse, though I had settled on Web API controllers for simplicity's sake, the
    // JSON stuff was closely linked to MVC controllers!  It was a typical ASP/.NET can-of-worms...
    // To make matters even worse than that, the "simplest" way to define a JSON content-type is
    // heavily configuration based (or similar non-obvious methods) which I couldn't even code
    // because of ASP/.NET "DLL hell" so I gave the whole effort up instead opting for a tiny
    // amount of hand coding.
    // Content-Type: "application/json" (an already-formed string, not a serialized object or any class
    // of data returned by ASP/Web API).  Strip off the double quotes that enclose the string data:
    if (response_edited.substr(0, 1) == '"') {
        response_edited = response_edited.substr(1, response_edited.length - 2);
    }
    // Content-Type: "application/xml".  Remove the XML tags that enclose the string data:
    if (response_edited.indexOf("<string xmlns=") > -1) {
        // <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
        //      DETAIL INFO HERE
        // </string>
        var debug_trace = false;
        response_edited = excise_bounds_inclusive(response_edited, "<string xmlns=", '/">', debug_trace);
        response_edited = remove_all_procedural(response_edited, "</string>");
    }
    return response_edited;
}
function syntax_check_JSON(JSON_string) {
    // Constants:
    //var FIREFOX_ERROR            = "JSON.parse: bad control character in string literal";
    var CHROME_OPERA_ERROR = "Unexpected token";
    var INTERNET_EXPLORER_ERROR1 = "Invalid character";
    var INTERNET_EXPLORER_ERROR2 = "JSON.parse"; // Visual Studio "internal web browser"
    var SAFARI_ERROR = "JSON Parse error: Unterminated string";
    var CHARACTER_BUFFER_LENGTH = 100;
    var error_message = ""; // init
    try {
        JSON.parse(JSON_string);
    }
    catch (e) {
        error_message = "syntax_check_JSON() error: " + e.message;
        // Firefox example error:
        //      JSON.parse: bad control character in string literal at line 1 column 145803 of the JSON data
        if (error_message.indexOf("at line 1 column") == -1) {
            error_message = "JSON.parse error.  Use FireFox to find the details. " + e.message;
        }
        else {
            // Remove leading and trailing, leaving only the column number:
            var error_message_edited = error_message.substr(error_message.indexOf("column ") + 7);
            error_message_edited = error_message_edited.split(" of the JSON data").join("");
            var error_column = Number(error_message_edited);
            // Focus on the offending syntax:
            var JSON_string_focus_on_error = JSON_string.substring(error_column - CHARACTER_BUFFER_LENGTH, error_column + CHARACTER_BUFFER_LENGTH);
            // Append the information to the error message:
            error_message += " " + JSON_string_focus_on_error;
        }
        standard_streams_services.write("error", error_message);
    }
    return error_message;
}
//-----------------------------------------------------------------------------------------------------------
// Date/time functions:
function format_seconds_as_time(seconds_argument) {
    // Break up the argument seconds into hours, minutes, seconds:
    var hours = Math.floor(seconds_argument / 3600);
    var minutes = Math.floor((seconds_argument - (hours * 3600)) / 60);
    var seconds = Math.floor(seconds_argument - (hours * 3600) - (minutes * 60));
    // Convert the case:
    var hours_string = hours.toString();
    var minutes_string = minutes.toString();
    var seconds_string = seconds.toString();
    // Format the duration components as necessary:
    if (hours < 10) {
        hours_string = "0" + hours.toString();
    }
    if (minutes < 10) {
        minutes_string = "0" + minutes.toString();
    }
    if (seconds < 10) {
        seconds_string = "0" + seconds.toString();
    }
    // Combine and return the result:
    return hours_string + ':' + minutes_string + ':' + seconds_string;
}
function get_first_year_index(look_in) {
    var years = get_years(look_in);
    return look_in.indexOf(years[0]);
}
function get_next_year_index(look_in, start_at) {
    // Consolidate the valid centuries so we can search for them on an equal basis:
    var look_in_edited = replace_all(look_in, "19", "20");
    var candidate_year_index = look_in_edited.indexOf("20", start_at);
    var next_year = 0;
    var next_year_index = -1; // init
    if (candidate_year_index > -1) {
        var candidate_year = look_in.substr(candidate_year_index, 4);
        if (!isNaN(candidate_year)) {
            next_year_index = candidate_year_index;
        }
        else {
            next_year_index = look_in_edited.indexOf("20", candidate_year_index + 1);
        }
    }
    return next_year_index;
}
function get_seconds_from_ISO_duration(duration_string) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var duration_string_edited = duration_string;
    //--------------------------------------------------------------------
    // ISO 8601 Duration Format
    // Durations are a component of time intervals.
    // Eg: The Very Best Of Sting & The Police (h3P0JYpp5rk)
    // PT1H14M45S
    // P = duration (historically called "period")
    // T = time
    // H = hour
    // M = minute
    // S = second
    //--------------------------------------------------------------------
    // We don't need these:
    duration_string_edited = duration_string_edited.replace("PT", "");
    // Supply any missing time components, perhaps in the wrong order:
    if (duration_string_edited.indexOf("H") == -1) {
        duration_string_edited = "0H" + duration_string_edited;
    } // pre-pend
    if (duration_string_edited.indexOf("S") == -1) {
        duration_string_edited += "0S";
    } // append
    if (duration_string_edited.indexOf("M") == -1) {
        duration_string_edited += "0M";
    } // append to wrong position
    // Regularize these to serve as parse tokens:
    duration_string_edited = duration_string_edited.replace("H", "H ");
    duration_string_edited = duration_string_edited.replace("M", "M ");
    duration_string_edited = duration_string_edited.replace("S", "S ");
    // Parse to an array:
    var time_component = duration_string_edited.split(" ");
    // Shift the alphabetic character (H, M, S) from the end to the beginning so
    // it can drive a sort:
    for (var i = 0; i < time_component.length; i++) {
        if (time_component[i].indexOf("H") != -1) {
            time_component[i] = time_component[i].replace("H", "");
            time_component[i] = "H" + time_component[i];
        }
        if (time_component[i].indexOf("M") != -1) {
            time_component[i] = time_component[i].replace("M", "");
            time_component[i] = "M" + time_component[i];
        }
        if (time_component[i].indexOf("S") != -1) {
            time_component[i] = time_component[i].replace("S", "");
            time_component[i] = "S" + time_component[i];
        }
    }
    // Sort the array in alphabetical order, which is helpful because the proper
    // format (H:M:S) is in alphabetical order!
    time_component = time_component.sort();
    // Having completed the sort, the array is now in proper order (H, followed
    // by M, followed by S):
    for (var j = 0; j < time_component.length; j++) {
        // Since we have no more need for it, strip off the first character (H, M or S),
        // leaving only digits:
        time_component[j] = time_component[j].substring(1);
    }
    // Access the components individually:
    var hour = parseInt(time_component[1]);
    var minute = parseInt(time_component[2]);
    var second = parseInt(time_component[3]);
    // Compute the total seconds:
    var total_seconds = hour * (3600); // 60 * 60
    total_seconds += minute * (60);
    total_seconds += second;
    // Return the amount of time that the ISO duration format represents, expressed as the
    // equivalent total number of seconds:
    return total_seconds;
}
function get_year_at(look_in, start_at) {
    // Return the year as a string:
    return look_in.substr(start_at, 4);
}
function get_years(look_in) {
    //var next_year_index = -1; // init
    var next_year_index;
    var years = new Array;
    do {
        next_year_index = get_next_year_index(look_in, next_year_index + 1);
        if (next_year_index > -1) {
            years.push(get_year_at(look_in, next_year_index));
        }
    } while (next_year_index > -1);
    return years;
}
function is_valid_century(look_in) {
    if (look_in == "19" ||
        look_in == "20" ||
        look_in == 19 ||
        look_in == 20) {
        return true;
    }
    else {
        return false;
    }
}
//-----------------------------------------------------------------------------------------------------------
// Debug functions:
function examine_char(look_in) {
    for (var i = 0; i < look_in.length; i++) {
        standard_streams_services.write("debug", look_in.substr(i, 1) + " " + look_in.charCodeAt(i).toString() + "<br>");
    }
}
function get_function_description(function_name) {
    // Get and show the function definition and the argument values generically:
    //print_string("----------------------BEGIN ARGUMENTS----------------------<br>");
    standard_streams_services.write("debug", "<br>----------------------BEGIN ARGUMENTS----------------------");
    var function_description = get_function_description_level_2(function_name);
    standard_streams_services.write("debug", function_description);
    // Get info using "caller" (up one levels):
    var function_arguments = arguments.callee.caller.arguments;
    for (var i = 0; i < function_arguments.length; i++) {
        if (function_arguments[i].constructor == Array) {
            print_array(function_arguments[i]);
        }
        else {
            standard_streams_services.write("debug", function_arguments[i]);
        }
    }
    standard_streams_services.write("debug", "----------------------END ARGUMENTS----------------------<br>");
}
function get_function_description_level_2(function_name) {
    // Debugging/Strict Mode 3 of 3 - Failure Point:
    // NOTE: Usage of the "use strict" directive will cause the following to fail.
    // Since this is a fundamental aspect of Discography Debugging, strict mode
    // must be turned off for it to work.
    // Get info using "caller.caller" (up two levels):
    var function_arguments = arguments.callee.caller.caller.toString();
    // Cleanup:
    function_arguments = function_arguments.substr(0, function_arguments.indexOf("{"));
    function_arguments = function_arguments.split("function ").join(""); // string replacement via split/join
    function_arguments = function_arguments.split("function").join(""); // string replacement via split/join
    // Cobble together and return a generic description of the function:
    return function_name + function_arguments;
}
function narrow_focus_on_long_string(long_string, focal_point_index, buffer_size) {
    // Sometimes you need to use "alert()" because the alternative is to write to the browser but you can't/won't
    // do so because you are working on other browser outputs which you don't want to mess up or because you want
    // to see HTML comments which, by their nature, won't successfully be written to the browser (a lesson hard
    // learned).  Since I often work with long strings (JSON feeds, etc) , and since "alert()" truncates them, I
    // need a function that "zooms in" on a long string and focuses on some narrower substring of it, which can
    // be better handled (mostly for my own debugging).
    // NOTE: "buffer_size" refers to the buffer size on either side of "focal_point_index", thus the true buffer
    // size = "buffer_size" X 2.
    //return get_substring(long_string, focal_point_index - buffer_size, focal_point_index + buffer_size);
    return long_string.substring(focal_point_index - buffer_size, focal_point_index + buffer_size + 1);
}
//function print(variable_to_print) {
//    // A polymorphic print function:
//    switch (Object.prototype.toString.call(variable_to_print)) {
//        case "[object Number]":
//            print_string(variable_to_print.toString());
//            break;
//        case "[object String]":
//            print_string(variable_to_print);
//            break;
//        case "[object Array]":
//            print_array(variable_to_print);
//            break;
//    }
//}
function print_array(array_to_print) {
    print_string("------------------------ print_array begin ------------------------");
    print_string("array length = " + array_to_print.length.toString());
    for (var i = 0; i < array_to_print.length; i++) {
        print_string(array_to_print[i]);
    }
    print_string("------------------------ print_array end ------------------------");
}
function print_string(string_to_print) {
    standard_streams_services.write("debug", string_to_print);
}
function represent_bounded_string_succinctly(bounded_string, start_index, end_index) {
    var BUFFER_SIZE = 50;
    var CONTINUATION = ".........";
    // Focus on the beginning, focus on the end and represent the entire string in a succinct way:
    return narrow_focus_on_long_string(bounded_string, start_index, BUFFER_SIZE) +
        CONTINUATION +
        narrow_focus_on_long_string(bounded_string, end_index, BUFFER_SIZE);
}
function throw_error(error_message) {
    var e = new Error(error_message);
    throw e;
}
//-----------------------------------------------------------------------------------------------------------
// Miscellaneous functions:
//-------------------------------------------------------------------------------------
// Character encodings in HTML
// https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
// What's the right way to decode a string that has special HTML entities in it?
// https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it/7394787
//-------------------------------------------------------------------------------------
function decodeHtmlEntity(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
;
function get_browser_name() {
    // Thanks to http://www.javascripter.net/faq/browsern.htm for this. 
    // NOTE: I have retained much processing that I do not
    // currently need but may sometime in the future:
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    // In Opera, the true version is after "Opera" or after "Version":
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent:
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome":
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version":
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox":
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent:
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // Trim the fullVersion string at semicolon/space if present:
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
    //standard_streams_services.write(
    //    "message",
    //    'Browser name  =       ' + browserName + '<br>' +
    //    'Full version  =       ' + fullVersion + '<br>' +
    //    'Major version =       ' + majorVersion + '<br>' +
    //    'navigator.appName =   ' + navigator.appName + '<br>' +
    //    'navigator.userAgent = ' + navigator.userAgent + '<br>'
    //);
    return browserName;
}
function remove_HTML_comments(look_in, debug) {
    // CROSS-REFERENCE H - HTML comments - How to debug HTML comments.
    // NOTE: The argument "debug", above, is currently passsed from object function "remove_extraneous()"
    // residing in file "WikipediaDiscography.js".
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // NOTE: This function could be replaced by a call to "excise_bounds_inclusive()" which didn't
    // exist at the time that this was created.
    // NOTE: My standard debug technique is to output things to the browser using either my own HTML
    // DIVs, "innerHTML" or "document.write()".  All such techniques will fail in the special case of
    // HTML comments.  They simply were never intended to be seen by the user, so the browser suppresses
    // them.  The "createComment()" function is available but it writes comments internally to the
    // document.  To see the comment, which unfortunately will be truncated, use "alert()".    
    // Actual constants:
    var HTML_COMMENT_START = "<!--";
    var HTML_COMMENT_END = "-->";
    // Debug constants:
    var HTML_COMMENT_START_DUMMY = "HTML_COMMENT_START";
    var HTML_COMMENT_END_DUMMY = "HTML_COMMENT_END";
    // NOTE: The reference to "alert()", above, with its truncation limitation, is not really a practical solution,
    // especially when working with long strings.  Since code that can't be debugged is deficient, let's replace the
    // problematic stuff with stuff we can use, both for production runs (all tokens being equal) and debugging:
    look_in_edited = replace_all(look_in_edited, HTML_COMMENT_START, HTML_COMMENT_START_DUMMY);
    look_in_edited = replace_all(look_in_edited, HTML_COMMENT_END, HTML_COMMENT_END_DUMMY);
    // NOTE: The reference to "alert()"s truncation limitation has been mitigated by the creation and use of
    // purely utilitarian debug functions "narrow_focus_on_long_string()" and "represent_bounded_string_succinctly()".
    // If an HTML comment block is found...
    if (look_in_edited.indexOf(HTML_COMMENT_START_DUMMY) > -1) {
        //...excise it:
        // NOTE: I went to great lengths to somewhat "gold plate" this process, though it is used only once, for removing
        // HTML comments.  However, it might have been used to remove, eg, strings delineated by the Wikipedia reference
        // list templates "{{refbegin}}" and "{{refend}}".  This proved not to be necessary, though some day it might be:
        look_in_edited = excise_bounds_inclusive(look_in_edited, HTML_COMMENT_START_DUMMY, // though these say "dummy", they are used for production
        HTML_COMMENT_END_DUMMY, 
        // Built-in debugging:
        debug);
    }
    return look_in_edited;
}
//-----------------------------------------------------------------------------------------------------------
// String functions:
function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
}
function consolidate_extraneous_spaces(look_in) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    var double_space_index;
    do {
        double_space_index = look_in_edited.indexOf("  ");
        look_in_edited = replace_all(look_in_edited, "  ", " ");
    } while (double_space_index > -1);
    look_in_edited = look_in_edited.trim();
    // Return the modified copy of the argument:
    return look_in_edited;
}
function count_occurrences(look_in, look_for) {
    var regExp = new RegExp("\\b" + look_for + "\\b", "gi");
    return look_in.match(regExp) ? look_in.match(regExp).length : 0;
}
function excise(look_in, start_index, end_index) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // Excision by omission:
    look_in_edited = look_in_edited.substring(0, start_index) + look_in_edited.substring(end_index + 1);
    // Return the modified copy of the argument:
    return look_in_edited;
}
function excise_bounds_inclusive(look_in, start_token, end_token, debug) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // Now let's do the excision in a "pulled clothesline" style, ie, excise a found string and continue
    // searching from the beginning, not having to advance through the string but instead, "pulling" each
    // occurrance forward (assuming there are multiples found):
    // Built-in debugging:
    if (debug == true) {
        print_string("DEBUG EXCISION BEFORE: " + look_in_edited);
    }
    var cut_start_index, cut_end_index;
    // Lower case is better for comparison:
    do {
        cut_start_index = look_in_edited.toLowerCase().indexOf(start_token.toLowerCase());
        if (cut_start_index > -1) {
            cut_end_index = look_in_edited.toLowerCase().indexOf(end_token.toLowerCase(), cut_start_index + 1) + end_token.length;
            if (cut_end_index > -1) {
                // Built-in debugging:
                if (debug == true) {
                    print_string("DEBUG EXCISION BOUNDED STRING: " + represent_bounded_string_succinctly(look_in_edited, cut_start_index, cut_end_index));
                }
                // Do the excision, combining everything before the excision with everything after it:
                //look_in_edited = look_in_edited.substring(0, cut_start_index - 1) +
                look_in_edited = look_in_edited.substring(0, cut_start_index) +
                    look_in_edited.substring(cut_end_index);
            }
        }
        // Repeat, searching from the beginning until no more search string occurrances are found:
    } while (cut_start_index > -1);
    // Built-in debugging:
    if (debug == true) {
        print_string("DEBUG EXCISION AFTER: " + look_in_edited);
    }
    // Return the modified copy of the argument with all occurrances of the found string excised.
    // If none were found, the original argument will be sent back unchanged:
    return look_in_edited;
}
function get_substring(look_in, start_index, end_index) {
    // NOTE: re: "end_index + 1": For some strange reason, the second argument to the "String.substring()" function
    // is "the position up to, but not including, where to end the extraction."  Thus the start index is "really"
    // the start index but the end index is not.  This is, of course, confusing and causes me to have to alter my
    // formulae to handle it.  Rather than pollute my code, I'll do the addition here:
    // NOTE 2: This was a noble idea, but it came  too late in the Wikipedia Discography project.  It was my attempt
    // to bring order to chaos that ended up adding to it because it brought a third "sub-string" function into an
    // application that was already full of "String.substring()" and "String.substr()" calls.  It could have been
    // helpful but only if it became the only substring approach used.  This would have required much clerical
    // retrofitting, time which I judged to be a waste.  Documenting it here is sufficient.
    // I couldn't take it anymore!  Am now using "get_substring()" in my main code. 7/30/2015
    // Also, a better approach would probably be to take the whole concept of "bounds" into account and, in the
    // process, solve a bigger, more awkward problem with string-parse processing (eg: Do I include the bounds in the
    // returned string or excision?, Are the bounds one-character or more?, Don't forget the "end_index + 1" problem
    // documented below.) I do this time and time again, throughout the entire application.  It's all a convoluted
    // mess, but c'est la vie.
    return look_in.substring(start_index, end_index + 1);
}
function insert_at(insert_into, insert, insert_at) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var insert_into_edited = insert_into;
    // Do the insertion, combining everything before the insertion with everything after it:
    insert_into_edited =
        get_substring(insert_into_edited, 0, insert_at - 1) +
            insert +
            get_substring(insert_into_edited, insert_at, insert_into_edited.length - 1);
    // Return the modified copy of the argument:
    return insert_into_edited;
}
function regularize_AND_separators(look_in) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // 3-17-2019 started seeing:
    //      YouTube visual:         Tony Orlando & Dawn - The Greatest Hits (Full Album)
    //      YouTube API match key:  tony orlando amp dawn the greatest hits full album
    look_in_edited = replace_all(look_in_edited, "&amp", " and ");
    //look_in_edited = replace_all(look_in_edited, "&", " and ");     // Eg: Simon & Garfunkel
    look_in_edited = replace_all(look_in_edited, "\\+", " and "); // Eg: Mike + The Mechanics
    look_in_edited = consolidate_extraneous_spaces(look_in_edited);
    // Return the modified copy of the argument:
    return look_in_edited;
}
function regularize_dashes(look_in) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // EM DASH, hex "2014", eg: Bachman�Turner Overdrive
    // EN DASH, hex "2013", eg: The B-52's
    //-------------------------------------------------------------------
    // 3-18-2019:
    // Convert EM DASHs and EN DASHs to simple dashes:
    look_in_edited = look_in_edited.replace(/\u2013|\u2014/g, "-");
    //-------------------------------------------------------------------
    // Return the modified copy of the argument:
    return look_in_edited;
}
function remove_all_procedural(look_in, look_for) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // If the string is found:
    if (look_in_edited.indexOf(look_for) > -1) {
        // Combine these two portions, implicitly excising the found string:
        do {
            look_in_edited =
                // Text preceeding the found string:
                look_in_edited.substring(0, look_in_edited.indexOf(look_for)) +
                    // Text following the found string:
                    look_in_edited.substr(look_in_edited.indexOf(look_for) + look_for.length);
            // Continue while the string is still found:
        } while (look_in_edited.indexOf(look_for) > -1);
    }
    // Return the modified copy of the argument:
    return look_in_edited;
}
function remove_leading_expression(look_in, look_for) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // If the "leading expression" is found at the beginning of the string...
    if (look_in_edited.substr(0, look_for.length) == look_for) {
        //...remove it:
        look_in_edited = look_in_edited.substring(look_for.length);
    }
    // Return either the original string, unchanged, or the newly constructed one:
    return look_in_edited;
}
function remove_special_chars(string_to_clean) {
    // These are the ASCII printable characters all of which are enterable from
    // the keyboard.  They start with the space character and end with the tilde
    // character.  Anything else is considered a "special character":
    var reg_exp = "[\x20-\x7E]";
    // This function strips out everything EXCEPT those characters prescribed in
    // the regular expression:
    return strip_string_to_regexp(string_to_clean, reg_exp);
}
function remove_successive_spaces(string_to_clean) {
    // Strip out extraneous, successive spaces.  To do so, repeatedly change
    // SPACE+SPACE to SPACE:
    while (string_to_clean.search("  ") > 0) {
        string_to_clean = string_to_clean.replace(RegExp("  ", "g"), " "); //
    }
    return string_to_clean;
}
function replace_all(look_in, from, to) {
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    // Make the replacement:
    look_in_edited = look_in.replace(RegExp(from, "gi"), to); // global, case-insensitive
    // Return the modified copy of the argument:
    return look_in_edited;
}
function strip_string_to_regexp(look_in, regexp) {
    var look_in_edited = look_in;
    var stripped_string = ""; // init
    // We will now create a new string...
    for (var i = 0; i < look_in_edited.length; i++) {
        //...that has in it only the characters prescribed in the regular expression:
        if (look_in_edited[i].match(new RegExp(regexp, "gi"))) {
            stripped_string += look_in_edited[i];
        }
    }
    // Reset:
    look_in_edited = stripped_string;
    return look_in_edited;
}
function subset(look_in, look_for) {
    var is_a_subset = false; // init
    if (look_in.match(RegExp(look_for, "gi"))) { // global, case-insensitive
        if (look_for.length < look_in.length) { // global, case-insensitive
            is_a_subset = true;
        }
    }
    return is_a_subset;
}
function trim(string_to_trim) {
    // This function uses a regular expression that matches one or more occurrences
    // of whitespace (\s) at the beginning or end of the string:
    return string_to_trim.replace(/^\s+|\s+$/g, '');
}
function truncate_bound_exclusive(look_in, end_token) {
    // Case insensitive:
    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;
    var end_token_index = look_in_edited.toLowerCase().indexOf(end_token.toLowerCase());
    if (end_token_index > -1) {
        look_in_edited = look_in_edited.substring(0, end_token_index);
    }
    // Return the modified copy of the argument:
    return look_in_edited;
}
function zero_pad(number, digits) {
    // Pad the high order digits with zeros:
    // eg: zero_pad(123, 4) returns "0123" as a string
    var return_string = number.toString();
    while (return_string.length < digits) {
        return_string = "0" + return_string;
    }
    return return_string;
}
//-----------------------------------------------------------------------------------------------------------
// Window functions:
function open_popup_window(window_uri, modal_dialog, resizable, scrollbars, width_in_pixels, height_in_pixels) {
    //----------------------------------------------------------------------
    var window_desc = ""; // init
    // The following processing has the effect of centering the window
    // to be opened on the screen.  Centering is default behavior in
    // all browsers except Firefox.  Rather than making the process
    // browser-specific, using Configuration Services, I'll just do
    // it for everybody, no harm, no foul:
    // Compute the location's coordinates:
    // NOTE: "Avail" means excluding the Windows task bar.
    var x = (screen.availWidth / 2) - (width_in_pixels / 2);
    var y = (screen.availHeight / 2) - (height_in_pixels / 2);
    // Use the equal sign for equality and the comma as a separator:
    window_desc = "margin-left=auto,margin-right=auto,toolbar=yes,"; // init
    window_desc += "resizable=" + resizable + ",";
    window_desc += "scrollbars=" + scrollbars + ",";
    window_desc += "width=" + width_in_pixels.toString() + "px,";
    window_desc += "height=" + height_in_pixels.toString() + "px,";
    window_desc += "left=" + x.toString() + ",";
    window_desc += "top=" + y.toString();
    //--------------------------------------------------------------------------
    // Opening a window as a modal dialog has the side effect of losing the window's
    // "favicon" upon display.  Microsoft Edge loses the icon in all cases.  These
    // are my test results of the following processing:
    // Browser              Favicon Shows   Comments
    // -------              -------------   --------
    // Brave                yes
    // Chrome               yes
    // Vivaldi              yes             opens in its own tab, not a popup
    // Edge                 no
    // Firefox              yes
    // Internet Explorer    no
    // Opera                yes
    // Safari               yes
    // Open a regular window:
    return window.open(window_uri, "_blank", window_desc);
}
function set_window_title(window_to_set, title) {
    if (window_to_set.document) {
        window_to_set.document.title = title;
    }
    else {
        // NOTE: Recursive call:
        setTimeout(function () { return set_window_title(window_to_set, title); }, 10); // milliseconds
    }
}
function show_array_in_new_window(title, string_array) {
    // Assemble the window's HTML:    
    var HTML_string = "<br><h3>" + title + "</h3>"; // init
    for (var i = 0; i < string_array.length; i++) {
        HTML_string += string_array[i] + "<br>";
    }
    // Open and load the window:
    // NOTE: Without the "about:blank" parameter, below, set_window_title(), below, will
    // fail on Safari only:
    var new_window = window.open("about:blank");
    // Set the title internally, on the form, and externally, on the window:
    new_window.document.write(HTML_string);
    set_window_title(new_window, title);
}
//# sourceMappingURL=WorkingWebBrowserServices.js.map