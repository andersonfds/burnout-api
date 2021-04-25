import { StepTypeBurnout, StepTypeOptions, StepTypeText } from "./steps/create-step-type.dto";

export interface StepTypeMap {
    name: string;
    type: any,
}

export const dataTypesMap: StepTypeMap[] = [
    {
        name: 'text',
        type: StepTypeText,
    },
    {
        name: 'options',
        type: StepTypeOptions,
    },
    {
        name: 'burnout',
        type: StepTypeBurnout,
    },
];