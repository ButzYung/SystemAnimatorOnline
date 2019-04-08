#include-once
; ===============================================================================================================================
; Error codes returned by $BASS_ErrorGetCode
; ===============================================================================================================================
Global Const $BASS_OK = 0 ;all is OK
Global Const $BASS_ERROR_MEM = 1 ;memory error
Global Const $BASS_ERROR_FILEOPEN = 2 ;can;t open the file
Global Const $BASS_ERROR_DRIVER = 3 ;can;t find a free sound driver
Global Const $BASS_ERROR_BUFLOST = 4 ;the sample buffer was lost
Global Const $BASS_ERROR_HANDLE = 5 ;invalid handle
Global Const $BASS_ERROR_FORMAT = 6 ;unsupported sample format
Global Const $BASS_ERROR_POSITION = 7 ;invalid position
Global Const $BASS_ERROR_INIT = 8 ;$BASS_Init has not been successfully called
Global Const $BASS_ERROR_START = 9 ;$BASS_Start has not been successfully called
Global Const $BASS_ERROR_ALREADY = 14 ;already initialized/paused/whatever
Global Const $BASS_ERROR_NOCHAN = 18 ;can;t get a free channel
Global Const $BASS_ERROR_ILLTYPE = 19 ;an illegal type was specified
Global Const $BASS_ERROR_ILLPARAM = 20 ;an illegal parameter was specified
Global Const $BASS_ERROR_NO3D = 21 ;no 3D support
Global Const $BASS_ERROR_NOEAX = 22 ;no EAX support
Global Const $BASS_ERROR_DEVICE = 23 ;illegal device number
Global Const $BASS_ERROR_NOPLAY = 24 ;not playing
Global Const $BASS_ERROR_FREQ = 25 ;illegal sample rate
Global Const $BASS_ERROR_NOTFILE = 27 ;the stream is not a file stream
Global Const $BASS_ERROR_NOHW = 29 ;no hardware voices available
Global Const $BASS_ERROR_EMPTY = 31 ;the MOD music has no sequence data
Global Const $BASS_ERROR_NONET = 32 ;no internet connection could be opened
Global Const $BASS_ERROR_CREATE = 33 ;couldn;t create the file
Global Const $BASS_ERROR_NOFX = 34 ;effects are not available
Global Const $BASS_ERROR_NOTAVAIL = 37 ;requested data is not available
Global Const $BASS_ERROR_DECODE = 38 ;the channel is a "decoding channel"
Global Const $BASS_ERROR_DX = 39 ;a sufficient DirectX version is not installed
Global Const $BASS_ERROR_TIMEOUT = 40 ;connection timedout
Global Const $BASS_ERROR_FILEFORM = 41 ;unsupported file format
Global Const $BASS_ERROR_SPEAKER = 42 ;unavailable speaker
Global Const $BASS_ERROR_VERSION = 43 ;invalid BASS version (used by add-ons)
Global Const $BASS_ERROR_CODEC = 44 ;codec is not available/supported
Global Const $BASS_ERROR_ENDED = 45 ;the channel/file has ended
Global Const $BASS_ERROR_UNKNOWN = -1 ;some other mystery problem

; ===============================================================================================================================
; $BASS_SetConfig options
; ===============================================================================================================================
Global Const $BASS_CONFIG_BUFFER = 0
Global Const $BASS_CONFIG_UPDATEPERIOD = 1
Global Const $BASS_CONFIG_GVOL_SAMPLE = 4
Global Const $BASS_CONFIG_GVOL_STREAM = 5
Global Const $BASS_CONFIG_GVOL_MUSIC = 6
Global Const $BASS_CONFIG_CURVE_VOL = 7
Global Const $BASS_CONFIG_CURVE_PAN = 8
Global Const $BASS_CONFIG_FLOATDSP = 9
Global Const $BASS_CONFIG_3DALGORITHM = 10
Global Const $BASS_CONFIG_NET_TIMEOUT = 11
Global Const $BASS_CONFIG_NET_BUFFER = 12
Global Const $BASS_CONFIG_PAUSE_NOPLAY = 13
Global Const $BASS_CONFIG_NET_PREBUF = 15
Global Const $BASS_CONFIG_NET_PASSIVE = 18
Global Const $BASS_CONFIG_REC_BUFFER = 19
Global Const $BASS_CONFIG_NET_PLAYLIST = 21
Global Const $BASS_CONFIG_MUSIC_VIRTUAL = 22
Global Const $BASS_CONFIG_VERIFY = 23
Global Const $BASS_CONFIG_UPDATETHREADS = 24
Global Const $BASS_CONFIG_DEV_BUFFER = 27;
Global Const $BASS_CONFIG_DEV_DEFAULT = 36;
Global Const $BASS_CONFIG_NET_READTIMEOUT = 37;

