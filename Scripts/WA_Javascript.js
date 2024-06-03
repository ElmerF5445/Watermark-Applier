//import domtoimage from 'dom-to-image';
//const domtoimage = require("dom-to-image");

var WA_Projects_SessionStarted = 0;
var WA_Projects_ProjectName = "";

function WA_Projects_StartSession(){
	if (WA_Projects_Status_ProjectLoaded == 0){
		if (WA_Projects_SessionStarted == 0){
			Subwindows_Open('Projects_CreateProject');
			WA_Projects_ProjectName = "Untitled_Project";
			document.getElementById("WA_Projects_ProjectName_Input").value = WA_Projects_ProjectName;
			WA_Projects_SessionStarted = 1;
		}
	} else {
		if (WA_Projects_SessionStarted == 1){
			document.getElementById("Header_MainMenu_Navigation_Item_Projects_EditProjectName").style.display = "flex";
			document.getElementById("Header_MainMenu_Navigation_Item_Projects_SaveProject").style.display = "flex";
			document.getElementById("FilterImages").style.display = "grid";
			document.getElementById("ApplyWatermark").style.display = "grid";
			document.getElementById("ProcessedImages").style.display = "grid";
			document.getElementById("BatchProcessing").style.display = "grid";
		}
	}
	if (WA_Projects_SessionStarted == 1){
		document.getElementById("Header_MainMenu_Navigation_Item_Projects_EditProjectName").style.display = "flex";
		document.getElementById("Header_MainMenu_Navigation_Item_Projects_SaveProject").style.display = "flex";
		document.getElementById("FilterImages").style.display = "grid";
		document.getElementById("ApplyWatermark").style.display = "grid";
		document.getElementById("ProcessedImages").style.display = "grid";
		document.getElementById("BatchProcessing").style.display = "grid";
	}
}

function WA_Projects_Save_ProjectName(){
	if (document.getElementById("WA_Projects_ProjectName_Input").value != "" || document.getElementById("WA_Projects_ProjectName_Input").value == null){
		WA_Projects_ProjectName = document.getElementById("WA_Projects_ProjectName_Input").value;
	} else {
		document.getElementById("WA_Projects_ProjectName_Input").value = "Untitled_Project";
		WA_Projects_ProjectName = document.getElementById("WA_Projects_ProjectName_Input").value;
	}
	document.getElementById("Header_PageNavi_Title").innerHTML = WA_Projects_ProjectName;
	document.getElementById("WA_Projects_ProjectName_SaveProject_Input").value = WA_Projects_ProjectName;
	document.getElementById("WA_Projects_ProjectName_EditProjectName_Input").value = WA_Projects_ProjectName;
	WA_Projects_SessionStarted = 1;
	WA_Projects_StartSession();
}

function WA_Projects_Edit_ProjectName(){
	var WA_Projects_Edit_ProjectName_NewName = document.getElementById("WA_Projects_ProjectName_EditProjectName_Input").value;
	WA_Projects_Save_ProjectName();
	if (localStorage.getItem("WA_ProjectIndex")){
		console.log("Editing project name...");
		var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));

		var WA_Projects_Edit_ProjectName_CurrentName_Index = WA_Projects_ProjectIndex.indexOf(WA_Projects_ProjectName);

		WA_Projects_ProjectIndex[WA_Projects_Edit_ProjectName_CurrentName_Index] = WA_Projects_Edit_ProjectName_NewName;

		localStorage.setItem("WA_ProjectIndex", JSON.stringify(WA_Projects_ProjectIndex));

		if (localStorage.getItem("WA_Project_" + WA_Projects_ProjectName)){
			var WA_Projects_Edit_ProjectName_CurrentProject_Data = JSON.parse(localStorage.getItem("WA_Project_" + WA_Projects_ProjectName));

			localStorage.setItem("WA_Project_" + WA_Projects_Edit_ProjectName_NewName, JSON.stringify(WA_Projects_Edit_ProjectName_CurrentProject_Data));

			localStorage.removeItem("WA_Project_" + WA_Projects_ProjectName);
		}

		WA_Projects_ProjectName = WA_Projects_Edit_ProjectName_NewName;
		document.getElementById("WA_Projects_ProjectName_Input").value = WA_Projects_Edit_ProjectName_NewName;
		WA_Projects_Save_ProjectName();
		Toast_CreateToast("Assets/Icons/placeholder.png", "Project renamed", "Project has been renamed and resaved successfully.");
		console.log("Rename success");
	}
	WA_Projects_Load_Home_ProjectList();
}

function WA_Projects_Save_Project(){
	WA_Projects_ProjectName = document.getElementById("WA_Projects_ProjectName_SaveProject_Input").value;
	WA_Projects_Save_ProjectName();
	if (localStorage.getItem("WA_ProjectIndex")){
		console.log("Saving project...");
		var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));
		if (WA_Projects_Save_Project_Status == 0){
			WA_Projects_ProjectIndex.push(WA_Projects_ProjectName);
			localStorage.setItem("WA_ProjectIndex", JSON.stringify(WA_Projects_ProjectIndex));
		}
		

		WA_Projects_Save_Project_Data_Main = [WA_FileNameList_Images, WA_FileNameList_Images_FilterState, WA_FileNameList_Images_Filtered, WA_FileNameList_Images_Filtered_DataID];
		
		localStorage.setItem("WA_Project_" + WA_Projects_ProjectName, JSON.stringify(WA_Projects_Save_Project_Data_Main));
		if (WA_Projects_Save_Project_Status == 0){
			Toast_CreateToast("Assets/Icons/placeholder.png", "Project saved", "Project '" + WA_Projects_ProjectName + "' has been saved successfully.");
			console.log("Project saved successfully.");
		} else {
			Toast_CreateToast("Assets/Icons/placeholder.png", "Project resaved", "Project '" + WA_Projects_ProjectName + "' has been overwritten and saved successfully.");
			console.log("Project overwritten successfully.");
		}
		
	} else {
		console.log("No project index detected, creating...");
		var WA_Projects_ProjectIndex = ["fillerData"];
		localStorage.setItem("WA_ProjectIndex", JSON.stringify(WA_Projects_ProjectIndex));
		console.log("Project index created.");
		WA_Projects_Save_Project();
	}
	WA_Projects_Load_Home_ProjectList();
}
var WA_Projects_Save_Project_Status = 0; // 0 - Create new index entry, 1 - Overwrite similar file (this only happens when there are same file names)
function WA_Projects_CheckFileAvailability(Type){
	if (Type == "SaveProject" && WA_Projects_Status_ProjectLoaded == 0){
		if (localStorage.getItem("WA_ProjectIndex")){
			var WA_Projects_CheckFileAvailability_FileName = document.getElementById("WA_Projects_ProjectName_SaveProject_Input").value;
			var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));
			for (a = 1; a < WA_Projects_ProjectIndex.length; a++){
				if (WA_Projects_CheckFileAvailability_FileName == WA_Projects_ProjectIndex[a]){
					WA_Projects_Save_Project_Status = 1;
					document.getElementById("WA_Projects_ProjectName_SaveProject_Info_FileAlreadyExists").style.display = "block";
					break;
				} else {
					WA_Projects_Save_Project_Status = 0;
					document.getElementById("WA_Projects_ProjectName_SaveProject_Info_FileAlreadyExists").style.display = "none";
				}
			}
		}
	} else if (Type == "SaveProject" && WA_Projects_Status_ProjectLoaded == 1) {
		document.getElementById("WA_Projects_ProjectName_SaveProject_Info_FileAlreadyExists").style.display = "none";
		document.getElementById("WA_Projects_ProjectName_SaveProject_Input").style.display = "none";
		WA_Projects_Save_Project_Status = 1;
	}
	if (Type == "EditProject"){
		if (localStorage.getItem("WA_ProjectIndex")){
			var WA_Projects_CheckFileAvailability_FileName = document.getElementById("WA_Projects_ProjectName_EditProjectName_Input").value;
			var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));
			for (a = 1; a < WA_Projects_ProjectIndex.length; a++){
				if (WA_Projects_CheckFileAvailability_FileName == WA_Projects_ProjectIndex[a]){
					WA_Projects_Save_Project_Status = 1;
					if (WA_Projects_CheckFileAvailability_FileName != WA_Projects_ProjectName){
						document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_FileAlreadyExists").style.display = "block";
						document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_SameProjectName").style.display = "none";
					} else {
						document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_FileAlreadyExists").style.display = "none";
						document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_SameProjectName").style.display = "block";
					}
					break;
				} else {
					WA_Projects_Save_Project_Status = 0;
					document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_FileAlreadyExists").style.display = "none";
					document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_SameProjectName").style.display = "none";
				}
			}
		}
	}
	if (Type == "NewProject"){
		if (localStorage.getItem("WA_ProjectIndex")){
			var WA_Projects_CheckFileAvailability_FileName = document.getElementById("WA_Projects_ProjectName_Input").value;
			var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));
			for (a = 1; a < WA_Projects_ProjectIndex.length; a++){
				if (WA_Projects_CheckFileAvailability_FileName == WA_Projects_ProjectIndex[a]){
					WA_Projects_Save_Project_Status = 1;
					document.getElementById("WA_Projects_ProjectName_CreateProject_Info_FileAlreadyExists").style.display = "block";
					break;
				} else {
					WA_Projects_Save_Project_Status = 0;
					document.getElementById("WA_Projects_ProjectName_CreateProject_Info_FileAlreadyExists").style.display = "none";
				}
			}
		}
	}
	if (!localStorage.getItem("WA_ProjectIndex")){
		document.getElementById("WA_Projects_ProjectName_CreateProject_Info_FileAlreadyExists").style.display = "none";
		document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_FileAlreadyExists").style.display = "none";
		document.getElementById("WA_Projects_ProjectName_EditProjectName_Info_SameProjectName").style.display = "none";
		document.getElementById("WA_Projects_ProjectName_SaveProject_Info_FileAlreadyExists").style.display = "none";
	}
}

