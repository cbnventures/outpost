import type { Mock } from 'vitest';

import type {
  Recreate_RecreateContainer_Container,
  Recreate_RecreateContainer_Dependencies,
  Recreate_RecreateContainer_Outcome,
} from './recreate.d.ts';
import type { Shared_Engine } from './shared.d.ts';

/**
 * Recreate - Create dependencies.
 *
 * @since 1.1.0
 */
export type Recreate_InspectContainer = Shared_Engine['inspectContainer'];

export type Recreate_FakeEngine = { [Key in keyof Shared_Engine]: Mock<Shared_Engine[Key]> };

export type Recreate_CreateDependencies_Returns = Omit<Recreate_RecreateContainer_Dependencies, 'engine'> & {
  engine: Recreate_FakeEngine;
};

/**
 * Recreate - Recreate container - Fails before stopping when the reserved name exists.
 *
 * @since 1.1.0
 */
export type Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Dependencies = Recreate_CreateDependencies_Returns;

export type Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Leftover = Recreate_RecreateContainer_Container;

export type Recreate_RecreateContainer_FailsBeforeStoppingWhenTheReservedNameExists_Outcome = Recreate_RecreateContainer_Outcome;

/**
 * Recreate - Recreate container - Frees the reserved name for the next update.
 *
 * @since 1.1.0
 */
export type Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Container = Recreate_RecreateContainer_Container;

export type Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Replacement = Recreate_RecreateContainer_Container;

export type Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_Dependencies = Recreate_CreateDependencies_Returns;

export type Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_FirstOutcome = Recreate_RecreateContainer_Outcome;

export type Recreate_RecreateContainer_FreesTheReservedNameForTheNextUpdate_SecondOutcome = Recreate_RecreateContainer_Outcome;