; ===============================================================================================================================
; $BASS_SetConfigPtr options
; ===============================================================================================================================
Global Const $BASS_CONFIG_NET_AGENT = 16
Global Const $BASS_CONFIG_NET_PROXY = 17

; ===============================================================================================================================
; Initialization flags
; ===============================================================================================================================
Global Const $BASS_DEVICE_8BITS = 1 ;use 8 bit resolution, else 16 bit
Global Const $BASS_DEVICE_MONO = 2 ;use mono, else stereo
Global Const $BASS_DEVICE_3D = 4 ;enable 3D functionality
Global Const $BASS_DEVICE_LATENCY = 256 ;calculate device latency ($BASS_INFO struct)
Global Const $BASS_DEVICE_CPSPEAKERS = 1024 ;detect speakers via Windows control panel
Global Const $BASS_DEVICE_SPEAKERS = 2048 ;force enabling of speaker assignment
Global Const $BASS_DEVICE_NOSPEAKER = 4096 ;ignore speaker arrangement
Global Const $BASS_DEVICE_DMIX = 8192; // use ALSA "dmix" plugin

; ===============================================================================================================================
; DirectSound interfaces (for use with $BASS_GetDSoundObject)
; ===============================================================================================================================
Global Const $BASS_OBJECT_DS = 1 ; DirectSound
Global Const $BASS_OBJECT_DS3DL = 2 ;IDirectSound3DListener

Global Const $BASS_DEVICEINFO = "ptr name;" & _ 	;name Description of the device.
		"ptr driver;" & _ 	;driver The filename of the driver... NULL = no driver ("no sound" device)
		"dword flags;" ;flags The device's current status...

; ===============================================================================================================================
; $BASS_DEVICEINFO flags
; ===============================================================================================================================
Global Const $BASS_DEVICE_ENABLED = 1
Global Const $BASS_DEVICE_DEFAULT = 2
Global Const $BASS_DEVICE_INIT = 4

Global $BASS_INFO = 'dword flags;' & _ ; device capabilities (DSCAPS_xxx flags)
		'dword hwsize;' & _			; size of total device hardware memory
		'dword hwfree;' & _			; size of free device hardware memory
		'dword freesam;' & _			; number of free sample slots in the hardware
		'dword free3d;' & _			; number of free 3D sample slots in the hardware
		'dword minrate;' & _		; min sample rate supported by the hardware
		'dword maxrate;' & _			; max sample rate supported by the hardware
		'int eax;' & _				; device supports EAX? (always BASSFALSE if $BASS_DEVICE_3D was not used)
		'dword minbuf;' & _			; recommended minimum buffer length in ms (requires $BASS_DEVICE_LATENCY)
		'dword dsver;' & _			; DirectSound version
		'dword latency;' & _			; delay (in ms) before start of playback (requires $BASS_DEVICE_LATENCY)
		'dword initflags;' & _		; $BASS_Init "flags" parameter
		'dword speakers;' & _		; number of speakers available
		'dword freq' ; current output rate (OSX only)

; ===============================================================================================================================
; $BASS_INFO flags
; ===============================================================================================================================
Global Const $DSCAPS_CONTINUOUSRATE = 16 ; supports all sample rates between min/maxrate
Global Const $DSCAPS_EMULDRIVER = 32 ; device does NOT have hardware DirectSound support
Global Const $DSCAPS_CERTIFIED = 64 ; device driver has been certified by Microsoft
Global Const $DSCAPS_SECONDARYMONO = 256 ; mono
Global Const $DSCAPS_SECONDARYSTEREO = 512 ; stereo
Global Const $DSCAPS_SECONDARY8BIT = 1024 ; 8 bit
Global Const $DSCAPS_SECONDARY16BIT = 2048 ; 16 bit

; ===============================================================================================================================
; Recording device info structure
; ===============================================================================================================================
Global $BASS_RECORDINFO = "dword flags;" & _ ; device capabilities (DSCCAPS_xxx flags)
		'dword formats;' & _			; supported standard formats (WAVE_FORMAT_xxx flags)
		'dword inputs;' & _			; number of inputs
		'int singlein;' & _		; BASSTRUE = only 1 input can be set at a time
		'dword freq' ; current input rate (Vista/OSX only)

; ===============================================================================================================================
; $BASS_RECORDINFO flags
; ===============================================================================================================================
Global Const $DSCCAPS_EMULDRIVER = $DSCAPS_EMULDRIVER ; device does NOT have hardware DirectSound recording support
Global Const $DSCCAPS_CERTIFIED = $DSCAPS_CERTIFIED ; device driver has been certified by Microsoft