function WA_Projects_Load_Home_ProjectList(){
	if (localStorage.getItem("WA_ProjectIndex")){
		var WA_Projects_ProjectIndex = JSON.parse(localStorage.getItem("WA_ProjectIndex"));
		if (WA_Projects_ProjectIndex.length > 1){
			document.getElementById("WA_Welcome_ProjectList_List").innerHTML = "";
			for (a = 1; a < WA_Projects_ProjectIndex.length; a++){
				var WA_ProjectList_Element = document.createElement("p");
				WA_ProjectList_Element.innerHTML = WA_Projects_ProjectIndex[a];
				WA_ProjectList_Element.className = "WA_Welcome_Section_Item";
				WA_ProjectList_Element.setAttribute('onclick', 'WA_Projects_Load_Project("' + WA_Projects_ProjectIndex[a] + '")');
				document.getElementById("WA_Welcome_ProjectList_List").appendChild(WA_ProjectList_Element);
			}
		}
	}
}
var WA_Projects_Status_ProjectLoaded = 0; // 0 - Nothing loaded, 1 - Project loaded;
function WA_Projects_Load_Project(ProjectName){
	if (localStorage.getItem("WA_Project_" + ProjectName)){
		WA_Projects_Status_ProjectLoaded = 1;
		document.getElementById("WA_Projects_ProjectName_Input").value = ProjectName;
		WA_Projects_ProjectName = ProjectName;
		WA_Projects_Save_ProjectName();
		var WA_Projects_Load_Project_Data_Main = JSON.parse(localStorage.getItem("WA_Project_" + ProjectName));
		WA_FileNameList_Images = WA_Projects_Load_Project_Data_Main[0];
		WA_FileNameList_Images_FilterState = WA_Projects_Load_Project_Data_Main[1];
		WA_FileNameList_Images_Filtered = WA_Projects_Load_Project_Data_Main[2];
		WA_FileNameList_Images_Filtered_DataID = WA_Projects_Load_Project_Data_Main[3];

		if (WA_FileNameList_Images.length > 0){
			document.getElementById("WA_ImportImages_ImageList_Input").value = "";
			for (a = 0; a < WA_FileNameList_Images.length; a++){
				if(WA_FileNameList_Images[a].includes("\n")){
					document.getElementById("WA_ImportImages_ImageList_Input").value += WA_FileNameList_Images[a];
				} else {
					document.getElementById("WA_ImportImages_ImageList_Input").value += WA_FileNameList_Images[a] + '\n';
				}
			}
			document.getElementById('WA_FilterImages_ImageList_Settings_UsingFilePaths_Input').querySelector('.Toggle_Indicator').setAttribute('data-id', "Toggle_Deactivated");
			WA_ImportImages_ExtractFileNames();
			WA_RefreshEditor_FilterImages_FilteredList();
			WA_RefreshEditor_FilterImages_States();
		}
		Tabs_ChangeTab("FilterImages");
	}
	WA_Projects_SessionStarted = 1;
	WA_Projects_StartSession();
}

var WA_ApplyWatermark_GeneratedImages = 0;
var WA_ApplyWatermark_Status = 0; // 0 - Free, 1 - Processing

function WA_ApplyWatermark(){
	WA_ApplyWatermark_Status = 1;
	if (WA_ApplyWatermark_Status == 1){
		WA_ApplyWatermark_GeneratedImages++;
		Toast_CreateToast("Assets/Icons/icon_schedules.png", "Processing image", "Please wait for the image to be generated.");
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.outline = "solid red";

		var WA_ImageClientWidth = document.getElementById("WA_ApplyWatermark_Image").clientWidth;
		var WA_ImageClientHeight = document.getElementById("WA_ApplyWatermark_Image").clientHeight;
		document.getElementById("WA_ApplyWatermark_Canvas").style.width = WA_ImageClientWidth * WA_ApplyWatermark_Settings_ResolutionScale + "px";
		document.getElementById("WA_ApplyWatermark_Canvas").style.height = WA_ImageClientHeight * WA_ApplyWatermark_Settings_ResolutionScale + "px";
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = WA_ImageClientWidth * WA_ApplyWatermark_Settings_ResolutionScale + "px";
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = WA_ImageClientHeight * WA_ApplyWatermark_Settings_ResolutionScale + "px";

		domtoimage.toPng(document.getElementById('WA_ApplyWatermark_Canvas_Container'), {
			width: WA_ImageClientWidth * WA_ApplyWatermark_Settings_ResolutionScale,
			height: WA_ImageClientHeight * WA_ApplyWatermark_Settings_ResolutionScale,
		}).then(function(WA_ApplyWatermark_OutputImage_Data){
			var WA_ApplyWatermark_OutputImage_Element = new Image();
			WA_ApplyWatermark_OutputImage_Element.setAttribute('id', 'WA_ApplyWatermark_OutputImage_' + WA_ApplyWatermark_GeneratedImages);
			WA_ApplyWatermark_OutputImage_Element.setAttribute('data-id', WA_ApplyWatermark_GeneratedImages);
			WA_ApplyWatermark_OutputImage_Element.setAttribute('class', 'WA_OutputImage');
			WA_ApplyWatermark_OutputImage_Element.src = WA_ApplyWatermark_OutputImage_Data;
			document.getElementById('WA_ProcessedImages').appendChild(WA_ApplyWatermark_OutputImage_Element);

			document.getElementById("WA_ApplyWatermark_Canvas").style.width = null;
			document.getElementById("WA_ApplyWatermark_Canvas").style.height = null;
			document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = WA_OriginalClientWidth_Canvas_Container;
			document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = WA_OriginalClientHeight_Canvas_Container;

			if (WA_BatchProcessing_Status != 1){
				if (document.getElementById("WA_ApplyWatermark_Settings_GoToNextImageAfterGeneration_Input").querySelector(".Toggle_Indicator").getAttribute("data-id") == "Toggle_Activated"){
					WA_ApplyWatermark_ChangeSource_Image_Next();
				}
			}

			if(document.getElementById("WA_ApplyWatermark_Settings_DownloadAfterGeneration_Input").querySelector(".Toggle_Indicator").getAttribute("data-id") == "Toggle_Activated"){
				saveAs(WA_ApplyWatermark_OutputImage_Data, WA_Projects_ProjectName + "_" + WA_ApplyWatermark_GeneratedImages + ".png");
				Toast_CreateToast("Assets/Icons/icon_download.png", "Image processed", "Please wait for your image to download automatically.");
				WA_ApplyWatermark_Status = 0;
			} else {
				Toast_CreateToast("Assets/Icons/icon_check.png", "Image processed", "The image has been processed successfully.");
				WA_ApplyWatermark_Status = 0;
			}

			WA_ApplyWatermark_Status = 0;
		})
	}
}

