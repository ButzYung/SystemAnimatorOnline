#include-once
; ==========================================================================================================================================================
; Error codes returned by BASS_ErrorGetCode()
; ==========================================================================================================================================================
Global Const $BASS_ERROR_FX_NODECODE = 4000
Global Const $BASS_ERROR_FX_BPMINUSE = 4001

; ==========================================================================================================================================================
; Tempo / Reverse / BPM / Beat flag
; ==========================================================================================================================================================
Global Const $BASS_FX_FREESOURCE = 0x10000

; ==========================================================================================================================================================
; DSP channels flags
; ==========================================================================================================================================================
Global Const $BASS_BFX_CHANALL = -1
Global Const $BASS_BFX_CHANNONE = 0
Global Const $BASS_BFX_CHAN1 = 1
Global Const $BASS_BFX_CHAN2 = 2
Global Const $BASS_BFX_CHAN3 = 4
Global Const $BASS_BFX_CHAN4 = 8
Global Const $BASS_BFX_CHAN5 = 16
Global Const $BASS_BFX_CHAN6 = 32
Global Const $BASS_BFX_CHAN7 = 64
Global Const $BASS_BFX_CHAN8 = 128

; ==========================================================================================================================================================
; BiQuad filters
; ==========================================================================================================================================================
Global Const $BASS_BFX_BQF_LOWPASS = 0
Global Const $BASS_BFX_BQF_HIGHPASS = 1
Global Const $BASS_BFX_BQF_BANDPASS = 2
Global Const $BASS_BFX_BQF_BANDPASS_Q = 3
Global Const $BASS_BFX_BQF_NOTCH = 4
Global Const $BASS_BFX_BQF_ALLPASS = 5
Global Const $BASS_BFX_BQF_PEAKINGEQ = 6
Global Const $BASS_BFX_BQF_LOWSHELF = 7
Global Const $BASS_BFX_BQF_HIGHSHELF = 8

; ==========================================================================================================================================================
; DSP effects
; ==========================================================================================================================================================
Global Const $BASS_FX_BFX_ROTATE = "BASS_FX_BFX_ROTATE"
Global Const $BASS_FX_BFX_ROTATE_VALUE = 0x10000
Global Const $BASS_BFX_ROTATE = ''

Global Const $BASS_FX_BFX_ECHO = "BASS_FX_BFX_ECHO"
Global Const $BASS_FX_BFX_ECHO_VALUE = 0x10001
Global Const $BASS_BFX_ECHO = 'float;Int'

Global Const $BASS_FX_BFX_FLANGER = "BASS_FX_BFX_FLANGER"
Global Const $BASS_FX_BFX_FLANGER_VALUE = 0x10002
Global Const $BASS_BFX_FLANGER = 'float;float;Int'

Global Const $BASS_FX_BFX_VOLUME = "BASS_FX_BFX_VOLUME"
Global Const $BASS_FX_BFX_VOLUME_VALUE = 0x10003
Global Const $BASS_BFX_VOLUME = 'Int;float'

Global Const $BASS_FX_BFX_PEAKEQ = "BASS_FX_BFX_PEAKEQ"
Global Const $BASS_FX_BFX_PEAKEQ_VALUE = 0x10004
Global Const $BASS_BFX_PEAKEQ = 'Int;float;float;float;float;Int'

Global Const $BASS_FX_BFX_REVERB = "BASS_FX_BFX_REVERB"
Global Const $BASS_FX_BFX_REVERB_VALUE = 0x10005
Global Const $BASS_BFX_REVERB = 'float;Int'

Global Const $BASS_FX_BFX_LPF = "BASS_FX_BFX_LPF"
Global Const $BASS_FX_BFX_LPF_VALUE = 0x10006
Global Const $BASS_BFX_LPF = 'float;float;Int'

Global Const $BASS_FX_BFX_MIX = "BASS_FX_BFX_MIX"
Global Const $BASS_FX_BFX_MIX_VALUE = 0x10007

Global Const $BASS_FX_BFX_DAMP = "BASS_FX_BFX_DAMP"
Global Const $BASS_FX_BFX_DAMP_VALUE = 0x10008
Global Const $BASS_BFX_DAMP = 'float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_AUTOWAH = "BASS_FX_BFX_AUTOWAH"
Global Const $BASS_FX_BFX_AUTOWAH_VALUE = 0x10009
Global Const $BASS_BFX_AUTOWAH = 'float;float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_ECHO2 = "BASS_FX_BFX_ECHO2"
Global Const $BASS_FX_BFX_ECHO2_VALUE = 0x1000A
Global Const $BASS_BFX_ECHO2 = 'float;float;float;float;Int'