; ===============================================================================================================================
; defines for formats field of $BASS_RECORDINFO
; ===============================================================================================================================
Global Const $WAVE_FORMAT_1M08 = 0x1 ; 11.025 kHz, Mono,   8-bit
Global Const $WAVE_FORMAT_1S08 = 0x2 ; 11.025 kHz, Stereo, 8-bit
Global Const $WAVE_FORMAT_1M16 = 0x4 ; 11.025 kHz, Mono,   16-bit
Global Const $WAVE_FORMAT_1S16 = 0x8 ; 11.025 kHz, Stereo, 16-bit
Global Const $WAVE_FORMAT_2M08 = 0x10 ; 22.05  kHz, Mono,   8-bit
Global Const $WAVE_FORMAT_2S08 = 0x20 ; 22.05  kHz, Stereo, 8-bit
Global Const $WAVE_FORMAT_2M16 = 0x40 ; 22.05  kHz, Mono,   16-bit
Global Const $WAVE_FORMAT_2S16 = 0x80 ; 22.05  kHz, Stereo, 16-bit
Global Const $WAVE_FORMAT_4M08 = 0x100 ; 44.1   kHz, Mono,   8-bit
Global Const $WAVE_FORMAT_4S08 = 0x200 ; 44.1   kHz, Stereo, 8-bit
Global Const $WAVE_FORMAT_4M16 = 0x400 ; 44.1   kHz, Mono,   16-bit
Global Const $WAVE_FORMAT_4S16 = 0x800 ; 44.1   kHz, Stereo, 16-bit

; ===============================================================================================================================
; Sample info structure
; ===============================================================================================================================
Global $BASS_SAMPLE = 'dword freq;' & _	; default playback rate
		'float volume;' & _			; default volume (0-100)
		'float pan;' & _				; default pan (-100=left, 0=middle, 100=right)
		'dword flags;' & _			; $BASS_SAMPLE_xxx flags
		'dword length;' & _			; length (in samples, not bytes)
		'dword max;' & _				; maximum simultaneous playbacks
		'dword origres;' & _			; original resolution
		'dword chans;' & _			; number of channels
		'dword mingap;' & _			; minimum gap (ms) between creating channels
		'dword mode3d;' & _			; $BASS_3DMODE_xxx mode
		'float mindist;' & _			; minimum distance
		'float MAXDIST;' & _			; maximum distance
		'dword iangle;' & _			; angle of inside projection cone
		'dword oangle;' & _			; angle of outside projection cone
		'float outvol;' & _			; delta-volume outside the projection cone
		'dword vam;' & _				; voice allocation/management flags ($BASS_VAM_xxx)
		'dword priority;' ; priority (0=lowest, 0xffffffff=highest)

Global Const $BASS_SAMPLE_8BITS = 1 ; 8 bit
Global Const $BASS_SAMPLE_FLOAT = 256 ; 32-bit floating-point
Global Const $BASS_SAMPLE_MONO = 2 ; mono
Global Const $BASS_SAMPLE_LOOP = 4 ; looped
Global Const $BASS_SAMPLE_3D = 8 ; 3D functionality
Global Const $BASS_SAMPLE_SOFTWARE = 16 ; not using hardware mixing
Global Const $BASS_SAMPLE_MUTEMAX = 32 ; mute at max distance (3D only)
Global Const $BASS_SAMPLE_VAM = 64 ; DX7 voice allocation & management
Global Const $BASS_SAMPLE_FX = 128 ; old implementation of DX8 effects
Global Const $BASS_SAMPLE_OVER_VOL = 0x10000 ; override lowest volume
Global Const $BASS_SAMPLE_OVER_POS = 0x20000 ; override dwordest playing
Global Const $BASS_SAMPLE_OVER_DIST = 0x30000 ; override furthest from listener (3D only)

Global Const $BASS_STREAM_PRESCAN = 0x20000 ; enable pin-point seeking/length (MP3/MP2/MP1)
Global Const $BASS_MP3_SETPOS = $BASS_STREAM_PRESCAN
Global Const $BASS_STREAM_AUTOFREE = 0x40000 ; automatically free the stream when it stop/ends
Global Const $BASS_STREAM_RESTRATE = 0x80000 ; restrict the download rate of internet file streams
Global Const $BASS_STREAM_BLOCK = 0x100000 ; download/play internet file stream in small blocks
Global Const $BASS_STREAM_DECODE = 0x200000 ; don;t play the stream, only decode ($BASS_ChannelGetData)
Global Const $BASS_STREAM_STATUS = 0x800000 ; give server status info (HTTP/ICY tags) in DOWNLOADPROC