function WA_ApplyWatermark_Depracated(){
	WA_ApplyWatermark_Status = 1;
	WA_ApplyWatermark_GeneratedImages++;
	var scale = WA_ApplyWatermark_Settings_ResolutionScale;
    Toast_CreateToast("Assets/Icons/icon_schedules.png", "Processing image", "Please wait for the image to be generated.");
    document.getElementById("WA_ApplyWatermark_Canvas_Container").style.outline = "solid red";
	var WA_ImageClientWidth = document.getElementById("WA_ApplyWatermark_Image").clientWidth;
	var WA_ImageClientHeight = document.getElementById("WA_ApplyWatermark_Image").clientHeight;
	document.getElementById("WA_ApplyWatermark_Canvas").style.width = WA_ImageClientWidth * scale + "px";
	document.getElementById("WA_ApplyWatermark_Canvas").style.height = WA_ImageClientHeight * scale + "px";
	document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = WA_ImageClientWidth * scale + "px";
	document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = WA_ImageClientHeight * scale + "px";
	domtoimage.toPng(document.getElementById('WA_ApplyWatermark_Canvas_Container'), {
		width: WA_ImageClientWidth * scale,
		height: WA_ImageClientHeight * scale,
		}).then(function(data) {
		var img = new Image();
		img.setAttribute('id', 'OutputImage');
		img.setAttribute('class', 'WA_OutputImage');
		document.getElementById('WA_ProcessedImages').appendChild(img);
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.outline = "solid green";
		img.src = data;
		if(document.getElementById("WA_ApplyWatermark_Settings_DownloadAfterGeneration_Input").querySelector(".Toggle_Indicator").getAttribute("data-id") == "Toggle_Activated"){
			saveAs(data, WA_Projects_ProjectName + "_" + WA_ApplyWatermark_GeneratedImages + ".png");
			Toast_CreateToast("Assets/Icons/icon_download.png", "Image processed", "Please wait for your image to download automatically.");
			WA_ApplyWatermark_Status = 0;
		} else {
			Toast_CreateToast("Assets/Icons/icon_check.png", "Image processed", "The image has been processed successfully.");
			WA_ApplyWatermark_Status = 0;
		}
        console.log("Processing finished");
		document.getElementById("WA_ApplyWatermark_Canvas").style.width = null;
		document.getElementById("WA_ApplyWatermark_Canvas").style.height = null;
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = WA_OriginalClientWidth_Canvas_Container;
		document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = WA_OriginalClientHeight_Canvas_Container;
		if (WA_BatchProcessing_Status != 1){
			if (document.getElementById("WA_ApplyWatermark_Settings_GoToNextImageAfterGeneration_Input").querySelector(".Toggle_Indicator").getAttribute("data-id") == "Toggle_Activated"){
				WA_ApplyWatermark_ChangeSource_Image_Next();
			}
		}
		
		WA_ApplyWatermark_Status = 0;
	})
	
}

window.addEventListener('resize', function(){
    WA_Canvas_ChangeSize();
});

var WA_OriginalClientWidth_Canvas_Container;
var WA_OriginalClientHeight_Canvas_Container;
var WA_OriginalClientWidth_Image;
var WA_OriginalClientHeight_Image;

function WA_Canvas_ChangeSize(){
    document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = "100%";
    document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = "100%";
    var WA_ImageClientWidth = document.getElementById("WA_ApplyWatermark_Image").clientWidth;
	var WA_ImageClientHeight = document.getElementById("WA_ApplyWatermark_Image").clientHeight;
	document.getElementById("WA_ApplyWatermark_Canvas_Container").style.width = WA_ImageClientWidth;
	document.getElementById("WA_ApplyWatermark_Canvas_Container").style.height = WA_ImageClientHeight;

	WA_OriginalClientHeight_Canvas_Container = WA_ImageClientWidth;
	WA_OriginalClientHeight_Canvas_Container = WA_ImageClientHeight;WA_OriginalClientWidth_Image = WA_ImageClientWidth;
	WA_OriginalClientHeight_Image = WA_ImageClientHeight;
}

var WA_FileNameList_FileUpload_Links = [];

function WA_ImportImages_FileUpload_FetchFiles(callback){
	var WA_ImportImages_FileUpload_Input = document.getElementById("WA_ImportImages_FileUpload_Input");
    var WA_ImportImages_FileUpload_Input_Files = WA_ImportImages_FileUpload_Input.files;
    WA_FileNameList_FileUpload_Links = [];

    function processFile(file, callback) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const src = e.target.result;
            WA_FileNameList_FileUpload_Links.push(src);
            // After processing the file, check if all files are processed
            if (WA_FileNameList_FileUpload_Links.length === WA_ImportImages_FileUpload_Input_Files.length) {
                // Call the callback function to continue with the next steps
                callback();
				WA_FileNameList_Images = WA_FileNameList_FileUpload_Links;
            }
        };
        reader.readAsDataURL(file);
    }

    // If no files, call the callback immediately
    if (WA_ImportImages_FileUpload_Input_Files.length === 0) {
        callback();
        return;
    }

    // Iterate through each file and process it
    for (const file of WA_ImportImages_FileUpload_Input_Files) {
        processFile(file, callback);
    }
}

