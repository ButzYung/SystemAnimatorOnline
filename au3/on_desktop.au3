#Include <WinAPI.au3>
#include <SendMessage.au3>

;https://www.codeproject.com/articles/856020/draw-behind-desktop-icons-in-windows
;https://github.com/Foohy/Wallpainter/blob/master/Wallpainter/WinAPI.cs
;https://www.autoitscript.com/forum/topic/156591-child-window-of-desktop-transparent/

;$CmdLine[0] ; Contains the total number of items in the array.
;$CmdLine[1] ; The first parameter.

If $CmdLine[0] = 0 Then
  MsgBox(0, "", "ERROR: window handle required")
  Exit
EndIf

If $CmdLine[0] = 1 Then
  $progman = WinGetHandle("[Class:Progman]")

  _SendMessage ( $progman, 0x052C, 0,0 )

  If @error Then
    MsgBox(0, "", "_SendMessage Error: " & @error)
    Exit
  EndIf

;$SHELLDLL_DefView =  WinGetHandle("[Class:SHELLDLL_DefView]");ControlGetHandle($progman,'','[CLASS:SHELLDLL_DefView; INSTANCE:1]')

  Local $hSHELLDLL_DefView, $hWorkerW
; Look through a list of WorkerW windows - one will be the Desktop on Windows 7+ O/S's
  $aWinList=WinList("[CLASS:WorkerW]")
  For $i=1 To $aWinList[0][0]
    $hSHELLDLL_DefView=ControlGetHandle($aWinList[$i][1],'','[CLASS:SHELLDLL_DefView; INSTANCE:1]')
    If $hSHELLDLL_DefView<>'' Then
      $hWorkerW = $aWinList[$i+1][1]
      ExitLoop
    EndIf
  Next

;MsgBox(0, "", $hWorkerW)

;  WinSetState($hWorkerW, "", @SW_HIDE)

;Local $hNotepad = WinGetHandle("[CLASS:Notepad]");"[REGEXPTITLE:_ie\.hta$]");

;MsgBox(0, "", Binary($CmdLine[1]))

;$origParent = DllCall("user32.dll", "int", "SetParent", "hwnd", $CmdLine[1], "hwnd", $progman)
  $origParent = _WinAPI_SetParent($CmdLine[1], $progman)

  ConsoleWrite($origParent)

;MsgBox(0, "", String($origParent))
Else

  _WinAPI_SetParent($CmdLine[1], $CmdLine[2])

EndIf