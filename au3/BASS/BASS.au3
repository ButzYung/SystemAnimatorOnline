#AutoIt3Wrapper_Au3Check_Parameters=-d -w 1 -w 2 -w 3 -w 4 -w 5 -w 6
#include-once

;Include Constants
#include "BassConstants.au3"
#include <Misc.au3>

; #INDEX# =======================================================================================================================
; Title .........: BASS.au3
; Description ...: Almost all of BASS.DLL translated ready for easy use with AutoIt
; Author ........: Brett Francis (BrettF)
;
; 				   Special thanks go to ProgAndy for modifing this version and correcting various functions.  His work is
;				   greatly apreciated!
; ===============================================================================================================================

; #CURRENT# =====================================================================================================================
;			_BASS_SetConfig()
;			_BASS_GetConfig()
;			_BASS_SetConfigPtr()
;			_BASS_GetConfigPtr()
;			_BASS_GetVersion()
;			_BASS_ErrorGetCode()
;			_BASS_GetDeviceInfo()
;			_BASS_Init()
;			_BASS_SetDevice()
;			_BASS_GetDevice()
;			_BASS_Free()
;			_BASS_GetDSoundObject()
;			_BASS_GetInfo()
;			_BASS_Update()
;			_BASS_GetCPU()
;			_BASS_Start()
;			_BASS_Stop()
;			_BASS_Pause()
;			_BASS_SetVolume()
;			_BASS_GetVolume()
;			_BASS_PluginLoad()
;			_BASS_PluginFree()
;			_Bass_PluginGetInfo_Sample()
;			_BASS_Set3DFactors()
;			_BASS_Get3DFactors()
;			_BASS_Set3DPosition()
;			_BASS_Get3DPosition()
;			_BASS_Apply3D()
;			_BASS_SetEAXParameters()
;			_BASS_GetEAXParameters()
;			_BASS_MusicLoad()
;			_BASS_MusicFree()
;			_BASS_SampleLoad()
;			_BASS_SampleCreate()
;			_BASS_SampleFree()
;			_BASS_SampleSetData()
;			_BASS_SampleGetData()
;			_BASS_SampleGetInfo()
;			_BASS_SampleSetInfo()
;			_BASS_SampleGetChannel()
;			_BASS_SampleGetChannels()
;			_BASS_SampleStop()
;			_BASS_Startup()
;			_BASS_StreamCreate()
;			_BASS_StreamCreateFile()
;           _BASS_StreamCreateFileUser()
;			_BASS_StreamCreateURL()
;			_BASS_StreamFree()
;			_BASS_StreamGetFilePosition()
;			_BASS_StreamPutData()
;			_BASS_StreamPutFileData()
;			_BASS_RecordGetDeviceInfo()
;			_BASS_RecordInit()
;			_BASS_RecordSetDevice()
;			_BASS_RecordGetDevice()
;			_BASS_RecordFree()
;			_BASS_RecordGetInfo()
;			_BASS_RecordGetInputName()
;			_BASS_RecordSetInput()
;			_BASS_RecordGetInput()
;			_BASS_RecordStart()
;			_BASS_ChannelBytes2Seconds()
;			_BASS_ChannelSeconds2Bytes()
;			_BASS_ChannelGetDevice()
;			_BASS_ChannelSetDevice()
;			_BASS_ChannelIsActive()
;			_BASS_ChannelGetInfo()
;			_BASS_ChannelGetTags()
;			_BASS_ChannelFlags()
;			_BASS_ChannelUpdate()
;			_BASS_ChannelLock()
;			_BASS_ChannelPlay()
;			_BASS_ChannelStop()
;			_BASS_ChannelPause()
;			_BASS_ChannelSetAttribute()
;			_BASS_ChannelGetAttribute()
;			_BASS_ChannelSlideAttribute()
;			_BASS_ChannelIsSliding()
;			_BASS_ChannelGet3DAttributes()
;			_BASS_ChannelSet3DAttributes()
;			_BASS_ChannelSet3DPosition()
;			_BASS_ChannelGet3DPosition()
;			_BASS_ChannelGetLength()
;			_BASS_ChannelSetPosition()
;			_BASS_ChannelGetPosition()
;			_BASS_ChannelGetLevel()
;			_BASS_ChannelGetData()
;			_BASS_ChannelSetLink()
;			_BASS_ChannelRemoveLink()
;			_BASS_ChannelSetFX()
;			_BASS_ChannelRemoveFX()
;			_BASS_SetEAXPreset()
;			_BASS_ChannelSetFX()
;			_BASS_ChannelRemoveFX()
;			_BASS_ChannelSetDSP()
;			_BASS_ChannelRemoveDSP()
;           _BASS_ChannelSetSync()
;           _BASS_ChannelRemoveSync()
;			_BASS_FXGetParameters()
;			_BASS_FXSetParameters()
;			_BASS_ChannelSetVolume()
;			_BASS_ChannelGetVolume
; ===============================================================================================================================

; #INTERNAL_USE_ONLY#============================================================================================================
;			_BASS_PtrStringLen()
;			_BASS_PtrStringRead()
;			_LoWord()
;			_LoWord()
; ===============================================================================================================================

; #INTERNAL_CONSTANTS#===========================================================================================================
;			These constants should only be used internally.
; ===============================================================================================================================
Global $_ghBassDll = -1
Global $_gbBASSULONGLONGFIXED = _VersionCompare(@AutoItVersion, "3.3.0.0") = 1
Global $BASS_DWORD_ERR = 4294967295
Global $BASS_DLL_UDF_VER = "2.4.8.1"
Global $BASS_UDF_VER = "10.0"
Global $BASS_ERR_DLL_NO_EXIST = -1

;Should be set to True if you wish to check the version of Bass.DLL with the version that the UDF is designed for.
Global $BASS_STARTUP_VERSIONCHECK = True

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Startup
; Description ...: Starts up BASS functions.
; Syntax ........: _BASS_Startup($sBassDLL = "")
; Parameters ....: -	$sBassDLL	-	The relative path to Bass.dll.
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
Func _BASS_Startup($sBassDLL = "")
	If $_ghBassDll <> -1 Then Return True
	If Not $sBassDLL Then $sBassDLL = @ScriptDir & "\bass.dll"

	If Not FileExists($sBassDLL) Then Return SetError($BASS_ERR_DLL_NO_EXIST, 0, False)

	Local $sBit = __BASS_LibraryGetArch($sBassDLL)
	Select
		Case $sBit = "32" And @AutoItX64
			ConsoleWrite(@CRLF & "!Bass.dll is for 32bit only!" & @CRLF & "Run/compile Script at 32bit" & @CRLF)
		Case $sBit = "64" And Not @AutoItX64
			ConsoleWrite(@CRLF & "!Bass.dll is for 64bit only!" & @CRLF & "use 32bit version of Bass.dll" & @CRLF)
	EndSelect

	If $BASS_STARTUP_VERSIONCHECK Then
		If Not @AutoItX64 And _VersionCompare(FileGetVersion($sBassDLL), $BASS_DLL_UDF_VER) = -1 Then ConsoleWrite(@CRLF & "!This version of BASS.au3 is made for Bass.dll V" & $BASS_DLL_UDF_VER & ".  Please update" & @CRLF)
	EndIf

	$_ghBassDll = DllOpen($sBassDLL)
	Return $_ghBassDll <> -1
EndFunc   ;==>_BASS_Startup

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetConfig
; Description ...: Sets the value of a config option.
; Syntax ........: _BASS_SetConfig($option, $value)
; Parameters ....: -	$option		-	One of the following...
;						-	$BASS_CONFIG_3DALGORITHM		-		The 3D algorithm for software mixed 3D channels.
;							- $value 	-	One of the following...
;								- $BASS_3DALG_DEFAULT
;									-	The default algorithm. With WDM drivers, if the user has selected a
;										surround sound speaker configuration (eg. 4 or 5.1) in the control
;										panel, the sound is panned among the available directional speakers.
;										Otherwise it equates to BASS_3DALG_OFF.
;								- $BASS_3DALG_OFF
;									-	Uses normal left and right panning. The vertical axis is ignored except
;										for scaling of volume due to distance. Doppler shift and volume scaling
;										are still applied, but the 3D filtering is not performed. This is the
;										most CPU efficient algorithm, but provides no virtual 3D audio effect.
;										Head Related Transfer Function processing will not be done. Since only
;										normal stereo panning is used, a channel using this algorithm may be
;										accelerated by a 2D hardware voice if no free 3D hardware voices are
;										available.
;								- $BASS_3DALG_FULL
;									-	This algorithm gives the highest quality 3D audio effect, but uses more
;										CPU. This algorithm requires WDM drivers, if it's not available then
;										BASS_3DALG_OFF will automatically be used instead.
;								- $BASS_3DALG_LIGHT
;									-	This algorithm gives a good 3D audio effect, and uses less CPU than the
;										FULL algorithm. This algorithm also requires WDM drivers, if it's not
;										available then BASS_3DALG_OFF will automatically be used instead.
;						-	$BASS_CONFIG_BUFFER				-		Playback buffer length.
;							- $value 	-	One of the following...
;								- Buffer Length in miliseconds.
;						-	$BASS_CONFIG_CURVE_PAN			-		Panning translation curve.
;							- $value 	-	One of the following...
;								- False = Linear
;								- True 	= Logarithmic
;						-	$BASS_CONFIG_CURVE_VOL			-		Volume translation curve.
;							- $value 	-	One of the following...
;								- False = Linear
;								- True 	= Logarithmic
;						-	$BASS_CONFIG_FLOATDSP			-		Pass 32-bit floating-point sample data to all DSP functions?
;							- $value 	-	One of the following...
;								- True	= 32-bit floating-point sample data is passed to DSPPROC callback function.
;								- False	= Normal Operation.
;						-	$BASS_CONFIG_GVOL_MUSIC			-		Global MOD music volume.
;							- $value 	-	One of the following...
;								- Between  0 (silent) to 10000 (full).
;						-	$BASS_CONFIG_GVOL_SAMPLE		-		Global sample volume.
;							- $value 	-	One of the following...
;								- Between  0 (silent) to 10000 (full).
;						-	$BASS_CONFIG_GVOL_STREAM		-		Global stream volume.
;							- $value 	-	One of the following...
;								- Between  0 (silent) to 10000 (full).
;						-	$BASS_CONFIG_MUSIC_VIRTUAL		-		IT virtual channels.
;							- $value 	-	One of the following...
;								- Number of Virtual channels between 1 (min) 512 (max).
;						-	$BASS_CONFIG_NET_BUFFER			-		Internet download buffer length.
;							- $value 	-	One of the following...
;								- Buffer length in milliseconds
;						-	$BASS_CONFIG_NET_PASSIVE		-		Use passive mode in FTP connections?
;							- $value 	-	One of the following...
;								- True	= Passive Mode is used
;								- False = Normal Operation
;						-	$BASS_CONFIG_NET_PLAYLIST		-		Process URLs in playlists?
;							- $value 	-	One of the following...
;								- When to process URLs in PLS and M3U playlists
;									- 0 = never
;									- 1 = in BASS_StreamCreateURL only
;									- 2 = in BASS_StreamCreateURL, BASS_StreamCreateFile and BASS_StreamCreateFileUser.
;						-	$BASS_CONFIG_NET_PREBUF			-		Amount to pre-buffer when opening internet streams.
;							- $value 	-	One of the following...
;								- Ammount (Percentage) to pre-buffer.
;						-	$BASS_CONFIG_NET_TIMEOUT		-		Time to wait for a server to respond to a connection request.
;							- $value 	-	One of the following...
;								- Time to wait in milliseconds.
;						-	$BASS_CONFIG_PAUSE_NOPLAY		-		Prevent channels being played when the output is paused?
;							- $value 	-	One of the following...
;								- True	= Channels can't be played while the Output is paused.
;								- False = Normal Operation
;						-	$BASS_CONFIG_REC_BUFFER		-		Recording buffer length.
;							- $value 	-	One of the following...
;								- Buffer length in milliseconds.  Between 1000 (min) - 5000 (max).
;						-	$BASS_CONFIG_UPDATEPERIOD		-		Update period of playback buffers.
;							- $value 	-	One of the following...
;								- Update Period in milliseconds.
;								- 0 = disable automatic updating.
;								- Value has to be between 5 and 100 milliseconds.
;						-	$BASS_CONFIG_UPDATETHREADS		-		Number of update threads.
;							- $value 	-	One of the following...
;								- The number of threads to use
;								- 0 = disable automatic updating.
;						-	$BASS_CONFIG_VERIFY				-		File format verification length.
;							- $value 	-	One of the following...
;								- The amount of data to check, in bytes... 1000 (min) to 100000 (max).
;
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_ILLPARAM	-	Option is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetConfig($option, $value)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SetConfig", "dword", $option, "dword", $value)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return 1
EndFunc   ;==>_BASS_SetConfig

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetConfig
; Description ...: Retrieves the value of a config option.
; Syntax ........: _BASS_GetConfig($option)
; Parameters ....: -	$option		-	The option to get the value of.  Same as _BASS_SetConfig.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_ILLPARAM	-	option is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetConfig($option)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_GetConfig", "dword", $option)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_GetConfig

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetConfigPtr
; Description ...: Sets the value of a pointer config option.
; Syntax ........: _BASS_SetConfigPtr($option, $value)
; Parameters ....: -	$option		-	The option to set the value of.  One of the following:
;						-	 $BASS_CONFIG_NET_AGENT		-	"User-Agent" header.
;							- $value is set to:
;									- The "User-Agent" header.
;						-	 $BASS_CONFIG_NET_PROXY		-	Proxy server settings.
;							- $value is set to:
;									- The proxy server settings, in the form of "user:pass@server:port"
;									- NULL = don't use a proxy.
;									- "" (empty string) = use the default proxy settings.
;									- If only the "user:pass@" part is specified, then those authorization
;									  credentials are used with the default proxy server.
;									- If only the "server:port" part is specified, then that proxy server
;									  is used without any authorization credentials.
;
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_ILLPARAM	-	Option is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetConfigPtr($option, $value)
	Local $tpVal = "ptr"
	If IsString($value) Then $tpVal = "str"
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SetConfigPtr", "dword", $option, $tpVal, $value)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return 1
EndFunc   ;==>_BASS_SetConfigPtr

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetConfigPtr
; Description ...: Retrieves the value of a pointer config option.
; Syntax ........: _BASS_GetConfigPtr($option)
; Parameters ....: -	$option		-	The option to set the value of.  Same as _BASS_SetConfigPtr.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_ILLPARAM	-	Option is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetConfigPtr($option)
	Local $BASS_ret_ = DllCall($_ghBassDll, "ptr", "BASS_GetConfigPtr", "dword", $option)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		Local $BS_ERR = _BASS_ErrorGetCode()
		If $BS_ERR <> 0 Then Return SetError($BS_ERR, "", 0)
		Return SetError(0, "", $BASS_ret_[0])
	EndIf
	Return _BASS_PtrStringRead($BASS_ret_[0])
EndFunc   ;==>_BASS_GetConfigPtr

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetVersion
; Description ...: Retrieves the version of BASS that is loaded.
; Syntax ........: _BASS_GetVersion()
; Parameters ....:
; Return values .: Success      - Returns Version
;				   Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetVersion()
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_GetVersion")
	If @error Then Return SetError(1, 1, 0)
	Return SetError($BASS_ret_[0] = 0, 0, $BASS_ret_[0])
EndFunc   ;==>_BASS_GetVersion

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ErrorGetCode
; Description ...: Returns last error code.
; Syntax ........: _BASS_ErrorGetCode()
; Parameters ....:
; Return values .: Returns last error code.  Consult the function documentation to see reasons for each error code.
;				   The error code will be one of the following:
;					-	0 BASS_OK
;					-	1 BASS_ERROR_MEM
;					-	2 BASS_ERROR_FILEOPEN
;					-	3 BASS_ERROR_DRIVER
;					-	4 BASS_ERROR_BUFLOST
;					-	5 BASS_ERROR_HANDLE
;					-	6 BASS_ERROR_FORMAT
;					-	7 BASS_ERROR_POSITION
;					-	8 BASS_ERROR_INIT
;					-	9 BASS_ERROR_START
;					-	14 BASS_ERROR_ALREADY
;					-	18 BASS_ERROR_NOCHAN
;					-	19 BASS_ERROR_ILLTYPE
;					-	20 BASS_ERROR_ILLPARAM
;					-	21 BASS_ERROR_NO3D
;					-	22 BASS_ERROR_NOEAX
;					-	23 BASS_ERROR_DEVICE
;					-	24 BASS_ERROR_NOPLAY
;					-	25 BASS_ERROR_FREQ
;					-	27 BASS_ERROR_NOTFILE
;					-	29 BASS_ERROR_NOHW
;					-	31 BASS_ERROR_EMPTY
;					-	32 BASS_ERROR_NONET
;					-	33 BASS_ERROR_CREATE
;					-	34 BASS_ERROR_NOFX
;					-	37 BASS_ERROR_NOTAVAIL
;					-	38 BASS_ERROR_DECODE
;					-	39 BASS_ERROR_DX
;					-	40 BASS_ERROR_TIMEOUT
;					-	41 BASS_ERROR_FILEFORM
;					-	42 BASS_ERROR_SPEAKER
;					-	43 BASS_ERROR_VERSION
;					-	44 BASS_ERROR_CODEC
;					-	45 BASS_ERROR_ENDED
;					-	-1 BASS_ERROR_UNKNOWN
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ErrorGetCode()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ErrorGetCode")
	If @error Then Return SetError(1, 0, -1)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ErrorGetCode

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetDeviceInfo
; Description ...: Retrieves information on an output device.
; Syntax ........: _BASS_GetDeviceInfo($device)
; Parameters ....: -	$device		-	The device to get the information of... 0 = first.
; Return values .: Success      - Returns Array of Device information.
;									- [0] = Name	-	Description of the device.
;									- [1] = Driver	-	The filename of the driver... NULL = no driver ("no sound" device)
;									- [2] = The device's current status... a combination of these flags.
;										- $BASS_DEVICE_ENABLED 	-	The device is enabled. It will not be possible to initialize
;																	the device if this flag is not present.
;										- $BASS_DEVICE_DEFAULT 	-	The device is the system default.
;										- $BASS_DEVICE_INIT 	-	The device is initialized, ie. BASS_Init or BASS_RecordInit
;																	has been called.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DEVICE device is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetDeviceInfo($device)
	Local $aRet[3]
	Local $BASS_ret_struct = DllStructCreate("ptr name;ptr driver;dword flags;")
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_GetDeviceInfo", "dword", $device, "ptr", DllStructGetPtr($BASS_ret_struct))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	$aRet[0] = _BASS_PtrStringRead(DllStructGetData($BASS_ret_struct, 1))
	$aRet[1] = _BASS_PtrStringRead(DllStructGetData($BASS_ret_struct, 2))
	$aRet[2] = DllStructGetData($BASS_ret_struct, 3)
	Return $aRet
EndFunc   ;==>_BASS_GetDeviceInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Init
; Description ...: Initializes an output device.
; Syntax ........: _BASS_Init($flags, $device = -1, $freq = 44100, $win = 0, $clsid = "")
; Parameters ....: -	$flags		- 	Any Combination of these flags...
;						- $BASS_DEVICE_8BITS
;							- Use 8-bit resolution, else 16-bit.
;						- $BASS_DEVICE_MONO
;							- Use mono, else stereo.
;						- $BASS_DEVICE_3D
;							- Enable 3D functionality.
;						- $BASS_DEVICE_LATENCY
;							- Calculates the latency of the device, that is the delay between requesting a sound to play and it
;							  actually being heard. A recommended minimum buffer length is also calculated. Both values are
;							  retrievable in the BASS_INFO structure (latency & minbuf members). These calculations can increase
;						 	  the time taken by this function by 1-3 seconds.
;						- $BASS_DEVICE_CPSPEAKERS
;							- Use the Windows control panel setting to detect the number of speakers. Soundcards generally have
;						 	  their own control panel to set the speaker config, so the Windows control panel setting may not be
;						 	  accurate unless it matches that. This flag has no effect on Vista, as the speakers are already
;						 	  accurately detected.
;						- $BASS_DEVICE_SPEAKERS
;							- Force the enabling of speaker assignment. With some devices/drivers, the number of speakers BASS
;						 	  detects may be 2, when the device in fact supports more than 2 speakers. This flag forces the
;						 	  enabling of assignment to 8 possible speakers. This flag has no effect with non-WDM drivers.
;						- $BASS_DEVICE_NOSPEAKER
;							- Ignore speaker arrangement. This flag tells BASS not to make any special consideration for
;						 	  speaker arrangements when using the SPEAKER flags, eg. swapping the CENLFE and REAR speaker
;						 	  channels in 5/7.1 speaker output. This flag should be used with plain multi-channel
;						 	  (rather than 5/7.1) devices.
;					- 	$freq	-	Output sample rate.
;					- 	$win		-	The application's main window...
;						-	0 = the current foreground window (use this for console applications).
;					- 	$clsid 	-	Class identifier of the object to create, that will be used to initialize DirectSound...
;						-	NULL = use default.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DEVICE	-	device is invalid.
;										- $BASS_ERROR_ALREADY	-	The device has already been initialized. BASS_Free
;																	must be called before it can be initialized again.
;										- $BASS_ERROR_DRIVER	-	There is no available device driver... the device
;																	may already be in use.
;										- $BASS_ERROR_FORMAT	-	The specified format is not supported by the device.
;																	Try changing the freq and flags parameters.
;										- $BASS_ERROR_MEM		-	There is insufficient memory.
;										- $BASS_ERROR_NO3D		-	Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Init($flags, $device = -1, $freq = 44100, $win = 0, $clsid = "")
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Init", "int", $device, "dword", $freq, "dword", $flags, "hwnd", $win, "hwnd", $clsid)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Init

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetDevice
; Description ...: Sets the device to use for subsequent calls in the current thread.
; Syntax ........: _BASS_SetDevice($device)
; Parameters ....: -	$device 	-	The device to use... 0 = no sound, 1 = first real output device.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DEVICE	-	device is invalid.
;										- $BASS_ERROR_INIT		-	The device has not been initialized.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetDevice($device)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SetDevice", "dword", $device)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetDevice
; Description ...: Retrieves the device setting of the current thread.
; Syntax ........: _BASS_GetDevice()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT - _BASS_Init has not been successfully called
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetDevice()
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_GetDevice")
	If @error Then Return SetError(1, 1, 0)
	Switch $BASS_ret_[0]
		Case $BASS_DWORD_ERR
			Return SetError(_BASS_ErrorGetCode(), 0, 0)
		Case 4294967295 ; dword -1
			Return SetError(0, 0, -1)
		Case Else
			Return $BASS_ret_[0]
	EndSwitch
