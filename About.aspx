<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="About.aspx.cs" Inherits="JimRadio.About" %>

<%@ Register src="AboutTable.ascx" tagname="About" tagprefix="uc1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <link rel="icon"       type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" type="text/css"     href="Site.css"    />
    <link rel="stylesheet" type="text/css"     href="AboutTable.css"    />

    <title>About JimRadio</title>

</head>
<body>

    <form id="AboutForm" runat="server">    
        <uc1:About ID="AboutTable" runat="server" />
    </form>

</body>
</html>
