#AutoIt3Wrapper_UseX64=n
#include "Bass.au3"
#include "BassFX.au3"
#include "urlencode.au3"

_BASS_Startup()
___DeBug(@error, "load bass.dll")

_BASS_FX_Startup()
___DeBug(@error, "load bassfx.dll")


_BASS_Init(0)
___DeBug(@error, "bass init")


;$sFile = FileOpenDialog("Open...", "..\audiofiles", "playable formats (*.MP3;*.MP2;*.MP1;*.OGG;*.WAV;*.AIFF;*.AIF)")
;___Debug($sFile = "", $sFile)


Dim $sFile, $temp_filename
If $CmdLine[0] < 2 Then
  $sFile = "C:\CD\Music\Yanni\Yanni MP3\Yanni - Truth of Touch - Truth of Touch - Full Track HD.mp3"
  $temp_filename = "12345"
Else
  $sFile = _UnicodeURLDecode($CmdLine[1])
  ;MsgBox(0, "", $sFile)
  $temp_filename = $CmdLine[2]
EndIf


$hStream = _BASS_StreamCreateFile(False, $sFile, 0, 0, $BASS_STREAM_DECODE)
___DeBug(@error, "create decoding stream")

$iBytes = _BASS_ChannelGetLength($hStream, $BASS_POS_BYTE)
___DeBug(@error, "channel get length")

$iLength = _BASS_ChannelBytes2Seconds($hStream, $iBytes)
___DeBug(@error, "bytes to seconds")


;BASS_FX_BPM_MULT2: If in use, then the detected BPM will be automatically multiplied by 2 if (BPM < minBPM*2) - recommended setting.
$fBPM = _BASS_FX_BPM_DecodeGet($hStream, 0, $iLength, 0, $BASS_FX_BPM_MULT2, "_BPMPROCESSPROC")
___DeBug(@error, "BPM decode get (x2)")


$file = FileOpen(@TempDir & "\_bpm_" & $temp_filename & ".txt", 2)
FileWrite($file, $fBPM)
FileClose($file)

;MsgBox(0, "", $sFile & @CRLF & $fBPM & " Beats per Minutes detected")


_BASS_StreamFree($hStream)
___DeBug(@error, "free stream")
_BASS_Free()
___DeBug(@error, "free bass")

;MsgBox(0, "", _ID3ReadTag($sFile))
;_ID3SetTagField("TBPM", $fBPM)
;_ID3WriteTag($sFile)


Func _BPMPROCESSPROC($handle, $percent)
   ToolTip(Round($percent) & "% done")
EndFunc   ;==>_BPMPROCESSPROC


Func ___DeBug($iError, $sAction)
	Switch $iError
		Case -1
			ConsoleWrite(@CRLF & "-" & $sAction & @CRLF)
		Case -2
			ConsoleWrite(@CRLF & ">" & $sAction & @CRLF)
		Case 0
			ConsoleWrite(@CRLF & "+" & $sAction & " - OK" & @CRLF)
		Case Else
			ConsoleWrite(@CRLF & "!" & $sAction & " - FAILED, @error: " & $iError & @CRLF)
			Exit
	EndSwitch
EndFunc   ;==>___DeBug