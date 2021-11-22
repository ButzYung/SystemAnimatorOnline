/**
 * @fileoverview Declarations for the pose tracking API.
 */

/**
 * Version number of this package.
 */
export const VERSION: string;

/**
 * Represents pairs of (start,end) indexes so that we can connect landmarks
 * with lines to provide a skeleton when we draw the points.
 */
export declare type LandmarkConnectionArray = Array<[number, number]>;

/**
 * PoseEvent.onPose returns an array of landmarks. This array provides the
 * edges to connect those landmarks to one another.
 */
export declare const POSE_CONNECTIONS: LandmarkConnectionArray;

/**
 * Provide a way to access landmarks by their friendly names. Using an
 * interface allows us to prevent obfuscation for external javascript linkage,
 * while still allowing optimization for internal linkages.
 */
export declare const POSE_LANDMARKS: {
  NOSE: number,
  RIGHT_EYE_INNER: number,
  RIGHT_EYE: number,
  RIGHT_EYE_OUTER: number,
  LEFT_EYE_INNER: number,
  LEFT_EYE: number,
  LEFT_EYE_OUTER: number,
  RIGHT_EAR: number,
  LEFT_EAR: number,
  MOUTH_RIGHT: number,
  MOUTH_LEFT: number,
  RIGHT_SHOULDER: number,
  LEFT_SHOULDER: number,
  RIGHT_ELBOW: number,
  LEFT_ELBOW: number,
  RIGHT_WRIST: number,
  LEFT_WRIST: number,
  RIGHT_PINKY: number,
  LEFT_PINKY: number,
  RIGHT_INDEX: number,
  LEFT_INDEX: number,
  RIGHT_THUMB: number,
  LEFT_THUMB: number,
  RIGHT_HIP: number,
  LEFT_HIP: number
};

/**
 * Just the left-side landmarks for pose.
 */
export declare const POSE_LANDMARKS_LEFT: {
  LEFT_EYE_INNER: number,
  LEFT_EYE: number,
  LEFT_EYE_OUTER: number,
  LEFT_EAR: number,
  LEFT_RIGHT: number,
  LEFT_SHOULDER: number,
  LEFT_ELBOW: number,
  LEFT_WRIST: number,
  LEFT_PINKY: number,
  LEFT_INDEX: number,
  LEFT_THUMB: number,
  LEFT_HIP: number,
  LEFT_KNEE: number,
  LEFT_ANKLE: number,
  LEFT_HEEL: number,
  LEFT_FOOT_INDEX: number,
};

/**
 * Just the right-side landmarks for pose.
 */
export declare const POSE_LANDMARKS_RIGHT: {
  RIGHT_EYE_INNER: number,
  RIGHT_EYE: number,
  RIGHT_EYE_OUTER: number,
  RIGHT_EAR: number,
  RIGHT_LEFT: number,
  RIGHT_SHOULDER: number,
  RIGHT_ELBOW: number,
  RIGHT_WRIST: number,
  RIGHT_PINKY: number,
  RIGHT_INDEX: number,
  RIGHT_THUMB: number,
  RIGHT_HIP: number,
  RIGHT_KNEE: number,
  RIGHT_ANKLE: number,
  RIGHT_HEEL: number,
  RIGHT_FOOT_INDEX: number
};

/**
 * Just the neutral landmarks for pose.
 */
export declare const POSE_LANDMARKS_NEUTRAL: {
  NOSE: number,
};

/**
 * Represents a single normalized landmark.
 */
export declare interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/**
 * Detected points are returned as a collection of normalized landmarks.
 */
export type NormalizedLandmarkList = NormalizedLandmark[];

/**
 * Represents a single landmark (not normalized).
 */
export interface Landmark extends NormalizedLandmark {}

/**
 * Detected points are returned as a collection of landmarks.
 */
export type LandmarkList = Landmark[];

/**
 * We support several ways to get image inputs.
 */
export type InputImage = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

/**
 * Legal inputs.
 */
export interface InputMap {
  image: InputImage;
}

/**
 * GpuBuffers should all be compatible with Canvas' `drawImage`
 */
type GpuBuffer = HTMLCanvasElement|HTMLImageElement|ImageBitmap;

/**
 * Possible results from Pose.
 */
export interface Results {
  poseLandmarks: NormalizedLandmarkList;
  poseWorldLandmarks: LandmarkList;
  segmentationMask: GpuBuffer;
  image: GpuBuffer;
}

/**
 * Configurable options for Pose.
 */
export interface Options {
  selfieMode?: boolean;
  modelComplexity?: 0|1|2;
  smoothLandmarks?: boolean;
  enableSegmentation?: boolean;
  smoothSegmentation?: boolean;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

/**
 * Listener for any results from Pose.
 */
export type ResultsListener = (results: Results) => (Promise<void>|void);

/**
 * Contains all of the setup options to drive the pose solution.
 */
export interface PoseConfig {
  locateFile?: (path: string, prefix?: string) => string;
}

/**
 * Declares the interface of Pose.
 */
declare interface PoseInterface {
  close(): Promise<void>;
  onResults(listener: ResultsListener): void;
  initialize(): Promise<void>;
  reset(): void;
  send(inputs: InputMap, at?: number): Promise<void>;
  setOptions(options: Options): void;
}

/**
 * Encapsulates the entire Pose solution. All that is needed from the developer
 * is the source of the image data. The user will call `send`
 * repeatedly and if a pose is detected, then the user can receive callbacks
 * with this metadata.
 */
export declare class Pose implements PoseInterface {
  constructor(config?: PoseConfig);

  /**
   * Shuts down the object. Call before creating a new instance.
   */
  close(): Promise<void>;

  /**
   * Registers a single callback that will carry any results that occur
   * after calling Send().
   */
  onResults(listener: ResultsListener): void;

  /**
   * Initializes the solution. This includes loading ML models and mediapipe
   * configurations, as well as setting up potential listeners for metadata. If
   * `initialize` is not called manually, then it will be called the first time
   * the developer calls `send`.
   */
  initialize(): Promise<void>;

  /**
   * Tells the graph to restart before the next frame is sent.
   */
  reset(): void;

  /**
   * Processes a single frame of data, which depends on the options sent to the
   * constructor.
   */
  send(inputs: InputMap, at?: number): Promise<void>;

  /**
   * Adjusts options in the solution. This may trigger a graph reload the next
   * time the graph tries to run.
   */
  setOptions(options: Options): void;
}
