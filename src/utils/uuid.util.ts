/**
 * Returns string by uuidv4.
 *
 * @remarks
 * This method is part of the {@link utils/uuid}.
 *
 * @returns The string
 *
 * @beta
 */
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const uuid_v4 = (m = Math, d = Date, h = 16, s = (s) => m.floor(s).toString(h)) =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
// 61ac2b3b9712540314a4cb28
// 3b241101-e2bb-4255-8caf-4136c566a962
// 2f0a-450-454-9f6a-3b28f7
/**
 * Returns string by generateUID.
 *
 * @remarks
 * This method is part of the {@link utils/uuid}.
 *
 * @returns The string
 *
 * @beta
 */
export const generateUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  const newFirstPart = ('000' + firstPart.toString(36)).slice(-3);
  const newSecondPart = ('000' + secondPart.toString(36)).slice(-3);
  return newFirstPart + newSecondPart;
};