EndFunc   ;==>_BASS_GetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Free
; Description ...: Frees all resources used by the output device, including all its samples, streams and MOD musics.
; Syntax ........: _BASS_Free()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT - _BASS_Init has not been successfully called
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Free()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Free")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Free

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetDSoundObject
; Description ...:
; Syntax ........: _BASS_GetDSoundObject($object)
; Parameters ....: -	$object		-	Object The interface to retrieve.  Can Be one of the following...
;							- HCHANNEL, HMUSIC or HSTREAM handle, in which case an IDirectSoundBuffer interface is returned.
;							- BASS_OBJECT_DS Retrieve the IDirectSound interface.
;							- BASS_OBJECT_DS3DL Retrieve the IDirectSound3DListener interface.
; Return values .: Success      - Returns a pointer to the requested object
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_ILLPARAM	-	object is invalid.
;										- $BASS_ERROR_NOTAVAIL	-	The requested object is not available with the current device
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetDSoundObject($object)
	Local $BASS_ret_ = DllCall($_ghBassDll, "ptr", "BASS_GetDSoundObject", "dword", $object)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_GetDSoundObject

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetInfo
; Description ...: Retrieves information on the device being used.
; Syntax ........: _BASS_GetInfo()
; Parameters ....:
; Return values .: Success      - Returns an array containg information on the device.
;									- [0] = Flags	-	The device's capabilities... a combination of these flags.
;										- $DSCAPS_CONTINUOUSRATE
;											- The device supports all sample rates between minrate and maxrate.
;										- $DSCAPS_EMULDRIVER
;											- The device's drivers do NOT have DirectSound support, so it is being emulated.
;											  Updated drivers should be installed.
;										- $DSCAPS_CERTIFIED
;											- The device driver has been certified by Microsoft. This flag is always set
;											  on WDM drivers.
;										- $DSCAPS_SECONDARYMONO
;											- Mono samples are supported by hardware mixing.
;										- $DSCAPS_SECONDARYSTEREO
;											- Stereo samples are supported by hardware mixing.
;										- $DSCAPS_SECONDARY8BIT
;											- 8-bit samples are supported by hardware mixing.
;										- $DSCAPS_SECONDARY16BIT
;											- 16-bit samples are supported by hardware mixing.
;									- [1] = hwsize
;										- The device's total amount of hardware memory.
;									- [2] = hwfree
;										- The device's amount of free hardware memory.
;									- [3] = freesam
;										- The number of free sample slots in the hardware.
;									- [4] = free3d
;										- The number of free 3D sample slots in the hardware.
;									- [5] = minrate
;										- The minimum sample rate supported by the hardware.
;									- [6] = maxrate
;										-  maximum sample rate supported by the hardware.
;									- [7] = eax
;										- The device supports EAX and has it enabled? The device's
;										  "Hardware acceleration" needs to be set to "Full" in its "Advanced Properties"
;										  setup, else EAX is disabled. This is always FALSE if BASS_DEVICE_3D was not specified when
;										  BASS_Init was called.
;									- [8] = minbuf
;										- The minimum buffer length (rounded up to the nearest millisecond) recommended for use
;										  (with the BASS_CONFIG_BUFFER config option). Requires that BASS_DEVICE_LATENCY was used
;										  when BASS_Init was called
;									- [9] = dsver
;										- DirectSound version... 9 = DX9/8/7/5 features are available, 8 = DX8/7/5 features are available,
;										  7 = DX7/5 features are available, 5 = DX5 features are available. 0 = none of the DX9/8/7/5
;										  features are available.
;									- [10] = latency
;										- The average delay (rounded up to the nearest millisecond) for playback of HSTREAM/HMUSIC
;										  channels to start and be heard. Requires that BASS_DEVICE_LATENCY was used when BASS_Init
;										  was called.
;									- [11] = initflags
;										- The flags parameter of the BASS_Init call.
;									- [12] = speakers
;										- The number of speakers the device/drivers supports... 2 means that there is no support for
;										  speaker assignment (this will always be the case with VxD drivers). It's also possible that
;										  it could mistakenly be 2 with some devices/drivers, when the device in fact supports more speakers.
;										  In that case the BASS_DEVICE_CPSPEAKERS flag can be used in the BASS_Init call to use the Windows
;										  control panel setting, or the BASS_DEVICE_SPEAKERS flag can be used to force the enabling of
;										  speaker assignment.
;									- [13] = freq
;										- The device's current output sample rate. This is only available on Windows Vista and OSX.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetInfo()
	Local $aRet[14]
	Local $BASS_ret_struct = DllStructCreate($BASS_INFO)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_GetInfo", "ptr", DllStructGetPtr($BASS_ret_struct))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	For $i = 0 To 13
		$aRet[$i] = DllStructGetData($BASS_ret_struct, $i + 1)
	Next
	Return SetError(0, "", $aRet)
