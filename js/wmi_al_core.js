// (2020-09-04)

var WMI_AL_ref = {
  Win32_PerfFormattedData_PerfOS_Processor: {
    properties: {
      PercentProcessorTime: 0
//     ,PercentIdleTime: 100
    }
   ,collection_length_default: 2
   ,timer_interval: "PC_count_max"
  }

 ,Win32_OperatingSystem: {
    properties: {
      TotalVisibleMemorySize: 2048
    }
   ,collection_length_default: 1
   ,timer_interval: "0"
  }

 ,Win32_PerfFormattedData_PerfOS_Memory: {
    properties: {
      AvailableMBytes: 2048
    }
   ,collection_length_default: 1
   ,timer_interval: "PC_count_max"
  }

 ,Win32_PerfFormattedData_PerfDisk_LogicalDisk: {
    properties: {
      Name: "C"
     ,PercentDiskTime: 0
    }
   ,collection_length_default: 2
   ,timer_interval: "PC_count_max"
  }

 ,Win32_PerfFormattedData_PerfOS_PagingFile: {
    properties: {
      PercentUsage: 0
     ,AllocatedBaseSize: 1024
     ,CurrentUsage: 0
    }
   ,collection_length_default: 1
   ,timer_interval: "PC_count_max"
  }

 ,Win32_PerfFormattedData_Tcpip_NetworkInterface: {
    properties: {
      Name: "Now Loading..."
     ,BytesReceivedPerSec: 0
     ,BytesSentPerSec: 0
//     ,CurrentBandwidth: 0
    }
   ,collection_length_default: 1
   ,timer_interval: "PC_count_max"
  }

 ,Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine: {
    properties: {
      UtilizationPercentage: 0
    }
   ,collection_length_default: 1
   ,timer_interval: "PC_count_max"
  }
}