Global Const $BASS_MUSIC_FLOAT = $BASS_SAMPLE_FLOAT
Global Const $BASS_MUSIC_MONO = $BASS_SAMPLE_MONO
Global Const $BASS_MUSIC_LOOP = $BASS_SAMPLE_LOOP
Global Const $BASS_MUSIC_3D = $BASS_SAMPLE_3D
Global Const $BASS_MUSIC_FX = $BASS_SAMPLE_FX
Global Const $BASS_MUSIC_AUTOFREE = $BASS_STREAM_AUTOFREE
Global Const $BASS_MUSIC_DECODE = $BASS_STREAM_DECODE
Global Const $BASS_MUSIC_PRESCAN = $BASS_STREAM_PRESCAN ; calculate playback length
Global Const $BASS_MUSIC_CALCLEN = $BASS_MUSIC_PRESCAN
Global Const $BASS_MUSIC_RAMP = 0x200 ; normal ramping
Global Const $BASS_MUSIC_RAMPS = 0x400 ; sensitive ramping
Global Const $BASS_MUSIC_SURROUND = 0x800 ; surround sound
Global Const $BASS_MUSIC_SURROUND2 = 0x1000 ; surround sound (mode 2)
Global Const $BASS_MUSIC_FT2MOD = 0x2000 ; play .MOD as FastTracker 2 does
Global Const $BASS_MUSIC_PT1MOD = 0x4000 ; play .MOD as ProTracker 1 does
Global Const $BASS_MUSIC_NONINTER = 0x10000 ; non-interpolated sample mixing
Global Const $BASS_MUSIC_SINCINTER = 0x800000 ; sinc interpolated sample mixing
Global Const $BASS_MUSIC_POSRESET = 32768 ; stop all notes when moving position
Global Const $BASS_MUSIC_POSRESETEX = 0x400000 ; stop all notes and reset bmp/etc when moving position
Global Const $BASS_MUSIC_STOPBACK = 0x80000 ; stop the music on a backwards jump effect
Global Const $BASS_MUSIC_NOSAMPLE = 0x100000 ; don;t load the samples

; ===============================================================================================================================
; Speaker assignment flags
; ===============================================================================================================================
Global Const $BASS_SPEAKER_FRONT = 0x1000000 ; front speakers
Global Const $BASS_SPEAKER_REAR = 0x2000000 ; rear/side speakers
Global Const $BASS_SPEAKER_CENLFE = 0x3000000 ; center & LFE speakers (5.1)
Global Const $BASS_SPEAKER_REAR2 = 0x4000000 ; rear center speakers (7.1)
Global Const $BASS_SPEAKER_LEFT = 0x10000000 ; modifier: left
Global Const $BASS_SPEAKER_RIGHT = 0x20000000 ; modifier: right
Global Const $BASS_SPEAKER_FRONTLEFT = $BASS_SPEAKER_FRONT + $BASS_SPEAKER_LEFT
Global Const $BASS_SPEAKER_FRONTRIGHT = $BASS_SPEAKER_FRONT + $BASS_SPEAKER_RIGHT
Global Const $BASS_SPEAKER_REARLEFT = $BASS_SPEAKER_REAR + $BASS_SPEAKER_LEFT
Global Const $BASS_SPEAKER_REARRIGHT = $BASS_SPEAKER_REAR + $BASS_SPEAKER_RIGHT
Global Const $BASS_SPEAKER_CENTER = $BASS_SPEAKER_CENLFE + $BASS_SPEAKER_LEFT
Global Const $BASS_SPEAKER_LFE = $BASS_SPEAKER_CENLFE + $BASS_SPEAKER_RIGHT
Global Const $BASS_SPEAKER_REAR2LEFT = $BASS_SPEAKER_REAR2 + $BASS_SPEAKER_LEFT
Global Const $BASS_SPEAKER_REAR2RIGHT = $BASS_SPEAKER_REAR2 + $BASS_SPEAKER_RIGHT

Global Const $BASS_UNICODE = 0x80000000

Global Const $BASS_RECORD_PAUSE = 32768 ; start recording paused

; ===============================================================================================================================
; DX7 voice allocation flags
; ===============================================================================================================================
Global Const $BASS_VAM_HARDWARE = 1
Global Const $BASS_VAM_SOFTWARE = 2
Global Const $BASS_VAM_TERM_TIME = 4
Global Const $BASS_VAM_TERM_DIST = 8
Global Const $BASS_VAM_TERM_PRIO = 16

; ===============================================================================================================================
; Channel info structure
; ===============================================================================================================================
Global $BASS_CHANNELINFO = 'dword freq;' & _ ; default playback rate
		'dword chans;' & _			; channels
		'dword flags;' & _			; $BASS_SAMPLE/STREAM/MUSIC/SPEAKER flags
		'dword ctype;' & _			; type of channel
		'dword origres;' & _			; original resolution
		'dword plugin;' & _			; plugin
		'dword sample;' & _			; sample
		'ptr filename;' ;filename