EndFunc   ;==>_BASS_GetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Update
; Description ...: Manually updates the HSTREAM and HMUSIC channel playback buffers.
; Syntax ........: _BASS_Update($length)
; Parameters ....: -	$length		-	The amount to render, in milliseconds.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_NOTAVAIL	-	Updating is already in progress
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Update($length)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Update", "dword", $length)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Update

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetCPU
; Description ...: Retrieves the current CPU usage of BASS.
; Syntax ........: _BASS_GetCPU()
; Parameters ....:
; Return values .: Success      - Returns the BASS CPU usage as a percentage of total CPU time
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetCPU()
	Local $BASS_ret_ = DllCall($_ghBassDll, "float", "BASS_GetCPU")
	If @error Then Return SetError(1, 1, 0)
	;If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(),0,0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_GetCPU

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Start
; Description ...: Starts (or resumes) the output.
; Syntax ........: _BASS_Start()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 	-	_BASS_Init has not been successfully called.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Start()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Start")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Start

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Stop
; Description ...: Stops the output, stopping all musics/samples/streams.
; Syntax ........: _BASS_Stop()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 	-	_BASS_Init has not been successfully called.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Stop()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Stop")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Stop

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Pause
; Description ...: Stops the output, pausing all musics/samples/streams.
; Syntax ........: _BASS_Pause()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 	-	_BASS_Init has not been successfully called.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Pause()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Pause")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Pause

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetVolume
; Description ...: Sets the output master volume
; Syntax ........: _BASS_SetVolume($volume)
; Parameters ....: -	$volume 	-	The volume level... 0 (silent) to 1 (max).
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL 	-	There is no volume control when using the "no sound" device.
;										- $BASS_ERROR_ILLPARAM 	-	volume is invalid.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetVolume($volume)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SetVolume", "float", $volume)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SetVolume

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetVolume
; Description ...: Retrieves the current master volume level.
; Syntax ........: _BASS_GetVolume()
; Parameters ....:
; Return values .: Success      - Returns the current volume level.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL 	-	There is no volume control when using the "no sound" device.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetVolume()
	Local $BASS_ret_ = DllCall($_ghBassDll, "float", "BASS_GetVolume")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = -1 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_GetVolume

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_PluginLoad
; Description ...: Plugs an "add-on" into the standard stream and sample creation functions.
; Syntax ........: _BASS_PluginLoad($file, $flags = 0)
; Parameters ....: -	$file Filename of the add-on/plugin.
;					-	$flags Any combination of these flags.
;						- $BASS_UNICODE		-	file is a Unicode (UTF-16) filename.
; Return values .: Success      - Returns the plugin's handle.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_FILEOPEN	-	The file could not be opened.
;										- $BASS_ERROR_FILEFORM	-	The file is not a plugin.
;										- $BASS_ERROR_VERSION	-	The plugin requires a different BASS version. Due to the use of the "stdcall" calling-convention, and so risk of stack faults from unexpected API differences, an add-on won't load at all on Windows if the BASS version is unsupported, and a BASS_ERROR_FILEFORM error will be generated instead of this.
;										- $BASS_ERROR_ALREADY	-	The plugin is already loaded.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_PluginLoad($file, $flags = 0)

	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_PluginLoad", "wstr", $file, "dword", BitOR($flags, $BASS_UNICODE))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_PluginLoad

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_PluginFree
; Description ...: Unplugs an add-on.
; Syntax ........: _BASS_PluginFree($handle)
; Parameters ....: -	$handle 	-	The plugin handle returned by _BASS_PluginLoad or 0 = all plugins.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_PluginFree($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_PluginFree", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_PluginFree

; #FUNCTION# ====================================================================================================================
; Name ..........: _Bass_PluginGetInfo
; Description ...: Retrieves information on a plugin.
; Syntax ........: _Bass_PluginGetInfo($handle)
; Parameters ....: -	$handle		- 	The plugin handle returned by _BASS_PluginLoad
; Return values .: Success      - Returns and array containg the following data:
;									- [0][0] = Number of elements.
;									- [0][1] = Version
;									- [1][0] = Channel type
;									- [1][1] = Format description.
;									- [1][2] = File extension filter, in the form of "*.ext1;*.ext2;etc...".
;									- [n][0] = Channel type
;									- [n][1] = Format description.
;									- [n][2] = File extension filter, in the form of "*.ext1;*.ext2;etc...".
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not valid.
; Author ........: Monoceres
; Modified ......: Prog@ndy, Brett Francis (BrettF)
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _Bass_PluginGetInfo($handle)
	Local $BASSArrOfBASS_PLUGINFORM
	Local $call = DllCall($_ghBassDll, "ptr", "BASS_PluginGetInfo", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $call[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	Local $bp = DllStructCreate($BASS_PLUGININFO, $call[0]) ; Create a BASS_PLUGININFO struct from pointer recieved

	Local $ArrOfBASS_PLUGINFORM_TAG, $iFormatc = DllStructGetData($bp, "formatc")
	; The formatc element hold how many structs we have to have
	For $i = 1 To $iFormatc
		$ArrOfBASS_PLUGINFORM_TAG &= $BASS_PLUGINFORM ; An array is nothing more than a series of identical structs after eachother
	Next
	; Create the array of structs from the string we just did and the pointer we have saved in the BASS_PLUGININFO struct
	$BASSArrOfBASS_PLUGINFORM = DllStructCreate($ArrOfBASS_PLUGINFORM_TAG, DllStructGetData($bp, "formats"))
	Local $aRet[$iFormatc + 1][3]
	$aRet[0][0] = $iFormatc
	$aRet[0][1] = DllStructGetData($bp, 'version')
	For $i = 0 To $iFormatc - 1 ; Loop through each element$strstruct = DllStructCreate("char[255];", DllStructGetData($BASSArrOfBASS_PLUGINFORM, $i * 3 + 2))
		;$strstruct = DllStructCreate("dword;", DllStructGetData($BASSArrOfBASS_PLUGINFORM, $i * 3 + 1))
		;$aRet[$i+1][0] = DllStructGetData($strstruct, 1)
		$aRet[$i + 1][0] = DllStructGetData($BASSArrOfBASS_PLUGINFORM, $i * 3 + 1)
		; Remember, we just have a bunch of data in the struct, we have to calculate were each element is ourselves
		; The first ptr to name is at position 2, so add 2, then we need to add 3 position for each array element we get
		; When we have calculated which ptr we need create the char array from the pointer
		; We finally have access to something interesting, the names of the formats the plugin can handle
		$aRet[$i + 1][1] = _BASS_PtrStringRead(DllStructGetData($BASSArrOfBASS_PLUGINFORM, $i * 3 + 2))

		; Same as above but with the third element in the array (the ext ptr)
		$aRet[$i + 1][2] = _BASS_PtrStringRead(DllStructGetData($BASSArrOfBASS_PLUGINFORM, $i * 3 + 3))
	Next
	Return $aRet
EndFunc   ;==>_Bass_PluginGetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Set3DFactors
; Description ...: Sets the factors that affect the calculations of 3D sound.
; Syntax ........: _BASS_Set3DFactors($distf, $rollf, $doppf)
; Parameters ....: -	$distf The distance factor...
;							- 0 or less = leave current
;							- 1.0 = use meters
;							- 0.9144 = use yards
;							- 0.3048 = use feet.
;					-	$rollf		-	The rolloff factor, how fast the sound quietens with distance...
;							- 0.0 (min) - 10.0 (max)
;							- less than 0.0 = leave current...
;							- 0.0 = no rolloff,
;							- 1.0 = real world,
;							- 2.0 = 2x real.
;					-	$doppf The doppler factor...
;							- 0.0 (min) - 10.0 (max),
;							- less than 0.0 = leave current...
;							- 0.0 = no doppler,
;							- 1.0 = real world,
;							- 2.0 = 2x real.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NO3D	-	The device was not initialized with 3D support
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Set3DFactors($distf, $rollf, $doppf)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Set3DFactors", "float", $distf, "float", $rollf, "float", $doppf)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Set3DFactors

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Get3DFactors
; Description ...:
; Syntax ........: _BASS_Get3DFactors(ByRef $distf, ByRef $rollf, ByRef $doppf)
; Parameters ....: -
; Return values .: Success      - Returns 1
;                                  The ByRef params contain the factors
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NO3D	-	The device was not initialized with 3D support
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Get3DFactors(ByRef $distf, ByRef $rollf, ByRef $doppf)
	Local $BASS_ret_ = DllCall("bass.dll", "int", "BASS_Get3DFactors", "float*", 0, "float*", 0, "float*", 9)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	$distf = $BASS_ret_[1]
	$rollf = $BASS_ret_[2]
	$doppf = $BASS_ret_[3]
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Get3DFactors

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Set3DPosition
; Description ...: Sets the position, velocity, and orientation of the listener (ie. the player).
; Syntax ........: _BASS_Set3DPosition($pos = 0, $vel = 0, $front = 0, $top = 0)
; Parameters ....: -	$pos 		-	The position of the listener... NULL = leave current.
;						- Array Containing
;							- [0] = x +ve = right, -ve = left.
;							- [1] = y +ve = up, -ve = down.
;							- [2] = z +ve = front, -ve = behind.
;					-	$vel 		-	The listener's velocity in units (as set with BASS_Set3DFactors) per second...
;										NULL = leave current
;					-	$front 		-	The direction that the listener's front is pointing...
;										NULL = leave current. This is automatically normalized.
;					-	$top 		-	The direction that the listener's top is pointing...
;										NULL = leave current.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NO3D	-	The device was not initialized with 3D support
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Set3DPosition($pos = 0, $vel = 0, $front = 0, $top = 0)
	Local $pos_s, $vel_s, $front_s, $top_s, $pPos = 0, $pVel = 0, $pFront = 0, $pTop = 0

	If UBound($pos, 0) = 1 And UBound($pos, 1) > 2 Then
		$pos_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($pos_s, "X", $pos[0])
		DllStructSetData($pos_s, "Y", $pos[1])
		DllStructSetData($pos_s, "Z", $pos[2])
		$pPos = DllStructGetPtr($pos_s)
	EndIf

	If UBound($vel, 0) = 1 And UBound($vel, 1) > 2 Then
		$vel_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($vel_s, "X", $vel[0])
		DllStructSetData($vel_s, "Y", $vel[1])
		DllStructSetData($vel_s, "Z", $vel[2])
		$pVel = DllStructGetPtr($vel_s)
	EndIf

	If UBound($front, 0) = 1 And UBound($front, 1) > 2 Then
		$front_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($front_s, "X", $front[0])
		DllStructSetData($front_s, "Y", $front[1])
		DllStructSetData($front_s, "Z", $front[2])
		$pFront = DllStructGetPtr($front_s)
	EndIf

	If UBound($top, 0) = 1 And UBound($top, 1) > 2 Then
		$top_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($top_s, "X", $top[0])
		DllStructSetData($top_s, "Y", $top[1])
		DllStructSetData($top_s, "Z", $top[2])
		$pTop = DllStructGetPtr($top_s)
	EndIf

	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Set3DPosition", "ptr", $pPos, "ptr", $pVel, "ptr", $pFront, "ptr", $pTop)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Set3DPosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Get3DPosition
; Description ...:
; Syntax ........: _BASS_Get3DPosition(ByRef $pos, ByRef $vel, ByRef $front, ByRef $top)
; Parameters ....: -	$pos 		-	The position of the listener... NULL = leave current.
;						- Array Containing
;							-Pos
;								- [0][0] = x +ve = right, -ve = left.
;								- [0][1] = y +ve = up, -ve = down.
;								- [0][2] = z +ve = front, -ve = behind.
;							-Velocity
;								- [1][0] = x +ve = right, -ve = left.
;								- [1][1] = y +ve = up, -ve = down.
;								- [1][2] = z +ve = front, -ve = behind.
;							-Front
;								- [2][0] = x +ve = right, -ve = left.
;								- [2][1] = y +ve = up, -ve = down.
;								- [2][2] = z +ve = front, -ve = behind.
;							-Top
;								- [3][0] = x +ve = right, -ve = left.
;								- [3][1] = y +ve = up, -ve = down.
;								- [3][2] = z +ve = front, -ve = behind.
;					-	$vel 		-	The listener's velocity in units (as set with BASS_Set3DFactors) per second...
;										NULL = leave current
;					-	$front 		-	The direction that the listener's front is pointing...
;										NULL = leave current. This is automatically normalized.
;					-	$top 		-	The direction that the listener's top is pointing...
;										NULL = leave current.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Get3DPosition(ByRef $pos, ByRef $vel, ByRef $front, ByRef $top)
	Local $pos_s = DllStructCreate($BASS_3DVECTOR)
	Local $vel_s = DllStructCreate($BASS_3DVECTOR)
	Local $front_s = DllStructCreate($BASS_3DVECTOR)
	Local $top_s = DllStructCreate($BASS_3DVECTOR)
	$pos = 0
	$vel = 0
	$front = 0
	$top = 0

	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_Get3DPosition", "ptr", DllStructGetPtr($pos_s), "ptr", DllStructGetPtr($vel_s), "ptr", DllStructGetPtr($front_s), "ptr", DllStructGetPtr($top_s))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Dim $pos[3], $vel[3], $front[3], $top[3]
	$pos[0] = DllStructGetData($pos_s, 1)
	$pos[1] = DllStructGetData($pos_s, 2)
	$pos[2] = DllStructGetData($pos_s, 3)

	$vel[0] = DllStructGetData($vel_s, 1)
	$vel[1] = DllStructGetData($vel_s, 2)
	$vel[2] = DllStructGetData($vel_s, 3)

	$front[0] = DllStructGetData($front_s, 1)
	$front[1] = DllStructGetData($front_s, 2)
	$front[2] = DllStructGetData($front_s, 3)

	$top[0] = DllStructGetData($top_s, 1)
	$top[1] = DllStructGetData($top_s, 2)
	$top[2] = DllStructGetData($top_s, 3)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_Get3DPosition


; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Apply3D
; Description ...: Applies changes made to the 3D system.
; Syntax ........: _BASS_Apply3D()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......: This function must be called to apply any changes made with _BASS_Set3DFactors, _BASS_Set3DPosition,
;				   _BASS_ChannelSet3DAttributes or _BASS_ChannelSet3DPosition. This allows multiple changes to be synchronized,
;				   and also improves performance.
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Apply3D()
	DllCall($_ghBassDll, "none", "BASS_Apply3D")
	If @error Then Return SetError(1)
EndFunc   ;==>_BASS_Apply3D

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetEAXParameters
; Description ...: Sets the type of EAX environment and its parameters.
; Syntax ........: _BASS_SetEAXParameters($env, $vol, $decay, $damp)
; Parameters ....: 	- $env 	-	The EAX environment...
;								- -1 = leave current
;								- or one of the following.
;								- $EAX_ENVIRONMENT_GENERIC
;								- $EAX_ENVIRONMENT_PADDEDCELL
;								- $EAX_ENVIRONMENT_ROOM
;								- $EAX_ENVIRONMENT_BATHROOM
;								- $EAX_ENVIRONMENT_LIVINGROOM
;								- $EAX_ENVIRONMENT_STONEROOM
;								- $EAX_ENVIRONMENT_AUDITORIUM
;								- $EAX_ENVIRONMENT_CONCERTHALL
;								- $EAX_ENVIRONMENT_CAVE
;								- $EAX_ENVIRONMENT_ARENA
;								- $EAX_ENVIRONMENT_HANGAR
;								- $EAX_ENVIRONMENT_CARPETEDHALLWAY
;								- $EAX_ENVIRONMENT_HALLWAY
;								- $EAX_ENVIRONMENT_STONECORRIDOR
;								- $EAX_ENVIRONMENT_ALLEY
;								- $EAX_ENVIRONMENT_FOREST
;								- $EAX_ENVIRONMENT_CITY
;								- $EAX_ENVIRONMENT_MOUNTAINS
;								- $EAX_ENVIRONMENT_QUARRY
;								- $EAX_ENVIRONMENT_PLAIN
;								- $EAX_ENVIRONMENT_PARKINGLOT
;								- $EAX_ENVIRONMENT_SEWERPIPE
;								- $EAX_ENVIRONMENT_UNDERWATER
;								- $EAX_ENVIRONMENT_DRUGGED
;								- $EAX_ENVIRONMENT_DIZZY
;								- $EAX_ENVIRONMENT_PSYCHOTIC
;							- $vol 	-	The volume of the reverb...
;								- 0 (off) to 1 (max)
;								- less than 0 = leave current.
;							- $decay 	-	The time in seconds it takes the reverb to diminish by 60dB...
;								- 0.1 (min) to 20 (max),
;								- less than 0 = leave current.
;							- $damp 	-	The damping, high or low frequencies decay faster...
;								- 0 = high decays quickest
;								- 1 = low/high decay equally
;								- 2 = low decays quickest
;								- less than 0 = leave current
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOEAX	-	The output device does not support EAX.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetEAXParameters($env, $vol, $decay, $damp)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SetEAXParameters", "int", $env, "float", $vol, "float", $decay, "float", $damp)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SetEAXParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_GetEAXParameters
; Description ...:
; Syntax ........: _BASS_GetEAXParameters(ByRef $env, ByRef $vol, ByRef $decay, ByRef $damp)
; Parameters ....: -	$env 	-	The EAX environment...
;						-	NULL = don't retrieve it. See _BASS_SetEAXParameters for a list of the possible environments.
;					-	$vol 	-	The volume of the reverb...
;						-	NULL = don't retrieve it.
;					-	$decay 	-	The decay duration...
;						-	NULL = don't retrieve it.
;					-	$damp 	-	The damping...
;						-	NULL = don't retrieve it.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOEAX	-	The output device does not support EAX.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_GetEAXParameters(ByRef $env, ByRef $vol, ByRef $decay, ByRef $damp)
	$vol = 0
	$decay = 0
	$damp = 0
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_GetEAXParameters", "DWORD*", $env, "float*", 0, "float*", 0, "float*", 0)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	$env = $BASS_ret_[1]
	$vol = $BASS_ret_[2]
	$decay = $BASS_ret_[3]
	$damp = $BASS_ret_[4]
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_GetEAXParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_MusicLoad
; Description ...: Loads a MOD music file; MO3 / IT / XM / S3M / MTM / MOD / UMX formats.
; Syntax ........: _BASS_MusicLoad($mem, $file, $offset, $length, $flags, $freq)
; Parameters ....: -	$mem TRUE = load the MOD music from memory.
;					-	$file Filename (mem = FALSE) or a memory location (mem = TRUE).
;					-	$offset File offset to load the MOD music from (only used if mem = FALSE).
;					-	$length Data length... 0 = use all data up to the end of file (if mem = FALSE).
;					-	$flags A combination of these flags.
;						-	$BASS_SAMPLE_8BITS
;								- Use 8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT flags are specified,
;								  then the sample data will be 16-bit.
;						-	$BASS_SAMPLE_FLOAT
;								- Use 32-bit floating-point sample data. See Floating-point channels for info.
;						-	$BASS_SAMPLE_MONO
;								- Decode/play the MOD music in mono (uses less CPU than stereo). This flag is automatically
;								  applied if BASS_DEVICE_MONO was specified when calling BASS_Init.
;						-	$BASS_SAMPLE_SOFTWARE
;								- Force the MOD music to not use hardware mixing.
;						-	$BASS_SAMPLE_3D
;								- Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when calling
;								  _BASS_Init. 3D channels must also be mono, so BASS_SAMPLE_MONO is automatically applied.
;								  The SPEAKER flags can not be used together with this flag.
;						-	$BASS_SAMPLE_FX
;								- requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8 effect
;								  implementations section for details. Use BASS_ChannelSetFX to add effects to the music.
;						-	$BASS_SAMPLE_LOOP
;								- Loop the music.
;						-	$BASS_MUSIC_NONINTER
;								- Use non-interpolated sample mixing. This generally reduces the sound quality, but can be good for chip-tunes.
;						-	$BASS_MUSIC_SINCINTER
;								- Use sinc interpolated sample mixing. This increases the sound quality, but also requires more processing.
;								  If neither this or the BASS_MUSIC_NONINTER flag is specified, linear interpolation is used.
;						-	$BASS_MUSIC_RAMP
;								- Use "normal" ramping (as used in FastTracker 2).
;						-	$BASS_MUSIC_RAMPS
;								- Use "sensitive" ramping.
;						-	$BASS_MUSIC_SURROUND
;								- Apply XMPlay's surround sound to the music (ignored in mono).
;						-	$BASS_MUSIC_SURROUND2
;								- Apply XMPlay's surround sound mode 2 to the music (ignored in mono).
;						-	$BASS_MUSIC_FT2MOD
;								- Play .MOD file as FastTracker 2 would.
;						-	$BASS_MUSIC_PT1MOD
;								- Play .MOD file as ProTracker 1 would.
;						-	$BASS_MUSIC_POSRESET
;								- Stop all notes when seeking (BASS_ChannelSetPosition).
;						-	$BASS_MUSIC_POSRESETEX
;								- Stop all notes and reset bpm/etc when seeking.
;						-	$BASS_MUSIC_STOPBACK
;								- Stop the music when a backward jump effect is played. This stops musics that never reach the end
;								  from going into endless loops. Some MOD musics are designed to jump all over the place, so this
;								  flag would cause those to be stopped prematurely. If this flag is used together with the
;								  $BASS_SAMPLE_LOOP flag, then the music would not be stopped but any BASS_SYNC_END sync would be triggered.
;						-	$BASS_MUSIC_PRESCAN
;								- Calculate the playback length of the music, and enable seeking in bytes. This slightly increases the
;								  time taken to load the music, depending on how long it is. In the case of musics that loop, the
;								  length until the loop occurs is calculated. Use BASS_ChannelGetLength to retrieve the length.
;						-	$BASS_MUSIC_NOSAMPLE
;								- Don't load the samples. This reduces the time (and memory) taken to load the music, notably with
;								  MO3 files, which is useful if you just want to get the text and/or length of the music without playing it.
;						-	$BASS_MUSIC_AUTOFREE
;								- Automatically free the music when playback ends. Note that some musics have infinite loops, so
;								  never actually end on their own.
;						-	$BASS_MUSIC_DECODE
;								- Decode/render the sample data, without playing it. Use BASS_ChannelGetData to retrieve decoded
;								  sample data. The BASS_SAMPLE_3D, BASS_STREAM_AUTOFREE and SPEAKER flags can not be used together
;								  with this flag. The BASS_SAMPLE_SOFTWARE and BASS_SAMPLE_FX flags are also ignored.
;						-	$BASS_SPEAKER_xxx Speaker assignment flags.
;								- The BASS_SAMPLE_MONO flag is automatically applied when using a mono speaker assignment flag.
;						-	$BASS_UNICODE
;								- file is a Unicode (UTF-16) filename.
;					-	$freq Sample rate to render/play the MOD music at... 0 = the rate specified in the BASS_Init call.
; Return values .: Success      - Returns the loaded MOD music's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT
;											- _BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL
;											- The BASS_MUSIC_AUTOFREE flag is unavailable to decoding channels.
;										- $BASS_ERROR_FILEOPEN
;											- The file could not be opened.
;										- $BASS_ERROR_FILEFORM
;											- The file's format is not recognised/supported.
;										- $BASS_ERROR_FORMAT
;											- The sample format is not supported by the device/drivers. If using the
;											  $BASS_SAMPLE_FLOAT flag, it could be that floating-point channels are not supported.
;										- $BASS_ERROR_SPEAKER
;											- The specified SPEAKER flags are invalid. The device/drivers do not support
;											  them or 3D functionality is enabled.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
;										- $BASS_ERROR_NO3D
;											- Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN
;											- Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_MusicLoad($mem, $file, $offset, $length, $flags, $freq)
	Local $tpFile = "ptr"
	If IsString($file) Then $tpFile = "wstr"
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_MusicLoad", "int", $mem, $tpFile, $file, "uint64", $offset, "DWORD", $length, "DWORD", BitOR($flags, $BASS_UNICODE), "DWORD", $freq)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_MusicLoad

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_MusicFree
; Description ...: Frees a MOD music's resources, including any sync/DSP/FX it has.
; Syntax ........: _BASS_MusicFree($handle)
; Parameters ....: -	$handle		-	Handle returned by _Bass_MusicLoad.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	$Handle is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_MusicFree($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_MusicFree", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_MusicFree

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleLoad
; Description ...: Loads a WAV, AIFF, MP3, MP2, MP1, OGG or plugin supported sample.
; Syntax ........: _BASS_SampleLoad($mem, $file, $offset, $length, $max, $flags)
; Parameters ....: -	Handle to opened Bass.dll
;					-	$mem
;						-	TRUE = load the sample from memory.
;					-	$file
;						-	Filename (mem = FALSE) or a memory location (mem = TRUE).
;					-	$offset
;						-	File offset to load the sample from (only used if mem = FALSE).
;					-	$length
;						-	Data length...
;						-	0 = use all data up to the end of file (if mem = FALSE).
;							If length over-runs the end of the file, it'll automatically be
;							lowered to the end of the file.
;					-	$max
;						-	Maximum number of simultaneous playbacks...
;						-	1 (min) - 65535 (max).
;						-	Use one of the $BASS_SAMPLE_OVER flags to choose the override decider,
;							in the case of there being no free channel available for playback
;							(ie. the sample is already playing max times).
;					-	$flags
;						-	A combination of these flags.
;							- $BASS_SAMPLE_FLOAT
;								- Use 32-bit floating-point sample data (not really recommended for samples).
;							- $BASS_SAMPLE_LOOP
;								- Looped? Note that only complete sample loops are allowed, you can't
;								  loop just a part of the sample. More fancy looping can be achieved by streaming the file.
;							- $BASS_SAMPLE_MONO
;								- Convert the sample (MP3/MP2/MP1 only) to mono, if it's not already. This
;								  flag is automatically applied if BASS_DEVICE_MONO was specified when calling _BASS_Init.
;							- $BASS_SAMPLE_SOFTWARE
;								- Force the sample to not use hardware mixing.
;							- $BASS_SAMPLE_VAM
;								- requires DirectX 7 or above Enables the DX7 voice allocation and management
;								   features on the sample, which allows the sample to be played in software or hardware.
;								   This flag is ignored if the BASS_SAMPLE_SOFTWARE flag is also specified.
;							- $BASS_SAMPLE_3D
;								- Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified
;								   when calling BASS_Init, and the sample must be mono.
;							- $BASS_SAMPLE_MUTEMAX
;								- Mute the sample when it is at (or beyond) its max distance (3D samples only).
;							- $BASS_SAMPLE_OVER_VOL
;								- Override: the channel with the lowest volume is overridden.
;							- $BASS_SAMPLE_OVER_POS
;								- Override: the longest playing channel is overridden.
;							- $BASS_SAMPLE_OVER_DIST
;								- Override: the channel furthest away (from the listener) is overridden (3D samples only).
;							- $BASS_UNICODE
;								- file is a Unicode (UTF-16) filename.
; Return values .: Success      - Returns the loaded sample's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT		-	BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL	-	Sample functions are not available when using
;																	the "no sound" device.
;										- $BASS_ERROR_ILLPARAM 	-	max and/or length is invalid. The length must be
;																	specified when loading from memory.
;										- $BASS_ERROR_FILEOPEN 	-	The file could not be opened.
;										- $BASS_ERROR_FILEFORM 	-	The file's format is not recognised/supported.
;										- $BASS_ERROR_CODEC 	-	The file uses a codec that's not available/supported.
;																	This can apply to WAV and AIFF files, and also MP3 files
;																	when using the "MP3-free" BASS version.
;										- $BASS_ERROR_FORMAT 	-	The sample format is not supported by the device/drivers.
;																	If the sample is more than stereo or the $BASS_SAMPLE_FLOAT
;																	flag is used, it could be that they are not supported.
;										- $BASS_ERROR_MEM 		-	There is insufficient memory.
;										- $BASS_ERROR_NO3D 		-	Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleLoad($mem, $file, $offset, $length, $max, $flags)
	Local $tpFile = "ptr"
	If IsString($file) Then $tpFile = "wstr"
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_SampleLoad", "int", $mem, $tpFile, $file, "uint64", $offset, "DWORD", $length, "DWORD", $max, "DWORD", BitOR($flags, $BASS_UNICODE))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleLoad

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleCreate
; Description ...: Creates a new sample.
; Syntax ........: _BASS_SampleCreate($length, $freq, $chans, $max, $flags)
; Parameters ....: 		- 	Handle to opened Bass.dll
;					-	$length
;								- 	The sample's length, in bytes.
;					-	$freq
;								- 	The default sample rate.
;					-	$chans
;								- 	The number of channels...
;								- 	1 = mono, 2 = stereo, etc...
;								- 	More than stereo is not available with old VxD drivers.
;					-	$max Maximum
;								- 	number of simultaneous playbacks...
;								- 	1 (min) - 65535 (max)...
;								- 	use one of the $BASS_SAMPLE_OVER flags to choose the override decider,
;								 	in the case of there being no free channel available for playback
;								    (ie. the sample is already playing max times).
;					-	$flags
;						- 	A combination of these flags.
;							-	$BASS_SAMPLE_8BITS
;									- Use 8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT flags are
;									  specified, then the sample is 16-bit.
;							-	$BASS_SAMPLE_FLOAT
;									- Use 32-bit floating-point sample data (not really recommended for samples).
;							-	$BASS_SAMPLE_LOOP
;									- Looped? Note that only complete sample loops are allowed, you can't loop just
;									   a part of the sample. More fancy looping can be achieved via streaming.
;							-	$BASS_SAMPLE_SOFTWARE
;									- Force the sample to not use hardware mixing.
;							-	$BASS_SAMPLE_VAM
;									- requires DirectX 7 or above Enables the DX7 voice allocation and management features
;									   on the sample, which allows the sample to be played in software or hardware. This flag
;									   is ignored if the BASS_SAMPLE_SOFTWARE flag is also specified.
;							-	$BASS_SAMPLE_3D Enable
;									- 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when
;									   calling BASS_Init, and the sample must be mono (chans=1).
;							-	$BASS_SAMPLE_MUTEMAX
;									- Mute the sample when it is at (or beyond) its max distance (software 3D samples only).
;							-	$BASS_SAMPLE_OVER_VOL
;									- Override: the channel with the lowest volume is overridden.
;							-	$BASS_SAMPLE_OVER_POS
;									- Override: the longest playing channel is overridden.
;							-	$BASS_SAMPLE_OVER_DIST
;									- Override: the channel furthest away (from the listener) is overridden (3D samples only).
; Return values .: Success      - Returns the new sample's handle
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL 	-	Sample functions are not available when using the
;																	"no sound" device.
;										- $BASS_ERROR_ILLPARAM 	-	max is invalid.
;										- $BASS_ERROR_FORMAT 	-	The sample format is not supported by the device/drivers.
;										- $BASS_ERROR_MEM 		-	There is insufficient memory.
;										- $BASS_ERROR_NO3D 		-	Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleCreate($length, $freq, $chans, $max, $flags)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_SampleCreate", "DWORD", $length, "DWORD", $freq, "DWORD", $chans, "DWORD", $max, "DWORD", $flags)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleCreate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleFree
; Description ...: Frees a sample's resources.
; Syntax ........: _BASS_SampleFree($handle)
; Parameters ....: -	$handle		- 	Handle to a sample.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleFree($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleFree", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleFree

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleSetData
; Description ...: Sets a samples data
; Syntax ........: _BASS_SampleSetData($handle, $buffer)
; Parameters ....: -	$handle 	-	The sample handle.
;					-	$buffer 	-	Pointer to the data.
;					-	$size	 	-	Size of the buffer.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	 handle is not valid.
;										- $BASS_ERROR_UNKNOWN	-	 Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleSetData($handle, $buffer)
	Local $pBuffer
	If IsPtr($buffer) Then
		$pBuffer = $buffer
	Else
		$buffer = Binary($buffer)
		Local $sBuffer = DllStructCreate("byte[" & BinaryLen($buffer) & "]")
		DllStructSetData($sBuffer, 1, $buffer)
		$pBuffer = DllStructGetPtr($sBuffer)
	EndIf
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleSetData", "dword", $handle, "ptr", $pBuffer)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleSetData

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleGetData
; Description ...: Retrieves a copy of a sample's data.
; Syntax ........: _BASS_SampleGetData($handle, $pBuffer)
; Parameters ....: -	$handle		-	The sample handle
;                   -	$pBuffer		-	Pointer to a buffer to receive the data.
;                                           It must be large enough to reveive it, so get the size with _BASS_SampleGetInfo
; Return values .: Success      - Returns 1.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not valid.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleGetData($handle, $pBuffer)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleGetData", "dword", $handle, "ptr", $pBuffer)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleGetData

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleGetInfo
; Description ...: Retrieves a sample's default attributes and other information.
; Syntax ........: _BASS_SampleGetInfo($handle)
; Parameters ....: -	$handle		- 	Handle to a sample.
; Return values .: Success      - Returns an array containg the samples data:
;									- [0] = freq 	-	Default sample rate.
;									- [1] = volume	-	Default volume... 0 (silent) to 1 (full).
;									- [2] = pan		-	Default panning position...
;										- -1 (full left) to +1 (full right),
;										- 0 = centre.
;									- [3] = flags 	-	A combination of these flags.
;										$BASS_SAMPLE_8BITS		-	8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT
;																	flags are present, then the sample is 16-bit.
;										$BASS_SAMPLE_FLOAT 		-	32-bit floating-point.
;										$BASS_SAMPLE_LOOP 		-	Looped?
;										$BASS_SAMPLE_3D 		-	The sample has 3D functionality enabled.
;										$BASS_SAMPLE_MUTEMAX 	-	Mute the sample when it is at (or beyond) its max distance
;																	(3D samples only).
;										$BASS_SAMPLE_SOFTWARE 	-	The sample is not using hardware mixing... it is being mixed
;																	in software by DirectSound.
;										$BASS_SAMPLE_VAM DX7 	-	voice allocation and management features are enabled (see below).
;										$BASS_SAMPLE_OVER_VOL 	-	Override: the channel with the lowest volume is overridden.
;										$BASS_SAMPLE_OVER_POS 	-	Override: the longest playing channel is overridden.
;										$BASS_SAMPLE_OVER_DIST 	-	Override: the channel furthest away (from the listener) is
;																	overridden (3D samples only).
;									- [4] = length 	-	The length in bytes.
;									- [5] = max 	-	Maximum number of simultaneous playbacks.
;									- [6] = origres 	-	The original resolution (bits per sample)... 0 = undefined.
;									- [7] = chans 	-	Number of channels... 1 = mono, 2 = stereo, etc...
;									- [8] = mingap 	-	Minimum time gap in milliseconds between creating channels using
;																	_BASS_SampleGetChannel. This can be used to prevent
;																	flanging effects caused by playing a sample multiple
;																	times very close to each other. The default setting,
;																	after loading/creating a sample, is 0 (disabled).
;									- [9] = mode3d 	-	The 3D processing mode... one of these flags. BASS_3DMODE_NORMAL
;																	Normal 3D processing.
;										$BASS_3DMODE_RELATIVE 	-	The sample's 3D position (position/velocity/orientation)
;																	is relative to the listener. When the listener's
;																	position/velocity/orientation is changed with
;																	_BASS_Set3DPosition, the sample's position relative
;																	to the listener does not change.
;										$BASS_3DMODE_OFF 		-	Turn off 3D processing on the sample, the sound
;																	will be played in the center.
;									- [10] = mindist 	-	The minimum distance. The sample's volume is at maximum
;																	when the listener is within this distance.
;									- [11] = maxdist 	-	The maximum distance. The sample's volume stops decreasing
;																	when the listener is beyond this distance.
;									- [12] = iangle 	-	The angle of the inside projection cone in degrees...
;																	0 (no cone) to 360 (sphere).
;									- [13] = oangle 	-	The angle of the outside projection cone in degrees...
;																	0 (no cone) to 360 (sphere).
;									- [14] = outvol 	-	The delta-volume outside the outer projection cone...
;																	0 (silent) to 1 (full).
;									- [15] = vam 		-	voice allocation/management flags... a combination of these
;										$BASS_VAM_HARDWARE 		-	Play the sample in hardware. If no hardware voices are
;																	available then the play call will fail.
;										$BASS_VAM_SOFTWARE 		-	Play the sample in software (ie. non-accelerated).
;																	No other VAM flags may be used together with this flag.
;										$BASS_VAM_TERM_TIME 	-	If there are no free hardware voices, the buffer to be
;																	terminated will be the one with the least time left to play.
;										$BASS_VAM_TERM_DIST 	-	If there are no free hardware voices, the buffer to
;																	be terminated will be one that was loaded/created with
;																	the BASS_SAMPLE_MUTEMAX flag and is beyond its max
;																	distance (maxdist). If there are no buffers that match
;																	this criteria, then the play call will fail.
;										$BASS_VAM_TERM_PRIO 	-	If there are no free hardware voices, the buffer to
;																	be terminated will be the one with the lowest priority.
;																	This flag may be used with the TERM_TIME or TERM_DIST flag,
;																	if multiple voices have the same priority then the time or
;																	distance is used to decide which to terminate.
;									- [16] priority 	-	Priority, used with the BASS_VAM_TERM_PRIO flag...
;											-	0 (min) to 0xFFFFFFFF (max).
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	The handle is invalid
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleGetInfo($handle)
	Local $reta[17], $BASS_SAMPLE_INFO_S
	$BASS_SAMPLE_INFO_S = DllStructCreate($BASS_SAMPLE)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleGetInfo", "dword", $handle, "ptr", DllStructGetPtr($BASS_SAMPLE_INFO_S))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	For $i = 1 To 17
		$reta[$i - 1] = DllStructGetData($BASS_SAMPLE_INFO_S, $i)
	Next
	Return SetError(0, "", $reta)
EndFunc   ;==>_BASS_SampleGetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleSetInfo
; Description ...:
; Syntax ........: _BASS_SampleSetInfo($handle, $info)
; Parameters ....: -	$handle		-	Handle to a sample
;					- 	$info		-	Array containg the following infomation:
;									- [0] = freq 	-	Default sample rate.
;									- [1] = volume	-	Default volume... 0 (silent) to 1 (full).
;									- [2] = pan		-	Default panning position...
;										- -1 (full left) to +1 (full right),
;										- 0 = centre.
;									- [3] = flags 	-	A combination of these flags.
;										$BASS_SAMPLE_8BITS		-	8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT
;																	flags are present, then the sample is 16-bit.
;										$BASS_SAMPLE_FLOAT 		-	32-bit floating-point.
;										$BASS_SAMPLE_LOOP 		-	Looped?
;										$BASS_SAMPLE_3D 		-	The sample has 3D functionality enabled.
;										$BASS_SAMPLE_MUTEMAX 	-	Mute the sample when it is at (or beyond) its max distance
;																	(3D samples only).
;										$BASS_SAMPLE_SOFTWARE 	-	The sample is not using hardware mixing... it is being mixed
;																	in software by DirectSound.
;										$BASS_SAMPLE_VAM DX7 	-	voice allocation and management features are enabled (see below).
;										$BASS_SAMPLE_OVER_VOL 	-	Override: the channel with the lowest volume is overridden.
;										$BASS_SAMPLE_OVER_POS 	-	Override: the longest playing channel is overridden.
;										$BASS_SAMPLE_OVER_DIST 	-	Override: the channel furthest away (from the listener) is
;																	overridden (3D samples only).
;									- [4] = length 	-	The length in bytes.
;									- [5] = max 	-	Maximum number of simultaneous playbacks.
;									- [6] = origres 	-	The original resolution (bits per sample)... 0 = undefined.
;									- [7] = chans 	-	Number of channels... 1 = mono, 2 = stereo, etc...
;									- [8] = mingap 	-	Minimum time gap in milliseconds between creating channels using
;																	_BASS_SampleGetChannel. This can be used to prevent
;																	flanging effects caused by playing a sample multiple
;																	times very close to each other. The default setting,
;																	after loading/creating a sample, is 0 (disabled).
;									- [9] = mode3d 	-	The 3D processing mode... one of these flags. BASS_3DMODE_NORMAL
;																	Normal 3D processing.
;										$BASS_3DMODE_RELATIVE 	-	The sample's 3D position (position/velocity/orientation)
;																	is relative to the listener. When the listener's
;																	position/velocity/orientation is changed with
;																	_BASS_Set3DPosition, the sample's position relative
;																	to the listener does not change.
;										$BASS_3DMODE_OFF 		-	Turn off 3D processing on the sample, the sound
;																	will be played in the center.
;									- [10] = mindist 	-	The minimum distance. The sample's volume is at maximum
;																	when the listener is within this distance.
;									- [11] = maxdist 	-	The maximum distance. The sample's volume stops decreasing
;																	when the listener is beyond this distance.
;									- [12] = iangle 	-	The angle of the inside projection cone in degrees...
;																	0 (no cone) to 360 (sphere).
;									- [13] = oangle 	-	The angle of the outside projection cone in degrees...
;																	0 (no cone) to 360 (sphere).
;									- [14] = outvol 	-	The delta-volume outside the outer projection cone...
;																	0 (silent) to 1 (full).
;									- [15] = vam 		-	voice allocation/management flags... a combination of these
;										$BASS_VAM_HARDWARE 		-	Play the sample in hardware. If no hardware voices are
;																	available then the play call will fail.
;										$BASS_VAM_SOFTWARE 		-	Play the sample in software (ie. non-accelerated).
;																	No other VAM flags may be used together with this flag.
;										$BASS_VAM_TERM_TIME 	-	If there are no free hardware voices, the buffer to be
;																	terminated will be the one with the least time left to play.
;										$BASS_VAM_TERM_DIST 	-	If there are no free hardware voices, the buffer to
;																	be terminated will be one that was loaded/created with
;																	the BASS_SAMPLE_MUTEMAX flag and is beyond its max
;																	distance (maxdist). If there are no buffers that match
;																	this criteria, then the play call will fail.
;										$BASS_VAM_TERM_PRIO 	-	If there are no free hardware voices, the buffer to
;																	be terminated will be the one with the lowest priority.
;																	This flag may be used with the TERM_TIME or TERM_DIST flag,
;																	if multiple voices have the same priority then the time or
;																	distance is used to decide which to terminate.
;									- [16] priority 	-	Priority, used with the BASS_VAM_TERM_PRIO flag...
;											-	0 (min) to 0xFFFFFFFF (max).
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	The handle is invalid
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleSetInfo($handle, $info)
	Local $BASS_SAMPLE_INFO_S
	$BASS_SAMPLE_INFO_S = DllStructCreate($BASS_SAMPLE)
	For $i = 1 To 17
		DllStructSetData($BASS_SAMPLE_INFO_S, $i, $info[$i - 1])
	Next
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleSetInfo", "dword", $handle, "ptr", DllStructGetPtr($BASS_SAMPLE_INFO_S))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleSetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleGetChannel
; Description ...: Creates/initializes a playback channel for a sample.
; Syntax ........: _BASS_SampleGetChannel($handle, $onlynew)
; Parameters ....: -	$handle 	-	Handle of the sample to play.
;					-	$onlynew 	-	Do not recycle/override one of the sample's existing channels?
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not a valid sample handle.
;										- $BASS_ERROR_NOCHAN	-	The sample has no free channels... the maximum
;																	number of simultaneous playbacks has been reached, and
;																	no BASS_SAMPLE_OVER flag was specified for the sample or
;																	onlynew = TRUE.
;										- $BASS_ERROR_TIMEOUT	-	The sample's minimum time gap (BASS_SAMPLE) has not yet
;																	passed since the last channel was created.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleGetChannel($handle, $onlynew)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_SampleGetChannel", "dword", $handle, "int", $onlynew)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleGetChannel


; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleGetChannels
; Description ...: Retrieves all a sample's existing channels.
; Syntax ........: _BASS_SampleGetChannels($hSample)
; Parameters ....: -	$hSample 	-	The sample handle.
; Return values .: Success      - Returns array of the sample's channel handles
;                  Failure      - Returns empty array and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not a valid sample handle.
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleGetChannels($hSample)
	Local $aReturn[1] = [0]

	Local $tInfo = DllStructCreate($BASS_SAMPLE)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleGetInfo", "dword", $hSample, "ptr", DllStructGetPtr($tInfo))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, $aReturn)

	Local $iCount = DllStructGetData($tInfo, 6)
	If $iCount = 0 Then Return SetError(1, 0, $aReturn)

	Local $tChannels = DllStructCreate("dword[" & $iCount & "];")

	$BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_SampleGetChannels", "dword", $hSample, "ptr", DllStructGetPtr($tChannels))
	If @error Then Return SetError(1, 1, $aReturn)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, $aReturn)
	$iCount = $BASS_ret_[0]

	ReDim $aReturn[$iCount + 1]
	$aReturn[0] = $iCount

	For $i = 1 To $iCount
		$aReturn[$i] = DllStructGetData($tChannels, 1, $i)
	Next

	Return $aReturn
EndFunc   ;==>_BASS_SampleGetChannels


; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SampleStop
; Description ...: Stops all instances of a sample.
; Syntax ........: _BASS_SampleStop($handle)
; Parameters ....: -	$handle 	-	The sample handle.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	 handle is not a valid sample.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SampleStop($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_SampleStop", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_SampleStop

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamCreate
; Description ...: Creates a user sample stream.
; Syntax ........: _BASS_StreamCreate($freq, $chans, $flags, $proc = 0, $pUser = 0)
; Parameters ....: -	$freq  		-	The default sample rate. The sample rate can be changed using BASS_ChannelSetAttribute.
;					-	$chans  	-	The number of channels... 1 = mono, 2 = stereo, 4 = quadraphonic, 6 = 5.1, 8 = 7.1.
;					-	$flags 	 	-	Any combination of these flags.
;						- $BASS_SAMPLE_8BITS
;							- Use 8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT flags are specified, then
;							  the stream is 16-bit.
;						- $BASS_SAMPLE_FLOAT
;							- Use 32-bit floating-point sample data. See Floating-point channels for info.
;						- $BASS_SAMPLE_SOFTWARE
;							- Force the stream to not use hardware mixing.
;						- $BASS_SAMPLE_3D
;							- Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when calling
;							  _BASS_Init, and the stream must be mono (chans=1). The SPEAKER flags can not be used together
;							   with this flag.
;						- $BASS_SAMPLE_FX
;							- requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8
;							   effect implementations section for details. Use BASS_ChannelSetFX to add effects to the stream.
;						- $BASS_STREAM_AUTOFREE
;							- Automatically free the stream when playback ends.
;						- $BASS_STREAM_DECODE
;							- Decode the sample data, without playing it. Use BASS_ChannelGetData to retrieve decoded
;							  sample data. The BASS_SAMPLE_3D, BASS_STREAM_AUTOFREE and SPEAKER flags can not be used
;							  together with this flag. The BASS_SAMPLE_SOFTWARE and BASS_SAMPLE_FX flags are also ignored.
;						- $BASS_SPEAKER_xxx
;							- Speaker assignment flags. These flags have no effect when the stream is more than stereo.
;					-	$proc 	-	The user defined stream writing function, or one of the following.
;						- Callback function has the following paramaters:
;							- $handle
;								- The stream that needs writing.
;							- $buffer
;								- Pointer to the buffer to write the sample data in.
;								  The data should be as follows: 8-bit samples are unsigned,
;								  16-bit samples are signed, 32-bit floating-point samples range from -1 to +1.
;							- $length
;								- The maximum number of bytes to write.
;							- $user
;								- The user instance data given when BASS_StreamCreate was called.
;						- $STREAMPROC_DUMMY
;							- Create a "dummy" stream. A dummy stream doesn't have any sample data of its own,
;							  but a decoding dummy stream (with BASS_STREAM_DECODE flag) can be used to apply
;							  DSP/FX processing to any sample data, by setting DSP/FX on the stream and feeding
;							   the data through BASS_ChannelGetData. The dummy stream should have the same sample
;							   format as the data being fed through it.
;						- $STREAMPROC_PUSH
;							- Create a "push" stream. Instead of BASS pulling data from a STREAMPROC function,
;							  data is pushed to BASS via BASS_StreamPutData.
;					- 	$user 	-	user User instance data to pass to the callback function. Unused when creating
;									a dummy or push stream. (Pointer!)
; Return values .: Success      - Returns a handle to the stream
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT
;											- _BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL
;											- Only decoding channels (BASS_STREAM_DECODE) are allowed when using
;											  the "no sound" device. The BASS_STREAM_AUTOFREE flag is also unavailable
;											  to decoding channels.
;										- $BASS_ERROR_FORMAT
;											- The sample format is not supported by the device/drivers. If the stream
;											  is more than stereo or the BASS_SAMPLE_FLOAT flag is used, it could be
;											  that they are not supported.
;										- $BASS_ERROR_SPEAKER
;											- The specified SPEAKER flags are invalid. The device/drivers do not support
;											  them, they are attempting to assign a stereo stream to a mono speaker
;											  or 3D functionality is enabled.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
;										- $BASS_ERROR_NO3D
;											- Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN
;											- Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamCreate($freq, $chans, $flags, $proc = 0, $pUser = 0)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "ptr", "dword;ptr;dword;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf

	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_StreamCreate", "DWORD", $freq, "DWORD", $chans, "DWORD", $flags, "ptr", $proc, "ptr", $pUser)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($proc_s, $BASS_ret_[0])
EndFunc   ;==>_BASS_StreamCreate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamCreateFile
; Description ...: Creates a sample stream from an MP3, MP2, MP1, OGG, WAV, AIFF or plugin supported file.
; Syntax ........: _BASS_StreamCreateFile($mem, $file, $offset, $length, $flags)
; Parameters ....: -	$mem TRUE = stream the file from memory.
;					-	$file Filename (mem = FALSE) or a memory location (mem = TRUE).
;					-	$offset File offset to begin streaming from (only used if mem = FALSE).
;					-	$length Data length... 0 = use all data up to the end of the file (if mem = FALSE).
;					-	$flags Any combination of these flags.
;						-	$BASS_SAMPLE_FLOAT
;							- Use 32-bit floating-point sample data. See Floating-point channels for info.
;						-	$BASS_SAMPLE_MONO
;							- Decode/play the stream (MP3/MP2/MP1 only) in mono, reducing the CPU usage (
;							  if it was originally stereo). This flag is automatically applied if BASS_DEVICE_MONO was
;							  specified when calling BASS_Init.
;						-	$BASS_SAMPLE_SOFTWARE
;							- Force the stream to not use hardware mixing.
;						-	$BASS_SAMPLE_3D
;							- Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when calling
;							  _BASS_Init, and the stream must be mono. The SPEAKER flags can not be used together with this flag.
;						-	$BASS_SAMPLE_LOOP
;							- Loop the file. This flag can be toggled at any time using BASS_ChannelFlags.
;						-	$BASS_SAMPLE_FX
;							- requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8
;							  effect implementations section for details. Use BASS_ChannelSetFX to add effects to the stream.
;						-	$BASS_STREAM_PRESCAN
;							- Enable pin-point accurate seeking (to the exact byte) on the MP3/MP2/MP1 stream. This also
;							  increases the time taken to create the stream, due to the entire file being pre-scanned
;							  for the seek points.
;						-	$BASS_STREAM_AUTOFREE
;							- Automatically free the stream when playback ends.
;						-	$BASS_STREAM_DECODE
;							- Decode the sample data, without playing it. Use BASS_ChannelGetData to retrieve decoded
;							  sample data. The BASS_SAMPLE_3D, BASS_STREAM_AUTOFREE and SPEAKER flags can not be used
;							  together with this flag. The BASS_SAMPLE_SOFTWARE and BASS_SAMPLE_FX flags are also ignored.
;						-	$BASS_SPEAKER_xxx
;							- Speaker assignment flags. These flags have no effect when the stream is more than stereo.
;						-	$BASS_UNICODE
;							- file is a Unicode (UTF-16) filename.
; Return values .: Success      - Returns a handle to the stream
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT
;											- _BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL
;											- Only decoding channels (BASS_STREAM_DECODE) are allowed when using the "no sound"
;											  device. The BASS_STREAM_AUTOFREE flag is also unavailable to decoding channels.
;										- $BASS_ERROR_ILLPARAM
;											- The length must be specified when streaming from memory.
;										- $BASS_ERROR_FILEOPEN
;											- The file could not be opened.
;										- $BASS_ERROR_FILEFORM
;											- The file's format is not recognised/supported.
;										- $BASS_ERROR_CODEC
;											- The file uses a codec that's not available/supported. This can apply to WAV and
;											  AIFF files, and also MP3 files when using the "MP3-free" BASS version.
;										- $BASS_ERROR_FORMAT
;											- The sample format is not supported by the device/drivers. If the stream is more
;											  than stereo or the BASS_SAMPLE_FLOAT flag is used, it could be that they are
;											  not supported.
;										- $BASS_ERROR_SPEAKER
;											- The specified SPEAKER flags are invalid. The device/drivers do not support them,
;											  they are attempting to assign a stereo stream to a mono speaker or 3D
;											  functionality is enabled.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
;										- $BASS_ERROR_NO3D
;											- Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN
;											- Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamCreateFile($mem, $file, $offset, $length, $flags)
	Local $tpFile = "ptr"
	If IsString($file) Then $tpFile = "wstr"
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_StreamCreateFile", "int", $mem, $tpFile, $file, "uint64", $offset, "uint64", $length, "DWORD", BitOR($flags, $BASS_UNICODE))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_StreamCreateFile

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamCreateURL
; Description ...: Creates a sample stream from an MP3, MP2, MP1, OGG, WAV, AIFF or plugin supported file on the internet, optionally receiving the downloaded data in a callback function.
; Syntax ........: _BASS_StreamCreateURL($url, $offset, $flags, $proc = 0, $user = 0)
; Parameters ....: -	$url
;						- URL of the file to stream. Should begin with "http://" or "ftp://".
;					-	$offset
;						- File position to start streaming from. This is ignored by some servers, specifically when the
;					      length is unknown/undefined.
;					-	$flags Any combination of these flags.
;						-	$BASS_SAMPLE_FLOAT
;							- Use 32-bit floating-point sample data. See Floating-point channels for info.
;						-	$BASS_SAMPLE_MONO
;							- Decode/play the stream (MP3/MP2/MP1 only) in mono, reducing the CPU usage
;							  (if it was originally stereo). This flag is automatically applied if BASS_DEVICE_MONO was
;							  specified when calling BASS_Init.
;						-	$BASS_SAMPLE_SOFTWARE
;							- Force the stream to not use hardware mixing.
;						-	$BASS_SAMPLE_3D
;							- Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when calling
;							  _BASS_Init, and the stream must be mono. The SPEAKER flags can not be used together with this
;							  flag.
;						-	$BASS_SAMPLE_LOOP
;							- Loop the file. This flag can be toggled at any time using BASS_ChannelFlags. This flag is ignored
;							   when streaming in blocks (BASS_STREAM_BLOCK).
;						-	$BASS_SAMPLE_FX
;							- requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8
;							  effect implementations section for details. Use BASS_ChannelSetFX to add effects to the stream.
;						-	$BASS_STREAM_RESTRATE
;							- Restrict the download rate of the file to the rate required to sustain playback. If this flag
;							  is not used, then the file will be downloaded as quickly as the user's internet connection allows.
;						-	$BASS_STREAM_BLOCK
;							- Download and play the file in smaller chunks, instead of downloading the entire file to memory.
;							  Uses a lot less memory than otherwise, but it's not possible to seek or loop the stream; once
;							  it's ended, the file must be opened again to play it again. This flag will automatically be applied
;							   when the file length is unknown, for example with Shout/Icecast streams. This flag also has the
;							  effect of restricting the download rate.
;						-	$BASS_STREAM_STATUS
;							- Pass status info (HTTP/ICY tags) from the server to the DOWNLOADPROC callback during connection.
;							   This can be useful to determine the reason for a failure.
;						-	$BASS_STREAM_AUTOFREE
;							- Automatically free the stream when playback ends.
;						-	$BASS_STREAM_DECODE
;							- Decode the sample data, without playing it. Use BASS_ChannelGetData to retrieve decoded sample
;							  data. The BASS_SAMPLE_3D, BASS_STREAM_AUTOFREE and SPEAKER flags can not be used together with
;							  this flag. The BASS_SAMPLE_SOFTWARE and BASS_SAMPLE_FX flags are also ignored.
;						-	$BASS_SPEAKER_xxx
;							- Speaker assignment flags. These flags have no effect when the stream is more than stereo.
;					-	$proc Callback function to receive the file as it is downloaded... NULL = no callback.
;					-	$user User instance data to pass to the callback function.
; Return values .: Success      - Returns the stream handle
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT
;											- _BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOTAVAIL
;											- Only decoding channels (BASS_STREAM_DECODE) are allowed when using the
;											  "no sound" device. The BASS_STREAM_AUTOFREE flag is also unavailable to
;											  decoding channels.
;										- $BASS_ERROR_NONET
;											- No internet connection could be opened. Can be caused by a bad proxy setting.
;										- $BASS_ERROR_ILLPARAM
;											- url is not a valid URL.
;										- $BASS_ERROR_TIMEOUT
;											- The server did not respond to the request within the timeout period, as set with
;											  the BASS_CONFIG_NET_TIMEOUT config option.
;										- $BASS_ERROR_FILEOPEN
;											- The file could not be opened.
;										- $BASS_ERROR_FILEFORM
;											- The file's format is not recognised/supported.
;										- $BASS_ERROR_CODEC
;											- The file uses a codec that's not available/supported. This can apply to WAV and
;											  AIFF files, and also MP3 files when using the "MP3-free" BASS version.
;										- $BASS_ERROR_FORMAT
;											- The sample format is not supported by the device/drivers. If the stream is more
;											  than stereo or the BASS_SAMPLE_FLOAT flag is used, it could be that they are not
;											  supported.
;										- $BASS_ERROR_SPEAKER
;											- The specified SPEAKER flags are invalid. The device/drivers do not support them,
;											  they are attempting to assign a stereo stream to a mono speaker or 3D functionality
;											  is enabled.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
;										- $BASS_ERROR_NO3D
;											- Could not initialize 3D support.
;										- $BASS_ERROR_UNKNOWN
;											- Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamCreateURL($url, $offset, $flags, $proc = 0, $user = 0)
	Local $dcProc = -1
	If IsString($proc) Then
		$dcProc = DllCallbackRegister($proc, "ptr", "ptr;dword;ptr;")
		$proc = DllCallbackGetPtr($dcProc)
	EndIf
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_StreamCreateURL", "str", $url, "DWORD", $offset, "DWORD", $flags, "ptr", $proc, "ptr", $user)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $dcProc <> -1 Then DllCallbackFree($dcProc)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($dcProc, $BASS_ret_[0])
EndFunc   ;==>_BASS_StreamCreateURL

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamFree
; Description ...: Frees a sample stream's resources, including any sync/DSP/FX it has.
; Syntax ........: _BASS_StreamFree($handle)
; Parameters ....: -	$handle		-	Handle to previously opened stream.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamFree($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_StreamFree", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_StreamFree

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamGetFilePosition
; Description ...: Retrieves the file position/status of a stream.
; Syntax ........: _BASS_StreamGetFilePosition($handle, $mode)
; Parameters ....: -	$handle
;							- The stream handle.
;					-	$mode
;							- The file position/status to retrieve. One of the following.
;								- $BASS_FILEPOS_BUFFER
;									- The amount of data in the buffer of an internet file stream or "buffered" user file
;									  stream. Unless streaming in blocks, this is the same as BASS_FILEPOS_DOWNLOAD.
;								- $BASS_FILEPOS_CONNECTED
;									- Internet file stream or "buffered" user file stream is still connected? 0 = no, 1 = yes.
;								- $BASS_FILEPOS_CURRENT
;									- Position that is to be decoded for playback next. This will be a bit ahead of the position
;									   actually being heard due to buffering.
;								- $BASS_FILEPOS_END
;									- End of the file, in other words the file length. When streaming in blocks, the download
;									  buffer length is returned instead.
;								- $BASS_FILEPOS_DOWNLOAD
;									- Download progress of an internet file stream or "buffered" user file stream.
;								- $BASS_FILEPOS_START
;									- Start of stream data in the file.
; Return values .: Success      - Returns the requested file position/status is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											-Handle is not valid.
;										- $BASS_ERROR_NOTFILE
;											-The stream is not a file stream.
;										- $BASS_ERROR_NOTAVAIL
;											-The requested file position/status is not available.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamGetFilePosition($handle, $mode)
	Local $BASS_ret_ = DllCall($_ghBassDll, "uint64", "BASS_StreamGetFilePosition", "dword", $handle, "dword", $mode)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return __BASS_ReOrderULONGLONG($BASS_ret_[0])
EndFunc   ;==>_BASS_StreamGetFilePosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamPutData
; Description ...: Adds sample data to a "push" stream.
; Syntax ........: _BASS_StreamPutData($handle, $buffer, $length)
; Parameters ....: -	$handle The stream handle.
;					-	$buffer
;						- Pointer !!
;						- to the sample data.
;					-	$length
;						- The amount of data in bytes, optionally using the BASS_STREAMPROC_END flag to signify the end of the
;						  stream. 0 can be used to just check how much data is queued.
; Return values .: Success      - Returns the ammount of data queued.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											- handle is not valid.
;										- $BASS_ERROR_NOTAVAIL
;											- The stream is not using the push system.
;										- $BASS_ERROR_ENDED
;											- The stream has ended.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamPutData($handle, $buffer, $length)

	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_StreamPutData", "dword", $handle, "ptr", $buffer, "DWORD", $length)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_StreamPutData

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamCreateFileUser
; Description ...: Creates a sample stream from an MP3, MP2, MP1, OGG, WAV, AIFF or plugin supported file via user callback functions.
; Syntax ........: _BASS_StreamCreateFileUser($system, $flags, $proc = 0, $user = 0)
; Parameters ....: -	system File system to use, one of the following.
;                                          STREAMFILE_NOBUFFER Unbuffered.
;                                          STREAMFILE_BUFFER Buffered.
;                                          STREAMFILE_BUFFERPUSH Buffered, with the data pushed to BASS via BASS_StreamPutFileData.
;					-	flags Any combination of these flags.
;                                          $BASS_SAMPLE_FLOAT Use 32-bit floating-point sample data. See Floating-point channels for info.
;                                          $BASS_SAMPLE_MONO Decode/play the stream (MP3/MP2/MP1 only) in mono, reducing the CPU usage (if it was originally stereo). This flag is automatically applied if BASS_DEVICE_MONO was specified when calling BASS_Init.
;                                          $BASS_SAMPLE_SOFTWARE Force the stream to not use hardware mixing.
;                                          $BASS_SAMPLE_3D Enable 3D functionality. This requires that the BASS_DEVICE_3D flag was specified when calling BASS_Init, and the stream must be mono. The SPEAKER flags cannot be used together with this flag.
;                                          $BASS_SAMPLE_LOOP Loop the file. This flag can be toggled at any time using BASS_ChannelFlags. This flag is ignored when streaming in blocks (BASS_STREAM_BLOCK).
;                                          $BASS_SAMPLE_FX requires DirectX 8 or above Enable the old implementation of DirectX 8 effects. See the DX8 effect implementations section for details. Use BASS_ChannelSetFX to add effects to the stream.
;                                          $BASS_STREAM_PRESCAN Enable pin-point accurate seeking (to the exact byte) on the MP3/MP2/MP1 stream. This also increases the time taken to create the stream, due to the entire file being pre-scanned for the seek points. This flag is ignored when using a buffered file system.
;                                          $BASS_STREAM_RESTRATE Restrict the "download" rate of the file to the rate required to sustain playback. If this flag is not used, then the file will be downloaded as quickly as possible. This flag only has effect when using the STREAMFILE_BUFFER system.
;                                          $BASS_STREAM_BLOCK Download and play the file in smaller chunks. Uses a lot less memory than otherwise, but it is not possible to seek or loop the stream; once it has ended, the file must be opened again to play it again. This flag will automatically be applied when the file length is unknown. This flag also has the effect of restricting the download rate. This flag has no effect when using the STREAMFILE_NOBUFFER system.
;                                          $BASS_STREAM_AUTOFREE Automatically free the stream when playback ends.
;                                          $BASS_STREAM_DECODE Decode the sample data, without playing it. Use BASS_ChannelGetData to retrieve decoded sample data. The BASS_SAMPLE_3D, BASS_STREAM_AUTOFREE and SPEAKER flags cannot be used together with this flag. The BASS_SAMPLE_SOFTWARE and BASS_SAMPLE_FX flags are also ignored.
;                                          $BASS_SPEAKER_xxx Speaker assignment flags. These flags have no effect when the stream is more than stereo.
;					-	procs The user defined file functions.
;                   -   user User instance data to pass to the callback functions.
; Return values .: Success      - If successful, the new stream's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamCreateFileUser($system, $flags, $proc = 0, $user = 0)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "ptr", "ptr;ptr;ptr;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf
	Local $BASS_ret_ = DllCall($_ghBassDll, "hwnd", "BASS_StreamCreateFileUser", "dword", $system, "dword", $flags, "ptr", $proc, "ptr", $user)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($proc_s, $BASS_ret_[0])
EndFunc   ;==>_BASS_StreamCreateFileUser

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_StreamPutFileData
; Description ...: Adds data to a "push buffered" user file stream's buffer.
; Syntax ........: _BASS_StreamPutFileData($handle, $buffer, $length)
; Parameters ....: -	$handle 	-	The stream handle.
;					-	$buffer 	-	Pointer (!) to the file data.
;					-	$length 	-	The amount of data in bytes, or BASS_FILEDATA_END to end the file.
; Return values .: Success      - Returns the number of bytes read from buffer
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											- handle is not valid.
;										- $BASS_ERROR_NOTAVAIL
;											- The stream is not using the STREAMFILE_BUFFERPUSH file system.
;										- $BASS_ERROR_ENDED
;											- The file has ended.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_StreamPutFileData($handle, $buffer, $length)

	Local $BASS_ret_ = DllCall($_ghBassDll, "DWORD", "BASS_StreamPutFileData", "dword", $handle, "ptr", $buffer, "dword", $length)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_StreamPutFileData

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordGetDeviceInfo
; Description ...: Retrieves information on a recording device.
; Syntax ........: _BASS_RecordGetDeviceInfo($device)
; Parameters ....: -	$device 	-	The device to get the information of... 0 = first.
; Return values .: Success      - Returns an array containg the device info.
;									- [0] = Name
;										- Description of the device.
;									- [1] = Driver
;										- driver The filename of the driver...
;										   NULL = no driver ("no sound" device). On systems that can use both VxD and WDM
;										   drivers (Windows Me/98SE), this will reveal which type of driver is being used.
;										   Further information can be obtained from the file using the GetFileVersionInfo
;										   Win32 API function.
;									- [2] = Flags
;										- The device's current status... a combination of these flags.
;											- BASS_DEVICE_ENABLED
;												- The device is enabled. It will not be possible to initialize the
;												  device if this flag is not present.
;											- $BASS_DEVICE_DEFAULT
;												- The device is the system default.
;											- $BASS_DEVICE_INIT
;												- The device is initialized, ie. BASS_Init or BASS_RecordInit has been called.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DX
;											- A sufficient version of DirectX is not installed.
;										- $BASS_ERROR_DEVICE
;											- device is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordGetDeviceInfo($device)
	Local $aRet[3]
	Local $sRet = DllStructCreate($BASS_DEVICEINFO)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordGetDeviceInfo", "dword", $device, "ptr", DllStructGetPtr($sRet))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	$aRet[0] = _BASS_PtrStringRead(DllStructGetData($sRet, 1))
	$aRet[1] = _BASS_PtrStringRead(DllStructGetData($sRet, 2))
	$aRet[2] = DllStructGetData($sRet, 3)
	Return $aRet
EndFunc   ;==>_BASS_RecordGetDeviceInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordInit
; Description ...: Initializes a recording device.
; Syntax ........: _BASS_RecordInit($device)
; Parameters ....: -	$device 	-	The device to use...
;						-	-1 = default device
;						-	0 = first
;						-	_BASS_RecordGetDeviceInfo can be used to enumerate the available devices.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DX
;											- A sufficient version of DirectX is not installed.
;										- $BASS_ERROR_DEVICE d
;											- evice is invalid.
;										- $BASS_ERROR_ALREADY
;											- The device has already been initialized. _BASS_RecordFree must be called before
;											  it can be initialized again.
;										- $BASS_ERROR_DRIVER
;											- There is no available device driver
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordInit($device)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordInit", "int", $device)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_RecordInit

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordSetDevice
; Description ...: Sets the recording device to use for subsequent calls in the current thread.
; Syntax ........: _BASS_RecordSetDevice($device)
; Parameters ....: -	$device 	-	The device to use... 0 = first.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_DEVICE 	-	device is invalid.
;										- $BASS_ERROR_INIT 		-	The device has not been initialized.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordSetDevice($device)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordSetDevice", "dword", $device)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_RecordSetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordGetDevice
; Description ...: Retrieves the recording device setting of the current thread.
; Syntax ........: _BASS_RecordGetDevice()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT
;											- _BASS_RecordInit has not been successfully called or
;											  there are no initialized devices.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordGetDevice()
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_RecordGetDevice")
	If @error Then Return SetError(1, 1, 0)
	Switch $BASS_ret_[0]
		Case $BASS_DWORD_ERR
			Return SetError(_BASS_ErrorGetCode(), 0, 0)
		Case 4294967295 ; dword -1
			Return SetError(0, 0, -1)
		Case Else
			Return $BASS_ret_[0]
	EndSwitch
EndFunc   ;==>_BASS_RecordGetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordFree
; Description ...: Frees all resources used by the recording device.
; Syntax ........: _BASS_RecordFree()
; Parameters ....:
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT	-	_BASS_RecordInit has not been successfully called.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordFree()
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordFree")
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_RecordFree

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordGetInfo
; Description ...: Retrieves information on the recording device being used.
; Syntax ........: _BASS_RecordGetInfo()
; Parameters ....:
; Return values .: Success      - Returns an array containg information about the recording device.
;									-[0]	-	The device's capabilities... a combination of these flags.
;										- $DSCCAPS_EMULDRIVER 	-	The device's drivers do NOT have DirectSound recording
;																	support, so it is being emulated.
;										- $DSCCAPS_CERTIFIED 	-	The device driver has been certified by Microsoft.
;									-[1]	-	The standard formats supported by the device... a combination of these flags.
;										- $WAVE_FORMAT_1M08		-	11025hz, Mono, 8-bit
;										- $WAVE_FORMAT_1S08		-	11025hz, Stereo, 8-bit
;										- $WAVE_FORMAT_1M16 	-	11025hz, Mono, 16-bit
;										- $WAVE_FORMAT_1S16 	-	11025hz, Stereo, 16-bit
;										- $WAVE_FORMAT_2M08 	-	22050hz, Mono, 8-bit
;										- $WAVE_FORMAT_2S08 	-	22050hz, Stereo, 8-bit
;										- $WAVE_FORMAT_2M16 	-	22050hz, Mono, 16-bit
;										- $WAVE_FORMAT_2S16 	-	22050hz, Stereo, 16-bit
;										- $WAVE_FORMAT_4M08 	-	44100hz, Mono, 8-bit
;										- $WAVE_FORMAT_4S08 	-	44100hz, Stereo, 8-bit
;										- $WAVE_FORMAT_4M16 	-	44100hz, Mono, 16-bit
;										- $WAVE_FORMAT_4S16 	-	44100hz, Stereo, 16-bit
;									-[2]	-	The number of input sources available to the device.
;									-[3]	-	TRUE = only one input may be active at a time.
;									-[4]	-	The device's current input sample rate
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 	-	_BASS_RecordInit has not been successfully called.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordGetInfo()
	Local $aRet[5]
	Local $S_BASS_RECORDINFO = DllStructCreate($BASS_RECORDINFO)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordGetInfo", "ptr", DllStructGetPtr($S_BASS_RECORDINFO))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	For $i = 0 To 4
		$aRet[$i] = DllStructGetData($S_BASS_RECORDINFO, $i + 1)
	Next
	Return $aRet
EndFunc   ;==>_BASS_RecordGetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordGetInputName
; Description ...: Retrieves the text description of a recording input source.
; Syntax ........: _BASS_RecordGetInputName($input)
; Parameters ....: -	$input 	-	The input to get the description of... 0 = first, -1 = master.
; Return values .: Success      - Returns the description
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_RecordInit has not been successfully called.
;										- $BASS_ERROR_ILLPARAM	-	Input is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordGetInputName($input)
	Local $BASS_ret_ = DllCall($_ghBassDll, "ptr", "BASS_RecordGetInputName", "int", $input)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = "" Then Return SetError(_BASS_ErrorGetCode(), 0, $BASS_ret_[0])
	Return _BASS_PtrStringRead($BASS_ret_[0])
EndFunc   ;==>_BASS_RecordGetInputName

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordSetInput
; Description ...: Adjusts the settings of a recording input source.
; Syntax ........: _BASS_RecordSetInput($inputn, $flags, $volume)
; Parameters ....: -	$input		-	The input to adjust the settings of... 0 = first, -1 = master.
;					-	$flags 		-	The new setting... a combination of these flags.
;						- $BASS_INPUT_OFF
;							-	Disable the input. This flag can't be used when the device supports only one input at a time.
;						- $BASS_INPUT_ON
;							-	Enable the input. If the device only allows one input at a time, then any previously enabled
;								input will be disabled by this.
;					-	$volume		-	The volume level... 0 (silent) to 1 (max), less than 0 = leave current.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_RecordInit has not been successfully called.
;										- $BASS_ERROR_ILLPARAM 	-	input or volume is invalid.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordSetInput($input, $flags, $volume)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_RecordSetInput", "int", $input, "DWORD", $flags, "float", $volume)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_RecordSetInput

; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_RecordGetInput
; Description ...: Retrieves the current settings of a recording input source.
; Syntax ........: _BASS_RecordGetInput($inputn)
; Parameters ....: -	$input		-	The input to get the settings of... 0 = first, -1 = master.
; Return values .: Success      - Returns an array containg current settings.
;									- [0] 	- 	Settings.
;										- $BASS_INPUT_OFF
;											-	flag will be set if the input is disabled
;										- $BASS_INPUT_TYPE_DIGITAL
;											-	Digital input source, for example, a DAT or audio CD.
;										- $BASS_INPUT_TYPE_LINE
;											-	Line-in. On some devices, "Line-in" may be combined with other analog sources
;												into a single BASS_INPUT_TYPE_ANALOG input.
;										- $BASS_INPUT_TYPE_MIC
;											-	Microphone.
;										- $BASS_INPUT_TYPE_SYNTH
;											-	Internal MIDI synthesizer.
;										- $BASS_INPUT_TYPE_CD
;											-	Analog audio CD.
;										- $BASS_INPUT_TYPE_PHONE
;											-	Telephone.
;										- $BASS_INPUT_TYPE_SPEAKER
;											-	PC speaker.
;										- $BASS_INPUT_TYPE_WAVE
;											-	The device's WAVE/PCM output.
;										- $BASS_INPUT_TYPE_AUX
;											-	Auxiliary. Like "Line-in", "Aux" may be combined with other analog sources
;												into a single BASS_INPUT_TYPE_ANALOG input on some devices.
;										- $BASS_INPUT_TYPE_ANALOG
;											-	Analog, typically a mix of all analog sources.
;										- $BASS_INPUT_TYPE_UNDEF
;											-	Anything that is not covered by the other types.
;									- [1] 	- 	Volume
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_RecordInit has not been successfully called.
;										- $BASS_ERROR_ILLPARAM 	-	Input is invalid.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordGetInput($input)
	Local $aRet[2]
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_RecordGetInput", "int", $input, "float*", 0)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	$aRet[0] = $BASS_ret_[0]
	$aRet[1] = $BASS_ret_[2]
	Return $aRet
EndFunc   ;==>_BASS_RecordGetInput

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_RecordStart
; Description ...: Starts recording.
; Syntax ........: _BASS_RecordStart($freq, $chans, $flags, $proc = 0, $pUser = 0)
; Parameters ....: -	$freq 	-	The sample rate to record at.
;					-	$chans 	-	The number of channels... 1 = mono, 2 = stereo, etc...
;					-	$flags 	-	Any combination of these flags.
;						-	$BASS_SAMPLE_8BITS
;							-	Use 8-bit resolution. If neither this or the BASS_SAMPLE_FLOAT flags are specified,
;								then the recorded data is 16-bit.
;						-	$BASS_SAMPLE_FLOAT
;							-	Use 32-bit floating-point sample data. See Floating-point channels for info.
;						-	$BASS_RECORD_PAUSE
;							-	Start the recording paused. Use BASS_ChannelPlay to start it.
;					-	$proc		- 	Callback Function
;						-	$handle		-	The recording that the data is from.
;						-	$buffer 	-	Pointer to the recorded sample data. The sample data is in standard Windows
;											PCM format, that is 8-bit samples are unsigned, 16-bit samples are signed,
;											32-bit floating-point samples range from -1 to +1.
;						-	$length		-	The number of bytes in the buffer.
;						-	$user	-	The user instance data given when BASS_RecordStart was called.
;					-	$user 		-	User instance data to pass to the callback function.
; Return values .: Success      - Returns the new recording's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_RecordInit has not been successfully called.
;										- $BASS_ERROR_ALREADY 	-	Recording is already in progress. You must stop the current
;																	recording (BASS_ChannelStop) before calling this function
;																	again. On Windows XP, multiple simultaneous recordings
;																	can be made from the same device.
;										- $BASS_ERROR_NOTAVAIL  -	The recording device is not available. Another
;																	application may already be recording with it,
;																	or it could be a half-duplex device and is
;																	currently being used for playback.
;										- $BASS_ERROR_FORMAT  	-	The specified format is not supported. If using the
;																	$BASS_SAMPLE_FLOAT flag, it could be that floating-point
;																	recording is not supported.
;										- $BASS_ERROR_MEM  		-	There is insufficient memory.
;										- $BASS_ERROR_UNKNOWN  	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_RecordStart($freq, $chans, $flags, $proc = 0, $pUser = 0)
	Local $dcProc = -1
	If IsString($proc) Then
		$dcProc = DllCallbackRegister($proc, "int", "dword;ptr;dword;ptr;")
		$proc = DllCallbackGetPtr($dcProc)
	EndIf
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_RecordStart", "DWORD", $freq, "DWORD", $chans, "DWORD", $flags, "ptr", $proc, "ptr", $pUser)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $dcProc <> -1 Then DllCallbackFree($dcProc)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($dcProc, $BASS_ret_[0])
EndFunc   ;==>_BASS_RecordStart

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelBytes2Seconds
; Description ...: Translates a byte position into time (seconds), based on a channel's format.
; Syntax ........: _BASS_ChannelBytes2Seconds($handle, $pos)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$pos		-	 The position to translate.
; Return values .: Success      - Returns translated length
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	Handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelBytes2Seconds($handle, $pos)
	Local $BASS_ret_ = DllCall($_ghBassDll, "double", "BASS_ChannelBytes2Seconds", "dword", $handle, "uint64", $pos)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] < 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelBytes2Seconds

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSeconds2Bytes
; Description ...: Translates a time (seconds) position into bytes, based on a channel's format.
; Syntax ........: _BASS_ChannelSeconds2Bytes($handle, $pos)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$pos		-	 The position to translate.
; Return values .: Success      - Returns translated length
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	Handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSeconds2Bytes($handle, $pos)
	Local $BASS_ret_ = DllCall($_ghBassDll, "uint64", "BASS_ChannelSeconds2Bytes", "dword", $handle, "double", $pos)
	If @error Then Return SetError(1, 1, 0)
	$BASS_ret_[0] = __BASS_ReOrderULONGLONG($BASS_ret_[0])
	If $BASS_ret_[0] = -1 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	If Not $BASS_ret_[0] And $pos > 0 Then ;workaround for X64
		Local $iSec = _BASS_ChannelBytes2Seconds($handle, 1000000)
		If $iSec > 0 Then Return $pos * 1000000 / $iSec
	EndIf

	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSeconds2Bytes

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetDevice
; Description ...: Retrieves the device that a channel is using.
; Syntax ........: _BASS_ChannelGetDevice($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns device number
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......: Recording devices are indicated by the HIWORD of the return value being 1,
;				   when this function is called with a HRECORD channel.
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetDevice($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_ChannelGetDevice", "dword", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetDevice
; Description ...: Changes the device that a stream, MOD music or sample is using.
; Syntax ........: _BASS_ChannelSetDevice($handle, $device)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HMUSIC, HSTREAM, HSAMPLE
;					-	$device 	-	The device to use... 0 = no sound, 1 = first real output device.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE
;											- handle is not a valid channel.
;										- $BASS_ERROR_DEVICE
;											- device is invalid.
;										- $BASS_ERROR_INIT
;											- The requested device has not been initialized.
;										- $BASS_ERROR_ALREADY
;											- The channel is already using the requested device.
;										- $BASS_ERROR_NOTAVAIL
;											- Only decoding channels are allowed to use the "no sound" device.
;										- $BASS_ERROR_FORMAT
;											- The sample format is not supported by the device/drivers. If the channel is more
;											  than stereo or the BASS_SAMPLE_FLOAT flag is used, it could be that they
;											  are not supported.
;										- $BASS_ERROR_MEM
;											- There is insufficient memory.
;										- $BASS_ERROR_UNKNOWN
;											- Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetDevice($handle, $device)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSetDevice", "dword", $handle, "dword", $device)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSetDevice

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelIsActive
; Description ...: Checks if a sample, stream, or MOD music is active (playing) or stalled. Can also check if a recording is in progress.
; Syntax ........: _BASS_ChannelIsActive($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns one of the following
;									- $BASS_ACTIVE_STOPPED	-	The channel is not active, or handle is not a valid channel.
;									- $BASS_ACTIVE_PLAYING 	-	The channel is playing (or recording).
;									- $BASS_ACTIVE_PAUSED 	-	The channel is paused.
;									- $BASS_ACTIVE_STALLED 	-	Playback of the stream has been stalled due to a lack of sample
;																data. The playback will automatically resume once there is
;																sufficient data to do so.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelIsActive($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelIsActive", "DWORD", $handle)
	If @error Then Return SetError(1, 1, 0)
	;If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(),0,0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelIsActive

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetInfo
; Description ...:
; Syntax ........: _BASS_ChannelGetInfo($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns an array containg information about the channel
;									- [0]	-	freq	-	Default playback rate.
;									- [1]	-	chans Number of channels... 1=mono, 2=stereo, etc...
;									- [2]	-	flags A combination of these flags.
;											-	$BASS_SAMPLE_8BITS
;												-	The channel's resolution is 8-bit. If neither this or the BASS_SAMPLE_FLOAT
;													flags are present, then the channel's resolution is 16-bit.
;											-	$BASS_SAMPLE_FLOAT
;												-	The channel's resolution is 32-bit floating-point.
;											-	$BASS_SAMPLE_LOOP
;												-	The channel is looped.
;											-	$BASS_SAMPLE_3D
;												-	The channel has 3D functionality enabled.
;											-	$BASS_SAMPLE_SOFTWARE
;												-	The channel is NOT using hardware mixing.
;											-	$BASS_SAMPLE_VAM
;												-	The channel is using the DX7 voice allocation and management features.
;													(HCHANNEL only)
;											-	$BASS_SAMPLE_MUTEMAX
;												-	The channel is muted when at (or beyond) its max distance. (HCHANNEL)
;											-	$BASS_SAMPLE_FX
;												-	The channel has the "with FX flag" DX8 effect implementation enabled.
;													(HSTREAM/HMUSIC)
;											-	$BASS_STREAM_RESTRATE
;												-	The internet file download rate is restricted. (HSTREAM)
;											-	$BASS_STREAM_BLOCK
;												-	The internet file (or "buffered" user file) is streamed in small blocks.
;													 (HSTREAM)
;											-	$BASS_STREAM_AUTOFREE
;												-	The channel will automatically be freed when it ends. (HSTREAM/HMUSIC)
;											-	$BASS_STREAM_DECODE
;												-	The channel is a "decoding channel". (HSTREAM/HMUSIC/HRECORD)
;											-	$BASS_MUSIC_RAMP
;												-	The MOD music is using "normal" ramping. (HMUSIC)
;											-	$BASS_MUSIC_RAMPS
;												-	The MOD music is using "sensitive" ramping. (HMUSIC)
;											-	$BASS_MUSIC_SURROUND
;												-	The MOD music is using surround sound. (HMUSIC)
;											-	$BASS_MUSIC_SURROUND2
;												-	The MOD music is using surround sound mode 2. (HMUSIC)
;											-	$BASS_MUSIC_NONINTER
;												-	The MOD music is using non-interpolated mixing. (HMUSIC)
;											-	$BASS_MUSIC_FT2MOD
;												-	The MOD music is using FastTracker 2 .MOD playback. (HMUSIC)
;											-	$BASS_MUSIC_PT1MOD
;												-	The MOD music is using ProTracker 1 .MOD playback. (HMUSIC)
;											-	$BASS_MUSIC_STOPBACK
;												-	The MOD music will be stopped when a backward jump effect is played.
;													(HMUSIC)
;											-	$BASS_SPEAKER_xxx
;												-	Speaker assignment flags. (HSTREAM/HMUSIC)
;											-	$BASS_UNICODE
;												-	filename is a Unicode (UTF-16) filename.
;									- [3]	-	ctype The type of channel it is, which can be one of the following.
;											-	$BASS_CTYPE_SAMPLE
;												-	Sample channel. (HCHANNEL)
;											-	$BASS_CTYPE_STREAM
;												-	User sample stream. This can also be used as a flag to test if the
;													channel is any kind of HSTREAM.
;											-	$BASS_CTYPE_STREAM_OGG
;												-	Ogg Vorbis format stream.
;											-	$BASS_CTYPE_STREAM_MP1
;												-	MPEG layer 1 format stream.
;											-	$BASS_CTYPE_STREAM_MP2
;												-	MPEG layer 2 format stream.
;											-	$BASS_CTYPE_STREAM_MP3
;												-	MPEG layer 3 format stream.
;											-	$BASS_CTYPE_STREAM_AIFF
;												-	Audio IFF format stream.
;											-	$BASS_CTYPE_STREAM_WAV_
;												-	PCM Integer PCM WAVE format stream.
;											-	$BASS_CTYPE_STREAM_WAV_
;												-	FLOAT Floating-point PCM WAVE format stream.
;											-	$BASS_CTYPE_STREAM_WAV
;												-	WAVE format flag. This can be used to test if the channel is any kind
;													 of WAVE format. The codec (the file's "wFormatTag") is specified in
;													the LOWORD.
;											-	$BASS_CTYPE_MUSIC_MOD
;												-	Generic MOD format music. This can also be used as a flag to test if
;													the channel is any kind of HMUSIC.
;											-	$BASS_CTYPE_MUSIC_MTM
;												-	MultiTracker format music.
;											-	$BASS_CTYPE_MUSIC_S3M
;												-	ScreamTracker 3 format music.
;											-	$BASS_CTYPE_MUSIC_XM
;												-	FastTracker 2 format music.
;											-	$BASS_CTYPE_MUSIC_IT
;												-	Impulse Tracker format music.
;											-	$BASS_CTYPE_MUSIC_MO3
;												-	MO3 format flag, used in combination with one of the BASS_CTYPE_MUSIC
;													types.
;											-	$BASS_CTYPE_RECORD
;												-	Recording channel. (HRECORD)
;									- [4]	-	origres The original resolution (bits per sample)... 0 = undefined.
;									- [5]	-	plugin The plugin that is handling the channel... 0 = not using a plugin.
;													Note this is only available with streams created using the plugin system
;													via the standard BASS stream creation functions, not those created by add
;													-on functions. Information on the plugin can be retrieved via
;													_BASS_PluginGetInfo.
;									- [6]	-	sample The sample that is playing on the channel. (HCHANNEL only)
;									- [7]	-	filename The filename associated with the channel. (HSTREAM only)
;
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetInfo($handle)
	Local $aRet[8], $dsInfo
	$dsInfo = DllStructCreate($BASS_CHANNELINFO)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelGetInfo", "DWORD", $handle, "ptr", DllStructGetPtr($dsInfo))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	For $i = 0 To 6
		$aRet[$i] = DllStructGetData($dsInfo, $i + 1)
	Next
	$aRet[7] = _BASS_PtrStringRead(DllStructGetData($dsInfo, 8), BitAND($aRet[2], $BASS_UNICODE) = $BASS_UNICODE)
	Return $aRet
EndFunc   ;==>_BASS_ChannelGetInfo

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetTags
; Description ...: BASS_ERROR_HANDLE handle is not valid.
; Syntax ........: _BASS_ChannelGetTags($handle, $tags)
; Parameters ....: -	$handle		-	Handle The channel handle...
;									-	HMUSIC, HSTREAM
;					-	$tags The tags/headers wanted... one of the following.
;						-	$BASS_TAG_ID3
;							-	ID3v1 tags. A pointer to a 128 byte block is returned. See http://www.id3.org/ID3v1 for details
;								of the block's structure.
;						-	$BASS_TAG_ID3V2
;							-	ID3v2 tags. A pointer to a variable length block is returned. ID3v2 tags are supported at both
;								the start and end of the file. See http://www.id3.org/ for details of the block's structure.
;						-	$BASS_TAG_LYRICS3
;							-	Lyrics3v2 tag. A single string is returned, containing the Lyrics3v2 information. See
;								http://www.id3.org/Lyrics3v2 for details of its format.
;						-	$BASS_TAG_OGG
;							-	OGG comments. A pointer to a series of null-terminated UTF-8 strings is returned, the final
;								string ending with a double null.
;						-	$BASS_TAG_VENDOR
;							-	OGG encoder. A single UTF-8 string is returned.
;						-	$BASS_TAG_HTTP
;							-	HTTP headers, only available when streaming from a HTTP server. A pointer to a series of
;								null-terminated strings is returned, the final string ending with a double null.
;						-	$BASS_TAG_ICY
;							-	ICY (Shoutcast) tags. A pointer to a series of null-terminated strings is returned, the
;								final string ending with a double null.
;						-	$BASS_TAG_META
;							-	Shoutcast metadata. A single string is returned, containing the current stream title and url
;								(usually omitted). The format of the string is: StreamTitle='xxx';StreamUrl='xxx';
;						-	$BASS_TAG_RIFF_INFO
;							-	RIFF/WAVE "INFO" tags. A pointer to a series of null-terminated strings is returned, the final
;								string ending with a double null. The tags are in the form of "XXXX=text", where "XXXX" is
;								the chunk ID..
;						-	$BASS_TAG_MUSIC_NAME
;							-	MOD music title.
;						-	$BASS_TAG_MUSIC_MESSAGE
;							-	MOD message text.
;						-	$BASS_TAG_MUSIC_INST
;							-	MOD instrument name. Only available with formats that have instruments, eg. IT and XM (and MO3).
;						-	$BASS_TAG_MUSIC_SAMPLE
;							-	MOD sample name.
; Return values .: Success      - Returns pointer to Tag data
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not valid.
;										- $BASS_ERROR_NOTAVAIL 	-	The requested tags are not available.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetTags($handle, $tags)
	Local $BASS_ret_ = DllCall($_ghBassDll, "ptr", "BASS_ChannelGetTags", "DWORD", $handle, "DWORD", $tags)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetTags

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelFlags
; Description ...:
; Syntax ........: _BASS_ChannelFlags($handle, $flags, $mask)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC or HSTREAM handles accepted.
;					-	$flags A combination of these flags.
;						-	$BASS_SAMPLE_LOOP
;							-	Loop the channel.
;						-	$BASS_STREAM_AUTOFREE
;							-	Automatically free the channel when playback ends. Note that the BASS_MUSIC_AUTOFREE flag is
;								identical to this flag. (HSTREAM/HMUSIC only)
;						-	$BASS_STREAM_RESTRATE
;							-	Restrict the download rate. (HSTREAM)
;						-	$BASS_MUSIC_NONINTER
;							-	Use non-interpolated sample mixing. (HMUSIC)
;						-	$BASS_MUSIC_SINCINTER
;							-	Use sinc interpolated sample mixing. (HMUSIC)
;						-	$BASS_MUSIC_RAMP
;							-	Use "normal" ramping. (HMUSIC)
;						-	$BASS_MUSIC_RAMPS
;							-	Use "sensitive" ramping. (HMUSIC)
;						-	$BASS_MUSIC_SURROUND
;							-	Use surround sound. (HMUSIC)
;						-	$BASS_MUSIC_SURROUND2
;							-	Use surround sound mode 2. (HMUSIC)
;						-	$BASS_MUSIC_FT2MOD
;							-	Use FastTracker 2 .MOD playback. (HMUSIC)
;						-	$BASS_MUSIC_PT1MOD
;							-	Use ProTracker 1 .MOD playback. (HMUSIC)
;						-	$BASS_MUSIC_POSRESET
;							-	Stop all notes when seeking. (HMUSIC)
;						-	$BASS_MUSIC_POSRESETEX
;							-	Stop all notes and reset BPM/etc when seeking. (HMUSIC)
;						-	$BASS_MUSIC_STOPBACK
;							-	Stop when a backward jump effect is played. (HMUSIC)
;						-	$BASS_SPEAKER_xxx
;							-	Speaker assignment flags. (HSTREAM/HMUSIC)
;					-	$mask
;						-	The flags (as above) to modify. Flags that are not included in this are left as they
;							are, so it can be set to 0 in order to just retrieve the current flags. To modify the
;							speaker flags, any of the BASS_SPEAKER_xxx flags can be used in the mask
;							(no need to include all of them).
; Return values .: Success      - Returns the updated flags
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	Handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelFlags($handle, $flags, $mask)
	Local $BASS_ret_ = DllCall($_ghBassDll, "DWORD", "BASS_ChannelFlags", "DWORD", $handle, "DWORD", $flags, "DWORD", $mask)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelFlags

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelUpdate
; Description ...: Updates the playback buffer of a stream or MOD music.
; Syntax ........: _BASS_ChannelUpdate($handle, $length)
; Parameters ....: -	$handle		-	Handle The channel handle...
;							-	HMUSIC or HSTREAM handles accepted.
;					-	$length 	-	The amount to render, in milliseconds...
;									-	0 = default (2 x update period). This is capped at the space available in the buffer.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_NOTAVAIL 	-	Decoding channels do not have playback buffers.
;										- $BASS_ERROR_ENDED 	-	The channel has ended.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelUpdate($handle, $length)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelUpdate", "DWORD", $handle, "DWORD", $length)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelUpdate

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelLock
; Description ...: Locks a stream, MOD music or recording channel to the current thread.
; Syntax ........: _BASS_ChannelLock($handle, $lock)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$lock
;						-	FALSE 	=	unlock the channel
;						-	TRUE 	= 	lock the channel
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelLock($handle, $lock)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelLock", "DWORD", $handle, "int", $lock)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelLock

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelPlay
; Description ...: Starts (or resumes) playback of a sample, stream, MOD music, or recording.
; Syntax ........: _BASS_ChannelPlay($handle, $restart)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$restart 	-	Restart playback from the beginning?
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not a valid channel.
;										- $BASS_ERROR_START 	-	The output is paused/stopped, use BASS_Start to start it.
;										- $BASS_ERROR_DECODE 	-	The channel is not playable, it's a "decoding channel".
;										- $BASS_ERROR_BUFLOST 	-	Should not happen... check that a valid window handle was
;																	used with BASS_Init.
;										- $BASS_ERROR_NOHW 		-	No hardware voices are available (HCHANNEL only). This only
;																	occurs if the sample was loaded/created with the
;																	BASS_SAMPLE_VAM flag, and BASS_VAM_HARDWARE is set in
;																	the sample's VAM mode, and there are no hardware voices
;																	available to play it.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelPlay($handle, $restart)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelPlay", "DWORD", $handle, "int", $restart)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelPlay

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelStop
; Description ...: Stops a sample, stream, MOD music, or recording.
; Syntax ........: _BASS_ChannelStop($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not a valid channel.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelStop($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelStop", "DWORD", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelStop

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelPause
; Description ...: Pauses a sample, stream, MOD music, or recording.
; Syntax ........: _BASS_ChannelPause($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_NOPLAY 	-	The channel is not playing (or handle is not a valid channel).
;										- $BASS_ERROR_DECODE 	-	The channel is not playable, it's a "decoding channel".
;										- $BASS_ERROR_ALREADY 	-	The channel is already paused.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelPause($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelPause", "DWORD", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelPause

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetAttribute
; Description ...: Sets the value of a channel's attribute.
; Syntax ........: _BASS_ChannelSetAttribute($handle, $attrib, $value)
; Parameters ....: -	$handle		-	Handle The channel handle...
;							-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$attrib 	-	The attribute to set the value of... one of the following.
;						-	$BASS_ATTRIB_EAXMIX EAX 		-	wet/dry mix. (HCHANNEL/HMUSIC/HSTREAM only)
;							-	$value = The wet / dry ratio
;										-	0 (full dry) to 1 (full wet),
;										-	-1 = automatically calculate the mix based on the distance (the default).
;						-	$BASS_ATTRIB_FREQ				-	Sample rate.
;							-	$value =  The sample rate... 100 (min) to 100000 (max), 0 = original rate (when the channel
;										  was created). The value will be rounded down to a whole number.
;						-	$BASS_ATTRIB_MUSIC_AMPLIFY 		-	Amplification level. (HMUSIC)
;							-	$value = Amplification level... 0 (min) to 100 (max). This will be rounded down to a whole
;										 number.
;						-	$BASS_ATTRIB_MUSIC_BPM			-	BPM. (HMUSIC)
;							-	$value = The BPM... 1 (min) to 255 (max). This will be rounded down to a whole number.
;						-	$BASS_ATTRIB_MUSIC_PANSEP 		-	Pan separation level. (HMUSIC)
;							-	$value = Pan separation... 0 (min) to 100 (max), 50 = linear. This will be rounded down to a
;										 whole number.
;						-	$BASS_ATTRIB_MUSIC_PSCALER 		-	Position scaler. (HMUSIC)
;							-	$value = The scaler... 1 (min) to 256 (max). This will be rounded down to a whole number.
;						-	$BASS_ATTRIB_MUSIC_SPEED 		-	Speed. (HMUSIC)
;							-	$value = The speed... 0 (min) to 255 (max). This will be rounded down to a whole number.
;						-	$BASS_ATTRIB_MUSIC_VOL_CHAN 	-	A channel volume level. (HMUSIC)
;							-	$value = The volume level... 0 (silent) to 1 (full).
;						-	$BASS_ATTRIB_MUSIC_VOL_GLOBAL 	-	Global volume level. (HMUSIC)
;							-	$value =  The global volume level... 0 (min) to 64 (max, 128 for IT format). This will be
;										 rounded down to a whole number.
;						-	$BASS_ATTRIB_MUSIC_VOL_INST A	-	n instrument/sample volume level. (HMUSIC)
;							-	$value = The volume level... 0 (silent) to 1 (full).
;						-	$BASS_ATTRIB_PAN 				-	Panning/balance position.
;							-	$value = The pan position... -1 (full left) to +1 (full right), 0 = centre.
;						-	$BASS_ATTRIB_VOL 				-	Volume level.
;							-	$value = The volume level... 0 (silent) to 1 (full).
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_ILLTYPE 	-	attrib is not valid.
;										- $BASS_ERROR_ILLPARAM 	-	value is not valid
;										- $BASS_ERROR_NOEAX 	-	The channel does not have EAX support. EAX only applies to
;																	3D channels that are mixed by the hardware/drivers.
;																	BASS_ChannelGetInfo can be used to check if a channel
;																	is being mixed by the hardware.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetAttribute($handle, $attrib, $value)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSetAttribute", "DWORD", $handle, "DWORD", $attrib, "float", $value)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSetAttribute

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetAttribute
; Description ...: Retrieves the value of a channel's attribute.
; Syntax ........: _BASS_ChannelGetAttribute($handle, $attrib)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$attrib		-	Refer to _BASS_ChannelSetAttribute.
; Return values .: Success      - Returns the requested attribute.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_ILLTYPE 	-	attrib is not valid.
;										- $BASS_ERROR_NOEAX 	-	The channel does not have EAX support. EAX only applies to
;																	3D channels that are mixed by the hardware/drivers.
;																	BASS_ChannelGetInfo can be used to check if a channel
;																	is being mixed by the hardware.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetAttribute($handle, $attrib)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelGetAttribute", "DWORD", $handle, "DWORD", $attrib, "float*", 0)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[3]
EndFunc   ;==>_BASS_ChannelGetAttribute

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSlideAttribute
; Description ...: Slides a channel's attribute from its current value to a new value.
; Syntax ........: _BASS_ChannelSlideAttribute($handle, $attrib, $value, $time)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$attrib		- 	Refer to _BASS_ChannelSetAttribute
;					-	$value		- 	Refer to _BASS_ChannelSetAttribute
;					-	$time		-	The length of time (in milliseconds) that it should take for the
;										attribute to reach the value.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_ILLTYPE 	-	attrib is not valid.
;										- $BASS_ERROR_NOEAX 	-	The channel does not have EAX support. EAX only applies to
;																	3D channels that are mixed by the hardware/drivers.
;																	BASS_ChannelGetInfo can be used to check if a channel
;																	is being mixed by the hardware.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSlideAttribute($handle, $attrib, $value, $time)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSlideAttribute", "DWORD", $handle, "DWORD", $attrib, "float", $value, "dword", $time)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSlideAttribute

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelIsSliding
; Description ...: Checks if an attribute (or any attribute) of a sample, stream, or MOD music is sliding.
; Syntax ........: _BASS_ChannelIsSliding($handle, $attrib)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$attrib		- 	Refer to _BASS_ChannelSetAttribute
; Return values .: Success      - Returns True if sliding.
;                  Failure      - Returns False
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelIsSliding($handle, $attrib)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelIsSliding", "DWORD", $handle, "DWORD", $attrib)
	If @error Then Return SetError(1, 1, 0)
	;If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(),0,0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelIsSliding

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGet3DAttributes
; Description ...: Retrieves the 3D attributes of a sample, stream, or MOD music channel with 3D functionality.
; Syntax ........: _BASS_ChannelGet3DAttributes($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns an array containing 3D attributes
;								-	[0]	-	$mode 		-	Refer to _BASS_ChannelGet3DAttributes
;								-	[1]	-	$min 		-	Refer to _BASS_ChannelGet3DAttributes
;								-	[2]	-	$max  		-	Refer to _BASS_ChannelGet3DAttributes
;								-	[3]	-	$iangle  	-	Refer to _BASS_ChannelGet3DAttributes
;								-	[4]	-	$oangle  	-	Refer to _BASS_ChannelGet3DAttributes
;								-	[5]	-	$outvol  	-	Refer to _BASS_ChannelGet3DAttributes
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	Handle is not a valid channel.
;										- $BASS_ERROR_NO3D 		-	The channel does not have 3D functionality.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGet3DAttributes($handle)
	Local $aRet[6]
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelGet3DAttributes", "DWORD", $handle, "DWORD*", 0, "float*", 0, "float*", 0, "dword*", 0, "dword*", 0, "float*", 0)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	$aRet[0] = $BASS_ret_[2]
	$aRet[1] = $BASS_ret_[3]
	$aRet[2] = $BASS_ret_[4]
	$aRet[3] = $BASS_ret_[5]
	$aRet[4] = $BASS_ret_[6]
	$aRet[5] = $BASS_ret_[7]
	Return $aRet
EndFunc   ;==>_BASS_ChannelGet3DAttributes

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSet3DAttributes
; Description ...: Sets the 3D attributes of a sample, stream, or MOD music channel with 3D functionality.
; Syntax ........: _BASS_ChannelSet3DAttributes($handle, $mode, $min, $max, $iangle, $oangle, $outvol)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$handle 	-	The channel handle... a HCHANNEL, HMUSIC, HSTREAM.
;					-	$mode 		-	The 3D processing mode... one of these flags, -1 = leave current. BASS_3DMODE_NORMAL
;										Normal 3D processing.
;						-	$BASS_3DMODE_RELATIVE The channel's 3D position (position/velocity/orientation) is relative to
;										the listener. When the listener's position/velocity/orientation is changed with
;										_BASS_Set3DPosition, the channel's position relative to the listener does not change.
;						-	$BASS_3DMODE_OFF Turn off 3D processing on the channel, the sound will be played in the centre.
;					-	$min 		-	The minimum distance. The channel's volume is at maximum when the listener is within
;										this distance... 0 or less = leave current.
;					-	$max 		-	The maximum distance. The channel's volume stops decreasing when the listener is
;										beyond this distance... 0 or less = leave current.
;					-	$iangle 	-	The angle of the inside projection cone in degrees...
;										0(no cone) to 360 (sphere), -1 = leave current.
;					-	$oangle 	-	The angle of the outside projection cone in degrees...
;										0 (no cone) to 360 (sphere), -1 = leave current.
;					-	$outvol 	-	The delta-volume outside the outer projection cone...
;										0 (silent) to 1 (same as inside the cone), less than 0 = leave current.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_NO3D 		-	The channel does not have 3D functionality.
;										- $BASS_ERROR_ILLPARAM 	-	One or more of the attribute values is invalid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSet3DAttributes($handle, $mode, $min, $max, $iangle, $oangle, $outvol)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSet3DAttributes", "DWORD", $handle, "DWORD", $mode, "float", $min, "float", $max, "DWORD", $iangle, "DWORD", $oangle, "float", $outvol)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSet3DAttributes

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSet3DPosition
; Description ...: Sets the 3D position of a sample, stream, or MOD music channel with 3D functionality.
; Syntax ........: _BASS_ChannelSet3DPosition($handle, $pos = 0, $orient = 0, $vel = 0)
; Parameters ....: -	$handle		-	Handle The channel handle...
;							-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$pos		-	Position of the sound
;							- [0]	=	x +ve = right, -ve = left.
;							- [1]	=	y +ve = up, -ve = down.
;							- [2]	=	z +ve = front, -ve = behind.
;					-	$prient		-	Orientation of the sound
;							- [0]	=	x +ve = right, -ve = left.
;							- [1]	=	y +ve = up, -ve = down.
;							- [2]	=	z +ve = front, -ve = behind.
;					-	$vel		-	Velocity of the sound
;							- [0]	=	x +ve = right, -ve = left.
;							- [1]	=	y +ve = up, -ve = down.
;							- [2]	=	z +ve = front, -ve = behind.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_NO3D 		-	The channel does not have 3D functionality.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSet3DPosition($handle, $pos = 0, $orient = 0, $vel = 0)

	Local $pos_s, $vel_s, $orient_s, $pPos = 0, $pVel = 0, $pOrient = 0

	If UBound($pos, 0) = 1 And UBound($pos, 1) > 2 Then
		$pos_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($pos_s, "X", $pos[0])
		DllStructSetData($pos_s, "Y", $pos[1])
		DllStructSetData($pos_s, "Z", $pos[2])
		$pPos = DllStructGetPtr($pos_s)
	EndIf

	If UBound($orient, 0) = 1 And UBound($orient, 1) > 2 Then
		$orient_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($orient_s, "X", $orient[0])
		DllStructSetData($orient_s, "Y", $orient[1])
		DllStructSetData($orient_s, "Z", $orient[2])
		$pOrient = DllStructGetPtr($orient_s)
	EndIf

	If UBound($vel, 0) = 1 And UBound($vel, 1) > 2 Then
		$vel_s = DllStructCreate($BASS_3DVECTOR)
		DllStructSetData($vel_s, "X", $vel[0])
		DllStructSetData($vel_s, "Y", $vel[1])
		DllStructSetData($vel_s, "Z", $vel[2])
		$pVel = DllStructGetPtr($vel_s)
	EndIf

	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSet3DPosition", "DWORD", $handle, "PTR", $pPos, "PTR", $pOrient, "PTR", $pVel)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSet3DPosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGet3DPosition
; Description ...: Retrieves the 3D position of a sample, stream, or MOD music channel with 3D functionality.
; Syntax ........: _BASS_ChannelGet3DPosition($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns an array containg 3D position
;									-	Position of the sound
;										- [0][0]	=	x +ve = right, -ve = left.
;										- [0][1]	=	y +ve = up, -ve = down.
;										- [0][2]	=	z +ve = front, -ve = behind.
;									-	Orientation of the sound
;										- [1][0]	=	x +ve = right, -ve = left.
;										- [1][1]	=	y +ve = up, -ve = down.
;										- [1][2]	=	z +ve = front, -ve = behind.
;									-	Velocity of the sound
;										- [2][0]	=	x +ve = right, -ve = left.
;										- [2][1]	=	y +ve = up, -ve = down.
;										- [2][2]	=	z +ve = front, -ve = behind.
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_NO3D 		-	The channel does not have 3D functionality.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGet3DPosition($handle)
	Local $aRet[3][3]
	Local $s1 = DllStructCreate($BASS_3DVECTOR)
	Local $s2 = DllStructCreate($BASS_3DVECTOR)
	Local $s3 = DllStructCreate($BASS_3DVECTOR)

	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelGet3DPosition", "DWORD", $handle, "PTR", DllStructGetPtr($s1), "PTR", DllStructGetPtr($s2), "PTR", DllStructGetPtr($s3))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	For $i = 0 To 2
		$aRet[0][$i] = DllStructGetData($s1, $i + 1)
	Next
	For $i = 0 To 2
		$aRet[1][$i] = DllStructGetData($s2, $i + 1)
	Next
	For $i = 0 To 2
		$aRet[2][$i] = DllStructGetData($s3, $i + 1)
	Next
	Return $aRet
EndFunc   ;==>_BASS_ChannelGet3DPosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetLength
; Description ...: Retrieves the playback length of a channel.
; Syntax ........: _BASS_ChannelGetLength($handle, $mode)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$mode 		-	How to retrieve the length. One of the following.
;							- $BASS_POS_BYTE			-	 Get the length in bytes.
;							- $BASS_POS_MUSIC_ORDER 	-	Get the length in orders. (HMUSIC only)
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	handle is not valid.
;										- $BASS_ERROR_NOTAVAIL 	-	The requested length is not available.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetLength($handle, $mode)
	Local $BASS_ret_ = DllCall($_ghBassDll, "uint64", "BASS_ChannelGetLength", "DWORD", $handle, "DWORD", $mode)
	If @error Then Return SetError(1, 1, 0)
	$BASS_ret_[0] = __BASS_ReOrderULONGLONG($BASS_ret_[0])
	If $BASS_ret_[0] = -1 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetLength

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetPosition
; Description ...: Sets the playback position of a sample, MOD music, or stream.
; Syntax ........: _BASS_ChannelSetPosition($handle, $pos, $mode)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$pos The position, in units determined by the mode.
;					-	$mode How to set the position. One of the following, with optional flags.
;						-	$BASS_POS_BYTE 			-	The position is in bytes, which will be rounded down to the
;														nearest sample boundary.
;						-	$BASS_POS_MUSIC_ORDER  	-	The position is in orders and rows...
;						-	$BASS_MUSIC_POSRESET  	-	Stop all notes. This flag is applied automatically if it has been set
;														on the channel, eg. via BASS_ChannelFlags. (HMUSIC)
;						-	$BASS_MUSIC_POSRESETEX 	-	Stop all notes and reset bpm/etc. This flag is applied automatically
;														if it has been set on the channel, eg. via BASS_ChannelFlags. (HMUSIC)
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	Handle is not a valid channel.
;										- $BASS_ERROR_NOTFILE 	-	The stream is not a file stream.
;										- $BASS_ERROR_POSITION 	-	The requested position is invalid, eg. it is beyond the
;																	end or the download has not yet reached it.
;										- $BASS_ERROR_NOTAVAIL 	-	The requested mode is not available. Invalid flags are
;																	ignored and do not result in this error.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetPosition($handle, $pos, $mode)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSetPosition", "DWORD", $handle, "uint64", $pos, "DWORD", $mode)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSetPosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetPosition
; Description ...: Retrieves the playback position of a sample, stream, or MOD music. Can also be used with a recording channel.
; Syntax ........: _BASS_ChannelGetPosition($handle, $mode)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$mode 		-	How to retrieve the position. One of the following.
;						-	$BASS_POS_BYTE 			-	Get the position in bytes.
;						-	$BBASS_POS_MUSIC_ORDER 	-	Get the position in orders and rows...
;														- LOWORD = order
;														- HIWORD = row * scaler (BASS_ATTRIB_MUSIC_PSCALER). (HMUSIC only)
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_NOTAVAIL 	-	The requested position is not available.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetPosition($handle, $mode)
	Local $BASS_ret_ = DllCall($_ghBassDll, "uint64", "BASS_ChannelGetPosition", "DWORD", $handle, "DWORD", $mode)
	If @error Then Return SetError(1, 1, 0)
	$BASS_ret_[0] = __BASS_ReOrderULONGLONG($BASS_ret_[0])
	If $BASS_ret_[0] = -1 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetPosition

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetLevel
; Description ...: Retrieves the level (peak amplitude) of a stream, MOD music or recording channel.
; Syntax ........: _BASS_ChannelGetLevel($handle)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns the peak amplitude.
;									- Level of the left channel is returned in the low word (low 16-bits)
;									- Level of the right channel is returned in the high word (high 16-bits)
;									- If the channel is mono, then the low word is duplicated in the high word.
;									- The level ranges linearly from 0 (silent) to 32768 (max)
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetLevel($handle)
	Local $BASS_ret_ = DllCall($_ghBassDll, "DWORD", "BASS_ChannelGetLevel", "DWORD", $handle)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetLevel

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelGetData
; Description ...: Retrieves the immediate sample data (or an FFT representation of it) of a stream or MOD music channel.
; Syntax ........: _BASS_ChannelGetData($handle, $pBuffer, $length)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;                   - $pBuffer   - Pointer to the buffer to receive ChannelData
;					-	$length		-	Number of bytes wanted, and/or the following flags.
;						-$BASS_DATA_FLOAT			-	Return floating-point sample data.
;						-$BASS_DATA_FFT256			-	256 sample FFT (returns 128 floating-point values)
;						-$BASS_DATA_FFT512 			-	512 sample FFT (returns 256 floating-point values)
;						-$BASS_DATA_FFT1024 		-	1024 sample FFT (returns 512 floating-point values)
;						-$BASS_DATA_FFT2048 		-	2048 sample FFT (returns 1024 floating-point values)
;						-$BASS_DATA_FFT4096 		-	4096 sample FFT (returns 2048 floating-point values)
;						-$BASS_DATA_FFT8192 		-	8192 sample FFT (returns 4096 floating-point values)
;						-$BASS_DATA_FFT_INDIVIDUAL 	-	Use this flag to request separate FFT data for each channel.
;														The size of the data returned (as listed above) is multiplied
;														by the number channels.
;						-$BASS_DATA_FFT_NOWINDOW 	-	This flag can be used to prevent a Hann window being applied to the
;														sample data when performing an FFT.
;						-$BASS_DATA_AVAILABLE 		-	Query the amount of data the channel has buffered for playback, or
;														from recording. This flag can't be used with decoding channels as
;														they do not have playback buffers. buffer is ignored when
;														using this flag.
; Return values .: Success      - Returns 1 and the Buffer is filled with data
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									-$BS_ERR will be set to-
;									-$BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;									-$BASS_ERROR_ENDED  	-	The channel has reached the end.
;									-$BASS_ERROR_NOTAVAIL  	-	The BASS_DATA_AVAILABLE flag was used with a
;																decoding channel.
;									-$BASS_ERROR_BUFLOST  	-	Should not happen... check that a valid window handle
;																was used with BASS_Init.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetData($handle, $pBuffer, $length)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_ChannelGetData", "DWORD", $handle, "ptr", $pBuffer, "DWORD", $length)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = $BASS_DWORD_ERR Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelGetData

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetLink
; Description ...: Links two MOD music or stream channels together
; Syntax ........: _BASS_ChannelSetLink($handle, $chan)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$chan		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	At least one of handle and chan is not a valid channel.
;										- $BASS_ERROR_DECODE 	-	At least one of handle and chan is a "decoding channel"
;																	so can't be linked.
;										- $BASS_ERROR_ALREADY 	-	chan is already linked to handle.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetLink($handle, $chan)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelSetLink", "DWORD", $handle, "DWORD", $chan)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelSetLink

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelRemoveLink
; Description ...: Removes a links between two MOD music or stream channels.
; Syntax ........: _BASS_ChannelRemoveLink($handle, $chan)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$chan		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE	-	At least one of handle and chan is not a valid channel.
;										- $BASS_ERROR_ALREADY 	-	chan is already linked to handle.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelRemoveLink($handle, $chan)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelRemoveLink", "DWORD", $handle, "DWORD", $chan)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelRemoveLink
; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetFX
; Description ...: Sets an effect on a stream, MOD music, or recording channel.
; Syntax ........: _BASS_ChannelSetFX($handle, $type, $priority)
; Parameters ....: -	$handle		-	Handle The channel handle...
;										-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$type One of the following types of effect.
;						- $BASS_FX_DX8_CHORUS 		-	DX8 Chorus
;						- $BASS_FX_DX8_COMPRESSOR 	-	DX8 Compression
;						- $BASS_FX_DX8_DISTORTION 	-	DX8 Distortion
;						- $BASS_FX_DX8_ECHO		 	-	DX8 Echo
;						- $BASS_FX_DX8_FLANGER 	 	-	DX8 Flanger
;						- $BASS_FX_DX8_GARGLE 	 	-	DX8 Gargle
;						- $BASS_FX_DX8_I3DL2REVERB  -	DX8 I3DL2 (Interactive 3D Audio Level 2) reverb
;						- $BASS_FX_DX8_PARAMEQ  	-	DX8 Parametric equalizer
;						- $BASS_FX_DX8_REVERB 	 	-	DX8 Reverb
;					- $priority 	-	The priority of the new FX, which determines its position in the DSP chain.
;										DSP/FX with higher priority are applied before those with lower. This
;										parameter has no effect with DX8 effects when the "with FX flag" DX8
;										effect implementation is used.
; Return values .: Success      - Returns the new effects handle
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	handle is not a valid channel.
;										- $BASS_ERROR_ILLTYPE 	-	type is invalid.
;										- $BASS_ERROR_NOFX DX8 	-	effects are unavailable.
;										- $BASS_ERROR_FORMAT 	-	The channel's format is not supported by the effect.
;																	It may be floating-point (without DX9) or more than
;																	stereo.
;										- $BASS_ERROR_UNKNOWN 	-	Some other mystery problem!
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetFX($handle, $type, $priority)
	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_ChannelSetFX", "DWORD", $handle, "DWORD", Eval($type & "_Value"), "int", $priority)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	Assign("BASS_FX_" & $BASS_ret_[0], Eval(StringReplace($type, "_FX", "")), 2)
	Return $BASS_ret_[0]

EndFunc   ;==>_BASS_ChannelSetFX

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelRemoveFX
; Description ...: Removes an effect on a stream, MOD music, or recording channel.
; Syntax ........: _BASS_ChannelRemoveFX($handle, $fx)
; Parameters ....: -	$handle		-	Handle The channel handle...
;							-	HCHANNEL, HMUSIC, HSTREAM, HRECORD or HSAMPLE handles accepted.
;					-	$fx 		-	Handle of the effect to remove from the channel.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	At least one of handle and fx is not valid.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelRemoveFX($handle, $fx)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelRemoveFX", "DWORD", $handle, "DWORD", $fx)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelRemoveFX


; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FXReset
; Description ...: Resets an effect
; Syntax ........: _BASS_FXReset($hFX)
; Parameters ....: -	$fx 		-	Handle of the effect
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_HANDLE 	-	At least one of handle and fx is not valid.
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FXReset($hFX)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_FXReset", "DWORD", $hFX)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_FXReset


; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FXSetParameters
; Description ...: Sets the parameters of an effect.
; Syntax ........: _BASS_FXSetParameters($fxhandle, $param)
; Parameters ....:
;                    -    $fxhandle    -    Handle to the effect as returned by _BASS_ChannelSetFX
;                   -   $param    -    The parameters as string delimited by "|" ("1|2|3|...")
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FXSetParameters($fxhandle, $param)
	Local $struct
	Local $aParam = StringSplit($param, "|")
	$struct = DllStructCreate(Eval("BASS_FX_" & $fxhandle))
	For $i = 1 To $aParam[0]
		DllStructSetData($struct, $i, $aParam[$i])
	Next
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_FXSetParameters", "dword", $fxhandle, "ptr", DllStructGetPtr($struct))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_FXSetParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_FXGetParameters
; Description ...: Retrieves the parameters of an effect.
; Syntax ........: _BASS_FXGetParameters($fxhandle)
; Parameters ....:
;                    -    $fxhandle    -    Handle to the effect as returned by _BASS_ChannelSetFX
; Return values .: Success      - Returns Array of effect parameters.
;                                    - [0] = Number of parameters returned
;                                    - [1] = first parameter
;                                    - [2] = second parameter
;                                    - [n] = n parameter
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_FXGetParameters($fxhandle)
	Local $sRet = DllStructCreate(Eval("BASS_FX_" & $fxhandle))
	Local $BASS_ret_ = DllCall($_ghBassDll, "none", "BASS_FXGetParameters", "dword", $fxhandle, "ptr", DllStructGetPtr($sRet))
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)

	Local $aRet[1], $i = 1;, $types = StringSplit(Eval("BASS_FX_" & $fxhandle), ";")
	Do
		ReDim $aRet[$i + 1]
		$aRet[$i] = DllStructGetData($sRet, $i)
	Until @error
	ReDim $aRet[$i]
	$aRet[0] = $i - 1
	Return $aRet
EndFunc   ;==>_BASS_FXGetParameters

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetDSP
; Description ...: Sets up a user DSP function on a stream, MOD music, or recording channel
; Syntax ........: _BASS_ChannelSetDSP($handle, $proc, $user, $priority)
; Parameters ....: -	$handle    The channel handle... a HSTREAM, HMUSIC, or HRECORD.
;                   -   $proc      The callback function.
;                   -   $user      User instance data to pass to the callback function.
;                   -   $priority  The priority of the new DSP, which determines its position in the DSP chain. DSPs with higher priority are called before those with lower.
; Return values .: Success      - If successful, then the new DSP's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetDSP($handle, $proc, $user, $priority)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "ptr", "dword;dword;ptr;dword;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf

	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_ChannelSetDSP", "DWORD", $handle, "Ptr", $proc, "Ptr", $user, "int", $priority)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($proc_s, $BASS_ret_[0])
EndFunc   ;==>_BASS_ChannelSetDSP

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelRemoveDSP
; Description ...: Removes a DSP function from a stream, MOD music, or recording channel.
; Syntax ........: _BASS_ChannelRemoveDSP($handle, $dsp)
; Parameters ....: -	$handle    The channel handle... a HSTREAM, HMUSIC, or HRECORD.
;                   -   $dsp       Handle of the DSP function to remove from the channel. This can also be an HFX handle to remove an effect.
; Return values .: Success      - If successful, TRUE is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelRemoveDSP($handle, $dsp)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelRemoveDSP", "DWORD", $handle, "DWORD", $dsp)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelRemoveDSP

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_SetEAXPreset
; Description ...: Sets EAX Preset
; Syntax ........: _BASS_SetEAXPreset($preset)
; Parameters ....: -	$preset		-	EAX Enviroment.  Same as in _BASS_SetEAXParameters.
; Return values .: Success      - Returns 1
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
;									@error will be set to-
;										- $BASS_ERROR_INIT 		-	_BASS_Init has not been successfully called.
;										- $BASS_ERROR_NOEAX		-	The output device does not support EAX.
; Author ........: Brett Francis (BrettF)
; Modified ......: Prog@ndy
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_SetEAXPreset($preset)
	Local $BASS_RET
	Switch $preset
		Case $EAX_ENVIRONMENT_GENERIC
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_GENERIC, 0.5, 1.493, 0.5)
		Case $EAX_ENVIRONMENT_PADDEDCELL
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_PADDEDCELL, 0.25, 0.1, 0)
		Case $EAX_ENVIRONMENT_ROOM
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_ROOM, 0.417, 0.4, 0.666)
		Case $EAX_ENVIRONMENT_BATHROOM
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_BATHROOM, 0.653, 1.499, 0.166)
		Case $EAX_ENVIRONMENT_LIVINGROOM
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_LIVINGROOM, 0.208, 0.478, 0)
		Case $EAX_ENVIRONMENT_STONEROOM
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_STONEROOM, 0.5, 2.309, 0.888)
		Case $EAX_ENVIRONMENT_AUDITORIUM
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_AUDITORIUM, 0.403, 4.279, 0.5)
		Case $EAX_ENVIRONMENT_CONCERTHALL
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_CONCERTHALL, 0.5, 3.961, 0.5)
		Case $EAX_ENVIRONMENT_CAVE
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_CAVE, 0.5, 2.886, 1.304)
		Case $EAX_ENVIRONMENT_ARENA
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_ARENA, 0.361, 7.284, 0.332)
		Case $EAX_ENVIRONMENT_HANGAR
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_HANGAR, 0.5, 10, 0.3)
		Case $EAX_ENVIRONMENT_CARPETEDHALLWAY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_CARPETEDHALLWAY, 0.153, 0.259, 2)
		Case $EAX_ENVIRONMENT_HALLWAY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_HALLWAY, 0.361, 1.493, 0)
		Case $EAX_ENVIRONMENT_STONECORRIDOR
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_STONECORRIDOR, 0.444, 2.697, 0.638)
		Case $EAX_ENVIRONMENT_ALLEY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_ALLEY, 0.25, 1.752, 0.776)
		Case $EAX_ENVIRONMENT_FOREST
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_FOREST, 0.111, 3.145, 0.472)
		Case $EAX_ENVIRONMENT_CITY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_CITY, 0.111, 2.767, 0.224)
		Case $EAX_ENVIRONMENT_MOUNTAINS
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_MOUNTAINS, 0.194, 7.841, 0.472)
		Case $EAX_ENVIRONMENT_QUARRY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_QUARRY, 1, 1.499, 0.5)
		Case $EAX_ENVIRONMENT_PLAIN
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_PLAIN, 0.097, 2.767, 0.224)
		Case $EAX_ENVIRONMENT_PARKINGLOT
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_PARKINGLOT, 0.208, 1.652, 1.5)
		Case $EAX_ENVIRONMENT_SEWERPIPE
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_SEWERPIPE, 0.652, 2.886, 0.25)
		Case $EAX_ENVIRONMENT_UNDERWATER
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_UNDERWATER, 1, 1.499, 0)
		Case $EAX_ENVIRONMENT_DRUGGED
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_DRUGGED, 0.875, 8.392, 1.388)
		Case $EAX_ENVIRONMENT_DIZZY
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_DIZZY, 0.139, 17.234, 0.666)
		Case $EAX_ENVIRONMENT_PSYCHOTIC
			$BASS_RET = _BASS_SetEAXParameters($EAX_ENVIRONMENT_PSYCHOTIC, 0.486, 7.563, 0.806)
	EndSwitch
	If $BASS_RET = 0 Then Return SetError(@error, 0, 0)
	Return SetError(0, 0, $BASS_RET)
