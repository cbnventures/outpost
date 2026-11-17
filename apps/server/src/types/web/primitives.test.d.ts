import type { ComponentType } from 'react';

import type { Web_Components_Icon_Props } from '@/types/web/components.d.ts';

/**
 * Web - Primitives - Icon module.
 *
 * @since 1.1.0
 */
export type Web_Primitives_IconModule_Icon = ComponentType<Web_Components_Icon_Props>;
export type Web_Primitives_IconModule = {
  Icon: Web_Primitives_IconModule_Icon;
};