; ===============================================================================================================================
; $BASS_CHANNELINFO types
; ===============================================================================================================================
Global Const $BASS_CTYPE_SAMPLE = 1
Global Const $BASS_CTYPE_RECORD = 2
Global Const $BASS_CTYPE_STREAM = 0x10000
Global Const $BASS_CTYPE_STREAM_OGG = 0x10002
Global Const $BASS_CTYPE_STREAM_MP1 = 0x10003
Global Const $BASS_CTYPE_STREAM_MP2 = 0x10004
Global Const $BASS_CTYPE_STREAM_MP3 = 0x10005
Global Const $BASS_CTYPE_STREAM_AIFF = 0x10006
Global Const $BASS_CTYPE_STREAM_WAV = 0x40000 ; WAVE flag, LOWORD=codec
Global Const $BASS_CTYPE_STREAM_WAV_PCM = 0x50001
Global Const $BASS_CTYPE_STREAM_WAV_FLOAT = 0x50003
Global Const $BASS_CTYPE_MUSIC_MOD = 0x20000
Global Const $BASS_CTYPE_MUSIC_MTM = 0x20001
Global Const $BASS_CTYPE_MUSIC_S3M = 0x20002
Global Const $BASS_CTYPE_MUSIC_XM = 0x20003
Global Const $BASS_CTYPE_MUSIC_IT = 0x20004
Global Const $BASS_CTYPE_MUSIC_MO3 = 0x100 ; MO3 flag

Global $BASS_PLUGINFORM = 'dword;ptr;ptr;'

Global $BASS_PLUGININFO = 'dword version;' & _			; version (same form as $BASS_GetVersion)
		'dword formatc;' & _			; number of formats
		'ptr formats;' ; the array of formats

; ===============================================================================================================================
; 3D vector (for 3D positions/velocities/orientations)
; ===============================================================================================================================
Global $BASS_3DVECTOR = 'float X;' & _ 		; + = right, - = left
		'float Y;' & _ 		; + = up, - = down
		'float z;' ; + = front, - = behind

; ===============================================================================================================================
; 3D channel modes
; ===============================================================================================================================
Global Const $BASS_3DMODE_NORMAL = 0 ; normal 3D processing
Global Const $BASS_3DMODE_RELATIVE = 1 ; position is relative to the listener
Global Const $BASS_3DMODE_OFF = 2 ; no 3D processing

; ===============================================================================================================================
; software 3D mixing algorithms (used with $BASS_CONFIG_3DALGORITHM)
; ===============================================================================================================================
Global Const $BASS_3DALG_DEFAULT = 0
Global Const $BASS_3DALG_OFF = 1
Global Const $BASS_3DALG_FULL = 2
Global Const $BASS_3DALG_LIGHT = 3

; ===============================================================================================================================
; EAX environments, use with $BASS_SetEAXParameters
; ===============================================================================================================================
Global Const $EAX_ENVIRONMENT_GENERIC = 0
Global Const $EAX_ENVIRONMENT_PADDEDCELL = 1
Global Const $EAX_ENVIRONMENT_ROOM = 2
Global Const $EAX_ENVIRONMENT_BATHROOM = 3
Global Const $EAX_ENVIRONMENT_LIVINGROOM = 4
Global Const $EAX_ENVIRONMENT_STONEROOM = 5
Global Const $EAX_ENVIRONMENT_AUDITORIUM = 6
Global Const $EAX_ENVIRONMENT_CONCERTHALL = 7
Global Const $EAX_ENVIRONMENT_CAVE = 8
Global Const $EAX_ENVIRONMENT_ARENA = 9
Global Const $EAX_ENVIRONMENT_HANGAR = 10
Global Const $EAX_ENVIRONMENT_CARPETEDHALLWAY = 11
Global Const $EAX_ENVIRONMENT_HALLWAY = 12
Global Const $EAX_ENVIRONMENT_STONECORRIDOR = 13
Global Const $EAX_ENVIRONMENT_ALLEY = 14
Global Const $EAX_ENVIRONMENT_FOREST = 15
Global Const $EAX_ENVIRONMENT_CITY = 16
Global Const $EAX_ENVIRONMENT_MOUNTAINS = 17
Global Const $EAX_ENVIRONMENT_QUARRY = 18
Global Const $EAX_ENVIRONMENT_PLAIN = 19
Global Const $EAX_ENVIRONMENT_PARKINGLOT = 20
Global Const $EAX_ENVIRONMENT_SEWERPIPE = 21
Global Const $EAX_ENVIRONMENT_UNDERWATER = 22
Global Const $EAX_ENVIRONMENT_DRUGGED = 23
Global Const $EAX_ENVIRONMENT_DIZZY = 24
Global Const $EAX_ENVIRONMENT_PSYCHOTIC = 25
Global Const $EAX_ENVIRONMENT_COUNT = 26 ; total number of environments

Global Const $BASS_STREAMPROC_END = 0x80000000 ; end of user stream flag

; ===============================================================================================================================
; special STREAMPROCs
; ===============================================================================================================================
Global Const $STREAMPROC_DUMMY = 0 ; "dummy" stream
Global Const $STREAMPROC_PUSH = -1 ; push stream

; ===============================================================================================================================
; $BASS_StreamCreateFileUser file systems
; ===============================================================================================================================
Global Const $STREAMFILE_NOBUFFER = 0
Global Const $STREAMFILE_BUFFER = 1
Global Const $STREAMFILE_BUFFERPUSH = 2

