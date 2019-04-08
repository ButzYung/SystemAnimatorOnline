#include <Array.au3>
#Include <WinAPI.au3>
   
   Local $list = WinList()
   Local $list_length = $list[0][0]
   Local $_title[1]
   For $i = 1 to $list_length Step 1
	  Local $_text = $list[$i][0] & '/' & _WinAPI_GetClassName($list[$i][1])
	  _ArrayAdd($_title, $_text)
   Next
   MsgBox(0, "", _ArrayToString($_title, ","))
