import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  checkPasswordStrength,
  minimumPasswordLength,
} from '../src/web/password-strength.js';

/**
 * Password Strength - Check Password Strength.
 *
 * Uses the cases the sibling apps test, so every app keeps scoring the same
 * password the same way.
 *
 * @since 1.0.0
 */
describe('checkPasswordStrength', () => {
  it('asks for the minimum length first', () => {
    expect(minimumPasswordLength).toBe(12);

    expect(checkPasswordStrength('eleven char')).toStrictEqual({
      advice: '',
      label: 'Too short',
      score: 0,
    });

    return;
  });

  it('rates common words, runs, repeats, and the username as weak', () => {
    expect(checkPasswordStrength('password1234')).toStrictEqual({
      advice: 'Avoid common words like "password".',
      label: 'Weak',
      score: 1,
    });

    expect(checkPasswordStrength('P@ssw0rd2026!')['score']).toBe(1);

    expect(checkPasswordStrength('qwertyuiop12')['advice']).toBe('Avoid runs like "1234" or "qwerty".');

    expect(checkPasswordStrength('aaaaaaaaaaaa')['advice']).toBe('Avoid repeated characters.');

    expect(checkPasswordStrength('jacky2026jacky', ['jacky'])['advice']).toBe('Avoid using your username.');

    return;
  });

  it('rates random characters and long passphrases higher', () => {
    expect(checkPasswordStrength('kT9#xP2$mQ7!')).toStrictEqual({
      advice: 'A few more characters would make it strong.',
      label: 'Good',
      score: 3,
    });

    expect(checkPasswordStrength('kT9#xP2$mQ7!w')['label']).toBe('Strong');

    expect(checkPasswordStrength('correct horse battery staple')['score']).toBe(4);

    return;
  });

  it('explains fair passwords', () => {
    expect(checkPasswordStrength('kitten1999zzq')).toStrictEqual({
      advice: 'Avoid years and dates.',
      label: 'Fair',
      score: 2,
    });

    expect(checkPasswordStrength('hgjkdlsoqpwe')).toStrictEqual({
      advice: 'Add another word or a few more characters.',
      label: 'Fair',
      score: 2,
    });

    return;
  });

  return;
});