; ===============================================================================================================================
; $BASS_StreamPutFileData options
; ===============================================================================================================================
Global Const $BASS_FILEDATA_END = 0 ; end & close the file

; ===============================================================================================================================
; $BASS_StreamGetFilePosition modes
; ===============================================================================================================================
Global Const $BASS_FILEPOS_CURRENT = 0
Global Const $BASS_FILEPOS_DECODE = $BASS_FILEPOS_CURRENT
Global Const $BASS_FILEPOS_DOWNLOAD = 1
Global Const $BASS_FILEPOS_END = 2
Global Const $BASS_FILEPOS_START = 3
Global Const $BASS_FILEPOS_CONNECTED = 4
Global Const $BASS_FILEPOS_BUFFER = 5

; ===============================================================================================================================
; $BASS_ChannelSetSync types
; ===============================================================================================================================
Global Const $BASS_SYNC_POS = 0
Global Const $BASS_SYNC_END = 2
Global Const $BASS_SYNC_META = 4
Global Const $BASS_SYNC_SLIDE = 5
Global Const $BASS_SYNC_STALL = 6
Global Const $BASS_SYNC_DOWNLOAD = 7
Global Const $BASS_SYNC_FREE = 8
Global Const $BASS_SYNC_SETPOS = 11
Global Const $BASS_SYNC_MUSICPOS = 10
Global Const $BASS_SYNC_MUSICINST = 1
Global Const $BASS_SYNC_MUSICFX = 3
Global Const $BASS_SYNC_OGG_CHANGE = 12
Global Const $BASS_SYNC_MIXTIME = 0x40000000 ; FLAG: sync at mixtime, else at playtime
Global Const $BASS_SYNC_ONETIME = 0x80000000 ; FLAG: sync only once, else continuously

; ===============================================================================================================================
; $BASS_ChannelIsActive return values
; ===============================================================================================================================
Global Const $BASS_ACTIVE_STOPPED = 0
Global Const $BASS_ACTIVE_PLAYING = 1
Global Const $BASS_ACTIVE_STALLED = 2
Global Const $BASS_ACTIVE_PAUSED = 3

; ===============================================================================================================================
; Channel attributes
; ===============================================================================================================================
Global Const $BASS_ATTRIB_FREQ = 1
Global Const $BASS_ATTRIB_VOL = 2
Global Const $BASS_ATTRIB_PAN = 3
Global Const $BASS_ATTRIB_EAXMIX = 4
Global Const $BASS_ATTRIB_NOBUFFER = 5
Global Const $BASS_ATTRIB_CPU = 7
Global Const $BASS_ATTRIB_MUSIC_AMPLIFY = 0x100
Global Const $BASS_ATTRIB_MUSIC_PANSEP = 0x101
Global Const $BASS_ATTRIB_MUSIC_PSCALER = 0x102
Global Const $BASS_ATTRIB_MUSIC_BPM = 0x103
Global Const $BASS_ATTRIB_MUSIC_SPEED = 0x104
Global Const $BASS_ATTRIB_MUSIC_VOL_GLOBAL = 0x105
Global Const $BASS_ATTRIB_MUSIC_VOL_CHAN = 0x200 ; + channel #
Global Const $BASS_ATTRIB_MUSIC_VOL_INST = 0x300 ; + instrument #

; ===============================================================================================================================
; $BASS_ChannelGetData flags
; ===============================================================================================================================
Global Const $BASS_DATA_AVAILABLE = 0 ; query how much data is buffered
Global Const $BASS_DATA_FLOAT = 0x40000000 ; flag: return floating-point sample data
Global Const $BASS_DATA_FFT256 = 0x80000000 ; 256 sample FFT
Global Const $BASS_DATA_FFT512 = 0x80000001 ; 512 FFT
Global Const $BASS_DATA_FFT1024 = 0x80000002 ; 1024 FFT
Global Const $BASS_DATA_FFT2048 = 0x80000003 ; 2048 FFT
Global Const $BASS_DATA_FFT4096 = 0x80000004 ; 4096 FFT
Global Const $BASS_DATA_FFT8192 = 0x80000005 ; 8192 FFT
Global Const $BASS_DATA_FFT16384 = 0x80000006 ; 16384 FFT
Global Const $BASS_DATA_FFT_INDIVIDUAL = 0x10 ; FFT flag: FFT for each channel, else all combined
Global Const $BASS_DATA_FFT_NOWINDOW = 0x20 ; FFT flag: no Hanning window
Global Const $BASS_DATA_FFT_REMOVEDC = 0x40 ; FFT flag: pre-remove DC bias

