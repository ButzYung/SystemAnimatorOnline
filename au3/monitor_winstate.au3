; check active window state

#include <Misc.au3>
$hDLL = DllOpen("user32.dll")

;#include <WinAPI.au3>
;$hDesktop = _WinAPI_GetDesktopWindow()

$hTimer = TimerInit()

While TimerDiff($hTimer) < 5000
  Local $txt = ConsoleRead()

;   If @error Then ExitLoop
  If StringRegExp($txt, "KILL") Then
	 ExitLoop
  ElseIf $txt <> "" Then
	 $hTimer = TimerInit()
  EndIf

  Local $msg = "NORMAL"
  Local $list_last_index
; https://www.autoitscript.com/forum/topic/127063-how-to-detect-that-switching-to-fullscreen-is-done/
; Resolution might be changed so check each time
  Local $iW = @DesktopWidth
  Local $iH = @DesktopHeight

; Get GUI size
  Local $aPos = WinGetPos("[ACTIVE]")

; Does the active GUI fill the screen
  If $aPos[2] >= $iW And $aPos[3] >= $iH And Not StringRegExp(WinGetText("[ACTIVE]"), "^\W+$|FolderView") Then
    $msg = "FULLSCREEN" & "," & WinGetText("[ACTIVE]")
  Else
;    Local $list[2][2]
;    $list[1][1] = "[ACTIVE]"
;    $list_last_index = 1

    Local $list = WinList("[REGEXPCLASS:^(?!ApplicationFrameWindow)]")
    $list_last_index = $list[0][0]

    For $i=1 To $list_last_index
      Local $hwnd = $list[$i][1]
      If BitAND(WinGetState($hwnd), 32) Then;And Not StringRegExp($list[$i][0], "^\d+\W*$") Then
        $msg = "MAXIMIZE|" & $list[$i][0] & "|" & $hwnd
        ExitLoop
      EndIf
    Next
  EndIf

  If $msg <> "NORMAL" Then
	 ConsoleWrite($msg & "|" & $list_last_index)
	 Sleep(1000)
	 ContinueLoop
  EndIf

;ConsoleWrite($msg & "|" & $list_last_index)
;Sleep(1000)
;ContinueLoop

  For $i=1 To 10
	 Local $mouse_key = ""
	 If _IsPressed("1", $hDLL) Then $mouse_key = "1"
	 If _IsPressed("2", $hDLL) Then $mouse_key = "2"
	 If _IsPressed("4", $hDLL) Then $mouse_key = "4"
	 ConsoleWrite($msg & "|" & $list_last_index & "|" & $mouse_key)
	 Sleep(100)
  Next
WEnd

DllClose($hDLL)