#include-once

;===============================================================================
; _UnicodeURLEncode()
; Description: : Encodes an unicode string to be URL-friendly
; Parameter(s): : $UnicodeURL - The Unicode String to Encode
; Return Value(s): : The URL encoded string
; Author(s): : Dhilip89
; Note(s): : -
;
;===============================================================================

Func _UnicodeURLEncode($UnicodeURL)
    $UnicodeBinary = StringToBinary ($UnicodeURL, 4)
    $UnicodeBinary2 = StringReplace($UnicodeBinary, '0x', '', 1)
    $UnicodeBinaryLength = StringLen($UnicodeBinary2)
    Local $EncodedString
    For $i = 1 To $UnicodeBinaryLength Step 2
        $UnicodeBinaryChar = StringMid($UnicodeBinary2, $i, 2)
        If StringInStr("$-_.+!*'(),;/?:@=&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", BinaryToString ('0x' & $UnicodeBinaryChar, 4)) Then
            $EncodedString &= BinaryToString ('0x' & $UnicodeBinaryChar)
        Else
            $EncodedString &= '%' & $UnicodeBinaryChar
        EndIf
    Next
    Return $EncodedString
EndFunc   ;==>_UnicodeURLEncode



;===============================================================================
; _UnicodeURLDecode()
; Description: : Tranlates a URL-friendly string to a normal string
; Parameter(s): : $toDecode - The URL-friendly string to decode
; Return Value(s): : The URL decoded string
; Author(s): : nfwu, Dhilip89
; Note(s): : Modified from _URLDecode() that's only support non-unicode.
; Modified by Butz Yung/Anime Theme for use in System Animator gadget
;
;===============================================================================
Func _UnicodeURLDecode($toDecode)
    Local $strChar = "", $iOne, $iTwo
    Local $aryHex = StringSplit($toDecode, "")
	Local $binary_str = ""
    For $i = 1 To $aryHex[0]
        If $aryHex[$i] = "%" Then
            $i = $i + 1
            $iOne = $aryHex[$i]
            $i = $i + 1
            $iTwo = $aryHex[$i]

            $binary_str = $binary_str & $iOne & $iTwo
		Else
			If $binary_str Then
			   $strChar = $strChar & BinaryToString('0x' & $binary_str, 4)
			   $binary_str = ""
			EndIf
			
            $strChar = $strChar & $aryHex[$i]
        EndIf
    Next

    If $binary_str Then
      $strChar = $strChar & BinaryToString('0x' & $binary_str, 4)
    EndIf

    Return $strChar
EndFunc   ;==>_UnicodeURLDecode
#endregion