; ===============================================================================================================================
; $BASS_ChannelGetTags types : what;s returned
; ===============================================================================================================================
Global Const $BASS_TAG_ID3 = 0 ;ID3v1 tags : 128 byte block
Global Const $BASS_TAG_ID3V2 = 1 ;ID3v2 tags : variable length block
Global Const $BASS_TAG_OGG = 2 ;OGG comments : series of null-terminated UTF-8 strings
Global Const $BASS_TAG_HTTP = 3 ;HTTP headers : series of null-terminated ANSI strings
Global Const $BASS_TAG_ICY = 4 ;ICY headers : series of null-terminated ANSI strings
Global Const $BASS_TAG_META = 5 ;ICY metadata : ANSI string
Global Const $BASS_TAG_APE = 6; // APEv2 tags : series of null-terminated UTF-8 strings
Global Const $BASS_TAG_MP4 = 7; // MP4/iTunes metadata : series of null-terminated UTF-8 strings
Global Const $BASS_TAG_VENDOR = 9 ;OGG encoder : UTF-8 string
Global Const $BASS_TAG_LYRICS3 = 10 ;Lyric3v2 tag : ASCII string
Global Const $BASS_TAG_CA_CODEC = 11;	// CoreAudio codec info : TAG_CA_CODEC structure
Global Const $BASS_TAG_MF = 13;	// Media Foundation tags : series of null-terminated UTF-8 strings
Global Const $BASS_TAG_WAVEFORMAT = 14;	// WAVE format : WAVEFORMATEEX structure
Global Const $BASS_TAG_RIFF_INFO = 0x100 ;RIFF/WAVE tags : series of null-terminated ANSI strings
Global Const $BASS_TAG_RIFF_BEXT = 0x101; // RIFF/BWF "bext" tags : TAG_BEXT structure
Global Const $BASS_TAG_RIFF_CART = 0x102; // RIFF/BWF "cart" tags : TAG_CART structure
Global Const $BASS_TAG_RIFF_DISP = 0x103; // RIFF "DISP" text tag : ANSI string
Global Const $BASS_TAG_APE_BINARY = 0x1000; // + index #, binary APEv2 tag : TAG_APE_BINARY structure
Global Const $BASS_TAG_MUSIC_NAME = 0x10000 ;MOD music name : ANSI string
Global Const $BASS_TAG_MUSIC_MESSAGE = 0x10001 ;MOD message : ANSI string
Global Const $BASS_TAG_MUSIC_ORDERS = 0x10002; // MOD order list : BYTE array of pattern numbers
Global Const $BASS_TAG_MUSIC_INST = 0x10100 ;+ instrument #, MOD instrument name : ANSI string
Global Const $BASS_TAG_MUSIC_SAMPLE = 0x10300 ;+ sample #, MOD sample name : ANSI string

; ===============================================================================================================================
; $BASS_ChannelGetLength/GetPosition/SetPosition modes
; ===============================================================================================================================
Global Const $BASS_POS_BYTE = 0 ; byte position
Global Const $BASS_POS_MUSIC_ORDER = 1 ; order.row position, MAKEdword(order,row)
Global Const $BASS_POS_DECODE = 0x10000000; // flag: get the decoding (not playing) position
Global Const $BASS_POS_DECODETO = 0x20000000; // flag: decode to the position instead of seeking

; ===============================================================================================================================
; $BASS_RecordSetInput flags
; ===============================================================================================================================
Global Const $BASS_INPUT_OFF = 0x10000
Global Const $BASS_INPUT_ON = 0x20000

Global Const $BASS_INPUT_TYPE_MASK = 0xFF000000
Global Const $BASS_INPUT_TYPE_UNDEF = 0x0
Global Const $BASS_INPUT_TYPE_DIGITAL = 0x1000000
Global Const $BASS_INPUT_TYPE_LINE = 0x2000000
Global Const $BASS_INPUT_TYPE_MIC = 0x3000000
Global Const $BASS_INPUT_TYPE_SYNTH = 0x4000000
Global Const $BASS_INPUT_TYPE_CD = 0x5000000
Global Const $BASS_INPUT_TYPE_PHONE = 0x6000000
Global Const $BASS_INPUT_TYPE_SPEAKER = 0x7000000
Global Const $BASS_INPUT_TYPE_WAVE = 0x8000000
Global Const $BASS_INPUT_TYPE_AUX = 0x9000000
Global Const $BASS_INPUT_TYPE_ANALOG = 0xA000000

; ===============================================================================================================================
; DX8 effect types, use with $BASS_ChannelSetFX
; ===============================================================================================================================
Global Const $BASS_FX_DX8_CHORUS = "BASS_FX_DX8_CHORUS"
Global Const $BASS_FX_DX8_CHORUS_VALUE = 0

Global Const $BASS_FX_DX8_COMPRESSOR = "BASS_FX_DX8_COMPRESSOR"
Global Const $BASS_FX_DX8_COMPRESSOR_VALUE = 1

Global Const $BASS_FX_DX8_DISTORTION = "BASS_FX_DX8_DISTORTION"
Global Const $BASS_FX_DX8_DISTORTION_VALUE = 2

