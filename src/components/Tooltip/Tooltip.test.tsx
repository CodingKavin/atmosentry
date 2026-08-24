import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

// --- happy path ---

describe('Tooltip', () => {
  it('renders the trigger children', () => {
    render(<Tooltip text="Fine particles under 2.5µm"><span>PM2.5</span></Tooltip>);
    expect(screen.getByText('PM2.5')).toBeInTheDocument();
  });

  it('renders the tooltip text in the DOM', () => {
    render(<Tooltip text="Fine particles under 2.5µm"><span>PM2.5</span></Tooltip>);
    expect(screen.getByText('Fine particles under 2.5µm')).toBeInTheDocument();
  });

  it('tooltip text is not visible before hover', () => {
    render(<Tooltip text="Fine particles under 2.5µm"><span>PM2.5</span></Tooltip>);
    expect(screen.getByText('Fine particles under 2.5µm')).toHaveClass('opacity-0');
  });

  it('tooltip becomes visible on hover', async () => {
    const user = userEvent.setup();
    render(<Tooltip text="Fine particles under 2.5µm"><span>PM2.5</span></Tooltip>);
    await user.hover(screen.getByText('PM2.5'));
    expect(screen.getByText('Fine particles under 2.5µm')).toHaveClass('opacity-100');
  });

  it('tooltip hides again after mouse leaves', async () => {
    const user = userEvent.setup();
    render(<Tooltip text="Fine particles under 2.5µm"><span>PM2.5</span></Tooltip>);
    await user.hover(screen.getByText('PM2.5'));
    await user.unhover(screen.getByText('PM2.5'));
    expect(screen.getByText('Fine particles under 2.5µm')).toHaveClass('opacity-0');
  });

// --- edge cases ---

  it('accepts a custom className on the wrapper', () => {
    const { container } = render(
      <Tooltip text="hello" className="custom-class"><span>x</span></Tooltip>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  // TODO: add your edge cases below
});