var fileName;
var WA_FileNameList_LinkMode = "WithPath";
function WA_ImportImages_ExtractFileNames(){
	WA_FileNameList_Images_GeneratedCount = 0;
	if (document.getElementById('WA_FilterImages_ImageList_Settings_ListType').getAttribute('Radio_ActiveButton') == "ListType_FilePaths"){
		var filePath = document.getElementById("WA_ImportImages_ImageList_Input").value;
		console.log(filePath);
		fileName = filePath.split(" ");
		console.log(filePath);
		fileName = filePath.split("\\");
		console.log(fileName);
		fileName = fileName.filter(function(fileName){
			return /\.[^\.]+$/.test(fileName);
		});
		console.log(fileName);
		for (a = 0; a < fileName.length; a++){
			if (a == fileName.length - 1){
				var temp_FileName = fileName[a].replace('"', '');
				fileName[a] = temp_FileName;
			} else {
				var temp_FileName = fileName[a].replace('" "C:', '');
				fileName[a] = temp_FileName;
			}
		}
		for (a = 0; a < fileName.length; a++){
			var temp_FileName = fileName[a].replace('" ', '');
			fileName[a] = temp_FileName;
			var temp_FileName = fileName[a].replace('"', '');
			fileName[a] = temp_FileName;
			var temp_FileName = fileName[a].replace('" "C:', '');
			fileName[a] = temp_FileName;
			var temp_FileName = fileName[a].replace('C:', '');
			fileName[a] = temp_FileName;
			var temp_FileName = fileName[a].replace('"C:', '');
			fileName[a] = temp_FileName;
			var temp_FileName = fileName[a].replace(' "', '');
			fileName[a] = temp_FileName;
		}
		fileName = fileName.map(function(name) {
			return name.trim().replace(/^"|"$/g, '');
		});
		fileName = fileName.map(function(name) {
			return name.trimStart();
		});
		console.log(fileName);
		document.getElementById("WA_ImportImages_ImageList_Input").value = fileName.join(" ");
		WA_FileNameList_Images = fileName;
		WA_FileNameList_LinkMode = "WithPath";
	} else if (document.getElementById('WA_FilterImages_ImageList_Settings_ListType').getAttribute('Radio_ActiveButton') == "ListType_FileNames") {
		var fileName = document.getElementById("WA_ImportImages_ImageList_Input").value.split("\n");
		fileName = fileName.map(function(name) {
			return name.trim();
		});
		WA_FileNameList_Images = fileName;
		WA_FileNameList_Images = WA_FileNameList_Images.filter(item => item !== '');
		WA_FileNameList_LinkMode = "WithPath"
	} else if (document.getElementById('WA_FilterImages_ImageList_Settings_ListType').getAttribute('Radio_ActiveButton') == "ListType_GDriveLinks"){
		var fileName = document.getElementById("WA_ImportImages_ImageList_Input").value.split(", ");
		var WA_FileNameList_GDrive_Links_Raw = fileName;
		var WA_FileNameList_GDrive_Links_IDs = [];

		for (var a = 0; a < WA_FileNameList_GDrive_Links_Raw.length; a++) {
			var link = WA_FileNameList_GDrive_Links_Raw[a];
			var fileIdMatch = link.match(/\/d\/([^\/]+)/); // Extract file ID using regex
			if (fileIdMatch && fileIdMatch[1]) {
				WA_FileNameList_GDrive_Links_IDs.push(fileIdMatch[1]);
			}
		}

		var WA_FileNameList_GDrive_Links_Displayable = [];
		for (var a = 0; a < WA_FileNameList_GDrive_Links_IDs.length; a++) {
			WA_FileNameList_GDrive_Links_Displayable.push("https://lh3.google.com/u/0/d/" + WA_FileNameList_GDrive_Links_IDs[a]);
		}

		WA_FileNameList_GDrive_Links_Displayable.join(", ");

		WA_FileNameList_Images = WA_FileNameList_GDrive_Links_Displayable; // Add a space after each comma
		document.getElementById("WA_ImportImages_ImageList_Input").value = '';
		document.getElementById("WA_ImportImages_ImageList_Input").value = WA_FileNameList_Images;
	

		/*var fileName = document.getElementById("WA_ImportImages_ImageList_Input").value.split(", ");
		var WA_FileNameList_GDrive_Links_Raw = fileName;
		var WA_FileNameList_GDrive_Links_IDs = [];
		for (a = 0; a < WA_FileNameList_GDrive_Links_Raw.length; a++){
			var WA_FileNameList_GDrive_Links_Raw_StartingIndex = WA_FileNameList_GDrive_Links_Raw[a].indexOf("/d/") + 3;
			var WA_FileNameList_GDrive_Links_Raw_EndingIndex = WA_FileNameList_GDrive_Links_Raw[a].indexOf("/view");
			var WA_FileNameList_GDrive_Links_Raw_LinkID = WA_FileNameList_GDrive_Links_Raw[a].substring(WA_FileNameList_GDrive_Links_Raw_StartingIndex, WA_FileNameList_GDrive_Links_Raw_EndingIndex);
			WA_FileNameList_GDrive_Links_IDs.push(WA_FileNameList_GDrive_Links_Raw_LinkID);
		}
		var WA_FileNameList_GDrive_Links_Displayable = [];
		for (a = 0; a < WA_FileNameList_GDrive_Links_IDs.length; a++){
			WA_FileNameList_GDrive_Links_Displayable.push("https://drive.google.com/uc?export=download&id=" + WA_FileNameList_GDrive_Links_IDs[a]);
		}
		WA_FileNameList_Images = WA_FileNameList_GDrive_Links_Displayable;
		document.getElementById("WA_ImportImages_ImageList_Input").value = '';
		document.getElementById("WA_ImportImages_ImageList_Input").value = WA_FileNameList_Images;*/
		WA_FileNameList_LinkMode = "NoPath";
	} else if (document.getElementById('WA_FilterImages_ImageList_Settings_ListType').getAttribute('Radio_ActiveButton') == "ListType_FileUpload"){
		WA_FileNameList_LinkMode = "NoPath";
	}
	if (WA_Projects_Status_ProjectLoaded == 0){
		WA_FileNameList_Images_FilterState = new Array(WA_FileNameList_Images.length).fill("Not included");
	}
	document.getElementById("WA_FilterImages_ImageList_List").innerHTML = '';
	WA_ImportImages_Generate_ImageList_FilterImages();
}

var WA_FileNameList_Images = [];
var WA_FileNameList_Images_FilterState = [];
var WA_FileNameList_Images_GeneratedCount = 0;
var WA_FileNameList_Settings_LoadAllAtOnce = true;


function WA_ImportImages_ChangeLoadSettings(){
	if (document.getElementById('WA_FilterImages_ImageList_Settings_ImportSettings').getAttribute('Radio_ActiveButton') == "ImportSettings_LoadImagesAllAtOnce"){
		WA_FileNameList_Settings_LoadAllAtOnce = true;
		document.getElementById("WA_FilterImages_ImageList_LoaderBuffer").style.display = "none";
	} else {
		WA_FileNameList_Settings_LoadAllAtOnce = false;
		document.getElementById("WA_FilterImages_ImageList_LoaderBuffer").style.display = "flex";
	}
}

var WA_FileNameList_Images_GeneratedLevel = 1;
var WA_FileNameList_Images_ImagePerLevel = 12;
var WA_FileNameList_Images_ImagesCurrentlyGenerated = 0;
function WA_ImportImages_Generate_ImageList_FilterImages(){
	document.getElementById("WA_FilterImages_PreviewImage_Preview").style.display = "block";
	document.getElementById("WA_FilterImages_PreviewImage_Preview").src = "Assets/WA_Test_Image_2.png";
	WA_CurrentlyAccessedImage = 0;
	document.getElementById('Ribbon_FilterImages').querySelectorAll(".Ribbon_Item")[1].style.display = "grid";
	document.getElementById('Ribbon_FilterImages').querySelectorAll(".Ribbon_Item")[2].style.display = "grid";
	if (WA_FileNameList_Settings_LoadAllAtOnce == true){
		for (a = 0; a < WA_FileNameList_Images.length; a++){
			var WA_FilterImages_ImageList_Item_Div = document.createElement('div');
			WA_FilterImages_ImageList_Item_Div.className = "WA_FilterImages_ImageList_List_Item";
			WA_FilterImages_ImageList_Item_Div.setAttribute('id', 'WA_FilterImages_ImageList_List_Item_' + (a + WA_FileNameList_Images_GeneratedCount));
			WA_FilterImages_ImageList_Item_Div.setAttribute('onclick', 'WA_FilterImages_ChangePreviewSource(this.getAttribute("data-id"))');
			WA_FilterImages_ImageList_Item_Div.setAttribute('data-id', a);
			document.getElementById("WA_FilterImages_ImageList_List").appendChild(WA_FilterImages_ImageList_Item_Div);
	
			var WA_FilterImages_ImageList_Item_Thumbnail = document.createElement('img');
			WA_FilterImages_ImageList_Item_Thumbnail.setAttribute('loading', 'lazy');
			WA_FilterImages_ImageList_Item_Thumbnail.setAttribute('onerror', 'this.style.display = "none"');
			WA_FilterImages_ImageList_Item_Thumbnail.className = "WA_FilterImages_ImageList_List_Item_Image";
			if(WA_FileNameList_LinkMode == "WithPath"){
				WA_FilterImages_ImageList_Item_Thumbnail.src = "Assets/Images/" + WA_FileNameList_Images[a];
			} else if (WA_FileNameList_LinkMode == "NoPath"){
				WA_FilterImages_ImageList_Item_Thumbnail.src = WA_FileNameList_Images[a];
			}
			
			document.getElementById('WA_FilterImages_ImageList_List_Item_' + (a + WA_FileNameList_Images_GeneratedCount)).appendChild(WA_FilterImages_ImageList_Item_Thumbnail);
	
			var WA_FilterImages_ImageList_Item_FileName = document.createElement('p');
			WA_FilterImages_ImageList_Item_FileName.className = "WA_FilterImages_ImageList_List_Item_Name";
			WA_FilterImages_ImageList_Item_FileName.innerHTML = WA_FileNameList_Images[a];
			document.getElementById('WA_FilterImages_ImageList_List_Item_' + (a + WA_FileNameList_Images_GeneratedCount)).appendChild(WA_FilterImages_ImageList_Item_FileName);
			
		}
		WA_FileNameList_Images_GeneratedCount = WA_FileNameList_Images_GeneratedCount + WA_FileNameList_Images.length; 
	} else if (WA_FileNameList_Settings_LoadAllAtOnce == false){
		/*if (document.getElementById("WA_FilterImages_ImageList_Settings_LoaderAmount_Input").value >= 1){
			WA_FileNameList_Images_ImagePerLevel = document.getElementById("WA_FilterImages_ImageList_Settings_LoaderAmount_Input").value;
		} else {
			document.getElementById("WA_FilterImages_ImageList_Settings_LoaderAmount_Input").value = 12;
			WA_FileNameList_Images_ImagePerLevel = document.getElementById("WA_FilterImages_ImageList_Settings_LoaderAmount_Input").value;
		}*/
		
		for (a = WA_FileNameList_Images_ImagesCurrentlyGenerated; a < (WA_FileNameList_Images_ImagePerLevel * WA_FileNameList_Images_GeneratedLevel); a++){
			if (WA_FileNameList_Images[a] != undefined){
				var WA_FilterImages_ImageList_Item_Div = document.createElement('div');
				WA_FilterImages_ImageList_Item_Div.className = "WA_FilterImages_ImageList_List_Item";
				WA_FilterImages_ImageList_Item_Div.setAttribute('id', 'WA_FilterImages_ImageList_List_Item_' + a);
				WA_FilterImages_ImageList_Item_Div.setAttribute('onclick', 'WA_FilterImages_ChangePreviewSource(this.getAttribute("data-id"))');
				WA_FilterImages_ImageList_Item_Div.setAttribute('data-id', a);
				document.getElementById("WA_FilterImages_ImageList_List").appendChild(WA_FilterImages_ImageList_Item_Div);
		
				var WA_FilterImages_ImageList_Item_Thumbnail = document.createElement('img');
				WA_FilterImages_ImageList_Item_Thumbnail.setAttribute('loading', 'lazy');
				WA_FilterImages_ImageList_Item_Thumbnail.setAttribute('onerror', 'this.style.display = "none"');
				WA_FilterImages_ImageList_Item_Thumbnail.className = "WA_FilterImages_ImageList_List_Item_Image";
				if(WA_FileNameList_LinkMode == "WithPath"){
					WA_FilterImages_ImageList_Item_Thumbnail.src = "Assets/Images/" + WA_FileNameList_Images[a];
				} else if (WA_FileNameList_LinkMode == "NoPath"){
					WA_FilterImages_ImageList_Item_Thumbnail.src = WA_FileNameList_Images[a];
				}
				
				document.getElementById('WA_FilterImages_ImageList_List_Item_' + a).appendChild(WA_FilterImages_ImageList_Item_Thumbnail);
		
				var WA_FilterImages_ImageList_Item_FileName = document.createElement('p');
				WA_FilterImages_ImageList_Item_FileName.className = "WA_FilterImages_ImageList_List_Item_Name";
				WA_FilterImages_ImageList_Item_FileName.innerHTML = WA_FileNameList_Images[a];
				document.getElementById('WA_FilterImages_ImageList_List_Item_' + a).appendChild(WA_FilterImages_ImageList_Item_FileName);

				WA_FileNameList_Images_ImagesCurrentlyGenerated = a + 1;
			}
		}
		if (WA_FileNameList_Images_ImagesCurrentlyGenerated >= WA_FileNameList_Images.length){
			document.getElementById("WA_FilterImages_ImageList_LoaderBuffer").style.display = "none";
		}
		WA_FileNameList_Images_GeneratedCount = WA_FileNameList_Images_GeneratedCount + WA_FileNameList_Images.length; 
		WA_FileNameList_Images_GeneratedLevel++;
		WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage);
	}
	if (document.getElementById('WA_FilterImages_ImageList_Settings_ImportSettings').getAttribute('Radio_ActiveButton') == "ImportSettings_LoadImagesAllAtOnce"){
		document.getElementById("WA_FilterImages_ImageList_LoaderBuffer").style.display = "none";
	} else {
		document.getElementById("WA_FilterImages_ImageList_LoaderBuffer").style.display = "flex";
	}
}