EndFunc   ;==>_BASS_SetEAXPreset



; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelSetSync
; Description ...: Sets up a synchronizer on a MOD music, stream or recording channel.
; Syntax ........: _BASS_ChannelSetSync($handle, $type, $param, $proc, $user)
; Parameters ....:  -   $handle    The channel handle... a HSTREAM, HMUSIC, or HRECORD.
;                   -   $type      The type of sync (see the table below). The following flags may also be used.
;                                       $BASS_SYNC_MIXTIME Call the sync function immediately when the sync is triggered, instead of delaying the call until the sync event is actually heard. This is automatic with some sync types (see table below), and always with decoding and recording channels, as they cannot be played/heard.
;                                       $BASS_SYNC_ONETIME Call the sync only once, and then remove it from the channel.
;                   -   $param     The sync parameter.
;                   -   $proc      The callback function.
;                   -   $user      User instance data to pass to the callback function.
; Return values .: Success      - If successful, then the new DSP's handle is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetSync($handle, $type, $param, $proc, $user)
	Local $proc_s = -1
	If IsString($proc) Then
		$proc_s = DllCallbackRegister($proc, "ptr", "dword;dword;dword;ptr")
		$proc = DllCallbackGetPtr($proc_s)
	EndIf

	Local $BASS_ret_ = DllCall($_ghBassDll, "dword", "BASS_ChannelSetSync", "DWORD", $handle, "DWORD", $type, "UINT64", $param, "Ptr", $proc, "Ptr", $user)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then
		If $proc_s <> -1 Then DllCallbackFree($proc_s)
		Return SetError(_BASS_ErrorGetCode(), 0, 0)
	EndIf
	Return SetExtended($proc_s, $BASS_ret_[0])