Global Const $BASS_FX_BFX_PHASER = "BASS_FX_BFX_PHASER"
Global Const $BASS_FX_BFX_PHASER_VALUE = 0x1000B
Global Const $BASS_BFX_PHASER = 'float;float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_ECHO3 = "BASS_FX_BFX_ECHO3"
Global Const $BASS_FX_BFX_ECHO3_VALUE = 0x1000C
Global Const $BASS_BFX_ECHO3 = 'float;float;float;Int'

Global Const $BASS_FX_BFX_CHORUS = "BASS_FX_BFX_CHORUS"
Global Const $BASS_FX_BFX_CHORUS_VALUE = 0x1000D
Global Const $BASS_BFX_CHORUS = 'float;float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_APF = "BASS_FX_BFX_APF"
Global Const $BASS_FX_BFX_APF_VALUE = 0x1000E
Global Const $BASS_BFX_APF = 'float;float;Int'

Global Const $BASS_FX_BFX_COMPRESSOR = "BASS_FX_BFX_COMPRESSOR"
Global Const $BASS_FX_BFX_COMPRESSOR_VALUE = 0x1000F
Global Const $BASS_BFX_COMPRESSOR = 'float;float;float;Int'

Global Const $BASS_FX_BFX_DISTORTION = "BASS_FX_BFX_DISTORTION"
Global Const $BASS_FX_BFX_DISTORTION_VALUE = 0x10010
Global Const $BASS_BFX_DISTORTION = 'float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_COMPRESSOR2 = "BASS_FX_BFX_COMPRESSOR2"
Global Const $BASS_FX_BFX_COMPRESSOR2_VALUE = 0x10011
Global Const $BASS_BFX_COMPRESSOR2 = 'float;float;float;float;float;Int'

Global Const $BASS_FX_BFX_VOLUME_ENV = "BASS_FX_BFX_VOLUME_ENV"
Global Const $BASS_FX_BFX_VOLUME_ENV_Value = 0x10012
Global Const $BASS_BFX_ENV_NODE = 'double;float'
Global Const $BASS_BFX_VOLUME_ENV = 'int;int;ptr;bool'

Global Const $BASS_FX_BFX_BQF = "BASS_FX_BFX_BQF"
Global Const $BASS_FX_BFX_BQF_Value = 0x10013
Global Const $BASS_BFX_BQF = 'int;float;float;float;float;float;int'

; ==========================================================================================================================================================
; tempo attributes (BASS_ChannelSet/GetAttribute)
; ==========================================================================================================================================================
Global Const $BASS_ATTRIB_TEMPO = 0x10000
Global Const $BASS_ATTRIB_TEMPO_PITCH = 0x10001
Global Const $BASS_ATTRIB_TEMPO_FREQ = 0x10002

; ==========================================================================================================================================================
; tempo attributes options
; ==========================================================================================================================================================
Global Const $BASS_ATTRIB_TEMPO_OPTION_USE_AA_FILTER = 0x10010
Global Const $BASS_ATTRIB_TEMPO_OPTION_AA_FILTER_LENGTH = 0x10011
Global Const $BASS_ATTRIB_TEMPO_OPTION_USE_QUICKALGO = 0x10012
Global Const $BASS_ATTRIB_TEMPO_OPTION_SEQUENCE_MS = 0x10013
Global Const $BASS_ATTRIB_TEMPO_OPTION_SEEKWINDOW_MS = 0x10014
Global Const $BASS_ATTRIB_TEMPO_OPTION_OVERLAP_MS = 0x10015

; ==========================================================================================================================================================
; reverse attribute (BASS_ChannelSet/GetAttribute)
; ==========================================================================================================================================================
Global Const $BASS_ATTRIB_REVERSE_DIR = 0x11000

; ==========================================================================================================================================================
; playback directions
; ==========================================================================================================================================================
Global Const $BASS_FX_RVS_REVERSE = -1
Global Const $BASS_FX_RVS_FORWARD = 1

; ==========================================================================================================================================================
; bpm flags
; ==========================================================================================================================================================
Global Const $BASS_FX_BPM_BKGRND = 1
Global Const $BASS_FX_BPM_MULT2 = 2

; ==========================================================================================================================================================
; translation options
; ==========================================================================================================================================================
Global Const $BASS_FX_BPM_TRAN_X2 = 0
Global Const $BASS_FX_BPM_TRAN_2FREQ = 1
Global Const $BASS_FX_BPM_TRAN_FREQ2 = 2
Global Const $BASS_FX_BPM_TRAN_2PERCENT = 3
Global Const $BASS_FX_BPM_TRAN_PERCENT2 = 4