#include <Date.au3>
#include <Misc.au3>
#include <Winamp_Library.au3>

#include <Array.au3>

#include "urlencode.au3"

;_Singleton("_winamp")

$interval = 50
;$SA_check_count = 0, $temp_path = @TempDir & "\_SA_winamp.txt"

;OnAutoItExitRegister("OnExit")
;Opt("WinSearchChildren", 1)

$hTimer = TimerInit()

While TimerDiff($hTimer) < 5000
   Local $txt = ConsoleRead()

   If StringRegExp($txt, "KILL") Then
	  ExitLoop
   ElseIf $txt <> "" Then
	  $hTimer = TimerInit()
   EndIf

   Local $play_state = _Winamp_GetCurrentTrackPlayStatus()

   If $play_state < 1 Then
	  ConsoleWrite("{}")
	  Sleep($interval)
	  ContinueLoop
   EndIf

;WebKit requires the info file to be written in 2+256 mode (unicode). To make this work in IE, the string has to be converted to a URL-friendly one.
   Local $path = _UnicodeURLEncode(_Winamp_GetCurrentTrackFilePath())

   Local $pos  = _Winamp_GetCurrentTrackOutputTime()
   Local $time = _DateDiff('s', "1970/01/01 00:00:00", _Date_Time_SystemTimeToDateTimeStr(_Date_Time_GetSystemTime(), 1)) * 1000 + @MSEC

   Local $playing = "false"
   If $play_state = 1 Then
	  $playing = "true"
   EndIf

   Local $JSON = "{" & ('"time":' & $time) & (',"path":"' & StringReplace($path, "\", "\\") & '"') & (',"pos":' & $pos) & (',"playing":' & $playing) & "}"
   ConsoleWrite($JSON)

   Sleep($interval)
WEnd
