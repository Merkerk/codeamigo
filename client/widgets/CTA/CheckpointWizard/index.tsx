import { motion } from 'framer-motion';
import React, { useState } from 'react';

import {
  RegularStepFragment,
  StepExecutionTypeEnum,
} from '👨‍💻generated/graphql';
import Jest from '👨‍💻widgets/CTA/CheckpointWizard/jest';
import Match from '👨‍💻widgets/CTA/CheckpointWizard/match';
import Output from '👨‍💻widgets/CTA/CheckpointWizard/output';
import Select from '👨‍💻widgets/CTA/CheckpointWizard/select';

enum CheckpointWizardStepEnum {
  jest = 'jest',
  match = 'match',
  output = 'output',
  select = 'select',
}

const CheckpointWizard: React.FC<Props> = ({ selectFile, step }) => {
  const [wizardStep, setWizardStep] = useState<
    keyof typeof CheckpointWizardStepEnum
  >('select');

  return (
    <div className="absolute bottom-full left-0 invisible group-hover:visible p-4 mb-1 group-hover:mb-0 md:w-72 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 md:transform text-text-primary bg-bg-nav">
      <motion.div
        animate={{ display: wizardStep === 'select' ? 'block' : 'none' }}
      >
        <Select setWizardStep={setWizardStep} step={step} />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'match' ? 'block' : 'none' }}
      >
        <Match
          selectFile={selectFile}
          setWizardStep={setWizardStep}
          step={step}
        />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'output' ? 'block' : 'none' }}
      >
        <Output setWizardStep={setWizardStep} step={step} />
      </motion.div>
      <motion.div
        animate={{ display: wizardStep === 'jest' ? 'block' : 'none' }}
      >
        <Jest setWizardStep={setWizardStep} step={step} />
      </motion.div>
    </div>
  );
};

type Props = {
  selectFile?: React.Dispatch<React.SetStateAction<string | null>>;
  step: RegularStepFragment;
};

export default CheckpointWizard;