Global Const $BASS_FX_DX8_ECHO = "BASS_FX_DX8_ECHO"
Global Const $BASS_FX_DX8_ECHO_VALUE = 3

Global Const $BASS_FX_DX8_FLANGER = "BASS_FX_DX8_FLANGER"
Global Const $BASS_FX_DX8_FLANGER_VALUE = 4

Global Const $BASS_FX_DX8_GARGLE = "BASS_FX_DX8_GARGLE"
Global Const $BASS_FX_DX8_GARGLE_VALUE = 5

Global Const $BASS_FX_DX8_I3DL2REVERB = "BASS_FX_DX8_I3DL2REVERB"
Global Const $BASS_FX_DX8_I3DL2REVERB_VALUE = 6

Global Const $BASS_FX_DX8_PARAMEQ = "BASS_FX_DX8_PARAMEQ"
Global Const $BASS_FX_DX8_PARAMEQ_VALUE = 7

Global Const $BASS_FX_DX8_REVERB = "BASS_FX_DX8_REVERB"
Global Const $BASS_FX_DX8_REVERB_VALUE = 8

Global $BASS_DX8_CHORUS = 'float;' & _ 	;fWetDryMix
		'float;' & _				;fDepth
		'float;' & _				;fFeedback
		'float;' & _				;fFrequency
		'dword;' & _				;lWaveform, 0=triangle, 1=sine
		'float;' & _				;fDelay
		'dword;' ;lPhase

Global $BASS_DX8_COMPRESSOR = 'float;' & _	;fGain
		'float;' & _				;fAttack
		'float;' & _				;fRelease
		'float;' & _				;fThreshold
		'float;' & _				;fRatio
		'float;' ;fPredelay

Global $BASS_DX8_DISTORTION = 'float;' & _	;fGain
		'float;' & _				;fEdge
		'float;' & _				;fPostEQCenterFrequency
		'float;' & _				;fPostEQBandwidth
		'float;' ;fPreLowpassCutoff

Global $BASS_DX8_ECHO = 'float;' & _ 		;fWetDryMix
		'float;' & _ 				;fFeedback
		'float;' & _ 				;fLeftDelay
		'float;' & _ 				;fRightDelay
		'int;' ;lPanDelay

Global $BASS_DX8_FLANGER = 'float;' & _ 	;fWetDryMix
		'float;' & _ 				;fDepth
		'float;' & _ 				;fFeedback
		'float;' & _ 				;fFrequency
		'dword;' & _  				;lWaveform, 0=triangle, 1=sine
		'float;' & _ 				;fDelay
		'dword;' ;lPhase

Global $BASS_DX8_GARGLE = 'dword;' & _ 	;dwRateHz
		'dword;' ;dwWaveShape, 0=triangle, 1=square

Global $BASS_DX8_I3DL2REVERB = 'int;' & _ 	;lRoom                  [-10000, 0]      default: -1000 mB
		'int;' & _ 					;lRoomHF                [-10000, 0]      default: 0 mB
		'float;' & _ 				;flRoomRolloffFactor    [0.0, 10.0]      default: 0.0
		'float;' & _  				;flDecayTime           	[0.1, 20.0]      default: 1.49s
		'float;' & _  				;flDecayHFRatio        	[0.1, 2.0]       default: 0.83
		'int;' & _  				;lReflections           [-10000, 1000]   default: -2602 mB
		'float;' & _  				;flReflectionsDelay    	[0.0, 0.3]       default: 0.007 s
		'int;' & _ 					;lReverb                [-10000, 2000]   default: 200 mB
		'float;' & _  				;flReverbDelay         	[0.0, 0.1]       default: 0.011 s
		'float;' & _  				;flDiffusion           	[0.0, 100.0]     default: 100.0 %
		'float;' & _  				;flDensity             	[0.0, 100.0]     default: 100.0 %
		'float;' ;flHFReference			[20.0, 20000.0]  default: 5000.0 Hz

Global $BASS_DX8_PARAMEQ = 'float;' & _ 	;fCenter
		'float;' & _ 				;fBandwidth
		'float;' ;fGain

Global $BASS_DX8_REVERB = 'float;' & _ 	;fInGain                [-96.0,0.0]            default: 0.0 dB
		'float;' & _ 				;fReverbMix             [-96.0,0.0]            default: 0.0 db
		'float;' & _  				;fReverbTime           	[0.001,3000.0]         default: 1000.0 ms
		'float;' ;fHighFreqRTRatio 		[0.001,0.999]          default: 0.001

Global Const $BASS_DX8_PHASE_NEG_180 = 0
Global Const $BASS_DX8_PHASE_NEG_90 = 1
Global Const $BASS_DX8_PHASE_ZERO = 2
Global Const $BASS_DX8_PHASE_90 = 3
Global Const $BASS_DX8_PHASE_180 = 4