EndFunc   ;==>_BASS_ChannelSetSync

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_ChannelRemoveSync
; Description ...: Removes a synchronizer from a MOD music, stream or recording channel.
; Syntax ........: _BASS_ChannelRemoveSync($handle, $sync)
; Parameters ....: -	$handle    The channel handle... a HSTREAM, HMUSIC, or HRECORD.
;                   -   $sync      Handle of the synchronizer to remove.
; Return values .: Success      - If successful, TRUE is returned
;                  Failure      - Returns 0 and sets @ERROR to error returned by _BASS_ErrorGetCode()
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelRemoveSync($handle, $sync)
	Local $BASS_ret_ = DllCall($_ghBassDll, "int", "BASS_ChannelRemoveSync", "DWORD", $handle, "DWORD", $sync)
	If @error Then Return SetError(1, 1, 0)
	If $BASS_ret_[0] = 0 Then Return SetError(_BASS_ErrorGetCode(), 0, 0)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_ChannelRemoveSync


; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_ChannelSetVolume
; Description ...: Helper function to set the volume of a channel.
; Syntax ........: _BASS_ChannelSetVolume($hChannel, $nVol)
; Parameters ....: -   $hChannel	-	Handle to a channel
;					-	$nVol		-	0(silent) ... 100(full)
; Return values .: Success   -   Returns True
;                  Failure   -   Returns False and sets @ERROR as set by _BASS_ChannelSetVolume($hChannel, $nVol)
; Author ........: Prog@ndy
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelSetVolume($hChannel, $nVol)
	; Author: Prog@ndy
	Local $ret = _BASS_ChannelSetAttribute($hChannel, $BASS_ATTRIB_VOL, $nVol / 100)
	Return SetError(@error, @extended, $ret)
