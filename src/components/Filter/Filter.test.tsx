import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Filter from './Filter';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

const mockTracks: TypesTrack[] = [
  {
    _id: '1',
    name: 'Трек 1',
    author: 'Автор 1',
    release_date: '2021-01-01',
    genre: ['Рок'],
    duration: 180,
    duration_in_seconds: 180,
    album: 'Альбом 1',
    logo: null,
    track_file: 'track1.mp3',
    stared_user: [],
  },
  {
    _id: '2',
    name: 'Трек 2',
    author: 'Автор 2',
    release_date: '2020-01-01',
    genre: ['Поп'],
    duration: 200,
    duration_in_seconds: 200,
    album: 'Альбом 2',
    logo: null,
    track_file: 'track2.mp3',
    stared_user: [],
  },
];

const defaultProps = {
  tracks: mockTracks,
  currentFilter: {
    author: [] as string[],
    genre: null as string | null,
    year: null as string | null,
  },
  onFilterChange: jest.fn(),
};

const FilterWrapper = ({
  initialFilter,
  tracks,
  onFilterChange,
}: {
  initialFilter: typeof defaultProps.currentFilter;
  tracks: typeof mockTracks;
  onFilterChange: jest.Mock;
}) => {
  const [filter, setFilter] = useState(initialFilter);

  return (
    <Filter
      tracks={tracks}
      currentFilter={filter}
      onFilterChange={(type, value) => {
        setFilter((prev) => ({ ...prev, [type]: value }) as typeof prev);
        onFilterChange(type, value);
      }}
    />
  );
};

describe('Компонент Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен рендерить все кнопки фильтров', () => {
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      expect(screen.getByText('исполнителю')).toBeInTheDocument();
      expect(screen.getByText('жанру')).toBeInTheDocument();
      expect(screen.getByText('году выпуска')).toBeInTheDocument();
    });

    it('должен показывать текст сортировки на кнопке года', () => {
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={{ ...defaultProps.currentFilter, year: 'newest' }}
        />,
      );
      expect(screen.getByText('Сначала новые')).toBeInTheDocument();
    });
  });

  describe('Выпадающие списки', () => {
    it('должен открывать меню авторов при клике', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      await user.click(screen.getByText('исполнителю'));

      const list = await screen.findByTestId('filter-list');
      expect(within(list).getByText('Автор 1')).toBeInTheDocument();
      expect(within(list).getByText('Автор 2')).toBeInTheDocument();
    });

    it('должен закрывать меню при повторном клике', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      const button = screen.getByText('исполнителю');
      await user.click(button);

      await screen.findByTestId('filter-list');

      await user.click(button);
      await waitFor(() => {
        expect(screen.queryByTestId('filter-list')).not.toBeInTheDocument();
      });
    });

    it('должен показывать уникальные жанры', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      await user.click(screen.getByText('жанру'));

      const list = await screen.findByTestId('filter-list');
      expect(within(list).getByText('Рок')).toBeInTheDocument();
      expect(within(list).getByText('Поп')).toBeInTheDocument();
    });
  });

  describe('Обработчики событий', () => {
    it('должен вызывать onFilterChange при выборе автора', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      await user.click(screen.getByText('исполнителю'));
      const list = await screen.findByTestId('filter-list');
      await user.click(within(list).getByText('Автор 1'));

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('author', [
        'Автор 1',
      ]);
    });

    it('должен позволять выбрать несколько авторов', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={{ ...defaultProps.currentFilter }}
        />,
      );

      await user.click(screen.getByText('исполнителю'));
      const list = await screen.findByTestId('filter-list');

      await user.click(within(list).getByText('Автор 1'));
      await user.click(within(list).getByText('Автор 2'));

      expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith('author', [
        'Автор 1',
        'Автор 2',
      ]);
    });

    it('должен вызывать onFilterChange при выборе жанра', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      await user.click(screen.getByText('жанру'));
      const list = await screen.findByTestId('filter-list');
      await user.click(within(list).getByText('Рок'));

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('genre', 'Рок');
    });

    it('должен вызывать onFilterChange при выборе сортировки', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      await user.click(screen.getByText('году выпуска'));
      const list = await screen.findByTestId('filter-list');
      await user.click(within(list).getByText('Сначала новые'));

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        'year',
        'newest',
      );
    });

    it('должен сбрасывать сортировку при повторном клике', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={{ ...defaultProps.currentFilter, year: 'newest' }}
        />,
      );

      await user.click(screen.getByText('Сначала новые'));
      const list = await screen.findByTestId('filter-list');
      const newestOption = within(list).getByText('Сначала новые');

      await user.click(newestOption);
      expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith(
        'year',
        null,
      );
    });
  });

  describe('Визуальная индикация', () => {
    it('должен подсвечивать активный автор в списке', async () => {
      const user = userEvent.setup();
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={{ ...defaultProps.currentFilter, author: ['Автор 1'] }}
        />,
      );

      await user.click(screen.getByText('исполнителю'));
      const list = await screen.findByTestId('filter-list');
      const item = within(list).getByText('Автор 1');

      expect(item).toHaveClass('filter__option--active');
    });

    it('должен подсвечивать кнопку автора если есть выбранные авторы', () => {
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={{ ...defaultProps.currentFilter, author: ['Автор 1'] }}
        />,
      );

      expect(screen.getByText('исполнителю')).toHaveClass('active');
    });

    it('не должен подсвечивать кнопку автора если нет выбранных авторов', () => {
      render(
        <FilterWrapper
          {...defaultProps}
          initialFilter={defaultProps.currentFilter}
        />,
      );

      expect(screen.getByText('исполнителю')).not.toHaveClass('active');
    });
  });
});
