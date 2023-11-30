import * as vscode from 'vscode';
import { expect, test, vi } from 'vitest';

vi.mock('vscode', () => ({
  version: '0.0.0',
}));

test('vscode version', () => {
  expect(vscode.version).toBe('0.0.0');
});
