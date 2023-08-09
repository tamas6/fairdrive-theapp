import * as metamaskUtil from '../../src/utils/metamask';
import {
  decryptWallet,
  SIGN_WALLET_DATA,
  getBasicSignatureWallet,
} from '../../src/utils/metamask';
import { Wallet } from 'ethers';

const privateKey =
  'c5370d2c00c8df704ed9bc3180458c312585959922ab883fc09e38f9fb52961b';
const wallet = new Wallet(privateKey);
jest
  .spyOn(metamaskUtil, 'getAddress')
  .mockImplementation(() => Promise.resolve(wallet.address));
jest
  .spyOn(metamaskUtil, 'getSignature')
  .mockImplementation((address: string, text: string) =>
    wallet.signMessage(text)
  );

describe('Metamask', () => {
  const noPasswordSignature =
    '0xb7f4346174a6ff79983bdb10348523de3a4bd2b4772b9f7217b997c6ca1f6abd3de015eab01818e459fad3c067e00969d9f02b808df027574da2f7fd50170a911c';

  it('simulate metamask signature', async () => {
    expect(await wallet.signMessage(SIGN_WALLET_DATA)).toEqual(
      noPasswordSignature
    );
  });

  it('getBasicSignatureWallet without password', async () => {
    const expectedAddress = '0x61E18Ac267f4d5af06D421DeA020818255678649';
    const wallet = await getBasicSignatureWallet();
    expect(wallet.address).toBe(expectedAddress);
  });

  it('getBasicSignatureWallet with password', async () => {
    const expectedEasyAddress = '0xbb434d1D294455Aa6d85393187770b46Ecc11F95';
    const expectedStrongAddress = '0x1E721A883CeEbF8e2618140Ea00BE18dfC642238';
    const easyPassword = 'oneTwoThree';
    const strongPassword = 'Hello & world! =-0987654321`';
    const easyWallet = await getBasicSignatureWallet(easyPassword);
    expect(easyWallet.address).toBe(expectedEasyAddress);

    const strongWallet = await getBasicSignatureWallet(strongPassword);
    expect(strongWallet.address).toBe(expectedStrongAddress);

    // checks two steps getting of a wallet: 1 - get basic wallet, 2 - get encrypted wallet
    const walletBasic = await getBasicSignatureWallet();
    expect((await decryptWallet(walletBasic, easyPassword)).address).toEqual(
      easyWallet.address
    );
    expect((await decryptWallet(walletBasic, strongPassword)).address).toEqual(
      strongWallet.address
    );
  });
});
