#include <Array.au3>
;#Include <WinAPI.au3>

Dim $SA_list[1], $title_list[1]

Dim $SA_type[2] = ["[REGEXPTITLE:_ie\.hta$]", "[REGEXPTITLE:System Animator; REGEXPCLASS:Mozilla|Chrome_Widget]"]
For $i = 0 to 1 Step 1
   $SA = $SA_type[$i]
  
   If WinExists($SA) Then
	  Local $list = WinList($SA)
	
	  Local $list_length = $list[0][0]
	  For $j = 1 to $list_length Step 1
		 _ArrayAdd($title_list, $list[$j][0])
		 _ArrayAdd($SA_list, $list[$j][1])
	  Next
  EndIf
Next

$SA_length = UBound($SA_list)-1
  
If $SA_length > 0 Then
   ;MsgBox(0, "", _ArrayToString($title_list, ","))
   
   $program_manager = WinGetHandle("Program Manager")
   For $i = 1 to $SA_length Step 1
	  $handle = $SA_list[$i]
	  $origParent = DllCall("user32.dll", "int", "SetParent", "hwnd", $handle, "hwnd", $program_manager)
	  ;WinSetTitle($handle, "", $title_list[$i])
	  ;_WinAPI_ShowWindow($handle, @SW_SHOWNOACTIVATE)
	  ;$origParent2 = DllCall("user32.dll", "int", "SetParent", "hwnd", $handle, "hwnd",  $origParent[0])
   Next
EndIf