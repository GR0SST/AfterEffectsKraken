var csInterface = new CSInterface();


csInterface.requestOpenExtension("com.my.kraken.localserver", "");
var extensionDirectory = csInterface.getSystemPath("extension");
csInterface.evalScript(`MainDir = "${extensionDirectory}/host"`)




function request(path,type,json) {
	var url = "http://localhost:3200/";
	
	$.ajax({
		type,
		url: url+path,
		data,
		success: response => {
			return response
		}
	})

}