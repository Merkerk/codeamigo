import { Transition } from '@headlessui/react';
import React, { useCallback, useEffect } from 'react';

import ChangePassword from '👨‍💻modals/ChangePassword';
import HighDemand from '👨‍💻modals/HighDemand';
import Login from '👨‍💻modals/Login';
import MobileWarning from '👨‍💻modals/MobileWarning';
import Register from '👨‍💻modals/Register';
import RegisterAfterPreview from '👨‍💻modals/RegisterAfterPreview';
import ResetPasswordSent from '👨‍💻modals/ResetPasswordSent';
import Steps from '👨‍💻modals/Steps';
import TestsPassed from '👨‍💻modals/TestsPassed';

import { InitialModalState, modalVar } from '../apollo/cache/modal';
import { useModalQuery } from '../generated/graphql';

const Modals: React.FC<Props> = () => {
  const { data } = useModalQuery();

  const handleEscape = useCallback((event) => {
    if (data?.modal?.persistent !== true) {
      if (event.keyCode === 27) modalVar(InitialModalState);
    }
  }, []);

  useEffect(() => {
    if (data?.modal?.name)
      document.addEventListener('keydown', handleEscape, false);
    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [data?.modal?.name]);

  const isOpen = !!data?.modal?.name;

  return isOpen ? (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0" */}
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={isOpen}
        >
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-neutral-800 opacity-50 transition-opacity"
            onClick={() => {
              if (data?.modal?.persistent !== true) modalVar(InitialModalState);
            }}
          >
            <div className="absolute inset-0 opacity-75"></div>
          </div>
        </Transition>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          aria-hidden="true"
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
        >
          &#8203;
        </span>
        {/* Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" */}
        <div
          aria-labelledby="modal-headline"
          aria-modal="true"
          className="relative inline-block rounded-lg border border-neutral-800 bg-black text-left align-bottom shadow-xl transition-all sm:align-middle"
          role="dialog"
        >
          {/* <div
            className="bg-bg-primary absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full"
            onClick={() => modalVar(InitialModalState)}
          >
            <Icon
              className="text-white text-3xl"
              name="cancel-circled"
            />
          </div> */}
          {/* eslint-disable */}
          {data?.modal?.name === 'changePassword' && <ChangePassword />}
          {data?.modal?.name === 'login' && <Login />}
          {data?.modal?.name === 'register' && <Register />}
          {data?.modal?.name === 'registerAfterPreview' && (
            <RegisterAfterPreview />
          )}
          {data?.modal?.name === 'resetPasswordSent' && <ResetPasswordSent />}
          {data?.modal?.name === 'testsPassed' && <TestsPassed />}
          {data?.modal?.name === 'highDemand' && <HighDemand />}
          {data?.modal?.name === 'mobileWarning' && <MobileWarning />}
          {data?.modal?.name === 'steps' && <Steps />}
          {/* eslint-enable */}
        </div>
      </div>
    </div>
  ) : null;
};

type Props = {};

export default Modals;
