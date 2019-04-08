#include-once

;Include Constants
#include "Bass.au3"
#include "BassFXConstants.au3"
#include <Misc.au3>

; #INDEX# =======================================================================================================================
; Title .........: BASSFX.au3
; Description ...: Wrapper of BassFX.DLL
; Author ........: Brett Francis (BrettF)
; ===============================================================================================================================

; #CURRENT# =====================================================================================================================
;			_BASS_FX_Startup()
;			_BASS_FX_TempoCreate()
;			_BASS_FX_TempoGetSource()
;			_BASS_FX_TempoGetRateRatio()
;			_BASS_FX_ReverseCreate()
;			_BASS_FX_ReverseGetSource()
;			_BASS_FX_BPM_DecodeGet()
;			_BASS_FX_BPM_CallbackSet()
;			_BASS_FX_BPM_CallbackReset()
;			_BASS_FX_BPM_Translate()
;			_BASS_FX_BPM_Free()
;			_BASS_FX_BPM_BeatCallbackSet()
;			_BASS_FX_BPM_BeatCallbackReset()
;			_BASS_FX_BPM_BeatDecodeGet()
;			_BASS_FX_BPM_BeatSetParameters()
;			_BASS_FX_BPM_BeatGetParameters()
;			_BASS_FX_BPM_BeatFree()
; ===============================================================================================================================

Global $_ghBassFXDll = -1
Global $BASS_FX_DLL_UDF_VER = "2.4.7.1"
Global $BASS_FX_UDF_VER = "10.0"

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_Startup
; Description ...: Starts up BassCD functions.
; Syntax ........: _BASS_FX_Startup($sBassFXDll = "")
; Parameters ....: -	$sBassFXDll	-	The relative path to Bass_FX.dll.
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR
;									@error will be set to-
;										- $BASS_ERR_DLL_NO_EXIST	-	File could not be found.
; Author ........: Prog@ndy
; Modified ......: Eukalyptus
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_Startup($sBassFXDll = "")
	If $_ghBassFXDll <> -1 Then Return True
	If Not $sBassFXDll Then $sBassFXDll = @ScriptDir & "\Bass_fx.dll"

	If Not FileExists($sBassFXDll) Then Return SetError($BASS_ERR_DLL_NO_EXIST, 0, False)

	Local $sBit = __BASS_LibraryGetArch($sBassFXDll)
	Select
		Case $sBit = "32" And @AutoItX64
			ConsoleWrite(@CRLF & "!Bass_fx.dll is for 32bit only!" & @CRLF & "Run/compile Script at 32bit" & @CRLF)
		Case $sBit = "64" And Not @AutoItX64
			ConsoleWrite(@CRLF & "!Bass_fx.dll is for 64bit only!" & @CRLF & "use 32bit version of Bass_fx.dll" & @CRLF)
	EndSelect

	If $BASS_STARTUP_VERSIONCHECK Then
		If Not @AutoItX64 And _VersionCompare(FileGetVersion($sBassFXDll), $BASS_FX_DLL_UDF_VER) <> 0 Then ConsoleWrite(@CRLF & "!This version of BASSFX.au3 is made for BassFX.dll V" & $BASS_FX_DLL_UDF_VER & ".  Please update" & @CRLF)
		If $BASS_FX_UDF_VER <> $BASS_UDF_VER Then ConsoleWrite("!This version of BASSFX.au3 (v" & $BASS_FX_UDF_VER & ") may not be compatible to BASS.au3 (v" & $BASS_UDF_VER & ")" & @CRLF)
	EndIf

	$_ghBassFXDll = DllOpen($sBassFXDll)
	Return $_ghBassFXDll <> -1
EndFunc   ;==>_BASS_FX_Startup

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_TempoCreate
; Description ...: Creates a resampling stream from a decoding channel.
; Syntax ........: _BASS_FX_TempoCreate($chan, $flags)
; Parameters ....: -	$chan	-	Stream/music/wma/cd/any other supported add-on format using a decoding channel
;					-	$flags	-	A combination of the following flags:
;						- $BASS_SAMPLE_LOOP
;							- Looped? Note that only complete sample loops are allowed by DirectSound (ie. you can't loop just
;							  part of a sample)
;						- $BASS_SAMPLE_SOFTWARE
;							- Force the sample to not use hardware mixing
;						- $BASS_SAMPLE_3D
;							- Use 3D functionality. This is ignored if BASS_DEVICE_3D wasn't specified when calling BASS_Init.
;							  3D samples must be mono (use BASS_SAMPLE_MONO)
;						- $BASS_SAMPLE_FX
;							- Requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8 effect
;							  implementations section for details. Use BASS_ChannelSetFX to add effects to the stream
;						- $BASS_STREAM_AUTOFREE
;							- Automatically free the stream's resources when it has reached the end, or when BASS_ChannelStop
;							  (or BASS_Stop) is called
;						- $BASS_STREAM_DECODE
;							- Decode the sample data, without outputting it. Use BASS_ChannelGetData to retrieve decoded sample
;							  data. BASS_SAMPLE_SOFTWARE/3D/FX/AUTOFREE are all ignored when using this flag, as are the SPEAKER flags
;						- $BASS_SPEAKER_xxx
;							- Speaker assignment flags
;						- $BASS_FX_FREESOURCE
;							- Free the source handle as well
; Return values .: Success      - Returns the Tempo stream handle
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											$chan is not valid
;										- $BASS_ERROR_FX_NODECODE
;											The chan is not a decoding channel. Make sure the chan was created using
;											BASS_STREAM_DECODE / BASS_MUSIC_DECODE flag
;										- $BASS_ERROR_FORMAT The chan's format is not supported. Make sure chan is Mono / Stereo
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......: Supported ONLY - mono / stereo - channels
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_TempoCreate($chan, $flags)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "dword", "BASS_FX_TempoCreate", "dword", $chan, "dword", $flags)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_TempoCreate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_TempoGetSource
; Description ...: Get the source channel handle.
; Syntax ........: _BASS_FX_TempoGetSource($chan)
; Parameters ....: -	$Chan
;						- Tempo stream (or source channel) handle
; Return values .: Success      - Returns the source channel handle
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											$chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_TempoGetSource($chan)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "dword", "BASS_FX_TempoGetSource", "dword", $chan)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_TempoGetSource

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_TempoGetRateRatio
; Description ...: Get the ratio of the resulting rate and source rate (the resampling ratio).
; Syntax ........: _BASS_FX_TempoGetRateRatio($chan)
; Parameters ....: -	$Chan
;						- Tempo stream (or source channel) handle
; Return values .: Success      - Returns the resampling ratio
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											$chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_TempoGetRateRatio($chan)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "float", "BASS_FX_TempoGetRateRatio", "dword", $chan)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_TempoGetRateRatio

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_ReverseCreate
; Description ...: Creates a reversed stream from a decoding channel.
; Syntax ........: _BASS_FX_ReverseCreate($chan, $dec_block, $flags)
; Parameters ....: -	$chan
;						- Stream/music/wma/cd/any other supported add-on format using a decoding channel
;					-	$dec_block
;						- Length of decoding blocks in seconds. Larger blocks means less seeking overhead but larger spikes
;					-	$flags
;						- A combination of the following flags:
;							-	$BASS_SAMPLE_LOOP
;								-	Looped? Note that only complete sample loops are allowed by DirectSound (ie. you can't
;									loop just part of a sample)
;							-	$BASS_SAMPLE_SOFTWARE
;								-	Force the sample to not use hardware mixing
;							-	$BASS_SAMPLE_3D
;								-	Use 3D functionality. This is ignored if BASS_DEVICE_3D wasn't specified when calling
;									BASS_Init. 3D samples must be mono (use BASS_SAMPLE_MONO)
;							-	$BASS_SAMPLE_FX
;								-	requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the
;									DX8 effect implementations section for details. Use BASS_ChannelSetFX to add effects to
;									the stream
;							-	$BASS_STREAM_AUTOFREE
;								-	Automatically free the stream's resources when it has reached the end, or when
;									BASS_ChannelStop (or BASS_Stop) is called
;							-	$BASS_STREAM_DECODE
;								-	Decode the sample data, without outputting it. Use BASS_ChannelGetData to retrieve decoded
;									sample data. BASS_SAMPLE_SOFTWARE/3D/FX/AUTOFREE are all ignored when using this flag, as
;									are the SPEAKER flags
;							-	$BASS_SPEAKER_xxx
;								-	Speaker assignment flags
;							-	$BASS_FX_FREESOURCE
;								-	Free the source handle as well
; Return values .: Success      - Returns the handle of the reversed stream
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											- chan is not valid
;										- $BASS_ERROR_FX_NODECODE
;											- The chan is not a decoding channel. Make sure the chan was created using BASS_STREAM_DECODE / BASS_MUSIC_DECODE flag
;										- $BASS_ERROR_ILLPARAM
;											- An illegal parameter was specified
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......: 	MODs are supported if BASS_MUSIC_PRESCAN flag was applied to a source handle. Enable reverse supported flags
;					in BASS_FX_ReverseCreate and the others to source handle. For better MP3/2/1 reverse playback create the
;					stream using the BASS_STREAM_PRESCAN flag.
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_ReverseCreate($chan, $dec_block, $flags)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "dword", "BASS_FX_ReverseCreate", "dword", $chan, "float", $dec_block, "dword", $flags)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_ReverseCreate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_ReverseGetSource
; Description ...: Get the source channel handle of the reversed stream.
; Syntax ........: _BASS_FX_ReverseGetSource($chan)
; Parameters ....: -	$chan
;						-	Reverse stream (or source channel) handle
; Return values .: Success      - Returns the handle of the source of the reversed stream
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											- chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_ReverseGetSource($chan)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "dword", "BASS_FX_ReverseGetSource", "dword", $chan)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_ReverseGetSource

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_DecodeGet
; Description ...: Get the original BPM of a decoding channel.
; Syntax ........: _BASS_FX_BPM_DecodeGet($chan, $startSec, $endSec, $minMaxBPM, $flags, $proc = 0)
; Parameters ....: -	$chan
;						-	Stream/music/wma/cd/any other supported add-on format using a decoding channel
;					-	$startSec
;						-	Start detecting position in seconds
;					-	$endSec
;						-	End detecting position in seconds
;					-	$minMaxBPM
;						-	Set min & max bpm, e.g: MAKELONG(LOWORD.HIWORD), LO=Min, HI=Max. 0 = defaults 45/230
;					-	$flags
;						-	Either
;							-	$BASS_FX_BPM_xxx
;							-	$BASS_FX_FREESOURCE
;					-	$proc
;						-	User defined function to receive the process in percents, use "" if not in use
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
;										- 	$BASS_ERROR_FX_NODECODE
;											-	The chan is not a decoding channel. Make sure the chan was created using
;												BASS_STREAM_DECODE / BASS_MUSIC_DECODE flag
;										- 	$BASS_ERROR_ILLPARAM
;											-	An illegal parameter was specified
;										- 	$BASS_ERROR_FX_BPMINUSE
;											-	BPM detection, for this chan, is in use
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: the callback handle is returned as @extended - use this value to free the callback with _BASS_FX_BPM_Free
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_DecodeGet($chan, $startSec, $endSec, $minMaxBPM, $flags, $proc = 0)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "none", "dword;float")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "float", "BASS_FX_BPM_DecodeGet", "dword", $chan, "double", $startSec, "double", $endSec, "dword", $minMaxBPM, "dword", $flags, "ptr", $proc)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, -1)
	EndIf
	Return SetError(0, $proc_s, $_BASSFX_ret_[0])