EndFunc   ;==>_BASS_ChannelSetVolume

; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_ChannelGetVolume
; Description ...: Helper function to set the volume of a channel.
; Syntax ........: _BASS_ChannelGetVolume($hChannel)
; Parameters ....: -   $hChannel	-	Handle to a channel
; Return values .: Success   -   Returns Tthe volume of the channel- 0(silent) ... 100(full)
;                  Failure   -   Returns False and sets @ERROR as set by _BASS_ChannelSetVolume($hChannel, $nVol)
; Author ........: Prog@ndy
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_ChannelGetVolume($hChannel)
	; Author: Prog@ndy
	Local $ret = _BASS_ChannelGetAttribute($hChannel, $BASS_ATTRIB_VOL)
	Return SetError(@error, @extended, $ret * 100)
EndFunc   ;==>_BASS_ChannelGetVolume

; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_PtrStringLen
; Description ...: Retrieves the lenth of a string in a PTR.
; Syntax ........: _BASS_PtrStringLen($ptr, $IsUniCode = False)
; Parameters ....: -    $ptr                   -  Pointer to the string
;               -  [Optional] $IsUniCode  -  True = Unicode, False (Default) = ANSI
; Return values .: Success   -   Returns length of string ( can be 0 as well )
;                  Failure   -   Returns -1 and sets @ERROR
;                           @error will be set to 1
; Author ........: Prog@ndy
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_PtrStringLen($ptr, $IsUniCode = False)
	Local $UniCodeFunc = ""
	If $IsUniCode Then $UniCodeFunc = "W"
	Local $BASS_ret_ = DllCall("kernel32.dll", "int", "lstrlen" & $UniCodeFunc, "ptr", $ptr)
	If @error Then Return SetError(1, 0, -1)
	Return $BASS_ret_[0]
