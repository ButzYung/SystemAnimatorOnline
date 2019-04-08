$title = WinGetTitle("[ACTIVE]")
$result = StringRegExp($title, 'System Animator|\.hta')
If $result = 1 Then
   ;MsgBox(0, "",  $title)
   $hWnd = WinGetHandle("[ACTIVE]")
   WinSetOnTop($hWnd, "", 1)
EndIf