EndFunc   ;==>_BASS_FX_BPM_DecodeGet

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_CallbackSet
; Description ...: Enable getting BPM value by period of time in seconds.
; Syntax ........: _BASS_FX_BPM_CallbackSet($handle, $proc, $period, $minMaxBPM, $flags, $user)
; Parameters ....: -	$handle
;						- Stream/music/wma/cd/any other supported add-on format
;					-	$proc
;						-  User defined function to receive the bpm value
;					-	$period
;						-  Detection period in seconds
;					-	$minMaxBPM
;						-  Set min & max bpm, e.g: MAKELONG(LOWORD.HIWORD), LO=Min, HI=Max. 0 = defaults 45/230
;					-	$flags
;						-  Only BASS_FX_BPM_MULT2 flag is used
;					-	$user
;						-  User instance data to pass to the callback function
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
;										- 	$BASS_ERROR_ILLPARAM
;											-	An illegal parameter was specified
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: the callback handle is returned as @extended - use this value to free the callback with _BASS_FX_BPM_Free
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_CallbackSet($handle, $proc, $period, $minMaxBPM, $flags, $user)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "none", "dword;float;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_CallbackSet", "dword", $handle, "ptr", $proc, "double", $period, "dword", $minMaxBPM, "dword", $flags, "dword", $user)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetError(0, $proc_s, $_BASSFX_ret_[0])
EndFunc   ;==>_BASS_FX_BPM_CallbackSet

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_CallbackReset
; Description ...: Reset the buffers. Call this function after changing position.
; Syntax ........: _BASS_FX_BPM_CallbackReset($handle)
; Parameters ....: -	$Handle
;						-	 Stream/music/wma/cd/any other supported add-on format
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	handle is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_CallbackReset($handle)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_CallbackReset", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_CallbackReset

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_Translate
; Description ...: Translate the given BPM to FREQ/PERCENT and vice versa or multiply BPM by 2.
; Syntax ........: _BASS_FX_BPM_Translate($handle, $val2tran, $trans)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
;					-	$val2tran
;						-	Specify a value to translate to a given option (no matter if used X2)
;					-	$trans
;						-	Any of the following translation options:
;							-	$BASS_FX_BPM_TRAN_X2
;								-	multiply the original BPM value by 2. This may be used only once, and will change the
;									original BPM as well
;							-	$BASS_FX_BPM_TRAN_2FREQ
;								-	BPM value to Frequency
;							-	$BASS_FX_BPM_TRAN_FREQ2
;								-	Frequency to BPM value
;							-	$BASS_FX_BPM_TRAN_2PERCENT
;								-	BPM value to Percents
;							-	$BASS_FX_BPM_TRAN_PERCENT2
;								-	Percents to BPM value
; Return values .: Success      - Returns the newly calculated value is returned
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	handle is not valid
;										- 	$BASS_ERROR_ILLPARAM
;											-	An illegal parameter was specified
;										- 	$BASS_ERROR_ALREADY
;											-	$BASS_FX_BPM_TRAN_X2 already used on this handle
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_Translate($handle, $val2tran, $trans)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "float", "BASS_FX_BPM_Translate", "dword", $handle, "float", $val2tran, "dword", $trans)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_Translate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_Free
; Description ...: Frees all resources used by a given handle (decode or callback bpm).
; Syntax ........: _BASS_FX_BPM_Free($handle, $callback = 0)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
;                   -   $callback
;                       -   The callback handle as returned as @extended by a _BASS_FX_BPM_* function (if an AutoIt callback function was registered)
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	handle is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: 	If BASS_FX_FREESOURCE flag is used, this will free the source decoding channel as well. You can't set/get
;					this flag with BASS_ChannelFlags/BASS_ChannelGetInfo.
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_Free($handle, $callback = 0)
	If $callback Then DllCallbackFree($callback)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_Free", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_Free

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatCallbackSet
; Description ...: Enable getting Beat position in seconds in real-time.
; Syntax ........: _BASS_FX_BPM_BeatCallbackSet($handle, $proc, $user)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
;					-	$proc
;						-	User defined function to receive the beat position in seconds
;					-	$user
;						-	User instance data to pass to the callback function
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	handle is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: the callback handle is returned as @extended - use this value to free the callback with _BASS_FX_BPM_BeatFree
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatCallbackSet($handle, $proc, $user)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "none", "dword;double;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatCallbackSet", "dword", $handle, "ptr", $proc, "ptr", $user)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetError(0, $proc_s, $_BASSFX_ret_[0])
EndFunc   ;==>_BASS_FX_BPM_BeatCallbackSet

; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatCallbackReset
; Description ...: Reset the buffers. Call this function after changing position.
; Syntax ........: _BASS_FX_BPM_BeatCallbackReset($handle)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	handle is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: This function flushes the internal buffers of the Beat callback. Beat callback is automatically reset by
;				   BASS_ChannelSetPosition, except when called from a "mixtime" SYNCPROC .
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatCallbackReset($handle)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatCallbackReset", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_BeatCallbackReset

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatDecodeGet
; Description ...: Enable getting Beat position in seconds of the decoded channel using the callback function.
; Syntax ........: _BASS_FX_BPM_BeatDecodeGet($chan, $startSec, $endSec, $flags, $proc, $user)
; Parameters ....: -	$chan
;						-	Stream/music/wma/cd/any other supported add-on format using a decoding channel
;					-	$startSec
;						-	Start detecting position in seconds
;					-	$endSec
;						-	End detecting position in seconds
;					-	$flags
;						-	Either:
;							- 	$BASS_FX_BPM_BKGRND
;							-	$BASS_FX_FREESOURCE
;					-	$proc
;						-	User defined function to receive the beat position in seconds
;					-	$user
;						-	User instance data to pass to the callback function
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
;										- 	$BASS_ERROR_FX_NODECODE
;											-	The chan is not a decoding channel. Make sure the chan was created using
;												BASS_STREAM_DECODE / BASS_MUSIC_DECODE flag
;										- 	$BASS_ERROR_ILLPARAM
;											-	An illegal parameter was specified
;										- 	$BASS_ERROR_FX_BPMINUSE
;											-	Beat detection, for this chan, is in use
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: the callback handle is returned as @extended - use this value to free the callback with _BASS_FX_BPM_BeatFree
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatDecodeGet($chan, $startSec, $endSec, $flags, $proc, $user)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "none", "dword;double;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatDecodeGet", "dword", $chan, "double", $startSec, "double", $endSec, "dword", $flags, "ptr", $proc, "ptr", $user)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetError(0, $proc_s, $_BASSFX_ret_[0])
EndFunc   ;==>_BASS_FX_BPM_BeatDecodeGet

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatSetParameters
; Description ...: Set new values for beat detection.
; Syntax ........: _BASS_FX_BPM_BeatSetParameters($handle, $bandwidth, $centerfreq, $beat_rtime)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
;					-	$bandwidth (Default. 10Hz)
;						-	Bandwidth in Hz [0<..<rate/2] Hz
;							-	-1.0 = leave current
;					-	$centerfreq (Default. 90Hz)
;						-	Center frequency [0<..<rate/2] Hz
;							-	-1.0 = leave current
;					-	$beat_rtime (Default = 20ms)
;						-	Beat release time in ms
;							-	-1.0 = leave current
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatSetParameters($handle, $bandwidth, $centerfreq, $beat_rtime)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatSetParameters", "dword", $handle, "float", $bandwidth, "float", $centerfreq, "float", $beat_rtime)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_BeatSetParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatGetParameters
; Description ...: Get current beat values.
; Syntax ........: _BASS_FX_BPM_BeatGetParameters($handle)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
; Return values .: Success      - Returns array of Beat values:
;									-	[0] 	Bandwidth		Current bandwidth in Hz
;									-	[1] 	centerfreq		Current center frequency
;									-	[2] 	beat_rtime		Current center frequency
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatGetParameters($handle)
	Local $bandwidth, $centerfreq, $beat_rtime, $rArray[3]
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatGetParameters", "dword", $handle, "float*", $bandwidth, "float*", $centerfreq, "float*", $beat_rtime)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	;Set values modified by DllCall
	$rArray[0] = $_BASSFX_ret_[2] ; Bandwidth
	$rArray[1] = $_BASSFX_ret_[3] ; CenterFreq
	$rArray[2] = $_BASSFX_ret_[4] ; Beat_rtime
	Return $rArray
