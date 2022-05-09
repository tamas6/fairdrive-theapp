import { FC, useContext, useState } from 'react';
import router from 'next/router';
import { useForm } from 'react-hook-form';

import UserContext from '@context/UserContext';
import PodContext from '@context/PodContext';

import { createAccount, login, userStats } from '@api/authentication';
import { createPod } from '@api/pod';

import { AuthenticationHeader } from '@components/Headers';
import FeedbackMessage from '@components/FeedbackMessage/FeedbackMessage';
import { AuthenticationInput } from '@components/Inputs';
import { Button } from '@components/Buttons';

interface ConfirmMnemonicProps {}

const ConfirmMnemonic: FC<ConfirmMnemonicProps> = () => {
  const { register, handleSubmit, formState } = useForm();
  const { setUser, setPassword, setAddress } = useContext(UserContext);
  const { clearPodContext } = useContext(PodContext);
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data: {
    'word-5': string;
    'word-11': string;
    'word-12': string;
  }) => {
    let isMnemonicValid = true;

    const user = JSON.parse(localStorage.getItem('registerUser'));
    const mnemonic = localStorage.getItem('registerMnemonic');

    const mnemonicArr = mnemonic.split(' ');

    if (
      data['word-5'] !== mnemonicArr[4] ||
      data['word-11'] !== mnemonicArr[10] ||
      data['word-12'] !== mnemonicArr[11]
    ) {
      isMnemonicValid = false;
      setErrorMessage('Mnemonic mismatch!');
    }

    if (isMnemonicValid) {
      const registerData = {
        user_name: user.user_name,
        password: user.password,
        mnemonic: mnemonic,
      };

      createAccount(registerData)
        .then(() => {
          setUser(user.user_name);
          setPassword(user.password);

          createPod('Home', user.password)
            .then(() => {
              createPod('Consents', user.password)
                .then(() => {
                  login({ user_name: user.user_name, password: user.password })
                    .then(() => {
                      userStats()
                        .then((res) => {
                          setAddress(res.data.reference);
                          clearPodContext();
                          router.push('/overview');
                        })
                        .catch(() => {
                          setErrorMessage(
                            'Login failed. Incorrect user credentials, please try again.'
                          );
                        });
                    })
                    .catch(() => {
                      setErrorMessage(
                        'Login failed. Incorrect user credentials, please try again.'
                      );
                    });
                })
                .catch(() => {
                  setErrorMessage('Error: Could not create a new Pod.');
                });
            })
            .catch(() => {
              setErrorMessage('Error: Could not create a new Pod.');
            });
        })
        .catch(() => {
          setErrorMessage(
            'Registration failed. Invalid credentials, please try again.'
          );
        });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <AuthenticationHeader
        title="Confirm your seed phrase"
        content="Please enter the required word from your seed phrase to complete registration."
      />

      <div className="w-98 mt-12 mb-8">
        <div className="mb-5 text-center">
          <FeedbackMessage type="error" message={errorMessage} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <AuthenticationInput
            label="# Word 5"
            id="word-5"
            type="text"
            name="word-5"
            placeholder="Type here"
            useFormRegister={register}
            validationRules={{
              required: true,
            }}
            error={errors.user_name}
            errorMessage="Mnemonic Word #5 is required"
          />

          <AuthenticationInput
            label="# Word 11"
            id="word-11"
            type="text"
            name="word-11"
            placeholder="Type here"
            useFormRegister={register}
            validationRules={{
              required: true,
            }}
            error={errors.user_name}
            errorMessage="Mnemonic Word #11 is required"
          />

          <AuthenticationInput
            label="# Word 12"
            id="word-12"
            type="text"
            name="word-12"
            placeholder="Type here"
            useFormRegister={register}
            validationRules={{
              required: true,
            }}
            error={errors.user_name}
            errorMessage="Mnemonic Word #12 is required"
          />

          <div className="mt-14 text-center">
            <Button type="submit" variant="secondary" label="Register" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmMnemonic;