import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterItem from './FilterItem';

describe('Компонент FilterItem', () => {
  const defaultProps = {
    text: 'Тестовый элемент',
    isActive: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен рендерить текст элемента', () => {
    render(<FilterItem {...defaultProps} />);
    expect(screen.getByText('Тестовый элемент')).toBeInTheDocument();
  });

  it('должен применять активный класс когда isActive = true', () => {
    render(<FilterItem {...defaultProps} isActive={true} />);
    const item = screen.getByText('Тестовый элемент');
    expect(item).toHaveClass('filter__option--active');
  });

  it('не должен применять активный класс когда isActive = false', () => {
    render(<FilterItem {...defaultProps} isActive={false} />);
    const item = screen.getByText('Тестовый элемент');
    expect(item).not.toHaveClass('filter__option--active');
  });

  it('должен вызывать onClick при клике', async () => {
    const user = userEvent.setup();
    render(<FilterItem {...defaultProps} />);

    const item = screen.getByText('Тестовый элемент');
    await user.click(item);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильный HTML-тег и классы', () => {
    render(<FilterItem {...defaultProps} />);
    const item = screen.getByText('Тестовый элемент');

    expect(item.tagName.toLowerCase()).toBe('div');
    expect(item).toHaveClass('filter__option');
  });
});