var WA_CurrentlyAccessedImage = 0;

function WA_FilterImages_ChangePreviewSource(DataID){
	var WA_FilterImages_ChangePreviewSource_Element = document.getElementById("WA_FilterImages_ImageList_List_Item_" + DataID);
	if (WA_FilterImages_ChangePreviewSource_Element){
		var WA_FilterImages_ChangePreviewSource_Element_DataID = WA_FilterImages_ChangePreviewSource_Element.getAttribute("data-id");
		WA_CurrentlyAccessedImage = WA_FilterImages_ChangePreviewSource_Element_DataID;
		var WA_FilterImages_ChangePreviewSource_Element_Source = WA_FilterImages_ChangePreviewSource_Element.querySelector(".WA_FilterImages_ImageList_List_Item_Image").src;
		var WA_FilterImages_ChangePreviewSource_Element_FileName = WA_FilterImages_ChangePreviewSource_Element.querySelector(".WA_FilterImages_ImageList_List_Item_Name").innerHTML;
		console.log(WA_FilterImages_ChangePreviewSource_Element_Source);
		console.log(WA_FilterImages_ChangePreviewSource_Element_FileName);

		document.getElementById("WA_FilterImages_PreviewImage_Preview").src = WA_FilterImages_ChangePreviewSource_Element_Source;
		document.getElementById("WA_FilterImages_PreviewImage_FileName").innerHTML = WA_FilterImages_ChangePreviewSource_Element_FileName;

		for (a = 0; a < document.querySelectorAll(".WA_FilterImages_ImageList_List_Item").length; a++){
			document.querySelectorAll(".WA_FilterImages_ImageList_List_Item")[a].style.outline = "none";
		}

		WA_FilterImages_ChangePreviewSource_Element.style.outline = "solid var(--Accent-Color)";
	} else {
		WA_CurrentlyAccessedImage = DataID;
		document.getElementById("WA_FilterImages_PreviewImage_Preview").src = "Assets/Images/" + WA_FileNameList_Images[DataID];
		document.getElementById("WA_FilterImages_PreviewImage_FileName").innerHTML = WA_FileNameList_Images[DataID];
		for (a = 0; a < document.querySelectorAll(".WA_FilterImages_ImageList_List_Item").length; a++){
			document.querySelectorAll(".WA_FilterImages_ImageList_List_Item")[a].style.outline = "none";
		}
	}

	if (WA_FileNameList_Images_FilterState[DataID] == "Included"){
		document.getElementById("WA_FilterImages_PreviewImage_Preview").style.outline = "solid var(--Accent-Color)";
		document.getElementById("WA_FilterImages_PreviewImage_FileName").style.color = "var(--Accent-Color)";
		document.getElementById("WA_FilterImages_Ribbon_ToggleFilterState").querySelector(".Ribbon_Item_Text").innerHTML = "Remove item from filter list";
	} else {
		document.getElementById("WA_FilterImages_PreviewImage_Preview").style.outline = null;
		document.getElementById("WA_FilterImages_PreviewImage_FileName").style.color = null;
		document.getElementById("WA_FilterImages_Ribbon_ToggleFilterState").querySelector(".Ribbon_Item_Text").innerHTML = "Include item to filter list";
	}

	for (a = 0; a < document.querySelectorAll(".WA_FilterImages_FilteredImageList_List_Item").length; a++){
		document.querySelectorAll(".WA_FilterImages_FilteredImageList_List_Item")[a].style.outline = "none";
	}

	if(document.getElementById("WA_FilterImages_FilteredImageList_List_Item_" + DataID)){
		document.getElementById("WA_FilterImages_FilteredImageList_List_Item_" + DataID).style.outline = "solid var(--Accent-Color)";
	}
}

function WA_FilterImages_ChangePreviewSource_Previous(){
	var WA_CurrentlyAccessedImage_ChangedValue = parseInt(WA_CurrentlyAccessedImage) - 1;
	if (WA_CurrentlyAccessedImage_ChangedValue >= 0){
		WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage_ChangedValue);
	} else {
		var WA_CurrentlyAccessedImage_ChangedValue = WA_FileNameList_Images.length - 1;
		WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage_ChangedValue);
	}	
}

function WA_FilterImages_ChangePreviewSource_Next(){
	var WA_CurrentlyAccessedImage_ChangedValue = parseInt(WA_CurrentlyAccessedImage) + 1;
	if (WA_CurrentlyAccessedImage_ChangedValue < WA_FileNameList_Images.length){
		WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage_ChangedValue);
	} else {
		var WA_CurrentlyAccessedImage_ChangedValue = 0;
		WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage_ChangedValue);
	}	
}

function WA_FilterImages_ToggleFilterState(){
	if (WA_FileNameList_Images.length > 0){
		var WA_FilterImages_ToggleFilterState_ItemState = WA_FileNameList_Images_FilterState[WA_CurrentlyAccessedImage];
		if (WA_FilterImages_ToggleFilterState_ItemState == "Not included"){
			WA_FilterImages_ToggleFilterState_ItemState = "Included";
			WA_FileNameList_Images_FilterState[WA_CurrentlyAccessedImage] = WA_FilterImages_ToggleFilterState_ItemState;
			document.getElementById("WA_FilterImages_Ribbon_ToggleFilterState").querySelector(".Ribbon_Item_Text").innerHTML = "Remove item from filter list";
		} else if (WA_FilterImages_ToggleFilterState_ItemState == "Included"){
			WA_FilterImages_ToggleFilterState_ItemState = "Not included";
			WA_FileNameList_Images_FilterState[WA_CurrentlyAccessedImage] = WA_FilterImages_ToggleFilterState_ItemState;
			document.getElementById("WA_FilterImages_Ribbon_ToggleFilterState").querySelector(".Ribbon_Item_Text").innerHTML = "Include item to filter list";
		}
		WA_RefreshEditor_FilterImages_States();
		WA_RefreshEditor_FilterImages_FilteredList();
	}
}

function WA_FilterImages_RemoveUnfilteredItems(){
	if (WA_FileNameList_Images_Filtered.length > 0){
		document.getElementById("WA_ImportImages_ImageList_Input").value = "";
		for (a = 0; a < WA_FileNameList_Images_Filtered.length; a++){
			if(WA_FileNameList_Images_Filtered[a].includes("\n")){
				document.getElementById("WA_ImportImages_ImageList_Input").value += WA_FileNameList_Images_Filtered[a];
			} else {
				document.getElementById("WA_ImportImages_ImageList_Input").value += WA_FileNameList_Images_Filtered[a] + '\n';
			}
		}
		Radio_Select("ListType_FileNames");
		// document.getElementById('WA_FilterImages_ImageList_Settings_UsingFilePaths_Input').querySelector('.Toggle_Indicator').setAttribute('data-id', "Toggle_Deactivated");
		WA_ImportImages_ExtractFileNames();
		WA_FileNameList_Images_Filtered = [];
		//WA_FileNameList_Images_FilterState = [];
		WA_FileNameList_Images_Filtered_DataID = [];
		WA_RefreshEditor_FilterImages_FilteredList();
	}
}

function WA_RefreshEditor_FilterImages_States(){
	var WA_RefreshEditor_FilterImages_ImageListItems = document.querySelectorAll(".WA_FilterImages_ImageList_List_Item");
	for (a = 0; a < WA_RefreshEditor_FilterImages_ImageListItems.length; a++){
		if (WA_FileNameList_Images_FilterState[a] == "Included"){
			WA_RefreshEditor_FilterImages_ImageListItems[a].style.backgroundColor = "var(--BG-Color-Focus)";
		} else if (WA_FileNameList_Images_FilterState[a] == "Not included"){
			WA_RefreshEditor_FilterImages_ImageListItems[a].style.backgroundColor = null;
		}
	}

	if (WA_FileNameList_Images_FilterState[WA_CurrentlyAccessedImage] == "Included"){
		document.getElementById("WA_FilterImages_PreviewImage_Preview").style.outline = "solid var(--Accent-Color)";
		document.getElementById("WA_FilterImages_PreviewImage_FileName").style.color = "var(--Accent-Color)";
	} else {
		document.getElementById("WA_FilterImages_PreviewImage_Preview").style.outline = null;
		document.getElementById("WA_FilterImages_PreviewImage_FileName").style.color = null;
	}
}

var WA_FileNameList_Images_Filtered = [];
var WA_FileNameList_Images_Filtered_DataID = [];
function WA_RefreshEditor_FilterImages_FilteredList(){
	document.getElementById("WA_FilterImages_FilteredImageList_List").innerHTML = '';
	WA_FileNameList_Images_Filtered = [];
	WA_FileNameList_Images_Filtered_DataID = [];
	for (a = 0; a < WA_FileNameList_Images_FilterState.length; a++){
		if (WA_FileNameList_Images_FilterState[a] == "Included"){
			WA_FileNameList_Images_Filtered.push(WA_FileNameList_Images[a]);
			WA_FileNameList_Images_Filtered_DataID.push(a);
		}
	}
	for (a = 0; a < WA_FileNameList_Images_Filtered.length; a++){
		var WA_RefreshEditor_FilterImages_FilteredList_Item = document.createElement('div');
		WA_RefreshEditor_FilterImages_FilteredList_Item.className = "WA_FilterImages_FilteredImageList_List_Item";
		WA_RefreshEditor_FilterImages_FilteredList_Item.innerHTML = WA_FileNameList_Images_Filtered[a];
		WA_RefreshEditor_FilterImages_FilteredList_Item.setAttribute('id', "WA_FilterImages_FilteredImageList_List_Item_" + WA_FileNameList_Images_Filtered_DataID[a]);
		WA_RefreshEditor_FilterImages_FilteredList_Item.setAttribute('data-id', WA_FileNameList_Images_Filtered_DataID[a]);
		WA_RefreshEditor_FilterImages_FilteredList_Item.setAttribute("onclick", "WA_FilterImages_ChangePreviewSource(this.getAttribute('data-id'))");
		document.getElementById("WA_FilterImages_FilteredImageList_List").appendChild(WA_RefreshEditor_FilterImages_FilteredList_Item);
	}

	if (WA_FileNameList_Images_Filtered.length > 0){
		document.getElementById("WA_FilterImages_FilteredImageList_EmptyListIndicator").style.display = "none";
	} else {
		document.getElementById("WA_FilterImages_FilteredImageList_EmptyListIndicator").style.display = "block";
	}

	WA_FilterImages_ChangePreviewSource(WA_CurrentlyAccessedImage);
}

function WA_ImportImage_Generate_ImageList_ApplyWatermark(){
	if (WA_FileNameList_Images.length > 0){
		document.getElementById("WA_ApplyWatermark_FileList_List").innerHTML = "";
		for (a = 0; a < WA_FileNameList_Images.length; a++){
			var WA_ApplyWatermark_FileList_List_Item = document.createElement('p');
			WA_ApplyWatermark_FileList_List_Item.innerHTML = WA_FileNameList_Images[a];
			WA_ApplyWatermark_FileList_List_Item.className = "WA_ApplyWatermark_FileList_List_Item";
			WA_ApplyWatermark_FileList_List_Item.setAttribute('id', 'WA_ApplyWatermark_FileList_List_Item_' + a);
			WA_ApplyWatermark_FileList_List_Item.setAttribute('data-id', a);
			WA_ApplyWatermark_FileList_List_Item.setAttribute('onclick', 'WA_ApplyWatermark_ChangeSource_Image(this.getAttribute("data-id"))');
			document.getElementById("WA_ApplyWatermark_FileList_List").appendChild(WA_ApplyWatermark_FileList_List_Item);
		}
		document.getElementById("WA_ApplyWatermark_Information_Controls_Text").innerHTML = (parseInt(WA_CurrentlyAccessedImage) + 1) + " / " +  WA_FileNameList_Images.length;
	}
}

function WA_ApplyWatermark_ChangeSource_Image(DataID){
	console.log("Loading");
	if (document.getElementById("WA_FilterImages_ImageList_Settings_ListType").getAttribute("Radio_ActiveButton") != "ListType_GDriveLinks" && document.getElementById("WA_FilterImages_ImageList_Settings_ListType").getAttribute("Radio_ActiveButton") != "ListType_FileUpload"){
		document.getElementById("WA_ApplyWatermark_Image").src = "Assets/Images/" + WA_FileNameList_Images[DataID];
	} else {
		document.getElementById("WA_ApplyWatermark_Image").src = WA_FileNameList_Images[DataID];
	}
	
	document.getElementById("WA_ApplyWatermark_Information_FileName").innerHTML = WA_FileNameList_Images[DataID];
	WA_CurrentlyAccessedImage = DataID;
	document.getElementById("WA_ApplyWatermark_Information_Controls_Text").innerHTML = (parseInt(WA_CurrentlyAccessedImage) + 1) + " / " +  WA_FileNameList_Images.length;
	for (a = 0; a < document.querySelectorAll(".WA_ApplyWatermark_FileList_List_Item").length; a++){
		document.querySelectorAll(".WA_ApplyWatermark_FileList_List_Item")[a].style.outline = null;
	}
	document.getElementById("WA_ApplyWatermark_FileList_List_Item_" + DataID).style.outline = "solid var(--Accent-Color-Focus)";
	WA_Canvas_ChangeSize();
}

