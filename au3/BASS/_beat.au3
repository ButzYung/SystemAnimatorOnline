#AutoIt3Wrapper_UseX64=n
#include "Bass.au3"
#include "BassFX.au3"
#include "urlencode.au3"
#include <Array.au3>

_BASS_Startup()
___DeBug(@error, "load bass.dll")

_BASS_FX_Startup()
___DeBug(@error, "load bassfx.dll")


_BASS_Init(0)
___DeBug(@error, "bass init")


;$sFile = FileOpenDialog("Open...", "..\audiofiles", "playable formats (*.MP3;*.MP2;*.MP1;*.OGG;*.WAV;*.AIFF;*.AIF)")
;___Debug($sFile = "", $sFile)


Dim $sFile, $temp_filename, $bpm
If $CmdLine[0] < 3 Then
  $sFile = "C:\CD\Music\Anime\Touhou\Lovelight\01 Lovelight.mp3";"C:\CD\Music\Yanni\Yanni MP3\Yanni Live 2006 - For All Seasons.mp3"
  $temp_filename = "12345"
  $bpm = 128.01;130.16
Else
  $sFile = _UnicodeURLDecode($CmdLine[1])
;  MsgBox(0, "", $sFile)
  $temp_filename = $CmdLine[2]
  $bpm = Number($CmdLine[3])
EndIf


$hStream = _BASS_StreamCreateFile(False, $sFile, 0, 0, $BASS_STREAM_DECODE)
___DeBug(@error, "create decoding stream")

$iBytes = _BASS_ChannelGetLength($hStream, $BASS_POS_BYTE)
___DeBug(@error, "channel get length")

$iLength = _BASS_ChannelBytes2Seconds($hStream, $iBytes)
___DeBug(@error, "bytes to seconds")


Dim $t_index_max = Int($iLength/60)
Dim $beats[$t_index_max+1], $beats_temp[$t_index_max+1], $beats_all[1]
For $i = 0 To $t_index_max
   $beats[$i] = 0
   
   Local $_array[1] = [0]
   $beats_temp[$i] = $_array
Next


_BASS_FX_BPM_BeatDecodeGet($hStream, 0, $iLength, 0, "_BPMBEATPROC", 0)
___DeBug(@error, "set BPM Beat callback")


Func _BPMBEATPROC($handle, $pos, $user)
  ToolTip(Round($pos * 100 / $iLength) & "% done")

  _ArrayAdd($beats_temp[Int($pos/60)], $pos)
  _ArrayAdd($beats_all, $pos)
EndFunc   ;==>_BPMBEATPROC


$second_per_beat = 60/$bpm
For $i = 0 To $t_index_max
   Local $_beats = $beats_temp[$i]
   Local $b_max = UBound($_beats)
   
   If $b_max-1 < $bpm/5 Then ContinueLoop
   
   Local $_beats_for_compare = $beats_all
   Local $b_compare_max = UBound($_beats_for_compare)

   Local $b_count_max = Int($b_max/5)
   Local $b_index = 0
   For $j = 1 To $b_max-1
	  Local $beat = $_beats[$j], $b_count = 0
	  For $k = 1 To $b_compare_max-1
		 Local $beat_diff = Abs($beat - $_beats_for_compare[$k]) / $second_per_beat
		 $beat_diff = $beat_diff - Int($beat_diff)
		 If $beat_diff < 0.05 Then
			$b_count += 1
		 EndIf
	  Next

	  If $b_count > $b_count_max Then
		 $b_count_max = $b_count
		 $b_index = $j
	  EndIf
   Next
   
   ;MsgBox(0, "", Round($_beats[$b_index],2) & ":" & Int($b_count_max/($b_compare_max-1)*100) & "%")
   $beats[$i] = $_beats[$b_index]
Next


$file = FileOpen(@TempDir & "\_bpm_" & $temp_filename & ".txt", 2)
FileWrite($file, "[" & _ArrayToString($beats, ",") & "]")
FileClose($file)


_BASS_StreamFree($hStream)
___DeBug(@error, "free stream")
_BASS_Free()
___DeBug(@error, "free bass")


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