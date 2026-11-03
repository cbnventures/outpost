import type { UpdateReport } from 'outpost-package-updater';
import type { Mock, MockInstance } from 'vitest';

import type { Runner as History } from '../history.js';
import type { Runner as Scheduler } from '../scheduler.js';
import type { Shared_CheckTrigger, Shared_SchedulerEvent } from './shared.d.ts';

/**
 * Scheduler.
 *
 * @since 1.0.0
 */
export type Scheduler_Directory = string;

/**
 * Scheduler - Scheduler - Persists Whole Cycle Failures.
 *
 * @since 1.0.0
 */
export type Scheduler_Scheduler_PersistsWholeCycleFailures_History = History;

export type Scheduler_Scheduler_PersistsWholeCycleFailures_Scheduler = Scheduler;

export type Scheduler_Scheduler_PersistsWholeCycleFailures_Stderr = MockInstance<typeof process.stderr.write>;

export type Scheduler_Scheduler_PersistsWholeCycleFailures_Reloaded = History;

/**
 * Scheduler - Scheduler - Resumes A Handed Over Check Once And Holds The Lock.
 *
 * @since 1.0.0
 */
export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_History = History;

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Scheduler = Scheduler;

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Stdout = MockInstance<typeof process.stdout.write>;

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Report = UpdateReport;

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Gate_Release = ((value: void) => void) | undefined;

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Gate = {
  release: Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Gate_Release;
};

export type Scheduler_Scheduler_ResumesAHandedOverCheckOnceAndHoldsTheLock_Finished = Promise<void>;

/**
 * Scheduler - Scheduler - Tells Listeners When A Check Starts And Finishes.
 *
 * @since 1.0.0
 */
export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_History = History;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle_ContainerIds = string[] | undefined;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle_Source = Shared_CheckTrigger;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle = (containerIds: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle_ContainerIds, source: Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle_Source) => Promise<UpdateReport>;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_RunCycle = Mock<Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Cycle>;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Scheduler = Scheduler;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Event = Shared_SchedulerEvent;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Events = Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Event[];

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Stdout = MockInstance<typeof process.stdout.write>;

export type Scheduler_Scheduler_TellsListenersWhenACheckStartsAndFinishes_Unsubscribe = () => void;