function WA_ApplyWatermark_ChangeSource_Image_Previous(){
	if (WA_FileNameList_Images.length > 0){
		var WA_CurrentlyAccessedImage_ChangedValue = parseInt(WA_CurrentlyAccessedImage) - 1;
		if (WA_CurrentlyAccessedImage_ChangedValue > -1){
			WA_ApplyWatermark_ChangeSource_Image(WA_CurrentlyAccessedImage_ChangedValue);
		} else {
			WA_CurrentlyAccessedImage_ChangedValue = parseInt(WA_FileNameList_Images.length) - 1;
			WA_ApplyWatermark_ChangeSource_Image(WA_CurrentlyAccessedImage_ChangedValue);
		}
	}
}

function WA_ApplyWatermark_ChangeSource_Image_Next(){
	if (WA_FileNameList_Images.length > 0){
		var WA_CurrentlyAccessedImage_ChangedValue = parseInt(WA_CurrentlyAccessedImage) + 1;
		if (WA_CurrentlyAccessedImage_ChangedValue < (parseInt(WA_FileNameList_Images.length))){
			WA_ApplyWatermark_ChangeSource_Image(WA_CurrentlyAccessedImage_ChangedValue);
		} else {
			WA_CurrentlyAccessedImage_ChangedValue = 0;
			WA_ApplyWatermark_ChangeSource_Image(WA_CurrentlyAccessedImage_ChangedValue);
		}
	}
}

var WA_ApplyWatermark_Settings_ResolutionScale = 1;
var WA_ApplyWatermark_Settings_ImageOffset_Vertical;
var WA_ApplyWatermark_Settings_ImageOffset_Horizontal;
var WA_ApplyWatermark_Settings_ImageScale;
var WA_ApplyWatermark_Settings_ImageBrightness;
var WA_ApplyWatermark_Settings_ImageContrast;
var WA_ApplyWatermark_Settings_WatermarkPosition_Top;
var WA_ApplyWatermark_Settings_WatermarkPosition_Bottom;
var WA_ApplyWatermark_Settings_WatermarkPosition_Left;
var WA_ApplyWatermark_Settings_WatermarkPosition_Right;
var WA_ApplyWatermark_Settings_WatermarkSize_Width;
var WA_ApplyWatermark_Settings_WatermarkSize_Height;
var WA_ApplyWatermark_Settings_WatermarkOpacity;
function WA_ApplyWatermark_Settings_ApplyChanges(){
	if (document.getElementById("WA_ApplyWatermark_Settings_ResolutionScale_Input").value != null){
		WA_ApplyWatermark_Settings_ResolutionScale = document.getElementById("WA_ApplyWatermark_Settings_ResolutionScale_Input").value;
	}

	if(document.getElementById("WA_ApplyWatermark_Settings_EnablePreviewGridlines_Input").querySelector(".Toggle_Indicator").getAttribute("data-id") == "Toggle_Activated"){
		// TBA
	}
	/* Image settings */
	WA_ApplyWatermark_Settings_ImageOffset_Vertical = document.getElementById("WA_ApplyWatermark_Settings_ImageOffset_Input_Vertical").value;
	WA_ApplyWatermark_Settings_ImageOffset_Horizontal = document.getElementById("WA_ApplyWatermark_Settings_ImageOffset_Input_Horizontal").value;
	WA_ApplyWatermark_Settings_ImageScale = document.getElementById("WA_ApplyWatermark_Settings_ImageScale_Input").value;
	WA_ApplyWatermark_Settings_ImageBrightness = document.getElementById("WA_ApplyWatermark_Settings_ImageBrightness_Input").value;
	WA_ApplyWatermark_Settings_ImageContrast = document.getElementById("WA_ApplyWatermark_Settings_ImageContrast_Input").value;
	document.getElementById("WA_ApplyWatermark_Image").style.transform = null;
	if (WA_ApplyWatermark_Settings_ImageOffset_Vertical != null){
		document.getElementById("WA_ApplyWatermark_Image").style.transform = "translateY(" + WA_ApplyWatermark_Settings_ImageOffset_Vertical + ")";
	}
	if (WA_ApplyWatermark_Settings_ImageOffset_Horizontal != null){
		document.getElementById("WA_ApplyWatermark_Image").style.transform += "translateX(" + WA_ApplyWatermark_Settings_ImageOffset_Horizontal + ")";
	}
	if (WA_ApplyWatermark_Settings_ImageScale != null){
		document.getElementById("WA_ApplyWatermark_Image").style.transform += "scale(" + WA_ApplyWatermark_Settings_ImageScale + ")";
	}
	document.getElementById("WA_ApplyWatermark_Image").style.filter = null;
	if (WA_ApplyWatermark_Settings_ImageBrightness != null){
		document.getElementById("WA_ApplyWatermark_Image").style.filter = "brightness(" + WA_ApplyWatermark_Settings_ImageBrightness + ")";
	}
	if (WA_ApplyWatermark_Settings_ImageContrast != null){
		document.getElementById("WA_ApplyWatermark_Image").style.filter += "contrast(" + WA_ApplyWatermark_Settings_ImageContrast + ")";
	}

	/* Watermark settings */
	WA_ApplyWatermark_Settings_WatermarkPosition_Top = document.getElementById("WA_ApplyWatermark_Settings_WatermarkPosition_Input_Top").value;
	WA_ApplyWatermark_Settings_WatermarkPosition_Bottom = document.getElementById("WA_ApplyWatermark_Settings_WatermarkPosition_Input_Bottom").value;
	WA_ApplyWatermark_Settings_WatermarkPosition_Left = document.getElementById("WA_ApplyWatermark_Settings_WatermarkPosition_Input_Left").value;
	WA_ApplyWatermark_Settings_WatermarkPosition_Right = document.getElementById("WA_ApplyWatermark_Settings_WatermarkPosition_Input_Right").value;
	if (WA_ApplyWatermark_Settings_WatermarkPosition_Top != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.top = WA_ApplyWatermark_Settings_WatermarkPosition_Top;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.top = null;
	}
	if (WA_ApplyWatermark_Settings_WatermarkPosition_Bottom != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.bottom = WA_ApplyWatermark_Settings_WatermarkPosition_Bottom;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.bottom = null;
	}
	if (WA_ApplyWatermark_Settings_WatermarkPosition_Left != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.left = WA_ApplyWatermark_Settings_WatermarkPosition_Left;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.left = null;
	}
	if (WA_ApplyWatermark_Settings_WatermarkPosition_Right != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.right = WA_ApplyWatermark_Settings_WatermarkPosition_Right;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.right = null;
	}
	WA_ApplyWatermark_Settings_WatermarkSize_Width = document.getElementById("WA_ApplyWatermark_Settings_WatermarkWidth_Input").value;
	WA_ApplyWatermark_Settings_WatermarkSize_Height = document.getElementById("WA_ApplyWatermark_Settings_WatermarkHeight_Input").value;
	if (WA_ApplyWatermark_Settings_WatermarkSize_Width != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.width = WA_ApplyWatermark_Settings_WatermarkSize_Width;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.width = null;
	}
	if (WA_ApplyWatermark_Settings_WatermarkSize_Height != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.height = WA_ApplyWatermark_Settings_WatermarkSize_Height;
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.height = null;
	}
	WA_ApplyWatermark_Settings_WatermarkOpacity = document.getElementById("WA_ApplyWatermark_Settings_WatermarkOpacity_Input").value;
	if (WA_ApplyWatermark_Settings_WatermarkOpacity != null){
		document.getElementById("WA_ApplyWatermark_Watermark").style.opacity = WA_ApplyWatermark_Settings_WatermarkOpacity + "%";
	} else {
		document.getElementById("WA_ApplyWatermark_Watermark").style.opacity = null;
	}
}

