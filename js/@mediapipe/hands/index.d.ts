/**
 * @fileoverview Declarations for the hand tracking API.
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
 * HandEvent.onHand returns an array of landmarks. This array provides the
 * edges to connect those landmarks to one another.
 */
export declare const HAND_CONNECTIONS: LandmarkConnectionArray;

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
 * One list of landmarks.
 */
export type NormalizedLandmarkList = NormalizedLandmark[];

/**
 * Multiple lists of landmarks.
 */
export type NormalizedLandmarkListList = NormalizedLandmarkList[];

/**
 * Represents a single landmark (not normalized).
 */
export interface Landmark extends NormalizedLandmark {}

/**
 * Detected points are returned as a collection of landmarks.
 */
export type LandmarkList = Landmark[];

/**
 * Detected points are returned as a collection of landmarks.
 */
export type LandmarkListList = LandmarkList[];

/**
 * GpuBuffers should all be compatible with Canvas' `drawImage`
 */
type GpuBuffer = HTMLCanvasElement|HTMLImageElement|ImageBitmap;

/**
 * The descriptiong of the hand represented by the corresponding landmarks.
 */
export interface Handedness {
  /**
   * Index of the object as it appears in multiHandLandmarks.
   */
  index: number;
  /**
   * Confidence score between 0..1.
   */
  score: number;
  /**
   * Identifies which hand is detected at this index.
   */
  label: 'Right'|'Left';
}

/**
 * Possible results from Hands.
 */
export interface Results {
  multiHandLandmarks: NormalizedLandmarkListList;
  multiHandWorldLandmarks: LandmarkListList;
  multiHandedness: Handedness[];
  image: GpuBuffer;
}

/**
 * Configurable options for Hands.
 */
export interface Options {
  selfieMode?: boolean;
  maxNumHands?: number;
  modelComplexity?: 0|1;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

/**
 * Listener for any results from Hands.
 */
export type ResultsListener = (results: Results) => (Promise<void>|void);

/**
 * Contains all of the setup options to drive the hand solution.
 */
export interface HandsConfig {
  locateFile?: (path: string, prefix?: string) => string;
}

/**
 * Declares the interface of Hands.
 */
declare interface HandsInterface {
  close(): Promise<void>;
  onResults(listener: ResultsListener): void;
  initialize(): Promise<void>;
  reset(): void;
  send(inputs: InputMap): Promise<void>;
  setOptions(options: Options): void;
}

/**
 * Encapsulates the entire Hand solution. All that is needed from the developer
 * is the source of the image data. The user will call `send`
 * repeatedly and if a hand is detected, then the user can receive callbacks
 * with this metadata.
 */
export declare class Hands implements HandsInterface {
  constructor(config?: HandsConfig);

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
  send(inputs: InputMap): Promise<void>;

  /**
   * Adjusts options in the solution. This may trigger a graph reload the next
   * time the graph tries to run.
   */
  setOptions(options: Options): void;
}
