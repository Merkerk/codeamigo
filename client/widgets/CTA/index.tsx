import { useReactiveVar } from '@apollo/client';
import { SandpackStatus } from '@codesandbox/sandpack-react';
import React, { useEffect, useRef, useState } from 'react';

import { isTestingVar, testFailureVar } from '👨‍💻apollo/cache/lesson';
import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import { Spinner } from '👨‍💻components/Spinners';
import {
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useCompleteCheckpointMutation,
  usePassCheckpointMutation,
} from '👨‍💻generated/graphql';
import {
  CodeSandboxTestMsgType,
  TestDataType,
} from '👨‍💻widgets/Lesson/Console/Tests/types';

const CTA: React.FC<Props> = ({
  bundlerReady,
  handleRunTests,
  isEditing,
  loading,
  nextStep,
  step,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [completeCheckpointM] = useCompleteCheckpointMutation({
    errorPolicy: 'ignore',
  });
  const [passCheckpoint] = usePassCheckpointMutation({ errorPolicy: 'ignore' });
  const isTesting = useReactiveVar(isTestingVar);
  const testsRef = useRef<TestDataType[]>([]);

  useEffect(() => {
    if (bundlerReady) {
      setTimeout(() => {
        setIsReady(true);
      }, 1000);
    }
  }, [bundlerReady]);

  const handlePassCheckpoint = async (
    message: MessageEvent<CodeSandboxTestMsgType>
  ) => {
    if (message.data.type !== 'test') return;
    // don't pass checkpoint if editting
    if (isEditing) {
      isTestingVar(false);
      return;
    }

    const lastCheckpointForStep =
      step.checkpoints &&
      step.checkpoints.findIndex(
        ({ id }) => id === step.currentCheckpointId
      ) ===
        step.checkpoints.length - 1;

    switch (message.data.event) {
      case 'test_end':
        testsRef.current = [...testsRef.current, message.data.test];
        break;
      case 'total_test_end':
        isTestingVar(false);
        if (testsRef.current[testsRef.current.length - 1]?.status === 'fail') {
          testFailureVar(true);
          return;
        } else {
          testFailureVar(false);
          if (!step.currentCheckpointId) return;

          const q = {
            query: StepDocument,
            variables: { id: step.id },
          };
          await passCheckpoint({
            update: (store) => {
              const stepData = store.readQuery<StepQuery>(q);
              if (!stepData?.step) return;

              store.writeQuery<StepQuery>({
                ...q,
                data: {
                  step: {
                    ...stepData.step,
                    checkpoints: stepData?.step?.checkpoints?.map(
                      (checkpoint) =>
                        checkpoint.id === stepData?.step?.currentCheckpointId
                          ? { ...checkpoint, isTested: true }
                          : checkpoint
                    ),
                  },
                },
              });
            },
            variables: { id: step.currentCheckpointId },
          });

          modalVar({
            callback: () =>
              lastCheckpointForStep ? nextStep() : completeCheckpoint(),
            name: 'testsPassed',
          });
        }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePassCheckpoint, true);

    return () =>
      window.removeEventListener('message', handlePassCheckpoint, true);
  }, [step.currentCheckpointId]);

  const completeCheckpoint = async () => {
    // don't complete checkpoint if editting
    if (isEditing) return;
    if (!step.currentCheckpointId) return;

    const q = {
      query: StepDocument,
      variables: { id: step.id },
    };
    await completeCheckpointM({
      update: (store) => {
        const stepData = store.readQuery<StepQuery>(q);
        if (!stepData?.step) return;

        // TODO: refactor this
        const nextCheckpointId = stepData?.step?.checkpoints?.find(
          ({ isCompleted }) => !isCompleted
        )?.id;

        store.writeQuery<StepQuery>({
          ...q,
          data: {
            step: {
              ...stepData.step,
              checkpoints: stepData?.step?.checkpoints?.map((checkpoint) =>
                checkpoint.id === stepData?.step?.currentCheckpointId
                  ? { ...checkpoint, isCompleted: true }
                  : checkpoint
              ),
              currentCheckpointId:
                nextCheckpointId || stepData.step.currentCheckpointId,
            },
          },
        });
      },
      variables: { id: step.currentCheckpointId },
    });
  };

  const runTests = () => {
    testsRef.current = [];
    handleRunTests();
  };

  const currentCheck = step.checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );
  const isTested = currentCheck?.isTested || !currentCheck || isEditing;
  const isStepComplete = !step.checkpoints?.find(
    (checkpoint) => checkpoint.isCompleted === false
  );
  const text = isTested ? 'Next 👉' : 'Test ✅';
  const spinner = isTesting || !isReady || loading;
  const fn = isTested
    ? isStepComplete || isEditing
      ? nextStep
      : completeCheckpoint
    : runTests;

  return (
    <Button
      className="justify-center w-20"
      disabled={spinner}
      nature="secondary"
      onClick={fn}
      type="button"
    >
      {spinner ? <Spinner /> : text}
    </Button>
  );
};

type Props = {
  bundlerReady: boolean;
  handleRunTests: () => void;
  isEditing?: boolean;
  isPreviewing?: boolean;
  loading: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
};

export default CTA;
