import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import type { GeoResult } from '../../types/geo';

const londonUK: GeoResult = {
  id: 2643743,
  name: 'London',
  admin1: 'England',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
};

const londonCA: GeoResult = {
  id: 6058560,
  name: 'London',
  admin1: 'Ontario',
  country: 'Canada',
  latitude: 42.9837,
  longitude: -81.2497,
};

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} onSelect={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('does not show dropdown when results is undefined', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={vi.fn()} onSelect={vi.fn()} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows dropdown with results when focused', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={vi.fn()}
        results={[londonUK, londonCA]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('displays city name, admin1, and country for each result', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={vi.fn()}
        results={[londonUK]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    const option = screen.getByRole('option');
    expect(option).toHaveTextContent('London');
    expect(option).toHaveTextContent('England');
    expect(option).toHaveTextContent('United Kingdom');
  });

  it('shows "No results found" when results is an empty array', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar value="xyz" onChange={vi.fn()} onSelect={vi.fn()} results={[]} />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('calls onSelect when a result is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={onSelect}
        results={[londonUK, londonCA]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    await user.pointer({ target: options[1], keys: '[MouseLeft]' });
    expect(onSelect).toHaveBeenCalledWith(londonCA);
  });

  it('navigates results with ArrowDown/ArrowUp and selects with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={onSelect}
        results={[londonUK, londonCA]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(londonCA);
  });

  it('does not go past the last result on ArrowDown', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={onSelect}
        results={[londonUK]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(londonUK);
  });

  it('closes dropdown on Escape', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        value="London"
        onChange={vi.fn()}
        onSelect={vi.fn()}
        results={[londonUK]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="London" onChange={onChange} onSelect={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with the appended character when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchBar
        value="London"
        onChange={onChange}
        onSelect={vi.fn()}
        results={[londonUK]}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('x');
    expect(onChange).toHaveBeenCalledWith('Londonx');
  });
});