EndFunc   ;==>_BASS_PtrStringLen

; #INTERNAL# ====================================================================================================================
; Name ..........: _BASS_PtrStringRead
; Description ...: Reads a string from a pointer
; Syntax ........: _BASS_PtrStringRead($ptr, $IsUniCode = False, $StringLen = -1)
; Parameters ....: -    $ptr        -  Pointer to the string
;               -  $IsUniCode  -  [Optional] True = Unicode, False (Default) = ANSI
;               -  $StringLen  -  [Optional] Length of the String
; Return values .: Success  -  Returns the read string (can be empty)
;                  Failure  -  Returns "" (empty String) and sets @ERROR
;                           @error will be set to 1
; Author ........: Prog@ndy
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_PtrStringRead($ptr, $IsUniCode = False, $StringLen = -1)
	Local $UniCodeString = ""
	If $IsUniCode Then $UniCodeString = "W"
	If $StringLen < 1 Then $StringLen = _BASS_PtrStringLen($ptr, $IsUniCode)
	If $StringLen < 1 Then Return SetError(1, 0, "")
	Local $struct = DllStructCreate($UniCodeString & "char[" & ($StringLen + 1) & "]", $ptr)
	Return DllStructGetData($struct, 1)
EndFunc   ;==>_BASS_PtrStringRead

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_HiWord
; Description ...: Returns the high word of a longword value
; Syntax ........: _BASS_HiWord($value)
; Parameters ....: 	-	$value		-	Longword value
; Return values .: Success      - Returns High order word of the longword value
; Author ........: Paul Campbell (PaulIA)
; Modified ......: Brett Francis (BrettF), eukalyptus
; Remarks .......: Taken from WinAPI.au3 (error fixed for values greater than 0x8000)
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_HiWord($value)
	$value = BitShift($value, 16)
	If $value < 0 Then $value = BitXOR($value, 0xFFFF0000)
	Return $value
