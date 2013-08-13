
function clickLocation(e)
{
	 alert(e.rowData.id+":"+e.rowData.title);
}

$.idintruction.addEventListener('android:back', function(e) {
	$.idintruction.close();
});
$.idintruction.open();
