#include <Date.au3>
#include <Misc.au3>
#include <Winamp_Library.au3>

#include <Array.au3>

#include "urlencode.au3"

_Singleton("_winamp")

Dim $interval = 100, $SA_check_count = 0, $temp_path = @TempDir & "\_SA_winamp.txt"

OnAutoItExitRegister("OnExit")
Opt("WinSearchChildren", 1)

While 1
   ;Local $begin = TimerInit()

   $SA_check_count += 1
   If $SA_check_count > 50 Then
  	  $SA_check_count = 0
	  
	  If Not (WinExists("[REGEXPTITLE:_ie\.hta$]") OR WinExists("[REGEXPTITLE:System Animator; REGEXPCLASS:Mozilla|Chrome_Widget]")) Then Exit
   EndIf

   Local $play_state = _Winamp_GetCurrentTrackPlayStatus()
   
   If $play_state < 1 Then
	  If FileExists($temp_path) Then
		 FileDelete($temp_path)
	  EndIf
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

   $file = FileOpen($temp_path, 2+256)
   FileWrite($file, $JSON)
   FileClose($file)

   ;Local $dif = TimerDiff($begin)
   ;MsgBox(0, "Time Difference", $dif)

   Sleep($interval)
WEnd

Func OnExit()
   If FileExists($temp_path) Then
	  FileDelete($temp_path)
   EndIf
EndFunc