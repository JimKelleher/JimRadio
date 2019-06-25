<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="JimRadio.About" %>

<%@ Register src="AboutTable.ascx" tagname="About" tagprefix="uc1" %>

<!DOCTYPE html>

<!-- Responsive design: Portrait: -->
<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <link rel="icon"       type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" type="text/css"     href="Site.css"    />
    <link rel="stylesheet" type="text/css"     href="AboutTable.css"    />

    <title>About JimRadio</title>

    <script type="text/javascript">

        //-----------------------------------------------------------------------------------------
        // Responsive web design is an approach that makes web pages render well on a variety of
        // devices and window or screen sizes.  Search for "responsive".
        window.addEventListener("orientationchange", function () {

            // The NOTE and processing below is taken from application ArtistMaint.  That app
            // had no problem when switching back to portrait mode.  This app does, though the
            // zooming is out, not in.  What a mess!  Here, the message will be generic and
            // apply to both portrait and landscape:
            alert("Correcting resizing error...");

            if (window.orientation == 0) {

                // Portrait:
                document.getElementById("viewport").setAttribute("content", "initial-scale=1.0");
            }
            else {
                // NOTE: It is a known problem that, on changing to landscape mode, the browser
                // fully zooms the page.  I have seen it documented for both Android and I-Phone.
                // Unfortunately, non of the solutions suggested worked for me.  In the course of
                // my debugging, I saw that a simple messagebox somehow short-circuits the problem.

                // Having wasted enough time on this, I will wait a few years, check back, and see
                // if the problem has been fixed.

                // Landscape:
                //alert("Correcting landscape resizing error...");
                document.getElementById("viewport").setAttribute("content", "initial-scale=0.5");
            }

        }, false);
        //---------------------------------------------------------------------------------------------------

    </script>

</head>
<body>

    <form id="AboutForm" runat="server">    
        <uc1:About ID="AboutTable" runat="server" />
    </form>

</body>
</html>