EndFunc   ;==>_BASS_HiWord

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_LoWord
; Description ...: Returns the low word of a longword value
; Syntax ........: _BASS_LoWord($value)
; Parameters ....: 	-	$value		-	Longword value
; Return values .: Success      - Returns Low order word of the longword value
; Author ........: Paul Campbell (PaulIA)
; Modified ......: Brett Francis (BrettF), eukalyptus
; Remarks .......: Taken from WinAPI.au3
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_LoWord($value)
	Return BitAND($value, 0x0000FFFF)
EndFunc   ;==>_BASS_LoWord

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_MakeLong
; Description ...: Returns the long word of $lo_value and $hi_value
; Syntax ........: _BASS_MakeLong($lo_value, $hi_value)
; Parameters ....: 	-	$lo_value		-	LoWord
;                   -   $hi_value       -   HiWord
; Return values .: Success      - Returns the long word of $lo_value and $hi_value
; Author ........: eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_MakeLong($lo_value, $hi_value)
	Return BitOR(BitShift($hi_value, -16), BitAND($lo_value, 0xFFFF))
EndFunc   ;==>_BASS_MakeLong

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_HiByte
; Description ...: Returns the high byte of a word value
; Syntax ........: _BASS_HiByte($value)
; Parameters ....: 	-	$value		-	word value
; Return values .: Success      - Returns High order byte of the word value
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_HiByte($value)
	Return BitShift($value, 8)
EndFunc   ;==>_BASS_HiByte

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_LoByte
; Description ...: Returns the low byte of a word value
; Syntax ........: _BASS_LoByte($value)
; Parameters ....: 	-	$value		-	word value
; Return values .: Success      - Returns Low order byte of the word value
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_LoByte($value)
	Return BitAND($value, 0x00FF)
EndFunc   ;==>_BASS_LoByte

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Hi4Bits
; Description ...: Returns the high 4 bits of a byte value
; Syntax ........: _BASS_Hi4Bits($value)
; Parameters ....: 	-	$value		-	byte value
; Return values .: Success      - Returns High order 4 bits of the byte value
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Hi4Bits($value)
	Return BitShift($value, 4)
EndFunc   ;==>_BASS_Hi4Bits

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_Lo4Bits
; Description ...: Returns the low 4 bits of a byte value
; Syntax ........: _BASS_Lo4Bits($value)
; Parameters ....: 	-	$value		-	byte value
; Return values .: Success      - Returns the low order 4 bits of the byte value
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_Lo4Bits($value)
	Return BitAND($value, 0x0F)
EndFunc   ;==>_BASS_Lo4Bits

; #FUNCTION# ====================================================================================================================
; Name ..........: _BASS_MakeWord
; Description ...: Returns the word of $lo_value and $hi_value
; Syntax ........: _BASS_MakeWord($lo_value, $hi_value)
; Parameters ....: 	-	$lo_value		-	LoByte
;                   -   $hi_value       -   HiByte
; Return values .: Success      - Returns the word of $lo_value and $hi_value
; Author ........: eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func _BASS_MakeWord($lo_value, $hi_value)
	Return BitOR(BitShift($hi_value, -8), BitAND($lo_value, 0xFF))
EndFunc   ;==>_BASS_MakeWord

; #INTERNAL# ====================================================================================================================
; Name ..........: __BASS_ReOrderULONGLONG
; Description ...: INTERNAL USE
; Syntax ........: __BASS_ReOrderULONGLONG($UINT64)
; Parameters ....:
; Return values .:
; Author ........: Prog@ndy
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func __BASS_ReOrderULONGLONG($UINT64)
	If $_gbBASSULONGLONGFIXED Then Return $UINT64 ;ConsoleWrite("! check, if __MySQL_ReOrderULONGLONG is still needed (int64 return fixed?)" & @CRLF)
	Local $int = DllStructCreate("uint64")
	Local $longlong = DllStructCreate("ulong;ulong", DllStructGetPtr($int))
	DllStructSetData($int, 1, $UINT64)
	Return 4294967296 * DllStructGetData($longlong, 1) + DllStructGetData($longlong, 2)
EndFunc   ;==>__BASS_ReOrderULONGLONG

; #INTERNAL# ====================================================================================================================
; Name ..........: __BASS_GetStructSize
; Description ...: INTERNAL USE
; Syntax ........: __BASS_GetStructSize($sStruct)
; Parameters ....:
; Return values .:
; Author ........: Eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func __BASS_GetStructSize($sStruct)
	Local $tStruct = DllStructCreate($sStruct)
	Return DllStructGetSize($tStruct)
EndFunc   ;==>__BASS_GetStructSize

; #INTERNAL# ====================================================================================================================
; Name ..........: __BASS_LibraryGetArch
; Description ...: INTERNAL USE - checks if bass.dll is 32 or 64 bit
; Syntax ........: __BASS_LibraryGetArch($sFile)
; Parameters ....:
; Return values .:
; Author ........: eukalyptus
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......:
; ===============================================================================================================================
Func __BASS_LibraryGetArch($sFile)
	Local $sReturn = ""
	Local $hFile, $bFile, $iOffset
	$hFile = FileOpen($sFile, 16)
	If @error Then Return SetError(1, 1, "")
	$bFile = FileRead($hFile)
	$iOffset = StringInStr($bFile, "50450000")
	If $iOffset Then
		$bFile = StringTrimLeft($bFile, $iOffset + 48)
		$bFile = StringLeft($bFile, 4)
		Switch $bFile
			Case "B010"
				$sReturn = "32"
			Case "B020"
				$sReturn = "64"
			Case Else
				$sReturn = ""
		EndSwitch
	EndIf
	FileClose($hFile)
	If $sReturn = "" Then Return SetError(1, 2, "")
	Return $sReturn
EndFunc   ;==>__BASS_LibraryGetArch