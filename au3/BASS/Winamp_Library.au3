#CS Winamp Library Info Header
	;
	;        Name/Title:         Winamp Automation Library (Winamp 2.x +).
	;        Description:        38 Functions to handle Winamp Media Player (www.winamp.com).
	;                            This library written base on the SDK that provided at Wanamp's home page:
	;                               http://www.winamp.com/development/sdk
	;
	;        Version:            1.5
	;        Last Update:        16.12.2010
	;        Requirements:       AutoIt 3.2.10.0 or higher, Winamp 2.x or higher.
	;        Note:               This UDF Library tested on Winamp v5.x.
	;        Author:             Copyright © 2008 - 2010 G.Sandler (CreatoR's Lab - http://creator-lab.ucoz.ru).
	;
	;        History Version:
	;
	;                           v1.5 [16.12.2010]
	;                              * _Winamp_GetCurrentTrackInfo now returns an array as it should have:
	;                                  0: Sample Rate in khz, 1: Bitrate, 2: Number of Channels, 3: Video LOWORD=w HIWORD=h, 4: Video Description, 5: Sample rate in hz
	;                              + Added 4 new UDFs (thanks to Erion):
	;                                  _Winamp_GetPan
	;                                  _Winamp_SetPan
	;                                  _Winamp_GetEq
	;                                  _Winamp_SetEq
	;
	;                           v1.4 [22.May.2009]
	;                              * The library now compatible with AutoIt v3.3.0.0.
	;                              * Added optional $h_Winamp_Wnd parameter to all functions
	;                               that sends message to winamp's window - It should allow to manage multiple winamp instances.
	;                                 (by default the handle is taken from $sWINAMP_CLASS).
	;
	;                           v1.3 [19.May.2008]
	;                              * The library now compatible with AutoIt v3.2.12.0.
	;
	;                              * Added UDF: _Winamp_ClearPlayList()
	;                              * Added UDF: _Winamp_GetCurrentTrackFilePath()
	;
	;                              * Changed _Winamp_GetPlayListToArray() function.
	;                                 Now it return a 2 dimensional array,
	;                                 where [0][0] is the element of current track, [n][0] is the track title,
	;                                 and [n][1] is the track file path.
	;
	;                              * Fixed UDF _Winamp_GetCurrentTrackTitle(),
	;                                 with $iMode <> -1 it was not returning correct track position.
	;
	;                           v1.2 [15.May.2008]
	;                              * _Winamp_GetCurrentTrackOutputTime() function now always returns output time in milliseconds.
	;                                Now if $iMode = -1 (default) function return current position, if <> -1 it return song lenght.
	;
	;                              * Added UDF: _Winamp_GetVolume()
	;
	;                           v1.1 [14.May.2008]
	;                              * Added UDF: _Winamp_AddFile()
	;                              * Added UDF: _Winamp_SetPLPosition()
	;                              * Added UDF: _Winamp_GetPLPosition()
	;                              * Added optional parameters for _Winamp_Play() UDF:
	;                                   $iTrack - Sets playlist position before start playing.
	;                                   $iWait - Determines if the function should wait for the sound to finish before continuing.
	;
	;                           v1.0 [31.Marth.2008]
	;                              * First Release.
	;
#CE
;

#include-once
#include <GUIConstantsEx.au3>
;

#Region Constants
Global Const $cWA_WM_COMMAND 			= 0x0111
Global Const $cWA_WM_COPYDATA 			= 0x004A
Global Const $cWA_WM_USER 				= 0x0400

Global Const $sWINAMP_CLASS 			= "[CLASS:Winamp v1.x]"
Global Const $sWINAMP_PL_CLASS 			= "[CLASS:BaseWindow_RootWnd;TITLE:Playlist Editor]"
Global Const $WM_WA_IPC 				= $cWA_WM_USER

Global Const $IPC_GETVERSION 			= 0 ;Returns Version of Winamp
Global Const $IPC_SETVOLUME 			= 122 ;Sets Volume (lparam)
Global Const $IPC_GETLISTLENGTH 		= 124 ;Returns the length of the current playlist, in tracks
Global Const $IPC_GETLISTPOS 			= 125 ;Returns the playlist position
Global Const $IPC_GETINFO 				= 126 ;Returns current song info
Global Const $IPC_ENQUEUEFILE			= 100 ;Adds File to PlayList
Global Const $IPC_DELETE				= 101 ;Clear the PlayList
Global Const $IPC_ISPLAYING 			= 104 ;Get song status
Global Const $IPC_GETOUTPUTTIME 		= 105 ;Get song time/lenght
Global Const $IPC_SETPLAYLISTPOS 		= 121 ;Set Current Position in PlayList
Global Const $IPC_JUMPTOTIME 			= 106 ;Seek in song
Global Const $IPC_RESTARTWINAMP 		= 135 ;Restart Winamp
Global Const $IPC_GETPLAYLISTFILE		= 210 ;Returns PlayList file path
Global Const $IPC_GETPLAYLISTFILEW		= 211 ;Returns PlayList file path
Global Const $IPC_GET_PLAYLISTTITLE 	= 212 ;Returns current song title
Global Const $IPC_GET_SHUFFLE 			= 250 ;Returns the status of the Shuffle option (1 if set)
Global Const $IPC_GET_REPEAT 			= 251 ;Returns the status of the Repeat option (1 if set)
Global Const $IPC_SET_SHUFFLE 			= 252 ;Sets the status of the Shuffle option (1 to turn it on)
Global Const $IPC_SET_REPEAT 			= 253 ;Sets the status of the Repeat option (1 to turn it on)
Global Const $IPC_SPAWNBUTTONPOPUP 		= 361 ;Pops up menu for specific controls

Global Const $WINAMP_OPTIONS_PREFS 		= 40012 ;Pops up the preferences
Global Const $WINAMP_OPTIONS_EQ 		= 40036 ;Toggles the EQ window
Global Const $WINAMP_OPTIONS_PLEDIT 	= 40040 ;Toggles the playlist window
Global Const $WINAMP_OPTIONS_AOT		= 40019 ;Toggles the "always on top" option
Global Const $WINAMP_FILE_QUIT			= 40001 ;Quit the Winamp
Global Const $WINAMP_FILE_PLAY 			= 40029 ;Pops up the load file(s) box
Global Const $WINAMP_FILE_DIR 			= 40187 ;Pops up the load directory box
Global Const $WINAMP_JUMPFILE       	= 40194 ;Pops up the "Jump to" box
Global Const $WINAMP_HELP_ABOUT 		= 40041 ;Pops up the about box
Global Const $WINAMP_BUTTON1 			= 40044 ;Previous
Global Const $WINAMP_BUTTON2 			= 40045 ;Play
Global Const $WINAMP_BUTTON3 			= 40046 ;Toggle Pause
Global Const $WINAMP_BUTTON4 			= 40047 ;Stop
Global Const $WINAMP_BUTTON5 			= 40048 ;Next
Global Const $WINAMP_BUTTON2_CTRL 		= 40155 ;Open URL Address box
Global Const $WINAMP_VOLUMEUP 			= 40058 ;Turns the volume up a little
Global Const $WINAMP_VOLUMEDOWN 		= 40059 ;Turns the volume down a little
Global Const $WINAMP_FFWD5S 			= 40060 ;Fast forwards 5 seconds
Global Const $WINAMP_REW5S	 			= 40061 ;Rewinds 5 seconds

Global Const $IPC_SETPANNING 			= 123 ; Sets the stereo position
Global Const $IPC_GETEQDATA 			= 127 ; queries the status of the EQ.
Global Const $IPC_SETEQDATA 			= 128 ; sets the value of the last position retrieved by IPC_GETEQDATA.

Global Const $WINAMP_PAN_LEFT 			= -127
Global Const $WINAMP_PAN_CENTRE 		= 0
Global Const $WINAMP_PAN_RIGHT 			= 127
Global Const $WINAMP_PAN_CURRENT 		= 666
#EndRegion Constants
;

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsPrefs()
;
; Function Description:    Display Prferences dialog.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show "Prferences" dialog and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsPrefs($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_OPTIONS_PREFS, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsPrefs

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsHelpAbout()
;
; Function Description:    Display "About Winamp" dialog.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   1, 2, 3 - According to DllCall() returns error.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsHelpAbout($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_HELP_ABOUT, "int", 0)
	
	If @error Then Return SetError(@error, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsHelpAbout

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsOpenFiles()
;
; Function Description:    Popups file(s)/dir selection (Open) window.
;
; Parameter(s):            $iMode - Defins what dialog to show:
;                                                               $iMode = -1 (default) will popup "Add file(s)" window.
;                                                               $iMode = 1 will popup "Open file(s)" window.
;                                                               If $iMode <> -1 And $iMode <> 1 then will show "Dir Select" window.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show file(s)/dir selection window and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - ControlSend() faild, or SendMessage fail if $iMode <> -1.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsOpenFiles($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			ControlSend($sWINAMP_PL_CLASS, "", "", "l")
		Case 1
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_FILE_PLAY, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_FILE_DIR, "int", 0)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsOpenFiles

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsURLAddress()
;
; Function Description:    Popups "URL Address Box" (to insert URL).
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show "URL Address Box" window and Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsURLAddress($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON2_CTRL, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsURLAddress

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsPLToggle()
;
; Function Description:    Toggle PlayList window (show/hide).
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show/Hide PlayList window and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsPLToggle($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_OPTIONS_PLEDIT, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsPLToggle

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsEQToggle()
;
; Function Description:    Toggle Equalizer window (show/hide).
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show/Hide Equalizer window and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsEQToggle($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_OPTIONS_EQ, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsEQToggle

;===============================================================================
;
; Function Name:  		   _Winamp_OptionsJumpTo()
;
; Function Description:    Popups "Jump to" window.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Show "Jump to" window and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_OptionsJumpTo($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_JUMPFILE, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_OptionsJumpTo

;===============================================================================
;
; Function Name:  		   _Winamp_AddFile()
;
; Function Description:    Add specific file path to Winamp's PlayList.
;
; Parameter(s):            $sFilePath - Full file path to add to the playlist.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Adds file to Winamp's PlayList and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_AddFile($sFilePath, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $iFilePathSize = StringLen($sFilePath) + 1
	Local $stMem = DllStructCreate("char[" & $iFilePathSize & "]")
	
	For $i = 0 To $iFilePathSize
		DllStructSetData($stMem, 1, Asc(StringMid($sFilePath, $i, 1)), $i)
	Next
	
	DllStructSetData($stMem, 1, 0, $iFilePathSize)
	
	;; Create the COPYDATASTRUCT ;;
	Local $stCopyData = DllStructCreate("uint;uint;ptr")
	DllStructSetData($stCopyData, 1, $IPC_ENQUEUEFILE) ;dwData -> $IPC_ENQUEUEFILE = 100
	DllStructSetData($stCopyData, 2, ($iFilePathSize * 2)) ;cbData = Size of the message
	DllStructSetData($stCopyData, 3, DllStructGetPtr($stMem)) ;lpData = Pointer to the message
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, _
		"int", $cWA_WM_COPYDATA, "int", 0, "ptr", DllStructGetPtr($stCopyData))
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_AddFile

;===============================================================================
;
; Function Name:  		   _Winamp_ClearPlayList()
;
; Function Description:    Clear the entire PlayList.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Clear the playlist and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_ClearPlayList($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_DELETE)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_ClearPlayList

;===============================================================================
;
; Function Name:  		   _Winamp_Close()
;
; Function Description:    Close Winamp instance (sends WM_CLOSE to the main window).
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Close($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_FILE_QUIT, "int", 0)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Close

;===============================================================================
;
; Function Name:  		   _Winamp_Restart()
;
; Function Description:    Restart Winamp.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Restart($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_RESTARTWINAMP)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Restart

;===============================================================================
;
; Function Name:  		   _Winamp_Play()
;
; Function Description:    Hits the "Play" button on the main controls window.
;
; Parameter(s):            $iTrack - [Optional] Sets playlist position before start playing.
;                          $iWait  - [Optional] Determines if the function should wait for the sound to finish
;                                    (considered only if $iMode = -1).
;                                               0 = Continue script, do not wait untill sound finishes playing (default)
;                                               1 = Function will wait untill the sound is finishes playing (status <> playing)
;                          $iMode  - [Optional] If this parameter <> -1, instead of pressing the "Play" button,
;                            will popup a menu with few options (the same as right click on the button).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;                          
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Play specific (or current) track in PlayList and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Play($iTrack = -1, $iWait = 0, $iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $iCurrent_Track = _Winamp_GetPLPosition()
	Local $iPlayStatus = _Winamp_GetCurrentTrackPlayStatus()
	
	If $iMode = -1 And $iPlayStatus = 1 And ($iTrack = $iCurrent_Track Or $iTrack = -1) Then Return 1
	
	If $iTrack >= 0 Then
		_Winamp_SetPLPosition($iTrack)
		$iCurrent_Track = $iTrack
	EndIf
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON2, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 4, "int", $IPC_SPAWNBUTTONPOPUP)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	If $iMode = -1 And $iWait > 0 Then
		While 1
			$iPlayStatus = _Winamp_GetCurrentTrackPlayStatus()
			If $iPlayStatus = 0 Or _Winamp_GetPLPosition() <> $iCurrent_Track Then ExitLoop
			
			Sleep(100)
		WEnd
	EndIf
	
	Return 1
EndFunc   ;==>_Winamp_Play

;===============================================================================
;
; Function Name:  		   _Winamp_PlayPauseToggle()
;
; Function Description:    Hits the "Pause" button on the main controls window.
;
; Parameter(s):            $iMode - If this parameter <> -1, instead of pressing the "Pause" button,
;                            will popup a menu with "Play/Pause" options (the same as right click on the button).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_PlayPauseToggle($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON3, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 3, "int", $IPC_SPAWNBUTTONPOPUP)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_PlayauseToggle

;===============================================================================
;
; Function Name:  		   _Winamp_Previous()
;
; Function Description:    Hits the "Previous" button on the main controls window.
;
; Parameter(s):            $iMode - If this parameter <> -1, instead of pressing the "Previous" button,
;                            will popup a menu with few options (the same as right click on the button).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Previous($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON1, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 1, "int", $IPC_SPAWNBUTTONPOPUP)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Previous

;===============================================================================
;
; Function Name:  		   _Winamp_Next()
;
; Function Description:    Hits the "Next" button on the main controls window.
;
; Parameter(s):            $iMode - If this parameter <> -1, instead of pressing the "Next" button,
;                            will popup a menu with few options (the same as right click on the button).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Next($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON5, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 2, "int", $IPC_SPAWNBUTTONPOPUP)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Next

;===============================================================================
;
; Function Name:  		   _Winamp_Stop()
;
; Function Description:    Hits the "Stop" button on the main controls window.
;
; Parameter(s):            $iMode - If this parameter <> -1, instead of pressing the "Stop" button,
;                            will popup a menu with few options (the same as right click on the button).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Stop($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_BUTTON4, "int", 0)
		Case Else
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 5, "int", $IPC_SPAWNBUTTONPOPUP)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Stop

;===============================================================================
;
; Function Name:  		   _Winamp_Seek()
;
; Function Description:    Seek in the current track.
;
; Parameter(s):            $iSeek - Defines seek mode, or the position in the song:
;                                                                              -1 -> Rewinds 5 seconds
;                                                                              -2 -> Fast forwards 5 seconds (Default)
;                                                                            >= 0 -> Sets position in the song (in milliseconds).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Seek($iSeek = -2, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iSeek
		Case -1 	;rewinds 5 seconds
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_REW5S, "int", 0)
		Case -2 	;fast forwards 5 seconds
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_FFWD5S, "int", 0)
		Case Else	;seek current track
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iSeek, "int", $IPC_JUMPTOTIME)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_Seek

;===============================================================================
;
; Function Name:  		   _Winamp_Start()
;
; Function Description:    Execute Winamp.
;
; Parameter(s):            $iMode - If this parameter <> -1 (default is -1),
;                             the winamp instance will not be executed if an instance of Winamp.exe already runing.
;                          $iWait - If this parameter is <> 0,
;                             the function will wait to the process that much seconds before returning.
;
; Requirement(s):          Properly installed Winamp Player.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to 1 if unable to find Winamp (reads from the registry).
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_Start($iMode = -1, $iWait = 5)
	If $iMode = -1 And ProcessExists("Winamp.exe") Then Return 1
	
	Local $iAutoItVersion_Compare = _VersionCompareEx(@AutoItVersion, "3.2.10.0")
	
	Local $iOld_Opt_REF = 0, $sOpt_REF_Str = "RunErrorsFatal"
	If $iAutoItVersion_Compare <= 0 Then $iOld_Opt_REF = Opt($sOpt_REF_Str, 0)
	
	Local $iError = 0, $iPID
	Local $sWinamp_RegPath = RegRead("HKEY_CURRENT_USER\Software\Winamp", "")
	
	If FileExists($sWinamp_RegPath) Then
		$iPID = Run($sWinamp_RegPath & "\Winamp.exe")
		$iError = @error
	Else
		$iError = 1
	EndIf
	
	If $iAutoItVersion_Compare <= 0 Then Opt($sOpt_REF_Str, $iOld_Opt_REF)
	
	If $iWait And Not $iError Then
		ProcessWait($iPID, $iWait)
		WinWait($sWINAMP_CLASS, "", $iWait)
	EndIf
	
	If $iError Then Return SetError(1, 0, 0)
	Return 1
EndFunc   ;==>_Winamp_Start

;===============================================================================
;
; Function Name:  		   _WinampSetEq()
;
; Function Description:    Sets the specified option of the EQ.
;
; Parameter(s):            $iPos - The equaliser position.
;                          $iVal - The new value of the specified $pos. It can be set according to the following table:
;                                                                      ** $Pos       $Val
;                                                                      ** ------------------
;                                                                      ** 0-9        The 10 bands of EQ data. 0-63 (+20db - -20db)
;                                                                      ** 10         The preamp value. 0-63 (+20db - -20db)
;                                                                      ** 11         Enabled. zero if disabled, nonzero if enabled.
;                                                                      ** 12         Autoload. zero if disabled, nonzero if enabled.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          Winamp 2.05 +.
;
; Return Value(s):         On Success -  Returns 0
;                          On Failure -  Returns -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
 ;                                                                  2 - SendMessage fail.
;                                                                   3 - Invalid $iPos value.
;
; Author(s):               Erion, G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetEq($iPos, $iVal, $h_Winamp_Wnd=0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	If $iPos < 0 Or $iPos > 12 Then Return SetError(3, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iPos, "int", $IPC_GETEQDATA)
	If @error Then Return SetError(2, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iVal, "int", $IPC_SETEQDATA)
	If @error Then Return SetError(2, 0, 0)
	
	Return 0
EndFunc   ;==>_Winamp_SetEq

;===============================================================================
;
; Function Name:  		   _Winamp_SetState()
;
; Function Description:    Set State for Winamp main window. Usefull when we need to hide/show the main window.
;
; Parameter(s):            $iState - State to set (i.e: @SW_MINIMIZE),
;                              if this parameter is -1 (default), then it toggles "always on top" options.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Sets main winamp window state and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - WinSetState() fail to find Winamp window,
;                                                                       or if $iState = -1, then SendMessage faild.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetState($iState=-1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iState
		Case -1
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_OPTIONS_AOT, "int", 0)
			
			If @error Then Return SetError(2, 0, 0)
		Case Else
			If Not WinSetState($hWinamp, "", $iState) Then Return SetError(2, 0, 0)
	EndSwitch
	
	Return 1
EndFunc   ;==>_Winamp_SetState

;===============================================================================
;
; Function Name:  		   _Winamp_SetVolume()
;
; Function Description:    Sets the volume of Winamp.
;
; Parameter(s):            $iVolume - Volume to set, from 0 to 255 (depends on next parameter).
;                          $iMode - Defines volume set mode:
;                                                            -1 -> $iVolume used to set the volume (default).
;                                                             0 -> Turns the volume down a little.
;                                                             1 -> Turns the volume up a little.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetVolume($iVolume, $iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Switch $iMode
		Case -1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iVolume, "int", $IPC_SETVOLUME)
		Case 0
			DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_VOLUMEDOWN, "int", 0)
		Case 1
			DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $cWA_WM_COMMAND, "int", $WINAMP_VOLUMEUP, "int", 0)
	EndSwitch
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_SetVolume

;===============================================================================
;
; Function Name:  		   _Winamp_SetShuffleOption()
;
; Function Description:    Sets the status of the "Shuffle" option.
;
; Parameter(s):            $iMode - 1 to turn it on, 0 to turn it off.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Sets status for "Shuffle" option and return 1.
;
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - Wrong $iMode parameter value.
;                                                                   3 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetShuffleOption($iMode = 1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	If $iMode < 0 Or $iMode > 1 Then Return SetError(2, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iMode, "int", $IPC_SET_SHUFFLE)
	
	If @error Then Return SetError(3, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_SetShuffleOption

;===============================================================================
;
; Function Name:  		   _Winamp_SetRepeatOption()
;
; Function Description:    Sets the status of the "Repeat" option.
;
; Parameter(s):            $iMode - 1 to turn it on, 0 to turn it off.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Sets status for "Repeat" option and return 1.
;
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - Wrong $iMode parameter value.
;                                                                   3 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetRepeatOption($iMode = 1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	If $iMode < 0 Or $iMode > 1 Then Return SetError(2, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iMode, "int", $IPC_SET_REPEAT)
	
	If @error Then Return SetError(3, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_SetRepeatOption

;===============================================================================
;
; Function Name:  		   _Winamp_SetPLPosition()
;
; Function Description:    Sets the song position in PlayList.
;
; Parameter(s):            $iPosition - Song position (zero-based).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Set PlayList position and return 1.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetPLPosition($iPosition, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iPosition, "int", $IPC_SETPLAYLISTPOS)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return 1
EndFunc   ;==>_Winamp_SetPLPosition

;===============================================================================
;
; Function Name:  		   _Winamp_SetPan()
;
; Function Description:    Sets the specified pan position for a track.
;
; Parameter(s):            $iPan - Sets the window pan, from -127 (left) to 127 (right). Centre is 0. You can use these:
;                                                                  $WINAMP_PAN_LEFT
;                                                                  $WINAMP_PAN_CENTRE
;                                                                  $WINAMP_PAN_RIGHT
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          Winamp 2.x +.
;
; Return Value(s):         On Success -  Returns 0
;                          On Failure -  Returns -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't running.
;                                                                   2 - SendMessage fail.
;                                                                   3 - Invalid pan position.
;
; Author(s):               Erion, G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_SetPan($iPan, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	If $iPan < -127 Or $iPan > 127 Then Return SetError(3, 0, 0)
	
	DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iPan, "int", $IPC_SETPANNING)
	If @error Then Return SetError(2, 0, 0)
	
	Return 0
EndFunc   ;==>_Winamp_SetPan

;===============================================================================
;
; Function Name:  		   _Winamp_GetEq()
;
; Function Description:    Queries the status of the EQ.
;
; Parameter(s):            $iPos - The queried equaliser position. It can be set according to the following table:
;                                                                     ** Value       Return
;                                                                     ** ------------------
;                                                                     ** 0-9        The 10 bands of EQ data. 0-63 (+20db - -20db)
;                                                                     ** 10         The preamp value. 0-63 (+20db - -20db)
;                                                                     ** 11         Enabled. zero if disabled, nonzero if enabled.
;                                                                     ** 12         Autoload. zero if disabled, nonzero if enabled.
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
; 
;
; Requirement(s):          Winamp 2.05 +.
;
; Return Value(s):         On Success -  Returns (See the table above)
;                          On Failure -  Returns -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
 ;                                                                  2 - SendMessage fail.
;                                                                   3 - Invalid $iPos value.
;
; Author(s):               Erion, G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetEq($iPos, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	If $iPos < 0 Or $iPos > 12 Then Return SetError(3, 0, 0)
	
	$aRet = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iPos, "int", $IPC_GETEQDATA)
	If @error Then Return SetError(2, 0, 0)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetEq

;===============================================================================
;
; Function Name:  		   _Winamp_GetPan()
;
; Function Description:    Gets the currently set stereo pan of a track.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          Winamp 2.x +.
;
; Return Value(s):         On Success -  Returns the current pan (from -127 to 127)
;                          On Failure -  Returns -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               Erion, G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetPan($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $WINAMP_PAN_CURRENT, "int", $IPC_SETPANNING)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetPan

;===============================================================================
;
; Function Name:  		   _Winamp_GetPLPosition()
;
; Function Description:    Get current zero-based song position in PlayList.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Returns PlayList position.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetPLPosition($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETLISTPOS)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetPLPosition

;===============================================================================
;
; Function Name:  		   _Winamp_GetPlayListToArray()
;
; Function Description:    Get Current Playlist to array.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Returns 2 dimensional array $aRet_Array with the PlayList entries, where:
;                                                                   [0][0] = Array element of current song (in $aRet_Array).
;                                                                   [n][0] = Song Title.
;                                                                   [n][1] = Song File Path.
;
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;                                                                   3 - Can not access to winamp playlist memory.
;                                                                   4 - Error to Open user32.dll.
;
; Author(s):               weaponx (mod. by G.Sandler)
;
;=====================================================================
Func _Winamp_GetPlayListToArray($h_Winamp_Wnd = 0)
	Local $aRet_Array[1][1]
	Local $hWinamp, $iWinamp_PID, $iNull, $pAddress_Title, $pAddress_FPath, $hUser32Dll, $iNumTracks, $aCurrent_Track
	
	$hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	$iWinamp_PID = WinGetProcess($hWinamp)
	
	;Return number of tracks in playlist
	$iNumTracks = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", _
		$WM_WA_IPC, "int", 0, "int", $IPC_GETLISTLENGTH)
	If @error Then Return SetError(2, 0, 0)
	
	$iNumTracks = $iNumTracks[0]
	
	$aRet_Array[0][0] = $iNumTracks
	ReDim $aRet_Array[$iNumTracks + 1][2]
	
	;Return current playlist position (zero based)
	$aCurrent_Track = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETLISTPOS)
	
	If Not @error Then $aRet_Array[0][0] = $aCurrent_Track[0] + 1
	
	;IMPORTANT - First song will be skipped without this
	$iNull = __API_GetInfoByAddress(0, 0)
	If @error Then Return SetError(3, 0, 0)
	
	$hUser32Dll = DllOpen("user32.dll")
	If $hUser32Dll = -1 Then Return SetError(4, 0, 0)
	
	For $i = 0 To $iNumTracks - 1
		$pAddress_Title = 0
		$pAddress_FPath = 0

		;Return memory address (pointer) of track title
		$pAddress_Title = DllCall($hUser32Dll, "int", "SendMessage", _
			"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $i, "int", $IPC_GET_PLAYLISTTITLE)
		If @error Then ContinueLoop
		
		$aRet_Array[$i + 1][0] = __API_GetInfoByAddress($pAddress_Title[0], $iWinamp_PID)
		If @error Then Return SetError(3, 0, 0)
		
		;Return memory address (pointer) of track file path
		$pAddress_FPath = DllCall($hUser32Dll, "int", "SendMessage", _
			"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $i, "int", $IPC_GETPLAYLISTFILEW)
		If @error Then ContinueLoop
		
		$aRet_Array[$i + 1][1] = __API_GetInfoByAddress($pAddress_FPath[0], $iWinamp_PID)
		If @error Then Return SetError(3, 0, 0)
	Next
	
	DllClose($hUser32Dll)
	
	Return $aRet_Array
EndFunc   ;==>_Winamp_GetPlayListToArray

;===============================================================================
;
; Function Name:  		   _Winamp_GetCurrentTrackTitle()
;
; Function Description:    Gets current song title.
;
; Parameter(s):            $iMode - Defins what to return:
;                                                          $iMode = -1 (default) will return song title.
;                                                          $iMode <> -1 returns song position (zero-based).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return current title/track position (depends on the $iMode).
;                          On Failure -  Return "" and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail (unable to get list current position).
;                                                                   2 - SendMessage fail (unable to get title).
;                                                                   4 - Can not access to winamp playlist memory.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetCurrentTrackTitle($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, "")
	
	;Return current playlist position (zero based)
	Local $iCurrent_Track = DllCall("user32.dll", "int", "SendMessage", _
			"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETLISTPOS)
	
	If @error Then Return SetError(2, 0, "")
	
	If $iMode <> -1 Then Return $iCurrent_Track[0]
	
	Local $pAddress = DllCall("user32.dll", "int", "SendMessage", _
			"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iCurrent_Track[0], "int", $IPC_GET_PLAYLISTTITLE)
	
	If @error Then Return SetError(3, 0, "")
	
	Local $sRet_Song = __API_GetInfoByAddress($pAddress[0], WinGetProcess($hWinamp))
	If @error Then Return SetError(4, 0, "")
	
	Return $sRet_Song
EndFunc   ;==>_Winamp_GetCurrentTrackTitle

;===============================================================================
;
; Function Name:  		   _Winamp_GetCurrentTrackFilePath()
;
; Function Description:    Gets current song file path.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return current file path.
;                          On Failure -  Return "" and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail (unable to get list current position).
;                                                                   2 - SendMessage fail (unable to get title).
;                                                                   4 - Can not access to winamp playlist memory.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetCurrentTrackFilePath($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, "")
	
	;Return current playlist position (zero based)
	Local $iCurrent_Track = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETLISTPOS)
	
	If @error Then Return SetError(2, 0, "")
	
	Local $pAddress = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $iCurrent_Track[0], "int", $IPC_GETPLAYLISTFILEW)
	
	If @error Then Return SetError(3, 0, "")
	
	Local $sRet_Song = __API_GetInfoByAddress($pAddress[0], WinGetProcess($hWinamp))
	If @error Then Return SetError(4, 0, "")
	
	Return $sRet_Song
EndFunc   ;==>_Winamp_GetCurrentTrackFilePath

;===============================================================================
;
; Function Name:  		   _Winamp_GetCurrentTrackOutputTime()
;
; Function Description:    Gets current track time.
;
; Parameter(s):            $iMode - Defines what to return:
;                                       $iMode = -1 (default) returns current position (in milliseconds).
;                                       $iMode <> -1 returns the track length (in milliseconds).
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return output time for current track.
;                          On Failure -  Return -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetCurrentTrackOutputTime($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, -1)
	
	Local $aRet
	
	Switch $iMode
		Case -1
			$aRet = DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETOUTPUTTIME)
		Case Else
			$aRet = DllCall("user32.dll", "int", "SendMessage", _
				"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 1, "int", $IPC_GETOUTPUTTIME)
	EndSwitch
	
	If @error Then Return SetError(2, 0, -1)
	
	If $iMode <> -1 Then $aRet[0] *= 1000 ;Make it ms.
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetCurrentTrackOutputTime

;===============================================================================
;
; Function Name:  		   _Winamp_GetCurrentTrackInfo()
;
; Function Description:    Gets current track info.
;
; Parameter(s):            $iMode - Defines what to return:
;                                                          $iMode = -1 (default) returns array with the following values:
;                                                             $aRet_Array[0] = Samplerate, in kilohertz (i.e. 44)
;                                                             $aRet_Array[1] = Bitrate  (i.e. 128)
;                                                             $aRet_Array[2] = Channels (i.e. 2)
;                                                             $aRet_Array[3] = Video LOWORD=w HIWORD=h
;                                                             $aRet_Array[4] = > 65536, string (video description)
;                                                             $aRet_Array[5] = > Samplerate, in hertz (i.e. 44100)
;
;                                                          $iMode = 0 Samplerate, in kilohertz (i.e. 44)
;                                                          $iMode = 1 Bitrate  (i.e. 128).
;                                                          $iMode = 2 Channels (i.e. 2).
;                                                          $iMode = 3 Video LOWORD=w HIWORD=h.
;                                                          $iMode = 4 > 65536, string (video description).
;                                                          $iMode = 5 > Samplerate, in hertz (i.e. 44100)
;                          $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          For the video info and Sample Rate in Hertz Winamp v5.25 +.
;
; Return Value(s):         On Success -  Return track info according to the $iMode parameters.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - Wrong $iMode parameter value.
;                                                                   3 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru), Erion
;
;=====================================================================
Func _Winamp_GetCurrentTrackInfo($iMode = -1, $h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	If $iMode < -1 Or $iMode > 5 Then Return SetError(2, 0, 0)
	
	Local $aRet, $aRet_Array[6]
	
	For $i = 0 To 5
		$aRet = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, "int", $WM_WA_IPC, "int", $i, "int", $IPC_GETINFO)
		
		If @error Then Return SetError(3, 0, 0)
		
		$aRet_Array[$i] = $aRet[0]
		
		If $iMode = $i Then Return $aRet[0]
	Next
	
	Return $aRet_Array
EndFunc   ;==>_Winamp_GetCurrentTrackInfo

;===============================================================================
;
; Function Name:  		   _Winamp_GetCurrentTrackPlayStatus()
;
; Function Description:    Gets play status.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1 if song is currently playing, returns 3 if it's paused, and 0 if it's stopped.
;                          On Failure -  Return -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetCurrentTrackPlayStatus($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, -1)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_ISPLAYING)
	
	If @error Then Return SetError(2, 0, -1)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetCurrentTrackPlayStatus

;===============================================================================
;
; Function Name:  		   _Winamp_GetVolume()
;
; Function Description:    Gets the current volume for Winamp Player.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return current volume value from 0-255, @extended includes volume percentage value.
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetVolume($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", "hwnd", $hWinamp, _
		"int", $WM_WA_IPC, "int", -666, "int", $IPC_SETVOLUME)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return SetExtended(Int($aRet[0] / 255 * 100), $aRet[0])
EndFunc   ;==>_Winamp_GetVolume

;===============================================================================
;
; Function Name:  		   _Winamp_GetVersion()
;
; Function Description:    Gets Winamp version.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return Winamp version.
;                                        Version will be 0x20yx for winamp 2.yx. versions previous to Winamp 2.0,
;                                        typically (but not always) use 0x1zyx for 1.zx versions. Weird, I know.
;
;                          On Failure -  Return 0 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetVersion($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, 0)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GETVERSION)
	
	If @error Then Return SetError(2, 0, 0)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetVersion

;===============================================================================
;
; Function Name:  		   _Winamp_GetShuffleOption()
;
; Function Description:    Gets the status of the "Shuffle" option.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1 if the option is turned on.
;                          On Failure -  Return -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - Wrong $iMode parameter value.
;                                                                   3 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetShuffleOption($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, -1)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GET_SHUFFLE)
	
	If @error Then Return SetError(2, 0, -1)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetShuffleOption

;===============================================================================
;
; Function Name:  		   _Winamp_GetRepeatOption()
;
; Function Description:    Gets the status of the "Repeat" option.
;
; Parameter(s):            $h_Winamp_Wnd - [Optional] Winamp window handle to use
;                                           (by default the handle is taken from $sWINAMP_CLASS).
;
; Requirement(s):          None.
;
; Return Value(s):         On Success -  Return 1 if the option is turned on.
;                          On Failure -  Return -1 and set @error to:
;                                                                   1 - Unable to find Winamp window, probably winamp isn't runing.
;                                                                   2 - Wrong $iMode parameter value.
;                                                                   3 - SendMessage fail.
;
; Author(s):               G.Sandler (a.k.a CreatoR) - CreatoR's Lab (http://creator-lab.ucoz.ru)
;
;=====================================================================
Func _Winamp_GetRepeatOption($h_Winamp_Wnd = 0)
	Local $hWinamp = WinGetHandle($sWINAMP_CLASS)
	If IsHWnd($h_Winamp_Wnd) Then $hWinamp = $h_Winamp_Wnd
	
	If Not IsHWnd($hWinamp) Then Return SetError(1, 0, -1)
	
	Local $aRet = DllCall("user32.dll", "int", "SendMessage", _
		"hwnd", $hWinamp, "int", $WM_WA_IPC, "int", 0, "int", $IPC_GET_REPEAT)
	
	If @error Then Return SetError(2, 0, -1)
	
	Return $aRet[0]
EndFunc   ;==>_Winamp_GetRepeatOption

;==============================================================================
;Author: weaponx (mod. by G.Sandler)
Func __API_GetInfoByAddress($lpszTitle, $iPID)
	; Open the process so we can read from it. The call will return a process handle.
	Local $aRet = DllCall("kernel32.dll", "uint", "OpenProcess", "byte", 0x10, "int", 0, "int", $iPID)
	Local $hProcess = $aRet[0], $sSongTitle = "", $hKernel32Dll, $v_Struct, $stData
	
	$hKernel32Dll = DllOpen('kernel32.dll')
	If $hKernel32Dll = -1 Then Return SetError(1, 0, "")
	
	; We have to read byte after byte until we encounter a "00" byte (string ends).
	
	While 1
		; Read from WinAMP's memory. Value will be copied into the string buffer,
		;which must contain exactly one character because ReadProcessMemory won't terminate the string,
		;only overwrite its contents.
		;$Output = "x"  ; Put exactly one character in as a placeholder.
		$v_Struct = DllStructCreate('byte[1]')
		
		DllCall($hKernel32Dll, 'int', 'ReadProcessMemory', 'int', $hProcess, 'int', $lpszTitle, _
			'int', DllStructGetPtr($v_Struct, 1), 'int', 1, 'int', 0)
		
		; Error checking - i.e. no permission for reading from the process's memory
		If @error Then
			DllCall($hKernel32Dll, "int", "CloseHandle", "int", $hProcess)
			DllClose($hKernel32Dll)
			Return SetError(2, 0, "")
		EndIf
		
		$stData = DllStructGetData($v_Struct, 1)
		
		; If the value of the byte read is zero we are at the end of the string.
		If $stData = 0 Then ExitLoop
		
		; Append the character to our teststr variable that will hold the whole title string
		$sSongTitle &= StringTrimLeft($stData, 2)
		
		; Increment address by one to obtain next byte
		$lpszTitle += 1
	WEnd
	
	DllCall($hKernel32Dll, "int", "CloseHandle", "int", $hProcess)  ; ErrorLevel and return value are not checked.
	DllClose($hKernel32Dll)
	
	Return BinaryToString("0x" & $sSongTitle)
EndFunc   ;==>__API_GetInfoByAddress

;==============================================================================
; Author: WeaponX (mod. by MrCreatoR)
;
;Return Values
;  0 string1 and string2 are equal
;  1 string1 is greater than string2
; -1 string1 is less than string2
;==============================================================================
Func _VersionCompareEx($sVersion_a, $sVersion_b)
	;Set default return value to same
	Local $iRet = 0
	Local $aVersion_a = StringSplit($sVersion_a, "."), $aVersion_b = StringSplit($sVersion_b, ".")
	
	;Determine number of positions to compare against
	Local $iNumPositions = $aVersion_a[0]
	If $aVersion_b[0] > $aVersion_a[0] Then $iNumPositions = $aVersion_b[0]
	
	;Declare temp arrays
	Dim $aVersion_a_Compare[$iNumPositions], $aVersion_b_Compare[$iNumPositions]
	
	;Fill temp arrays with zeros
	For $i = 0 To $iNumPositions - 1
		$aVersion_a_Compare[$i] = 0
		$aVersion_b_Compare[$i] = 0
	Next
	
	;Copy anything available from first input version
	For $i = 1 To $aVersion_a[0]
		If $i > $iNumPositions Then ExitLoop
		
		;Strip leading zeroes
		$sStripped = StringRegExpReplace($aVersion_a[$i], "^0+", "")
		
		If $sStripped <> "" Then $aVersion_a_Compare[$i - 1] = $sStripped
	Next
	
	;Copy anything available from second input version
	For $i = 1 To $aVersion_b[0]
		If $i > $iNumPositions Then ExitLoop
		
		;Strip leading zeroes
		$sStripped = StringRegExpReplace($aVersion_b[$i], "^0+", "")
		
		If $sStripped <> "" Then $aVersion_b_Compare[$i - 1] = $sStripped
	Next
	
	;Compare each individual element instead of whole string
	For $i = 0 To $iNumPositions - 1
		$iRet = StringCompare($aVersion_a_Compare[$i], $aVersion_b_Compare[$i])
		If $iRet <> 0 Then ExitLoop
	Next
	
	Return $iRet
EndFunc   ;==>_VersionCompareEx