EndFunc   ;==>_BASS_FX_BPM_BeatGetParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FX_BPM_BeatFree
; Description ...: Frees all resources used by a given handle (decode or callback beat).
; Syntax ........: _BASS_FX_BPM_BeatFree($handle, $callback = 0)
; Parameters ....: -	$handle
;						-	Stream/music/wma/cd/any other supported add-on format
;                   -   $callback
;                       -   The callback handle as returned as @extended by a _BASS_FX_BPM_Beat* function (if an AutoIt callback function was registered)
; Return values .: Success      - Returns True
;                  Failure      - Returns False and sets @ERROR as set by _Bass_ErrorGetCode()
;									@error will be set to-
;										- 	$BASS_ERROR_HANDLE
;											-	chan is not valid
; Author ........: Brett Francis (BrettF)
; Modified ......: eukalyptus
; Remarks .......: If BASS_FX_FREESOURCE flag is used, this will free the source decoding channel as well. You can't set/get
;				   this flag with BASS_ChannelFlags/BASS_ChannelGetInfo.
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FX_BPM_BeatFree($handle, $callback = 0)
	If $callback Then DllCallbackFree($callback)
	Local $_BASSFX_ret_ = DllCall($_ghBassFXDll, "int", "BASS_FX_BPM_BeatFree", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $_BASSFX_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $_BASSFX_ret_[0]
EndFunc   ;==>_BASS_FX_BPM_BeatFree