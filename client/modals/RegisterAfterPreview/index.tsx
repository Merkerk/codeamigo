import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const RegisterAfterPreview: React.FC<Props> = () => {
  return (
    <div className="max-w-lg w-96 mx-auto p-6 lg:px-4">
      <div className="text-3xl">🎉</div>
      <div className="text-xl text-text-primary font-semibold">Nice work!</div>
      <div className="text-text-primary">
        To continue and save your changes please sign up.
      </div>
      <Button
        className="mt-3"
        onClick={() =>
          modalVar({
            callback: modalVar().callback,
            name: 'register',
          })
        }
      >
        Sign Up
      </Button>
    </div>
  );
};

type Props = {};

export default RegisterAfterPreview;