function WA_ApplyWatermark_Change_Image(){
	var WA_ApplyWatermark_Change_Image_FileName = document.getElementById("WA_Change_Image_Input").value;
	if (WA_ApplyWatermark_Change_Image_FileName != ""){
		document.getElementById("WA_ApplyWatermark_Image").src = "Assets/Images/" + WA_ApplyWatermark_Change_Image_FileName;
		document.getElementById("WA_ApplyWatermark_Information_FileName").innerHTML = WA_ApplyWatermark_Change_Image_FileName;
	}
}

function WA_ApplyWatermark_Change_Watermark(){
	var WA_ApplyWatermark_Change_Watermark_FileName = document.getElementById("WA_Change_Watermark_Input").value;
	if (WA_ApplyWatermark_Change_Watermark_FileName != ""){
		document.getElementById("WA_ApplyWatermark_Watermark").src = "Assets/Watermarks/" + WA_ApplyWatermark_Change_Watermark_FileName;
	}
}

var WA_BatchProcessing_Status = 0; //0 - Free, 1 - Process Ongoing
async function WA_BatchProcessing_Start(){
	var WA_BatchProcessing_Progress_ProcessedCount = 0;
	var WA_BatchProcessing_Progress_TotalToBeProcessed = WA_FileNameList_Images.length;
	var WA_BatchProcessing_Progress_PercentComplete = (WA_BatchProcessing_Progress_ProcessedCount / WA_BatchProcessing_Progress_TotalToBeProcessed) * 100;
	
	if (WA_FileNameList_Images.length > 0){
		WA_BatchProcessing_Status = 1;
		Tabs_ChangeTab("ApplyWatermark");
		Subwindows_Open("BatchProcessing_Ongoing");
		WA_BatchProcessing_Report_CreateItem("Started", "Processing job started")
		await WA_BatchProcessing_ProcessImage(0);
	}

	async function WA_BatchProcessing_ProcessImage(WA_BatchProcessing_CurrentlyAccessedImage){
		if (WA_BatchProcessing_Status = 1){
			WA_BatchProcessing_Progress_ProcessedCount++;
			WA_BatchProcessing_Progress_PercentComplete = Math.round((WA_BatchProcessing_Progress_ProcessedCount / WA_BatchProcessing_Progress_TotalToBeProcessed) * 100);
			document.getElementById("WA_BatchProcessing_Progress_Text").innerHTML = WA_BatchProcessing_Progress_ProcessedCount + " / " + WA_BatchProcessing_Progress_TotalToBeProcessed + " images finished (" + WA_BatchProcessing_Progress_PercentComplete + "%)";
			document.getElementById("WA_BatchProcessing_Progress_Bar").style.width = WA_BatchProcessing_Progress_PercentComplete + "%";
			console.log("Processing image " + WA_BatchProcessing_Progress_ProcessedCount + " / " + WA_BatchProcessing_Progress_TotalToBeProcessed + " (" + WA_BatchProcessing_Progress_PercentComplete + "%)");
			WA_BatchProcessing_Report_CreateItem("Ongoing", "Processing image " + WA_BatchProcessing_Progress_ProcessedCount + " / " + WA_BatchProcessing_Progress_TotalToBeProcessed + " (" + WA_BatchProcessing_Progress_PercentComplete + "%)");

			WA_ApplyWatermark_ChangeSource_Image(WA_BatchProcessing_CurrentlyAccessedImage);
			WA_Canvas_ChangeSize();
			WA_ApplyWatermark();
			
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (WA_BatchProcessing_Progress_ProcessedCount < WA_BatchProcessing_Progress_TotalToBeProcessed && WA_BatchProcessing_Status == 1){
				WA_BatchProcessing_Report_CreateItem("Completed", "Processing completed");
				await WA_BatchProcessing_ProcessImage(WA_BatchProcessing_Progress_ProcessedCount);
			} else {
				WA_BatchProcessing_CompleteJob(WA_BatchProcessing_Progress_ProcessedCount);
				WA_BatchProcessing_Status = 0;
				WA_BatchProcessing_Report_CreateItem("Finished", "Processing job finished");
			}
		}
	}
	
}

function WA_BatchProcessing_Report_CreateItem(Type, Message){
	var WA_BatchProcessing_Report_CreateItem_Element = document.createElement('p');
	switch (Type){
		case "Started":
			WA_BatchProcessing_Report_CreateItem_Element.setAttribute("data-id", "Started");
			break;
		case "Ongoing":
			WA_BatchProcessing_Report_CreateItem_Element.setAttribute("data-id", "Ongoing");
			break;
		case "Completed":
			WA_BatchProcessing_Report_CreateItem_Element.setAttribute("data-id", "Completed");
			break;
		case "Cancelled":
			WA_BatchProcessing_Report_CreateItem_Element.setAttribute("data-id", "Cancelled");
			break;
		case "Finished":
			WA_BatchProcessing_Report_CreateItem_Element.setAttribute("data-id", "Finished");
			break;
	}
	WA_BatchProcessing_Report_CreateItem_Element.className = "WA_BatchProcessing_List_Report_Item";
	WA_BatchProcessing_Report_CreateItem_Element.innerHTML = Message;
	document.getElementById("WA_BatchProcessing_List_Report").appendChild(WA_BatchProcessing_Report_CreateItem_Element);
}

function WA_BatchProcessing_CompleteJob(WA_BatchProcessing_Progress_ProcessedCount){
	WA_BatchProcessing_Status = 0;
	Subwindows_Close("BatchProcessing_Ongoing");
	setTimeout(Subwindows_Open("BatchProcessing_Complete"), 5000);
	document.getElementById("WA_BatchProcessing_Completion_Text").innerHTML = "All " + WA_BatchProcessing_Progress_ProcessedCount + " images have been processed successfully."
}

function WA_ImportImage_Generate_ImageList_BatchProcessing(){
	if (WA_FileNameList_Images.length > 0){
		document.getElementById("WA_BatchProcessing_List_Files").innerHTML = "";
		for (a = 0; a < WA_FileNameList_Images.length; a++){
			var WA_BatchProcessing_FileList_List_Item = document.createElement('p');
			WA_BatchProcessing_FileList_List_Item.innerHTML = WA_FileNameList_Images[a];
			WA_BatchProcessing_FileList_List_Item.className = "WA_BatchProcessing_List_Item";
			WA_BatchProcessing_FileList_List_Item.setAttribute('id', 'WA_BatchProcessing_List_Item_' + a);
			WA_BatchProcessing_FileList_List_Item.setAttribute('data-id', a);
			document.getElementById("WA_BatchProcessing_List_Files").appendChild(WA_BatchProcessing_FileList_List_Item);
		}
	}
}

function WA_Settings_ChangeTab(Tab){
	document.getElementById("WA_ApplyWatermark_Settings_Tab_Output").style.display = "none";
	document.getElementById("WA_ApplyWatermark_Settings_Tab_Image").style.display = "none";
	document.getElementById("WA_ApplyWatermark_Settings_Tab_Watermark").style.display = "none";

	document.getElementById("WA_ApplyWatermark_Settings_Tab_" + Tab).style.display = "block";
}

// let Images = [];
function loadImages() {
	WA_FileNameList_LinkMode = "NoPath";
	const input = document.getElementById('file-input');
	const files = input.files;
	const photoGrid = document.getElementById('photo-grid');

	// Clear previous images
	photoGrid.innerHTML = '';

	// Loop through each selected file
	for (const file of files) {
		const reader = new FileReader();

		reader.onload = function(e) {
			// const img = document.createElement('img');
			WA_FileNameList_Images.push(e.target.result);
			// img.src = e.target.result;
			// photoGrid.appendChild(img);
		};

		reader.readAsDataURL(file);
	}
	// WA_ImportImages_Generate_ImageList_FilterImages();
}

function loadWatermarks() {
	const input = document.getElementById('file-input2');
	const files = input.files;
	// const photoGrid = document.getElementById('photo-grid');

	// Clear previous images
	// photoGrid.innerHTML = '';

	// Loop through each selected file
	for (const file of files) {
		const reader = new FileReader();

		reader.onload = function(e) {
			// const img = document.createElement('img');
			// WA_FileNameList_Images.push(e.target.result);
			document.getElementById("WA_ApplyWatermark_Watermark").src = e.target.result;
			// photoGrid.appendChild(img);
		};

		reader.readAsDataURL(file);
	}
	// WA_ImportImages_Generate_ImageList_FilterImages();
}